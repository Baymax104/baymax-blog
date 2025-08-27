---
title: Attention Is All You Need
categories: [论文笔记]
tags: [Transformer, Attention, Self-Attention]
date: 2024-08-12 01:30
updated: 2025-07-07 00:30
topic: paper
---

| 基本信息                                                     |
| ------------------------------------------------------------ |
| **期刊**: （发表日期: 2023-08-01）                           |
| **作者**: Ashish Vaswani; Noam Shazeer; Niki Parmar; Jakob Uszkoreit; Llion Jones; Aidan N. Gomez; Lukasz Kaiser; Illia Polosukhin |
| **摘要翻译**: 占主导地位的序列转导模型是基于复杂的循环或卷积神经网络，包括编码器和解码器。性能最好的模型也通过注意力机制连接编码器和解码器。我们提出了一种新的简单的网络架构 Transformer，它完全基于注意力机制，不需要递归和卷积。在两个机器翻译任务上的实验表明，这些模型在质量上具有优势，同时具有更高的可并行性，需要的训练时间显著减少。我们的模型在 WMT 2014 英德翻译任务上取得了 28.4 个 BLEU，比包括集成在内的现有最好结果提高了 2 个 BLEU 以上。在 WMT 2014 英法翻译任务上，我们的模型在 8 个 GPU 上训练 3.5 d 后，建立了一个新的单模型最先进的 BLEU 评分为 41.8，是文献中最好模型训练成本的一小部分。我们通过将 Transformer 成功地应用于具有大量和有限训练数据的英语选区解析，表明 Transformer 对其他任务具有良好的泛化能力。 |
| **期刊分区**:                                                |
| **原文 PDF 链接**: [Attention Is All You Need](https://arxiv.org/abs/1706.03762) |

## 摘要

- 以往的序列转换模型包含一个 encoder 和一个 decoder，通常使用复杂的 RNN 或 CNN，或使用 attention 连接 encoder 和 decoder
- Transformer 完全依靠 attention，不需要循环和卷积，具有更好的效果和更好的并行性
- 在 WMT 2014 Englishto-German translation task 上取得了 28.4 BLEU 评分，在 WMT 2014 English-to-French translation task 上取得了 41.8 BLEU 评分

## 前言及文献综述

### Introduction

- RNN 依赖前一个状态的固有顺序排除了并行化的可能性
- Attention 允许不考虑建模的依赖在输入输出序列中的距离
- Transformer 避免了递归，而是完全依赖 Attention 来构建输入和输出之间的全局依赖关系

### Background

- 在现有方法（Extended Neural GPU、ByteNet、ConvS2S）中，将来自两个任意输入或输出的词的信号关联起来所需的操作数量随词之间的距离呈线性增长
- Transformer 通过对词进行注意力加权后取平均值来将关联操作减少到一个恒定的数量，但这会降低有效分辨率，Transformer 使用多头注意力来抵消这个影响
- 自注意力，有时称为帧内注意力，是一种将单个序列的不同词联系起来的注意力机制，用于计算序列的表示
- 基于循环注意力机制的 end2end 网络在简单语言问答和语言建模上相比非序列对齐的循环网络表现更好

## 结论

- Transformer 使用多头自注意力替换了 encoder-decoder 架构中的循环层
- 在未来，将会拓展 Transformer 除了文本和标签以外的输入和输出，同时限制注意力机制使其有效地处理图像、音频等大型输入

## 方法

### 模型架构

Transformer 使用 encoder-decoder 架构，encoder 将输入的完整符号序列映射到一个连续的特征表示，decoder 根据这个特征表示，在每个时间步生成一个序列

模型是自回归的，不断使用之前产生的输出作为输入来生成下一个输出

![](https://cos.baymaxam.top/blog/transformer/transformer-1751819275555.png)

### Encoder

Encoder 由 N（N=6）层相同的层组成，每一层包含两个子层

- 两个子层分别是一个多头自注意力机制和一个 position-wise（对每个位置独立操作）的全连接层
- 每个子层都使用残差连接 +LayerNorm（Add & Norm）
- 所有子层以及嵌入层的输出维度都是 512

### Decoder

Decoder 由 N（N=6）层相同的层组成，每一层包含三个子层

- Encoder 的输出被输入到 Decoder 的多头自注意力中（这个 Attention 后文称作 encoder-decoder attention）
- 每个子层都使用残差连接 +LayerNorm（Add & Norm）
- 在第一个多头自注意力中使用 mask，保证在预测第 i 个词时，只依赖之前的词

### LayerNorm

对于一个多维的张量，沿着不同的轴进行 Normalization 会产生不同的效果，主要有两种

- BatchNorm：批标准化
- LayerNorm：层标准化

假设一个二维矩阵 $A\in\mathbb{R}^{batch\times feature}$，BatchNorm 就是在每个 feature 上进行标准化，消除了不同特征之间的差异，LayerNorm 则是在每个 batch 上进行标准化，消除了不同样本之间的差异

![](https://cos.baymaxam.top/blog/transformer/transformer-1751819298952.png)

拓展到三维，图示如下

![](https://cos.baymaxam.top/blog/transformer/transformer-1751819311888.png)

对于 NLP 任务，输入形状通常为 (batch, length, feature)，同时每个句子都有不同的长度，通过 padding 填充到相同长度。此时如果使用 BatchNorm，就消除了特征之间的差异，即上下文之间的差异，不符合 NLP 任务的特点，使用 LayerNorm 可以消除不同句子之间的差异性，保持了上下文的差异

### Attention

Attention 使用三个向量 query、key、value，它的输出是 value 的加权求和，其中的权重也称为注意力权重，注意力权重由 query 和 key 计算得到

#### Scaled Dot-Product Attention

query 和 key 的特征维度大小为 $d_k$，value 的特征维度大小为 $d_v$，将所有的 key 与 query 做点积（Dot-Product），除以 $\sqrt{d_k}$ 进行缩放，之后进行 softmax 得到注意力权重，将权重与 value 进行加权求和得到输出

![](https://cos.baymaxam.top/blog/transformer/transformer-1751819325733.png)

将 N 个 query 组成矩阵 $Q\in\mathbb{R}^{N\times d_k}$，所有的 key 组成矩阵 $K\in\mathbb{R}^{M\times d_k}$，所有的 value 组成矩阵 $V\in\mathbb{R}^{M\times d_v}$，有

$$
Attention(Q,K,V)=softmax(\frac{QK^T}{\sqrt{d_k}})V
$$

最常用的注意力机制有两种

- Dot-Product Attention（点积注意力）：与上述的 Attention 基本相同，除了不进行缩放
- Additive Attention（加性注意力）：直接将 Q 和 K 相加，再经过一个 $\tanh$ 激活

以上两种注意力机制在理论上具有相似的复杂度，但 Dot-Product 在实践上效果更好，更易于优化

当维度 $d_k$ 较小时，两种注意力表现相似，当 $d_k$ 较大时，Dot-Product 的一些结果值会变大，而一些结果值可能很小，相对的差距变大，导致 softmax 的梯度变得极小，因此使用缩放来抵消这种影响

#### Multi-Head Attention

将 Attention 堆叠 h 层，每一层在输入 Q、K、V 时，都分别经过一个可学习的线性层，每一层的 Attention 计算是并行的，产生特征维度为 $d_v$ 的输出，将 h 个输出拼接后输入到一个线性层产生最终输出

多头自注意力可以考虑到不同位置上的不同的表示子空间的信息，同时由于多头的注意力计算是并行的，因此总的计算成本与单头注意力加一个线性层的总成本相似

![](https://cos.baymaxam.top/blog/transformer/transformer-1751819344481.png)

设 Q、K、V 的线性层权重分别为 $W^Q\in\mathbb{R}^{d_{model}\times d_k}$，$W^K\in\mathbb{R}^{d_{model}\times d_k}$，$W^V\in\mathbb{R}^{d_{model}\times d_v}$，最终线性层的权重为 $W^O\in\mathbb{R}^{hd_v\times d_{model}}$，有

$$
\begin{aligned}
MultiHead(Q,K,V)&=Concat(head_1,…,head_h)W^O\\
where\quad head_i&=Attention(QW^Q_i,KW^K_i,VW^V_i)
\end{aligned}
$$

在实验中，设置 $h=8$，$d_k=d_v=\frac{d_{model}}{h}=64$

#### Attention 在模型中应用

- Encoder 的输出作为 key 和 value 输入到 encoder-decoder attention 中，Decoder 在 encoder-decoder attention 之前的输出作为 query 输入，这使得 Decoder 的输出考虑了 Encoder 的序列信息

- 在 Encoder 中，通过多头自注意力机制，输出的每个词的表示就融合了整个序列内的相似度权重

- Decoder 的第一层多头自注意力使用了 mask，用于保证输出第 i 个词时只依赖之前的词

    输入到 Decoder 的 outputs 是完整的结果序列，由于 Attention 会使用输入的整个序列进行计算，而 Decoder 在输出第 i 个词时不应该考虑第 i 个词之后的词，因此需要进行 mask

    Masked Attention 在进行缩放后，设置 mask 部分为一个极小的负数，之后 softmax 在 mask 部分的输出就是 0，实现了 mask 的效果

### Position-wise Feed-Forward Network

Transformer 中使用的 FFN 是 Position-wise，也就是对每个位置（词）独立进行操作，其中包含两个线性变换，隐层使用 ReLU 激活

$$
FFN(x)=\max (0,xW_1+b_1)W_2+b_2
$$

模型中设置输入和输出维度为 512，隐层的维度为 2048

### Embeddings and Softmax

在输入 inputs 和 outputs 时使用 Embedding 将 token 序列转换成向量，在 Decoder 输出后使用一个线性层 +Softmax 输出下一个 token 的概率

两个 Embedding 层和 Softmax 之前的线性层共享相同的权重，同时，在 Embedding 层，对权重乘以 $\sqrt{d_{model}}$

### Positional Encoding

在 Attention 中不会涉及到序列的顺序信息，因此需要在 Embedding 后加上序列的位置编码，位置编码就是使用一个向量来表示词的位置

在 Transformer 中使用以下位置编码

$$
\begin{aligned}
PE_{(pos,2i)}&=\sin(pos/10000^{2i/d_{model}})\\
PE_{(pos,2i+1)}&=\cos(pos/10000^{2i/d_{model}})
\end{aligned}
$$

其中，pos 表示词的位置，i 表示第 i 个特征，对所有词的每个特征就对应了一条正弦曲线，之所以选择这个函数，是因为对于任意偏移量 k，$PE_{pos+k}$ 都可以表示成 $PE_{pos}$ 的线性函数，可以很容易的学习到相对位置信息

## 为什么使用 Self-Attention

从三个方面进行比较

- 计算复杂度
- 计算并行度：通过串行操作的数量来衡量
- 网络中长依赖关系的路径长度：通过任意两个输入和输出位置之间的最大路径长度来衡量

![](https://cos.baymaxam.top/blog/transformer/transformer-1751819368481.png)

- 在并行度上，Self-Attention 的串行操作数量恒定，而 RNN 的串行操作数量为 $O(n)$，这一点上 Self-Attention 相比 RNN 更快

-   Self-Attention 的计算复杂度随 $n^2$ 增长，为了提高性能，可以将 Self-Attention 限制为仅考虑输入序列中以输出位置为中心的大小为 r 的邻域

- 对于核大小 k 小于序列长度 n 的 CNN，需要堆叠 $n/k$ 个 CNN 来获取整个序列的信息，这会增加网络中的最长路径长度

## 实验

### 训练

使用数据集 WMT 2014 English-German dataset 和 WMT 2014 English-French dataset 进行英语 - 德语和英语 - 法语的机器翻译任务

优化器：Adam，设置参数 $\beta_1=0.9$，$\beta_2=0.98$，$\epsilon=10^{-9}$

学习率：使用如下公式计算

$$
lrate=d^{-0.5}_{model}\cdot\min(step\_num^{-0.5},step\_num\cdot warmup\_steps^{-1.5})
$$

其中，warmup\_steps 设为 4000

正则化

- Residual Dropout：将 dropout 应用于每个子层的输出，然后将其添加到子层输入并归一化。此外，将 dropout 应用于 Encoder 和 Decoder 中的嵌入和位置编码的总和。对于基本模型，使用丢弃率 $P_{drop}=0.1$

- Label Smoothing：在训练过程中，使用了 $\epsilon_{ls}=0.1$ 的标签平滑

### 实验结果

![](https://cos.baymaxam.top/blog/transformer/transformer-1751819387593.png)

### 模型超参数

![](https://cos.baymaxam.top/blog/transformer/transformer-1751819397953.png)

- A 行比较不同的自注意力头的个数、$d_k$、$d_v$，自注意力头的个数过多和过少都会降低性能

- B 行比较不同的 $d_k$ 值，不同的 $d_k$ 会影响性能，确定注意力的 compatibility function 并不容易

- C 行和 D 行表明更大的模型有更好的性能，并且 dropout 可以有效地避免过拟合

- E 行比较正弦位置编码和可学习的位置嵌入，表明二者的性能几乎相同
