---
title: 深入LLM推理
categories: [人工智能, 大模型]
tags: [大模型, LLM]
date: 2026-08-13 15:09
updated: 2026-08-15 02:30
---

## 自回归生成

自回归生成的核心是一个循环：每一步输入已有 token 序列，输出下一个 token 的概率分布，选取下一个 token，将 token 追加到已有序列，重复该过程直到满足停止条件

停止条件一般有两个

- 模型输出的 token 是特殊的结束标记，如 `<EOS>`
- 模型输出的 token 数量达到了最大生成数量

该过程可以用以下伪代码描述

```python
def generate(model, prompt, max_tokens, temperature=1.0):
    """
    自回归生成流程伪代码
    
    Args:
        model: LLM模型
        prompt: 用户输入提示词的token序列
        max_tokens: 最大生成数量
        temperature: 采样温度
    """
    generated_tokens = list(prompt)  # 将prompt序列添加到生成序列中作为上下文
    new_token_count = 0
    
    while True:
        # 模型前向传播
        input_ids = torch.tensor(generated_tokens)  # (seq_len,)
        logits = model(input_ids)  # (seq_len, vocab_size)
        
        # 取最后一个logits向量
        next_token_logits = logits[-1, :]  # (vocab_size,)
        
        # 温度缩放并转换为概率分布
        probs = softmax(next_token_logits / temperature)
        
        # 采样
        next_token = sampling(probs)
        
        # 追加到生成序列
        generated_tokens.append(next_token)
        new_token_count += 1
        
        # 当生成token数超过最大生成数量，停止
        if new_token_count > max_tokens:
            break
            
        # 当生成的token为结束标记，停止
        if next_token == eos_token_id:
            break
        
    return generated_tokens
```

在上述流程中，可以看到每次生成时，输入整个序列参与计算，生成序列越来越长时，计算量也随之增加。注意到生成序列中，在预测位置之前的 token 在每次生成时都被重复计算，因此可以考虑使用一个缓存来存储历史 token 的计算结果，这个缓存就是 KV Cache

## KV Cache

KV Cache 用于缓存 token 的 K 向量和 V 向量，下面用一个示例来说明 KV Cache 的工作流程

设生成序列为 `[<bos>]`，KV Cache 为空

1. 输入 `<bos>`，计算该 token 的 q/k/v 向量，当前生成序列仅有该 token，Attention 计算表示为 $\text{Attention}(q_{0},[k_{0}],[v_{0}])$
2. 将 k/v 向量缓存到 KV Cache 中，$K=[k_{0}],V=[v_{0}]$
3. 预测下一个 token 为 `I`，生成序列变为 `[<bos>, I]`
4. 输入 `I`，计算该 token 的 q/k/v 向量，此时 Attention 计算还需要历史 token 的 k/v 向量，因此从 KV Cache 中读取历史 token 的 k/v 向量，Attention 计算表示为 $\text{Attention}(q_{1},[k_{0},k_{1}],[v_{0},v_{1}])$
5. 预测下一个 token 为 `love`，生成序列为 `[<bos>, I, love]`
6. 输入 `love`，计算该 token 的 q/k/v 向量，从 KV Cache 中读取历史 token 的 k/v 向量，Attention 计算表示为 $\text{Attention}(q_{2},[k_{0},k_{1},k_{2}],[v_{0},v_{1},v_{2}])$
7. 预测下一个 token 为 `you`，生成序列为 `[<bos>, I, love, you]`
8. 依此类推，直到生成结束

可以看到，若不使用 KV Cache，每次生成都需要输入整个序列来重复计算历史 token 的 k/v 向量。使用 KV Cache 后，历史 token 的 k/v 向量会被缓存，只需要输入最新生成的 token 即可计算 Attention，避免了历史 token 的重复计算问题，大幅降低了计算开销，但代价是 KV Cache 随着生成序列长度线性增长

**存储量分析**

定义以下参数

| 参数       | 含义               |
| -------- | ---------------- |
| $h_{kv}$ | K/V 注意力头数        |
| $d_{h}$  | 注意力头特征维度         |
| $L$      | Decoder block 层数 |
| $N$      | 序列长度             |
| $b_{e}$  | 每个元素的字节数         |

输入一个 token，每层 Decoder block 中计算的 k/v 向量形状为 $(d_{h}h_{kv},)$，共 $2d_{h}h_{kv}$ 个元素，对 L 层 Decoder block，每个 token 缓存的 k/v 向量共 $2Ld_{h}h_{kv}$ 个元素，单个 token 缓存量为

$$
\Delta M_{kv}=2Ld_{h}h_{kv}b_{e}
$$

对 N 个 token，KV Cache 大小为 $2NLd_{h}h_{kv}b_{e}$ 字节

## 两阶段推理

在使用 KV Cache 后，模型推理过程可以分成两个阶段，分别是 Prefill 和 Decode

**Prefill**

当用户发送一个请求给 LLM，推理过程首先进入 Prefill 阶段，该阶段需要理解用户输入的 prompt，具体来说，就是将用户输入的 prompt 添加到生成序列作为初始上下文并输入模型，模型对整个序列进行计算并缓存 KV，然后输出第一个 token

**Decode**

在 Prefill 阶段完成后，进入到 Decode 阶段，该阶段中，模型基于 Prefill 阶段的生成序列开始逐个生成 token，直到生成结束。需要注意的是，两个阶段共享同一个生成序列，用户输入的 prompt 在整个生成过程中都存在于生成序列中

## Prefix Caching

KV Cache 应用在模型的生成过程中，缓存的 k/v 向量与 token 和当前上下文都有关，因此无法将 kv 缓存应用在不同的上下文。为了将 kv 缓存在不同的上下文中复用，需要使用 Prefix Caching 技术

该技术的核心为通过匹配不同上下文中的相同前缀，复用前缀的 kv 缓存。下面说明其工作流程

1. 接收到首个 prompt，例如 `[x0, x1, x2, x3, x4]`
2. 在 Prefill 阶段计算该 prompt 的 kv 向量并缓存，例如 `[kv0, kv1, kv2, kv3, kv4]`
3. 接收到其他 prompt，例如 `[x0, x1, x2, y3, y4]`
4. 在 Prefill 阶段匹配到前缀 `[x0, x1, x2]`，复用该前缀的 kv 缓存，其余部分计算 k/v 向量并缓存

可以看到，Prefix Caching 主要优化了 Prefill 阶段的计算。在 Causal Attention 下，前面的 token 不会受到后续 token 的影响，因此相同前缀的 kv 缓存可以直接复用
