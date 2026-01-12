---
title: 模型架构
categories: [人工智能, 大模型]
tags: [人工智能, 大模型]
date: 2025-11-25 16:39
updated: 2026-01-12 15:19
topic: llm
---
## Transformer

大模型的底层架构主要为 Transformer 架构，其在文章 [Attention Is All You Need](https://arxiv.org/abs/1706.03762) 中被首次提出，其中的自注意力机制能够直接建模任意距离 token 的特征关系，使得模型具备了长距离的语言建模能力，且自注意力的计算过程非常利于硬件的并行优化，使得大规模参数计算成为可能

![](llm-model-1764060721185.png)

### 归一化

Transformer 中使用 LayerNorm 进行归一化，LayerNorm 适合处理可变长度的数据以及小批次数据，此外，研究人员还提出了其他的归一化方法

**RMSNorm**

相比 LayerNorm，在训练速度和性能上有一定优势，其中 $\gamma$ 是一个可学习参数

$$
\begin{aligned}
\text{RMSNorm}(x)&=\frac{x}{\text{RMS}(x)}\cdot\gamma\\
\text{RMS}(x)&=\sqrt{ \frac{1}{H}\sum^H_{i=1}x^2_{i} }
\end{aligned}
$$

Transformers 库中 LLaMA 的 RMSNorm 实现如下

```python
class LlamaRMSNorm(nn.Module):

    def __init__(self, hidden_size, eps=1e-6):
        super().__init__()
        self.weight = nn.Parameter(torch.ones(hidden_size))
        self.variance_epsilon = eps

    def forward(self, hidden_states):
        input_dtype = hidden_states.dtype
        hidden_states = hidden_states.to(torch.float32)
        variance = hidden_states.pow(2).mean(-1, keepdim=True)
        # 计算隐状态的均方根，添加一个偏移量防止除0
        hidden_states = hidden_states * torch.rsqrt(variance + self.variance_epsilon)
        # 将隐状态除以其均方根后重新缩放
        return self.weight * hidden_states.to(input_dtype)
```

**DeepNorm**

DeepNorm 主要提高了 Transformer 在深层的训练稳定性和性能

$$
\text{DeepNorm}(x)=\text{LayerNorm}(\alpha x+\text{Sublayer}(x))
$$

归一化模块的位置对模型也有重要影响，主要有三种策略

- Post-Norm：归一化模块放在残差计算后，Post-Norm 有助于模型更快收敛，但在训练过程中会出现不稳定，通常搭配其他策略结合使用
- Pre-Norm：归一化模块放在整个 FFN 或 Self-Attention 之前，训练更加稳定，但性能不如 Post-Norm
- Sandwich-Norm：归一化模块放在残差计算的前后都添加 LayerNorm

![](llm-model-1764062195207.png)

### 激活函数

原始的 Transformer 中使用 ReLU 作为激活函数，可能产生神经元失效的问题，因此产生了很多 ReLU 的变种，它们具有更好的性能和更好的收敛性

$$
\begin{aligned}
\text{Swish}(x)&=x\cdot \text{sigmoid}(x)\\
\text{GELU}(x)&=\frac{1}{2}x\left( 1+\text{erf}\left( \frac{x}{\sqrt{ 2 }} \right) \right),\quad\text{erf}(x)=\frac{2}{\sqrt{ \pi }}\int^x_{1}e^{-t^2}dt\\
\text{SwiGLU}&=\text{Swish}(\mathbf{W}^Gx)\odot(\mathbf{W}^Ux)\\
\text{GeGLU}(x)&=\text{GELU}(\mathbf{W}^Gx)\odot(\mathbf{W}^Ux)
\end{aligned}
$$

### 位置编码

原始 Transformer 中使用的位置编码是正余弦位置编码，也称为绝对位置编码，根据 token 的绝对位置来生成唯一的位置嵌入

相对位置编码是根据 key 与 query 之间的偏移量计算得来，得到的编码用于注意力矩阵的计算中，而不是直接与 token 的嵌入向量相加

旋转位置编码（RoPE）使用基于绝对位置信息的旋转矩阵来表示注意力中的相对位置信息，具有良好的性能和长期衰减的特性，已被主流大模型广泛采用

Transformers 库中 LLaMA 的 RoPE 实现如下

```python
def rotate_half(x):
    x1 = x[..., :x.shape[-1] // 2]
    x2 = x[..., x.shape[-1] // 2:]
    # 将向量每两个元素视为一个子空间
    return torch.cat((-x2, x1), dim=-1)
    
def apply_rotary_pos_emb(q, k, cos, sin, position_ids):
    cos = cos[position_ids].unsqueeze(1)
    sin = sin[position_ids].unsqueeze(1)
    # 获得各个子空间旋转的正余弦值，用于注意力矩阵计算
    q_embed = (q * cos) + (rotate_half(q) * sin)
    k_embed = (k * cos) + (rotate_half(k) * sin)
    return q_embed, k_embed
```

### 注意力机制

Transformer 中的自注意力机制表示如下

$$
\begin{aligned}
Q&=XW^Q\\
K&=XW^K\\
V&=XW^V\\
\text{Attention}(Q,K,V)&=\text{softmax}\left( \frac{QK^T}{\sqrt{D}} \right)V
\end{aligned}
$$

其中，设输入 X 是一个句子，其形状为 `(seq_len, d_model)`，$W^Q$、$W^K$ 的形状为 `(d_model, d_k)`，$W^V$ 的形状为 `(d_model, d_v)`

通过线性变换产生输入 X 中每个 token 的查询向量、键向量和值向量，$QK^T$ 计算的就是**句子中每个 token 与句子中的所有 token 的相关程度**（查询向量和键向量的相似程度，实现任意距离 token 之间的关系建模），得到相关度矩阵，其形状为 `(seq_len, seq_len)`

通过缩放和 softmax 归一化得到注意力分数矩阵，将注意力分数看做权重与值向量相乘，得到根据注意力分配的融合全局值向量的上下文特征向量（Context Vector），实现在每个 token 的嵌入中有侧重地融合全局 token 的嵌入

**稀疏注意力机制**

标准注意力机制的计算复杂度为 $O(n^2)$，n 为句子序列长度。为了降低注意力机制的计算开销，研究人员提出了多种注意力机制的变种

滑动窗口注意力机制设置一个大小为 w 的窗口，对于每个 token，融合前 w 个 token 的信息，将复杂度降到 $O(wT)$

![](llm-model-1764321673790.png)

**多查询/分组查询注意力**

多查询注意力机制在不同头之间共享 KV 矩阵，而分组查询注意力机制则是将注意力头分成多个组，每个组中共享 KV 矩阵

![](llm-model-1764325396468.png)

**硬件优化的注意力机制**

注意力机制的运算过程易于硬件优化，两个具有代表性的注意力变种是 FlashAttention 和 PagedAttention。FlashAttention 通过矩阵分块计算以及减少内存读写次数的方式，提高注意力分数的计算效率。PagedAttention 则针对增量解码阶段，对于 KV 缓存进行分块存储，并优化了计算方式，增大了并行计算度，从而提高了计算效率

### 混合专家模型

Transformer 中的 FFN 层对于每个 token 都进行全量计算，计算开销大且难以扩展参数规模，因此使用混合专家模型（MoE）替换 FFN 层实现不显著增加计算开销的情况下的参数规模扩展

MoE 基于集成学习的思想，包含多个“专家模型”和一个路由

- 专家模型：专家模型可以使用不同的模型，且可以独立扩展规模，在实践中，专家模型通常就是一个 FFN 层
    
- 路由：用于将 token 分配到不同的专家模型进行计算，通常实现为 Linear+Softmax，输出 token 与专家的匹配程度（匹配程度由 token 与专家的权重线性计算得到，专家的权重是可学习的），将 token 分配到 topk 个专家中进行计算

最后将多个专家的输出用匹配程度加权求和，得到 MoE 层的输出

MoE 层相当于将原先 FFN 层中的权重矩阵拆分为多个小权重矩阵，并且有选择的使用其中的一部分进行计算，不仅可以使模型的规模继续扩大，而且不显著增加计算开销

> 路由输出的匹配程度是一个稀疏值，只有 topk 个非零值（topk 外的专家匹配程度为 0），正是这一点保证了计算开销的减小

计算公式如下

$$
\begin{aligned}
G(x_{t})&=\text{topk}(\text{softmax}(x^tW^G))\\
\text{MoELayer}(x_{t})&=\sum^K_{i=1}G(x_{t})_{i}\cdot E_{i}(x_{t})
\end{aligned}
$$

![](llm-model-1764327465804.png)

## 大模型架构

当前大模型架构主要基于 Transformer 架构演变而来，主要分为以 BERT 为代表的编码器架构（Encoder-only）、以 GPT 为代表的解码器架构（Decoder-only）和以 T5 为代表的编码器 - 解码器架构（Encoder-decoder）

由于 GPT 系列模型的成功，在解码器架构的基础上产生了两个主流变种架构，分别是因果解码器架构和前缀解码器架构

![](llm-model-1768027434019.png)

### 因果解码器

目前绝大部分大模型都使用因果解码器架构，它采用单向的掩码自注意力机制，其中每个 token 只关注它本身和在它之前的 token，从而自回归地预测下一个 token，适用于文本对话、文本生成

例如，机器翻译任务输入 token 序列 `["I", "love", "NLP"]`，其中每个 token 嵌入只融合了在它之前的 token 信息，在生成时，首先关注整个输入序列生成 `"我"`，之后将 `"我"` 放到 token 序列末尾，将 `["I", "love", "NLP", "我"]` 继续作为输入

### 前缀解码器

前缀解码器架构参考了编码器 - 解码器架构，对于输入序列（前缀）使用双向注意力进行编码，而对于输出序列，则使用单向掩码注意力进行自回归生成，在编码和解码中，前缀编码器共享参数，适用于序列到序列的任务，如文本摘要、文本翻译、文本问答

例如，机器翻译任务输入 token 序列 `["I", "love", "NLP"]`，在初始时，整个输入序列作为前缀，使用双向注意力进行编码，其中每个 token 融合了整个前缀的信息，在生成时，初始输入序列为空，输入 `["I", "love", "NLP", ""]` 生成 `"我"`，将 `"我"` 添加到输出序列中，在生成下一个 token 时，前缀部分 `["I", "love", "NLP"]` 的 token 依然融合整个前缀的信息，而输出部分只关注之前的 token 序列 `["我"]`，根据前缀和输出生成下一个 token

## FlashAttention

FlashAttention 是一种针对原始注意力模块的优化方案，可以大幅减少注意力计算中的访存量，从而提升计算强度

它的核心思路是尽可能减少对于中间结果的保存，进而直接得到最终结果。根据注意力的计算方法 $\text{softmax}\left( \frac{QK^T}{\sqrt{ D }} \right)V$，可以发现其中需要保留多个中间结果,如 $QK^T$ 和 softmax 后的注意力分布矩阵。这些中间结果需要频繁写入显存，因此导致了大量的显存读写操作

FlashAttention 通过矩阵分块和算子融合等方法,将中间结果一直保留在缓存中，直到获得最终结果后再写回显存中，从而减少了显存读写量。FlashAttention 有效地减少了访存量，同时也降低了峰值显存的占用量

## PagedAttention

PagedAttention 是针对键值缓存拼接和注意力计算的优化操作，能够有效降低这两个运算部分的访存量，从而提高计算效率

在键值缓存拼接操作中，传统的实现方法会在每次拼接时新分配一段显存空间，然后拷贝原始键值缓存和新生成词元的状态到新分配的显存中去，这容易导致反复的显存读写，并且产生较多的显存碎片

PagedAttention 引入了操作系统中显存分页管理的方法，预先将显存划分成若干块给之后的键值缓存“预留空间”，从而显著减少了拼接时反复分配显存的操作

此外，PagedAttention 还优化了注意力计算操作，提高了计算的并行度从而减少其访存量。具体来说，增量解码阶段是以当前词元作为查询向量，与之前序列的键值缓存进行注意力计算的过程。考虑到键值缓存通常会较长，PagedAttention 采用了上述的分页管理操作，并使用算子融合的方法将查询向量与多个分页的键值缓存并行地进行计算，从而提升了计算效率
