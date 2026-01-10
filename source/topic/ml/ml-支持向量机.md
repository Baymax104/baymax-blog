---
title: 支持向量机
categories: [人工智能, 机器学习]
tags: [人工智能, 机器学习, SVM, 支持向量机]
date: 2025-07-05 22:16
updated: 2025-11-24 18:19
topic: ml
---
## 基本型

每个样本可以对应到样本空间中的一个点，对应样本分类也就是找到一个超平面，将不同类别的样本划分开

超平面使用线性方程来表示

$$
\omega^Tx+b=0
$$

假设超平面能够将样本正确分类，则有如下条件

$$
\left\{\begin{aligned}
\omega^Tx+b&\ge+1,&y_i&=1\\
\omega^Tx+b&\le-1,&y_i&=-1
\end{aligned}\right.
$$

距离超平面最近的几个使上式等号成立的样本点称为**支持向量**，异类支持向量到超平面的距离之和称为间隔

$$
\gamma=\frac{2}{\vert\vert\omega\vert\vert}
$$

在满足约束条件的情况下，找到最大间隔，即最小化 $\vert\vert\omega\vert\vert$，等价于最大化 $\vert\vert\omega\vert\vert$，SVM 基本型如下

$$
\begin{aligned}
\min\limits_{\omega,b}\quad&{1\over2}\vert\vert\omega\vert\vert^2\\
s.t.\quad &y_i\cdot(\omega^Tx_i+b)\ge1,\quad i=1,2,...,m
\end{aligned}
$$

> SVM 的优化问题可以转化为一个对偶问题，求解对偶问题可以得到支持向量

## 核函数

在现实样本中，原始样本空间中也许不存在一个超平面能够将样本分类，此时可将样本映射到更高维的空间中，若原始空间是有限维，此时存在一个高维特征空间使样本可分

将样本映射到高维特征空间后的超平面模型可表示为

$$
f(x)=\omega^T \phi(x)+b
$$

其对偶问题中需要求解 $\phi(x_{i})^T\phi(x_{j})$，由于映射后的特征空间维度可能很高，直接计算较为困难，因此假设以下函数

$$
\kappa(x_{i},x_{j})=\phi(x_{i})^T\phi(x_{j})
$$

使得样本在原始样本空间中使用函数 $\kappa(\cdot,\cdot)$ 计算的结果等于 $\phi(x_{i})^T\phi(x_{j})$，这样的函数称为**核函数**

核函数的形式可根据以下定理确定

令 $\chi$ 为输入空间，$\kappa(\cdot,\cdot)$ 为定义在 $\chi \times \chi$ 上的对称函数，则 $\kappa$ 是核函数当且仅当对于 $\forall D=\{x_{1},x_{2},\dots,x_{m}\}$，核矩阵 $\mathbf{K}$ 总是半正定的

$$
\mathbf{K}=\begin{bmatrix}
\kappa(x_1,x_1) & \cdots & \kappa(x_1,x_j) & \cdots & \kappa(x_1,x_m)\\
\vdots & \ddots & \vdots & \ddots & \vdots\\
\kappa(x_i,x_1) & \cdots & \kappa(x_i,x_j & \cdots & \kappa(x_i,x_m)\\
\vdots & \ddots & \vdots & \ddots & \vdots\\
\kappa(x_m,x_1) & \cdots & \kappa(x_m,x_j) & \cdots & \kappa(x_m,x_m)
\end{bmatrix}
$$

以下是几种常见的核函数

![](ml-支持向量机-1763977585910.png)

## 软间隔与正则化

在求解超平面时，可能难以找到一个超平面将所有样本都正确分类，或也无法保证该超平面没有过拟合，为了提高模型的泛化能力，需要允许模型在一些样本上出错，这称为软间隔，与之对应的将所有样本都分类正确的间隔称为硬间隔

软间隔的优化目标为

$$
\min_{\omega,b}\quad{\frac{1}{2}||\omega||^2+C\sum^m_{i=1}l(y_{i}(\omega^Tx_{i}+b)-1)}
$$

其中，$C>0$，$l(\cdot)$ 称为 0/1 损失函数

$$
l(x)=\left\{
\begin{aligned}
1,&&if\quad x<0\\
0,&&otherwise
\end{aligned}
\right.
$$

通过 C 控制样本不满足约束的程度，当 C 为无穷大时，要求所有样本都满足约束

在实践中，通常用其他数学性质更好的函数来替代 $l(\cdot)$，称为替代损失，常用的有以下三种

- hinge 损失：$l(x)=\max(0,1-x)$
- 指数损失：$l(x)=e^{-x}$
- 对率损失：$l(x)=\log(1+e^{-x})$

> 更一般地，可以将优化目标写成如下形式
>
> $$
> \min_{f}\quad{\Omega(f)+C\sum^m_{i=1}l(f(x_{i}),y_{i})}$$
> 以上形式称为正则化问题，其中，$\Omega(f)$称为正则化项，C称为正则化参数
