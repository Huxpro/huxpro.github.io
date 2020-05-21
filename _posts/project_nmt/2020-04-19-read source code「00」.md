---
title: "read source code「00」"
subtitle: "nmt综述"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - nmt
  - paper with code
---



## 前言

「nmt 1-3」讲述了neural machine translation领域的发展，2014年开始，随着nmt的性能逐渐超越smt，用nmt做seq2seq问题引起了大家的注意。

encoder-decoder模型的介绍这里不再赘述，下面总结一下前几篇文章精髓：

1. LSTMs outperformes RNNs, 因为rnn会遭受long-term dependency的问题。
2. deep LSTMs signiﬁcantly outperformes shallow LSTMs，双向的效果更佳，可以捕获上下文的信息，而且也可以更好的处理长句子。
3. 输入encoder部分将句子逆序输入是一个trick
4. beam search=10是一个比较好的结果
5. 由于decoder是将encoder的最后一个fixed length的隐状态 context vector c 来进行initialize预测，从而给encoder带来巨大的压力，引入attention机制可以很好的化解这种压力，同时提升模型性能。
6. attention有global与local的区分，目测local的更靠谱些，同时也不需要给所有的词都打分，缓解了计算压力。



## build a competitive seq2seq model from scratch

1. We first build up some basic knowledge about seq2seq models for NMT, explaining how to build and train a vanilla NMT model. 
2. The second part will go into details of building a competitive NMT model with attention mechanism. 
3. We then discuss tips and tricks to build the best possible NMT models (both in speed and translation quality) such as TensorFlow best practices (batching, bucketing), bidirectional RNNs, beam search, as well as scaling up to multiple GPUs using GNMT attention.

### Training – How to build our first NMT system

![Ctp9bu](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Ctp9bu.png)

Let's first dive into **the heart of building an NMT model** with concrete code snippets through which we will explain **Figure 2** in more detail. We defer data preparation and the full code to later. T**his part refers to file [model.py](https://github.com/tensorflow/nmt/blob/master/nmt/model.py).**

- **encoder_inputs** [max_encoder_time, batch_size]: source input words.

```python
# Embedding
embedding_encoder = variable_scope.get_variable(
    "embedding_encoder", [src_vocab_size, embedding_size], ...)
# Look up embedding:
#   encoder_inputs: [max_time, batch_size]
#   encoder_emb_inp: [max_time, batch_size, embedding_size]

# 用encoder_inputs从embedding_encoder：[vocab_size, embed_size]取出对应的向量
encoder_emb_inp = embedding_ops.embedding_lookup(
    embedding_encoder, encoder_inputs)
```

```python
# Build RNN cell
encoder_cell = tf.nn.rnn_cell.BasicLSTMCell(num_units)

# Run Dynamic RNN
"""
input:
	cell：LSTM、GRU等的记忆单元。cell参数代表一个LSTM或GRU的记忆单元，也就是一个cell。例如，
	cell = tf.nn.rnn_cell.LSTMCell((num_units)，其中，num_units表示rnn cell中神经元个数，
	也就是下文的cell.output_size。返回一个LSTM或GRU cell，作为参数传入。

    encoder_emb_inp: [max_time, batch_size, embedding_size]
    batch_size是输入的这批数据的数量，max_time就是这批数据中序列的最长长度，embed_size表示嵌入
    的词向量的维度。

    sequence_length：是一个list，假设你输入了三句话，且三句话的长度分别是5,10,25,那么
    sequence_length=[5,10,25]。

    time_major：决定了输出tensor的格式，如果为True, 张量的形状必须为 [max_time, 
    batch_size,cell.output_size]。如果为False, tensor的形状必须为[batch_size, max_time, 
    cell.output_size]
    
return:
	encoder_outputs: [max_time, batch_size, num_units]
	outputs很容易理解，就是每个cell会有一个输出
	
	encoder_state: [batch_size, num_units]
	states表示最终的状态，也就是序列中最后一个cell输出的状态。一般情况下states的形状为 
	[batch_size, cell.output_size ]，但当输入的cell为BasicLSTMCell时，state的形状为[2，
	batch_size, cell.output_size ]，其中2也对应着LSTM中的cell state和hidden state。
"""

encoder_outputs, encoder_state = tf.nn.dynamic_rnn(
    encoder_cell, encoder_emb_inp,
    sequence_length=source_sequence_length, time_major=True)
```

- **decoder_inputs** [max_decoder_time, batch_size]: target input words.

The *decoder* also needs to have access to the source information, and one simple way to achieve that is to **initialize it with the last hidden state of the encoder**, *encoder_state*. In Figure 2, we pass the hidden state at the source word "student" to the decoder side.

```python
# Build RNN cell
decoder_cell = tf.nn.rnn_cell.BasicLSTMCell(num_units)

# Helper
helper = tf.contrib.seq2seq.TrainingHelper(
    decoder_emb_inp, decoder_lengths, time_major=True)
# Decoder
decoder = tf.contrib.seq2seq.BasicDecoder(
    decoder_cell, helper, encoder_state,
    output_layer=projection_layer)
# Dynamic decoding
outputs, _ = tf.contrib.seq2seq.dynamic_decode(decoder, ...)

# logits: [batch_size, tgt_vocab_size]
logits = outputs.rnn_output
```

Lastly, we haven't mentioned *projection_layer* which is **a dense matrix to turn the top hidden states to logit vectors of dimension V**. 

```python
projection_layer = layers_core.Dense(
    tgt_vocab_size, use_bias=False)
```

- **decoder_outputs** [max_decoder_time, batch_size]: target output words, these are decoder_inputs shifted to the left by one time step with an end-of-sentence tag appended on the right.

Given the *logits* above, we are now ready to compute our training loss:

```python
crossent = tf.nn.sparse_softmax_cross_entropy_with_logits(
    labels=decoder_outputs, logits=logits)
train_loss = (tf.reduce_sum(crossent * target_weights) /
    batch_size)
```

Here, *target_weights* is a zero-one matrix of the same size as *decoder_outputs*. It **masks padding positions outside of the target sequence lengths with values 0.**

### Hands-on – Let's train an NMT model

Let's train our very first NMT model, translating from Vietnamese to English! **The entry point of our code is [nmt.py](https://github.com/tensorflow/nmt/blob/master/nmt/nmt.py).**

- example：**See [train.py](https://github.com/tensorflow/nmt/blob/master/nmt/train.py) for more details.**

```python
mkdir /tmp/nmt_model
python -m nmt.nmt \
    --src=vi --tgt=en \
    --vocab_prefix=/tmp/nmt_data/vocab  \
    --train_prefix=/tmp/nmt_data/train \
    --dev_prefix=/tmp/nmt_data/tst2012  \
    --test_prefix=/tmp/nmt_data/tst2013 \
    --out_dir=/tmp/nmt_model \
    --num_train_steps=12000 \ # 12 epochs
    --steps_per_stats=100 \
    --num_layers=2 \ # 2-layer LSTM seq2seq model
    --num_units=128 \ # 128-dim hidden units
    --dropout=0.2 \ # a dropout value of 0.2 (keep probability 0.8)
    --metrics=bleu
```

### Inference – How to generate translations

at inference time, we only have access to the source sentence, i.e., *encoder_inputs*. There are many ways to perform decoding. Decoding methods include greedy, sampling, and beam-search decoding.

![cgsnuN](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/cgsnuN.png)

#### **greedy decoding strategy**

1. We still encode the source sentence in the same way as during training to obtain an *encoder_state*, and **this *encoder_state* is used to initialize the decoder**.
2. The decoding (translation) process is **started as soon as the decoder receives a starting symbol "\<s\>" (refer as *tgt_sos_id* in our code)**;
3. For each timestep on the decoder side, we **treat the RNN's output as a set of logits**. We choose the most likely word, **the id associated with the maximum logit value**, as the emitted word (this is the "greedy" behavior). For example in Figure 3, the word "moi" has **the highest translation probability** in the first decoding step. We then feed this word as input to the next timestep.
4. The process continues **until the end-of-sentence marker "\</s\>" is produced as an output symbol (refer as *tgt_eos_id* in our code)**.

### TensorFlow下attention的实现细节

Remember that in the vanilla seq2seq model, we **pass the last source state from the encoder to the decoder when starting the decoding process**. 

- This **works well for short and medium-length sentences**;
- however, for **long sentences**, the single **fixed-size hidden state becomes an information bottleneck**. 
- **Instead of discarding all of the hidden states computed in the source RNN**, the attention mechanism provides an approach that **allows the decoder to peek at them** (treating them as a dynamic memory of the source information). 
- By doing so, **the attention mechanism improves the translation of longer sentences**. Nowadays, attention mechanisms are the defacto standard and have been successfully applied to many other tasks (including image caption generation, speech recognition, and text summarization).

![2unru2](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/2unru2.png)

#### following stages

1. The current target hidden state is compared with all source states to derive *attention weights* (can be visualized as in Figure 4).
2. Based on the attention weights we compute a *context vector* as the **weighted average of the source states**.
3. **Combine the context vector with the current target hidden state to yield the final *attention vector***
4. **The attention vector is fed as an input to the next time step** (*input feeding*). The first three steps can be summarized by the equations below:

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/h1xRM4.jpg" alt="h1xRM4" style="zoom: 33%;" />

![xYrU7x](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/xYrU7x.jpg)

**Various implementations of attention mechanisms can be found in [attention_wrapper.py](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/contrib/seq2seq/python/ops/attention_wrapper.py).**

#### 源码阅读

##### super init

- super 的一个最常见用法可以说是**在子类中调用父类的初始化方法**了。

- **super()** 函数是用于调用父类(超类)的一个方法。

  super 是用来解决**多重继承问题**的，直接用类名调用父类方法在使用单继承的时候没问题，但是如果使用多继承，会涉及到查找顺序（MRO）、重复调用（钻石继承）等种种问题。

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-
 
class FooParent(object):
    def __init__(self):
        self.parent = 'I\'m the parent.'
        print ('Parent')
    
    def bar(self,message):
        print ("%s from Parent" % message)
 
class FooChild(FooParent):
    def __init__(self):
        # super(FooChild,self) 首先找到 FooChild 的父类（就是类 FooParent），然后把类 FooChild 的对象转换为类 FooParent 的对象
        super(FooChild,self).__init__()    
        print ('Child')
        
    def bar(self,message):
        super(FooChild, self).bar(message)
        print ('Child bar fuction')
        print (self.parent)
 
if __name__ == '__main__':
    fooChild = FooChild()
    fooChild.bar('HelloWorld')
    
>>>
Parent
Child
HelloWorld from Parent
Child bar fuction
I'm the parent.
```



- 多重继承

```python
class Base(object):
    def __init__(self):
        print("enter Base")
        print("leave Base")

class A(Base):
    def __init__(self):
        print("enter A")
        super(A,self).__init__()
        print("leave A")

class B(Base):
    def __init__(self):
        print("enter B")
        super(B,self).__init__()
        print("leave B")

class C(A,B):
    def __init__(self):
        print("enter C")
        super(C,self).__init__()
        print("leave C")

c=C()

>>>
enter C
enter A
enter B
enter Base
leave Base
leave B
leave A
leave C

Process finished with exit code 0
```

类C继承自A,B，而A和B又分别继承类Base，每一个类的构造函数分别被调用了一次。

那么这个**调用顺序**是怎么决定的，为什么 enter A 的下一句不是 enter Base 而是 enter B？

- 原因是，super 和父类**没有实质性的关联**。
- 对于你定义的每一个类，Python 会计算出一个**方法解析顺序**（Method Resolution Order, **MRO**）列表，它代表了类继承的顺序

```python
print(C.mro())
>>> [<class '__main__.C'>, <class '__main__.A'>, <class '__main__.B'>, <class '__main__.Base'>, <class 'object'>]
```

这个列表真实的列出了类C的继承顺序。**C->A->B->Base->object**。在方法调用时，是按照这个顺序查找的。
那**这个 MRO 列表的顺序是怎么定的**呢，它是通过一个 C3 线性化算法来实现的，这里我们就不去深究这个算法了，总的来说，一个类的 MRO 列表就是合并所有父类的 MRO 列表，并遵循以下三条原则：

- 子类永远在父类前面
- 如果有多个父类，会根据它们在列表中的顺序被检查
- 如果对下一个类存在两个合法的选择，选择第一个父类

##### step1: AttentionModel(model.Model)

```python
class AttentionModel(model.Model):
  """Sequence-to-sequence dynamic model with attention.

  This class implements a multi-layer recurrent neural network as encoder,
  and an attention-based decoder. This is the same as the model described in
  (Luong et al., EMNLP'2015) paper: https://arxiv.org/pdf/1508.04025v5.pdf.
  This class also allows to use GRU cells in addition to LSTM cells with
  support for dropout.
  """

  def __init__(self,
               hparams,
               mode,
               iterator,
               source_vocab_table,
               target_vocab_table,
               reverse_target_vocab_table=None,
               scope=None,
               extra_args=None):
    self.has_attention = hparams.attention_architecture and hparams.attention

    # Set attention_mechanism_fn
    if self.has_attention:
        # 如果有外置的attention_mechanism_fn，则调用
      if extra_args and extra_args.attention_mechanism_fn:
        self.attention_mechanism_fn = extra_args.attention_mechanism_fn
      else:
        # 否则，调用nmt提供的attention机制，转到create_attention_mechanism函数
        self.attention_mechanism_fn = create_attention_mechanism

    # 用super init的方式调用父类model.Model的init方法进行初始化
    super(AttentionModel, self).__init__(
        hparams=hparams,
        mode=mode,
        iterator=iterator,
        source_vocab_table=source_vocab_table,
        target_vocab_table=target_vocab_table,
        reverse_target_vocab_table=reverse_target_vocab_table,
        scope=scope,
        extra_args=extra_args)
```

##### step2: create_attention_mechanism

```python
def create_attention_mechanism(attention_option, num_units, memory,
                               source_sequence_length, mode):
  """Create attention mechanism based on the attention_option."""
  del mode  # unused

  # 提供了4种tensorflow内置的Mechanism机制
  if attention_option == "luong":
    attention_mechanism = tf.contrib.seq2seq.LuongAttention(
        num_units, memory, memory_sequence_length=source_sequence_length)
  elif attention_option == "scaled_luong":
    attention_mechanism = tf.contrib.seq2seq.LuongAttention(
        num_units,
        memory,
        memory_sequence_length=source_sequence_length,
        scale=True)
  elif attention_option == "bahdanau":
    attention_mechanism = tf.contrib.seq2seq.BahdanauAttention(
        num_units, memory, memory_sequence_length=source_sequence_length)
  elif attention_option == "normed_bahdanau":
    attention_mechanism = tf.contrib.seq2seq.BahdanauAttention(
        num_units,
        memory,
        memory_sequence_length=source_sequence_length,
        normalize=True)
  else:
    raise ValueError("Unknown attention option %s" % attention_option)

  return attention_mechanism
```

#### nmt AttentionWrapper 源码解读

在 TF 的实现里，所有 RNN 都是 RNNCell 的子类。

- **做了这层抽象之后，多层 RNN 和单层 RNN 就可以统一起来**：多层 RNN 作为一个整体也在沿时间轴循环，其输入是最底层 RNN 的输入，输出是最顶层 RNN 的输出，状态是每一层 RNN 状态组成的元组。

- **其实 TF 中的 MultiRNNCell 也是这么实现的。**MultiRNNCell 也是 RNNCell 的一个子类，它接受一个 RNNCell 实例的列表，然后在 call 函数中自底向上逐层调用每个 RNNCell 实例的 call 方法，**最终把最上层 RNNCell 的输出作为整体的输出**，把所有层 RNNCell 的新状态都收集起来、类型转换成 tuple，作为整体的新状态。

```python
    # Attention
    attention_mechanism = self.attention_mechanism_fn(
        hparams.attention, num_units, memory, source_sequence_length, self.mode)

    cell = model_helper.create_rnn_cell(
        unit_type=hparams.unit_type,
        num_units=num_units,
        num_layers=num_layers,
        num_residual_layers=num_residual_layers,
        forget_bias=hparams.forget_bias,
        dropout=hparams.dropout,
        num_gpus=self.num_gpus,
        mode=self.mode,
        single_cell_fn=self.single_cell_fn)

    # Only generate alignment in greedy INFER mode.
    alignment_history = (self.mode == tf.contrib.learn.ModeKeys.INFER and
                         infer_mode != "beam_search")
    cell = tf.contrib.seq2seq.AttentionWrapper(
        cell,
        attention_mechanism,
        attention_layer_size=num_units,
        alignment_history=alignment_history,
        output_attention=hparams.output_attention,
        name="attention")
```

简单地说，就是**先定义一层普通的 RNNCell（例如 LSTM）**，然后**定义某种 Attention 机制的实例（如 LuongAttention 或者 BahdanauAttention）**，**最后把这俩东西都传给 AttentionWrapper，返回封装后的 RNNCell。**

- 是的！**封装后还是 RNNCell 的实例！**

```python
# 超精简示范代码
cell = tf.contrib.rnn.DeviceWrapper(LSTMCell(512), "/device:GPU:0")
attention_mechanism = tf.contrib.seq2seq.LuongAttention(512, encoder_outputs)
attn_cell = tf.contrib.seq2seq.AttentionWrapper(
  cell, attention_mechanism, attention_size=256)
```

可这是如何做到的呢？

- 原来，这里有一个偷天换日的技巧，把原先 RNNCell 的状态包装一下就行了。**定义一个新类叫 AttentionWrapperState，原先 RNNCell 的状态只是它的一个域，而它还有别的域，保存和注意力机制相关的东西。这样一来，封装后的单元仍然有类似公式 ![[公式]](https://www.zhihu.com/equation?tex=y_t%2C+s_t+%3D+f%28x_t%2C+s_%7Bt-1%7D%29) 的循环**，但是循环中用到的状态变量 ![[公式]](https://www.zhihu.com/equation?tex=s_t) 的类型已经变了，从原先 RNNCell 的状态类型变成了 AttentionWrapperState。但是不管怎么说，都维持这个 RNNCell 核心的循环式，因此它仍然是一种 RNNCell，不影响它和别的接口相结合（例如 tf.nn.dynamic_rnn），这样就完成了封装。

##### AttentionWrapper 内部的（简化版的）工作流程

![iqlHC7](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/iqlHC7.jpg)

```python
# step1:当前时间步输入，prev_state.attention是第一块灰色块
cell_inputs = concat([inputs, prev_state.attention], -1)
# step2
cell_output, next_cell_state = cell(cell_inputs, prev_state.cell_state)
# step3
score = attention_mechanism(cell_output)
# step4
alignments = softmax(score)
# step5：context vector（encoder 每个时间步输出的加权组合，第二块灰色块
context = matmul(alignments, attention_mechanism.values)
# step6
attention = tf.layers.Dense(attention_size)(concat([cell_output, context], 1))
# step7：下一时间步的状态
next_state = AttentionWrapperState(
  cell_state=next_cell_state,
  attention=attention)
# step8
output = attention
return output, next_state
```

事实上，这个流程恰好对应了论文 Thang Luong, Hieu Pham, and Chris Manning. **Effective Approaches to Attention-based Neural Machine Translation**. EMNLP'15。该论文中有一幅示意图如下：

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/P9LWgo.jpg" alt="P9LWgo" style="zoom:67%;" />

在 decoder 侧取一个时间步（例如取输入 X 所在的时间步），然后把上下两个红框看成一个整体（相当于 TF 代码 cell = MultiRNNCell([GRUCell(layer_size) for _ in range(2)]) 的运行结果），那么：

- step1: 

  上面参考代码的第一步就是把**当前输入 X 和前一步 attention 结果拼起来**（如虚线连接所示，论文中称为 input feeding），**作为当前时间步的输入**。这种做法的直觉是，前一步 attention 的信息可能会对当前预测有帮助，例如让模型避免连续两次注意到同一个地方，跟个结巴似的一直输出一个词。

- step2:

  第二步是对被封装的 RNNCell 进行正常的更新，取它的输出cell_output作为 query 供后续使用

- step3&4:

  第三步到第四步是计算 encoder 每一步和当前 query 的匹配得分 score，然后归一化成概率分布

- step5:

  第五步得到 context vector（encoder 每个时间步输出的加权组合），在上图中用灰色框表示

- step6:

  第六步是对 context vector 继续做变换的结果（默认不做变换，此时 attention = context vector）

- step7:

  最后把新的相关信息封装成新的 AttentionWrapperState，就是**下一时间步的状态**

这里的封装方式是先更新内部 RNNCell，再计算 attention。也正因如此，这种封装完美契合了 LuongAttention，但是与注意力机制的开山之作（Bahdanau 那篇）却不太对味儿。

##### nmt官方示范（time_major vs batch_major）

First, we need to define an attention mechanism, e.g., from (Luong et al., 2015):

```python
# attention_states: [batch_size, max_time, num_units]
attention_states = tf.transpose(encoder_outputs, [1, 0, 2])

# Create an attention mechanism
attention_mechanism = tf.contrib.seq2seq.LuongAttention(
    num_units, attention_states,
    memory_sequence_length=source_sequence_length)
```

In the previous [Encoder](https://github.com/tensorflow/nmt#encoder) section, ***encoder_outputs* is the set of all source hidden states at the top layer and has the shape of *[max_time, batch_size, num_units]* (since we use *dynamic_rnn* with *time_major* set to *True* for efficiency).** 

- **time_major**就是说哪个处于第一个位置，设置为true就应该把max_time放第一个位置
- 否则，如果是**batch_major**，应该把batch_size放第一个位置

**For the attention mechanism, we need to make sure the "memory" passed in is batch major, so we need to transpose *attention_states***. We pass *source_sequence_length* to the attention mechanism to ensure that the attention weights are properly normalized (over non-padding positions only).

Having defined an attention mechanism, we use *AttentionWrapper* to wrap the decoding cell:

```python
decoder_cell = tf.contrib.seq2seq.AttentionWrapper(
    decoder_cell, attention_mechanism,
    attention_layer_size=num_units)
```

The rest of the code is almost the same as in the Section [Decoder](https://github.com/tensorflow/nmt#decoder)!



#### TensorFlow源码剖析

我们需要关注的有如下几个类：

- `AttentionMechanism`: 所有attention机制的父类，内部没有任何实现。
- `_BaseAttentionMechanism`: 继承自`AttentionMechanism`，定义了attention机制的一些公共方法实现和属性。
- `BahdanauAttention`和`LuongAttention`：均继承自`_BaseAttentionMechanism`，分别实现了1.2节所述的两种attention机制。
- `AttentionWrapper`: 用于封装RNNCell的类，继承自`RNNCell`，所以被它封装后依然是一个RNNCell类，只不过是带了attention的功能。
- `AttentionWrapperState`：用来存放计算过程中的state，前面说了`AttentionWrapper`其实也是一个RNNCell，那么它也有隐藏态（hidden state）信息，`AttentionWrapperState`就是这个state。除了RNN cell state，其中还额外存放了一些信息。

此外还有 `_BaseMonotonicAttentionMechanism`、`BahdanauMonotonicAttention`、`LuongMonotonicAttention` 以实现单调（monotonic）attention机制，以及一些公共的方法，如 `_luong_score`、`_bahdanau_score`、`_prepare_memory` 等等。

在进一步分析之前，我们先来明确代码中一些术语的意思：

- key & query: Attention的本质可以被描述为一个查询（query）与一系列（键key-值value）对一起映射成一个输出：将query和每个key进行相似度计算得到权重并进行归一化，将权重和相应的键值value进行加权求和得到最后的attention，这里key=value。简单理解就是，query相当于前面说的解码器的隐藏态 h′ihi′ ，而key就是编码器的隐藏态 hihi。
- memory: 这个memory其实才是编码器的所有隐藏态，与前面的key区别就是key可能是memory经过处理（例如线性变换）后得到的。
- alignments: 计算得到的每步编码器隐藏态 hh 的权重向量，即 [αi1,αi2,…,αiTx][αi1,αi2,…,αiTx]。



## Tips & Tricks

### Building Training, Eval, and Inference Graphs

**When building a machine learning model in TensorFlow, it's often best to build three separate graphs:**

- The Training graph, which:
  - Batches, buckets, and possibly subsamples input data from a set of files/external inputs.
  - Includes the forward and backprop ops.
  - Constructs the optimizer, and adds the training op.
- The Eval graph, which:
  - Batches and buckets input data from a set of files/external inputs.
  - Includes the training forward ops, and additional evaluation ops that aren't used for training.
- The Inference graph, which:
  - May not batch input data.
  - Does not subsample or bucket input data.
  - Reads input data from placeholders (data can be fed directly to the graph via *feed_dict* or from a C++ TensorFlow serving binary).
  - Includes a subset of the model forward ops, and possibly additional special inputs/outputs for storing state between session.run calls.

**Building separate graphs has several benefits:**

- The inference graph is usually very different from the other two, so it makes sense to build it separately.
- The eval graph becomes simpler since it no longer has all the additional backprop ops.
- Data feeding can be implemented separately for each graph.
- Variable reuse is much simpler. For example, in the eval graph there's no need to reopen variable scopes with *reuse=True* just because the Training model created these variables already. So the same code can be reused without sprinkling *reuse=* arguments everywhere.
- In distributed training, it is commonplace to have separate workers perform training, eval, and inference. These need to build their own graphs anyway. So building the system this way prepares you for distributed training.

**The primary source of complexity becomes how to share Variables across the three graphs in a single machine setting**. This is solved by using a separate session for each graph. **The training session periodically saves checkpoints, and the eval session and the infer session restore parameters from checkpoints**. The example below shows the main differences between the two approaches.

**Before: Three models in a single graph and sharing a single Session**

```python
with tf.variable_scope('root'):
  train_inputs = tf.placeholder()
  train_op, loss = BuildTrainModel(train_inputs)
  initializer = tf.global_variables_initializer()

with tf.variable_scope('root', reuse=True):
  eval_inputs = tf.placeholder()
  eval_loss = BuildEvalModel(eval_inputs)

with tf.variable_scope('root', reuse=True):
  infer_inputs = tf.placeholder()
  inference_output = BuildInferenceModel(infer_inputs)

sess = tf.Session()

sess.run(initializer)

for i in itertools.count():
  train_input_data = ...
  sess.run([loss, train_op], feed_dict={train_inputs: train_input_data})

  if i % EVAL_STEPS == 0:
    while data_to_eval:
      eval_input_data = ...
      sess.run([eval_loss], feed_dict={eval_inputs: eval_input_data})

  if i % INFER_STEPS == 0:
    sess.run(inference_output, feed_dict={infer_inputs: infer_input_data})
```

**After: Three models in three graphs, with three Sessions sharing the same Variables**

```python
train_graph = tf.Graph()
eval_graph = tf.Graph()
infer_graph = tf.Graph()

with train_graph.as_default():
  train_iterator = ...
  train_model = BuildTrainModel(train_iterator)
  initializer = tf.global_variables_initializer()

with eval_graph.as_default():
  eval_iterator = ...
  eval_model = BuildEvalModel(eval_iterator)

with infer_graph.as_default():
  infer_iterator, infer_inputs = ...
  infer_model = BuildInferenceModel(infer_iterator)

checkpoints_path = "/tmp/model/checkpoints"

train_sess = tf.Session(graph=train_graph)
eval_sess = tf.Session(graph=eval_graph)
infer_sess = tf.Session(graph=infer_graph)

train_sess.run(initializer)
train_sess.run(train_iterator.initializer)

for i in itertools.count():

  train_model.train(train_sess)

  if i % EVAL_STEPS == 0:
    checkpoint_path = train_model.saver.save(train_sess, checkpoints_path, global_step=i)
    eval_model.saver.restore(eval_sess, checkpoint_path)
    eval_sess.run(eval_iterator.initializer)
    while data_to_eval:
      eval_model.eval(eval_sess)

  if i % INFER_STEPS == 0:
    checkpoint_path = train_model.saver.save(train_sess, checkpoints_path, global_step=i)
    infer_model.saver.restore(infer_sess, checkpoint_path)
    infer_sess.run(infer_iterator.initializer, feed_dict={infer_inputs: infer_input_data})
    while data_to_infer:
      infer_model.infer(infer_sess)
```

### Data Input Pipeline

Prior to TensorFlow 1.2, users had two options for feeding data to the TensorFlow training and eval pipelines:

1. Feed data directly via ***feed_dict*** at each training *session.run* call.
2. Use the **queueing mechanisms** in *tf.train* (e.g. *tf.train.batch*) and *tf.contrib.train*.
3. Use **helpers from a higher level framework** like *tf.contrib.learn* or *tf.contrib.slim* (which effectively use #2).

> The first approach is easier for users who aren't familiar with TensorFlow or need to do exotic input modification (i.e., their own minibatch queueing) that can only be done in Python. The second and third approaches are more standard but a little less flexible; they also require starting multiple python threads (queue runners). Furthermore, if used incorrectly queues can lead to deadlocks or opaque error messages. Nevertheless, queues are significantly more efficient than using *feed_dict* and are the standard for both single-machine and distributed training.

**Starting in TensorFlow 1.2**, there is a new system available for reading data into TensorFlow models: dataset iterators, as found in the **tf.data** module. Data iterators are flexible, easy to reason about and to manipulate, and provide efficiency and multithreading by leveraging the TensorFlow C++ runtime.

A **dataset** can be created from a batch data Tensor, a filename, or a Tensor containing multiple filenames. Some examples:

```python
# Training dataset consists of multiple files.
train_dataset = tf.data.TextLineDataset(train_files)

# Evaluation dataset uses a single file, but we may
# point to a different file for each evaluation round.
eval_file = tf.placeholder(tf.string, shape=())
eval_dataset = tf.data.TextLineDataset(eval_file)

# For inference, feed input data to the dataset directly via feed_dict.
infer_batch = tf.placeholder(tf.string, shape=(num_infer_examples,))
infer_dataset = tf.data.Dataset.from_tensor_slices(infer_batch)
```

All datasets can be treated similarly via input processing. This includes reading and cleaning the data, bucketing (in the case of training and eval), filtering, and batching.

```python
# To convert each sentence into vectors of word strings, for example, we use the dataset map transformation:
dataset = dataset.map(lambda string: tf.string_split([string]).values)

# We can then switch each sentence vector into a tuple containing both the vector and its dynamic length:
dataset = dataset.map(lambda words: (words, tf.size(words))
                      
# Finally, we can perform a vocabulary lookup on each sentence. Given a lookup table object table, this map converts the first tuple elements from a vector of strings to a vector of integers.
dataset = dataset.map(lambda words, size: (table.lookup(words), size))

# Joining two datasets is also easy. If two files contain line-by-line translations of each other and each one is read into its own dataset, then a new dataset containing the tuples of the zipped lines can be created via:
source_target_dataset = tf.data.Dataset.zip((source_dataset, target_dataset))
                      
# Batching of variable-length sentences is straightforward. The following transformation batches batch_size elements from source_target_dataset, and respectively pads the source and target vectors to the length of the longest source and target vector in each batch.
batched_dataset = source_target_dataset.padded_batch(
        batch_size,
        padded_shapes=((tf.TensorShape([None]),  # source vectors of unknown size
                        tf.TensorShape([])),     # size(source)
                       (tf.TensorShape([None]),  # target vectors of unknown size
                        tf.TensorShape([]))),    # size(target)
        padding_values=((src_eos_id,  # source vectors padded on the right with src_eos_id
                         0),          # size(source) -- unused
                        (tgt_eos_id,  # target vectors padded on the right with tgt_eos_id
                         0)))         # size(target) -- unused

"""
Values emitted from this dataset will be nested tuples whose tensors have a leftmost dimension of size batch_size. The structure will be:
	iterator[0][0] has the batched and padded source sentence matrices.
    iterator[0][1] has the batched source size vectors.
    iterator[1][0] has the batched and padded target sentence matrices.
    iterator[1][1] has the batched target size vectors.
"""    
```

Finally, bucketing that batches similarly-sized source sentences together is also possible.

- Reading data from a Dataset requires three lines of code: create the iterator, get its values, and initialize it.

```python
batched_iterator = batched_dataset.make_initializable_iterator()

((source, source_lengths), (target, target_lengths)) = batched_iterator.get_next()

# At initialization time.
session.run(batched_iterator.initializer, feed_dict={...})
```

## Other resources

For deeper reading on Neural Machine Translation and sequence-to-sequence models, we highly recommend the following materials by [Luong, Cho, Manning, (2016)](https://sites.google.com/site/acl16nmt/); [Luong, (2016)](https://github.com/lmthang/thesis); and [Neubig, (2017)](https://arxiv.org/abs/1703.01619).

There's a wide variety of tools for building seq2seq models, so we pick one per language:
Stanford NMT https://nlp.stanford.edu/projects/nmt/ *[Matlab]*
tf-seq2seq https://github.com/google/seq2seq *[TensorFlow]*
Nemantus https://github.com/rsennrich/nematus *[Theano]*
OpenNMT http://opennmt.net/ *[Torch]*
OpenNMT-py https://github.com/OpenNMT/OpenNMT-py *[PyTorch]*

## References

- Dzmitry Bahdanau, Kyunghyun Cho, and Yoshua Bengio. 2015.[ Neural machine translation by jointly learning to align and translate](https://arxiv.org/pdf/1409.0473.pdf). ICLR.
- Minh-Thang Luong, Hieu Pham, and Christopher D Manning. 2015.[ Effective approaches to attention-based neural machine translation](https://arxiv.org/pdf/1508.04025.pdf). EMNLP.
- Ilya Sutskever, Oriol Vinyals, and Quoc V. Le. 2014.[ Sequence to sequence learning with neural networks](https://papers.nips.cc/paper/5346-sequence-to-sequence-learning-with-neural-networks.pdf). NIPS.

