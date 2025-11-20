---
title: "DeepSeekMoE: Towards Ultimate Expert Specialization in Mixture-of-Experts Language Models"
categories: [论文笔记]
tags: [LLM, DeepSeek]
date: 2025-11-20 18:31
updated: 2025-11-20 18:36
topic: paper
---
## 背景

在传统 decoder-only 的大模型架构中，在 Self-Attention 层后使用 FFN 层处理输出，所有的 token 都需要经过整个 FFN 层权重矩阵的计算，计算开销大，且可计算的规模受限于权重矩阵的规模，模型难以扩展

基于以上问题，考虑用 MoE 层替换 FFN 层，MoE 层有基于集成学习的思想，包含多个“专家模型”和一个路由

- 专家模型：专家模型可以使用不同的模型，且可以独立扩展规模，在实践中，专家模型通常就是一个 FFN 层
    
- 路由：用于将 token 分配到不同的专家模型进行计算，通常实现为 Linear+Softmax，输出 token 与专家的匹配程度（匹配程度由 token 与专家的权重线性计算得到，专家的权重是可学习的），将 token 分配到 topk 个专家中进行计算

最后将多个专家的输出用匹配程度加权求和，得到 MoE 层的输出

MoE 层相当于将原先 FFN 层中的权重矩阵拆分为多个小权重矩阵，并且有选择的使用其中的一部分进行计算，不仅可以使模型的规模继续扩大，而且减小了计算开销

> 路由输出的匹配程度是一个稀疏值，只有 topk 个非零值（topk 外的专家匹配程度为 0），正是这一点保证了计算开销的减小

![](deepseek-moe-1763634987680.png)

## 创新点

提出了 DeepSeekMoE 架构，相比一般 MoE 架构，引入了两个策略来优化专家的专业性

1. 细粒度（fine-grained）的专家拆分将 N 个专家拆分为 mN 个专家，拆分后每个专家的规模为原先的 1\over m 倍，路由时，将 token 分配给 mK 个专家
    
2. 引入独立的共享专家多个专家之间可能存在相同的知识，会造成专家知识的冗余，因此在 mN 个专家中取 K_s 个独立的专家用于捕获共享的知识，共享知识与所有 token 进行计算，路由时有 mK-K_s 个专家参与分配

![](deepseek-moe-1763634973649.png)

DeepSeekMoE 架构的完整形式化表示如下，其中 u^l_t 为 MoE 层输入（Self-Attention 层输出），h^l_t 为 MoE 层输出

$$
  
\begin{align} h^l_t&=\sum\limits^{K_s}_{i=1}FFN_i(u^l_t)+\sum\limits^{mN}_{i=K_s+1}(g_{i,t}FFN_i(u^l_t))+u^l_t\\ g_{i,t}&=\left\{ \begin{aligned} s_{i,t},&s_{i,t}\in Topk(\{s_{j,t}|K_s+1\le j\le mN\},mK-K_s)\\ 0,&otherwise\\ \end{aligned} \right.\\ s_{i,t}&=Softmax_i({u^l_t}^Te^l_i) \end{align}  
$$

---

损失函数

损失函数中需要平衡两个问题

- 专家之间的平衡损失：路由时可能存在总是分配到有限的几个专家，导致其他专家没有充分地训练
    
- 设备之间的平衡损失：若专家模型分布在不同的设备上，训练的不平衡会加剧，在实践中优先保证设备之间的平衡损失

专家损失函数如下

$$
  
\begin{align} L_{Exp}&=\alpha_1 \sum\limits^{N'}_{i=1}f_iP_i\\ f_i&={N'\over K'T}\sum\limits^T_{t=1}Indicate(Token\quad t\quad selects\quad Expert\quad i)\\ P_i&={1\over T}\sum\limits^T_{t=1}s_{i,t} \end{align}  
$$

设备损失函数如下，其中专家被分为 D 个组\{d_1,d_2,…,d_D\}

$$
  
\begin{align} L_{Dev}&=\alpha_2\sum\limits^D_{i=1}f'_iP'_i\\ f'_i&={1\over |d_i|}\sum_{j\in d_i}f_j\\ P'_i&=\sum_{j\in d_i}P_j \end{align}  
$$

## 结论

在本文中，我们介绍了用于 MoE 语言模型的 DeepSeekMoE 架构，目标是实现最终的专家专业化。通过细粒度的专家分割和共享专家隔离，与流行的 MoE 架构相比，DeepSeekMoE 实现了显著更高的专家专业化和性能。从适度规模的 2B 参数开始，我们验证了 DeepSeekMoE 的优势，展示了其接近 MoE 模型上限性能的能力。此外，我们提供了经验证据来表明 DeepSeekMoE 比 GShard 具有更高水平的专家专业化。
