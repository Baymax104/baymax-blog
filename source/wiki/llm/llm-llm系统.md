---
title: LLM系统
categories: [人工智能, 大模型]
tags: [LLM, 大模型, 大模型开发]
date: 2025-03-04 23:35
updated: 2025-07-07 00:53
wiki: llm
---
## 语言模型

大语言模型（LLM）是通过预测下一个词的监督学习方式进行训练的。具体来说，首先准备一个包含数百亿甚至更多词的大规模文本数据集。然后，可以从这些文本中提取句子或句子片段作为模型输入。**模型会根据当前输入预测下一个词的概率分布**。**通过不断比较模型预测和实际的下一个词，并更新模型参数最小化两者差异**,语言模型逐步掌握了语言的规律，学会了预测下一个词

LLM 主要可以分为两类

### 基础语言模型（Base LLM）

通常以 `-base` 后缀或没有后缀命名

通过自监督学习在大规模文本数据上预训练，目标是预测下一个词或填补文本空缺，学习语言结构和统计规律，因此，如果给它一个开放式的 prompt，它可能会通过自由联想生成戏剧化的内容

早期 LLM 多为基础模型，但随着应用需求增长，仅仅使用预训练难以使模型理解复杂指令，且预训练成本较大，因此提出使用指令微调来优化 LLM 的指令任务能力

**当需要对 LLM 进行垂直领域微调时，应该使用基础模型进行微调**，避免指令微调模型中已固化的模板限制

### 指令微调语言模型

通常以 `-chat` 或 `-instruct` 后缀命名

对基础语言模型进行了专门的训练，以便更好地理解问题并给出符合指令的回答，指令微调使语言模型更加适合任务导向的对话应用，它可以生成遵循指令的语义准确的回复，而非自由联想

**指令微调是微调的一种，提升了 LLM 的指令任务处理能力**，使 LLM 更好地支持多轮对话和复杂指令，**在 LLM 开发中，一般采用指令微调语言模型**

将基础模型转换为指令微调模型通常需要进行两步，首先，使用小数据集对基础模型进行有监督微调（SFT），使模型能够初步根据指令来输出内容，之后，进一步调整模型，使用**基于人类反馈的强化学习（RLHF）**来使得 completion 更符合人类偏好

> **LLM 的预训练 - 微调范式**
>
> - 预训练：基于海量无标签数据，通过自监督学习（如 Masked Language Modeling）让模型掌握语言的通用模式、结构和语义知识，形成基础的语言理解和生成能力
> - 微调：在预训练模型的基础上，使用特定任务的有标签数据进行参数调整
>   - 指令微调：通过任务指令和示例（如问答对）使模型适应人类指令，提升零样本（Zero-shot）能力
>   - 领域微调：针对医疗、法律等垂直领域优化模型表现

## Tokens

在 LLM 领域中，词这个概念并不完全等同于语言学中的单词（word），准确来说，LLM 使用 token 来表示文本，即预训练目标中的“预测下一个词”指的是预测下一个 token

**对于一个句子，语言模型会先使用分词器将其拆分为一个个 token ，而不是原始的单词。**对于生僻词，可能会拆分为多个 token。这样可以大幅降低字典规模，提高模型训练和推断的效率。

**分词方式会对 LLM 的理解能力产生影响**，因此需要选择合适的分词器，以发挥语言模型的潜力

不同的模型有不同的 token 限制，token 限制指的是 prompt 的 token 数和 completion 的 token 数之和

## LLM 系统

LLM 系统的基本操作流程

1. 检查用户 prompt，防止 prompt 注入等情况
2. 使用思维链、prompt 链、指令分类等策略设计 prompt，输入到 LLM
3. 检查并评估 completion

### 检查输入

对于用户输入进行检查，确保用户能够负责任地使用系统并且没有试图以某种方式滥用系统

**Prompt 注入**

Prompt 注入是指用户试图通过提供输入来操控 AI 系统，以覆盖或绕过开发者设定的预期指令或约束条件

通常使用两种策略来避免 prompt 注入

- 使用分隔符分隔用户输入

  使用分隔符时，要注意删除用户输入中的分隔符

- 监督分类

  额外添加 prompt，设置少样本 prompt 来判断用户是否尝试进行 Prompt 注入

  > 可以使用 LLM 来评估 completion

### 指令分类

在处理不同情况下的多个独立指令集的任务时，可以先使用 LLM 对指令进行分类，并以此为基础确定要使用哪些指令集的指令，通常预先定义指令类别并硬编码与任务相关的具体指令

e.g.

```python
system_message = f"""
你将获得客户服务查询。
每个客户服务查询都将用{delimiter}字符分隔。
将每个查询分类到一个主要类别和一个次要类别中。
以 JSON 格式提供你的输出，包含以下键：primary 和 secondary。

主要类别：计费（Billing）、技术支持（Technical Support）、账户管理（Account Management）或一般咨询（General Inquiry）。

计费次要类别：
取消订阅或升级（Unsubscribe or upgrade）
添加付款方式（Add a payment method）
收费解释（Explanation for charge）
争议费用（Dispute a charge）

技术支持次要类别：
常规故障排除（General troubleshooting）
设备兼容性（Device compatibility）
软件更新（Software updates）

账户管理次要类别：
重置密码（Password reset）
更新个人信息（Update personal information）
关闭账户（Close account）
账户安全（Account security）

一般咨询次要类别：
产品信息（Product information）
定价（Pricing）
反馈（Feedback）
与人工对话（Speak to a human）

"""

user_message = f"我希望你删除我的个人资料和所有用户数据。"

messages =  [
    {'role':'system', 'content': system_message},
    {'role':'user', 'content': f"{delimiter}{user_message}{delimiter}"},  
]

response = get_completion_from_messages(messages)
print(response)  # {"primary": "账户管理", "secondary": "关闭账户"}
```

### 思维链推理

对于某些强逻辑问题，需要经过详细的推理步骤才能解决问题，此时使用 LLM 的思维链（CoT）策略，引导模型进行深度思考

思维链提示是一种引导语言模型进行逐步推理的 Prompt 设计技巧。它通过在 Prompt 中设置系统消息，要求语言模型在给出最终结论之前，先明确各个推理步骤。具体来说，Prompt 可以先请语言模型陈述对问题的初步理解，然后列出需要考虑的方方面面，最后再逐个分析这些因素，给出支持或反对的论据，才得出整体的结论

e.g.

```python
delimiter = "===="

system_message = f"""
请按照以下步骤回答客户的提问。客户的提问将以{delimiter}分隔。

步骤 1:{delimiter}首先确定用户是否正在询问有关特定产品或产品的问题。产品类别不计入范围。

步骤 2:{delimiter}如果用户询问特定产品，请确认产品是否在以下列表中。所有可用产品：

产品：TechPro 超极本
类别：计算机和笔记本电脑
品牌：TechPro
型号：TP-UB100
保修期：1 年
评分：4.5
特点：13.3 英寸显示屏，8GB RAM，256GB SSD，Intel Core i5 处理器
描述：一款适用于日常使用的时尚轻便的超极本。
价格：$799.99

产品：BlueWave 游戏笔记本电脑
类别：计算机和笔记本电脑
品牌：BlueWave
型号：BW-GL200
保修期：2 年
评分：4.7
特点：15.6 英寸显示屏，16GB RAM，512GB SSD，NVIDIA GeForce RTX 3060
描述：一款高性能的游戏笔记本电脑，提供沉浸式体验。
价格：$1199.99

产品：PowerLite 可转换笔记本电脑
类别：计算机和笔记本电脑
品牌：PowerLite
型号：PL-CV300
保修期：1年
评分：4.3
特点：14 英寸触摸屏，8GB RAM，256GB SSD，360 度铰链
描述：一款多功能可转换笔记本电脑，具有响应触摸屏。
价格：$699.99

产品：TechPro 台式电脑
类别：计算机和笔记本电脑
品牌：TechPro
型号：TP-DT500
保修期：1年
评分：4.4
特点：Intel Core i7 处理器，16GB RAM，1TB HDD，NVIDIA GeForce GTX 1660
描述：一款功能强大的台式电脑，适用于工作和娱乐。
价格：$999.99

产品：BlueWave Chromebook
类别：计算机和笔记本电脑
品牌：BlueWave
型号：BW-CB100
保修期：1 年
评分：4.1
特点：11.6 英寸显示屏，4GB RAM，32GB eMMC，Chrome OS
描述：一款紧凑而价格实惠的 Chromebook，适用于日常任务。
价格：$249.99

步骤 3:{delimiter} 如果消息中包含上述列表中的产品，请列出用户在消息中做出的任何假设，\
例如笔记本电脑 X 比笔记本电脑 Y 大，或者笔记本电脑 Z 有 2 年保修期等等。

步骤 4:{delimiter} 如果用户做出了任何假设，请根据产品信息确定假设是否正确。

步骤 5:{delimiter} 如果用户有任何错误的假设，请先礼貌地纠正客户的错误假设（如果适用）。\
只提及或引用可用产品列表中的产品，因为这是商店销售的唯一五款产品。以友好的口吻回答客户。

使用以下格式回答问题：
步骤 1: {delimiter} <步骤 1 的推理>
步骤 2: {delimiter} <步骤 2 的推理>
步骤 3: {delimiter} <步骤 3 的推理>
步骤 4: {delimiter} <步骤 4 的推理>
回复客户: {delimiter} <回复客户的内容>

请确保每个步骤上面的回答中中使用 {delimiter} 对步骤和步骤的推理进行分隔。
"""

user_message = f"给我推荐一个性能强劲的笔记本，我有玩游戏的需求"

messages = [
    {'role': 'system', 'content': system_message},
    {'role': 'user', 'content': f"{delimiter}{user_message}{delimiter}"},
]

response = get_completion_from_messages(messages)
print(response)
```

> 在使用思维链时，同时要注意 LLM 进行推理时，其中可能包含了系统的敏感信息，此时需要对 completion 进行处理，隐藏其中的敏感信息
{: .prompt-tip }

### Prompt 链

Prompt 链是将复杂任务工序化、流程化，分解为多个简单的任务，对于每个小任务构建不同的 prompt，从而解决复杂问题的策略

- 分解任务复杂度：每个 Prompt 仅处理一个具体子任务，避免过于宽泛的要求，提高成功率
- 降低计算成本。过长的 Prompt 使用更多 token，增加成本。拆分 Prompt 可以避免不必要的计算
- 更容易测试和调试：可以逐步分析每个环节的性能
- 融入外部工具：不同 Prompt 可以调用 API、数据库等外部资源（类似 Agent 的理念）
