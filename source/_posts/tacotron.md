---
title: "Tacotron: Towards End-to-End Speech Synthesis"
categories: [人工智能, 论文笔记]
tags: [Tacotron, TTS]
date: 2024-07-30 21:55
updated: 2025-07-07 00:34
---
| 基本信息                                                     |
| ------------------------------------------------------------ |
| **期刊**: （发表日期: 2017-04-06）                           |
| **作者**: Yuxuan Wang; R. J. Skerry-Ryan; Daisy Stanton; Yonghui Wu; Ying Xiao; Zhifeng Chen; Samy Bengio; Quoc Le; Yannis Agiomyrgiannakis; Rob Clark; Rif A. Saurous |
| **摘要翻译**: 文语合成系统通常由多个阶段组成，如文本分析前端、声学模型和音频合成模块。构建这些组件通常需要广泛的领域专业知识，并且可能包含脆性的设计选择。在本文中，我们提出了一种端到端的生成式文本到语音模型 Tacotron，该模型直接从字符合成语音。给定成对数据，模型可以在随机初始化的情况下完全从头开始训练。为了使序列到序列框架能够很好地完成这项具有挑战性的任务，我们提出了几个关键技术。Tacotron 在美国英语上取得了 3.82 的主观五级平均意见分数，在自然度方面优于生产参数系统。此外，由于 Tacotron 在帧级别生成语音，因此它比样本级别的自回归方法要快得多。 |
| **期刊分区**:                                                |
| **原文 PDF 链接**: [Tacotron: Towards End-to-End Speech Synthesis](https://arxiv.org/abs/1703.10135) |

## 摘要

- Tacotron 是 end2end 的 TTS 模型，可直接从字符生成语音
- 给定\<text,audio>可直接开始训练
- Tacotron 以一个 frame 为单位生成语音，而不是以一个 sample 为单位，速度更快

## 前言及文献综述

### Introduction

以往的 TTS 模型的缺点

- 需要领域专业知识
- 难以设计
- 每个组件独立训练
- 误差组成复杂

整合的 end2end 模型的优势

- 减少特征工程的需求
- 支持丰富的条件影响，end2end 的 条件影响发生在模型开始，而不是针对特定的组件
- 对数据的适应性更好
- 更加稳定

TTS 问题

- 是一个 inverse problem，本身难度大，必须要处理输入的多样性
- TTS 输出是连续的并且输出序列通常比输入更长

### Related Work

WaveNet

- 以 sample 为单位，太慢
- 不是 end2end，需要 TTS frontend 获取语音特征的条件影响

DeepVoice

- 使用 neural network 替换了 TTS 的组件，然而每个 network 需要单独训练

Generating spectral parameters with neural attention

- 需要预训练的 HMM 来帮助训练 alignment
- 有一些 tricks 不符合韵律学
- 需要训练一个 vocoder
- 基于 phoneme 输入，结果受到限制

Char2Wav

- 在使用 Sample RNN 之前，需要训练 vocoder 的参数
- seq2seq 模型和 Sample RNN 需要单独预训练

## 结论

- 达到 3.82MOS 分数
- 不需要手动设计语音特征
- 不需要复杂组件
- 实现了简单的文本标准化，在未来可能是不必要的
- 输出层，Attention 层，loss 和基于 Griffin-Lim 的 waveform 生成器可以改进，例如，Griffin - Lim 输出可能存在可听到的错误

## 方法

### 模型架构

![](tacotron-1751819512804.png)

- 分为 Encoder、基于 Attention 的 Decoder 和后处理网络
- 接收字符作为输入，输出 spectrogram frames，之后可将 spectrogram 转换为 waveform

模型超参数

![](tacotron-1751819523359.png)

### CBHG 模块

![](tacotron-1751819534451.png)

CBHG 模块组成

- Conv1D

    - 包含 k 组 1-D convolutional filter，第 k 个 filter 的宽度为 k，每组的 filter 个数为 $C_k$

    - 将 Convolution 的结果 stack 后输出

    - Batch Norm

    - 提取本地和上下文信息

- Max-pool

    - Max-Pool 的 stride 为 1
    - 沿时间维度最大池化，增强局部不变性

- Conv1D projections、residual connection

    - 将宽度还原到原始输出，进行残差连接
    - Batch Norm

- Highway network

    - 提取高层次信息

- Bidirectional GRU RNN

### Encoder

Encoder 的输入是一串字符序列，每个字符被解释为一个 one-hot 向量，embed 成一个连续值向量

对每个 embedding 进行一系列非线性变换，这些非线性变换称为 prenet，prenet 是一个带有 dropout 的 bottleneck layer（瓶颈层）

bottleneck layer 是指一个主要用于减少特征维度的模块，它可以是 linear layer，也可以是 convolution layer，此处的 bottleneck layer 是一个 linear layer

经过 pre-net 后再经过 CBHG，输入到 attention 中

### Decoder

在初始时输入一个全 0 的 frame，称为 go frame，每个 time step 输入一个 frame，frame 经过 prenet 后输入到 Attention RNN，Attention RNN 是一个 GRU 单元，输入 frame 和初始化的 hidden state

Attention RNN 产生 Attention 的 query，Encoder 的输出作为 Attention 的 key，Attention 的输出称为 context vector，在每个 time step 中都使用 Attention

Decoder RNN 是一个 GRU 单元，输入 context vector 和初始化的 hidden state，输出 r 个 frame，即 feature 长度为 r \* frame，取最后一个 frame 作为下一次的 frame

将 Decoder 的输出经过一个 postnet，将 seq2seq 的目标转换为 waveform

### Postnet

Postnet 模块是为了将 seq2seq 目标转换为 waveform 目标，模型中使用 CBHG 模块作为 Postnet

### 模型训练

- 优化器：Adam

    lr 初始为 0.001，在 500K 步时减小到 0.0005，在 1M 步时减小到 0.0003，在 2M 步时减小到 0.0001

- 损失函数：L1 Loss

    使用 loss mask

## 实验

### 消融实验

与 vanilla 模型对比

Encoder 和 Decoder 均使用 2 层残差 RNN，其中每层有 256 个 GRU 单元，没有使用 pre-net 或 post-net，decoder 直接预测 linear-scale log magnitude spectrogram，该模型需要预定采样 (采样率 0.5) 来学习 alignment 和泛化

![](tacotron-1751819583515.png)

在向前移动之前，注意力往往会停留在许多帧上，这会导致合成信号中的语音可理解度很差

---

使用两层残差 GRU 替换 CBHG

![](tacotron-1751819593736.png)

GRU 编码器产生的 alignment 是嘈杂的，这些嘈杂的 alignment 导致了错误发音

---

不使用 post-net 和使用 post-net 对比

![](tacotron-1751819617760.png)

从后处理网络得到的预测包含了更好的可分辨谐波和高频共振峰结构，减少了合成伪影

### 平均意见得分测试（MOS）

受试者被要求对模拟的自然程度进行 5 点李克特量表评分，使用 100 个未见过的短语用于测试，每个短语获得 8 个评分，将 Tacotron 与 parametric 模型和 concatenative 系统对比

![](tacotron-1751819643119.png)

## 创新点

- 在 Decoder 输出时产生 r 个 frame

    有助于减小模型大小、训练时间，同时可以大量增加收敛速度

    这可能是因为相邻的 frame 是有关联的，每个字符通常会对应到多个 frame

- dropout 层在测试时也进行 dropout

    音域使用类似 scheduled sampling 的技术会损坏音频质量，因此使用 dropout 层来模拟噪声，提高模型的泛化能力
