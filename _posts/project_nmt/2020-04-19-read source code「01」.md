---
title: "read source code「01」"
subtitle: "nmt「model.py」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - nmt
  - paper with code
---



### python模块collections中namedtuple()的理解

可以将namedtuple理解为c中的**struct结构**，其首先将各个item命名，然后对每个item赋予数据。

```python
from collections import namedtuple
 
websites = [
    ('Sohu', 'http://www.google.com/', '张朝阳'),
    ('Sina', 'http://www.sina.com.cn/', '王志东'),
    ('163', 'http://www.163.com/', '丁磊')
]
 
Website = namedtuple('Website', ['name', 'url', 'founder'])
 
for website in websites:
    website = Website._make(website)

>>> Website(name='Sohu', url='http://www.google.com/', founder="张朝阳")
Website(name='Sina', url='http://www.sina.com.cn/', founder="王志东")
Website(name='163', url='http://www.163.com/', founder="丁磊")
```

对应model.py中

```python
class TrainOutputTuple(collections.namedtuple(
    "TrainOutputTuple", ("train_summary", "train_loss", "predict_count",
                         "global_step", "word_count", "batch_size", "grad_norm",
                         "learning_rate"))):
  """To allow for flexibily in returing different outputs."""
  pass


class EvalOutputTuple(collections.namedtuple(
    "EvalOutputTuple", ("eval_loss", "predict_count", "batch_size"))):
  """To allow for flexibily in returing different outputs."""
  pass


class InferOutputTuple(collections.namedtuple(
    "InferOutputTuple", ("infer_logits", "infer_summary", "sample_id",
                         "sample_words"))):
  """To allow for flexibily in returing different outputs."""
  pass
```



## BaseModel

BaseModel类主要定义了一些初始化的参数与流程

- `hparams` 用法，**参见详解1**

- 通过 `self._set_params_initializer` 进行参数初始化，重点关注
  - tf.nn.embedding_lookup，**参见详解2**
  - self.init_embeddings(hparams, scope)，**参见详解3**
  
- 通过 `self.build_graph` 来构建图，**参见详解4**: 

  - tf.layers.Dense 作为Projection层

  - 单向与双向网络构建

    tf.contrib.rnn.BasicLSTMCell
    tf.contrib.rnn.GRUCell
    tf.contrib.rnn.LayerNormBasicLSTMCell
    tf.contrib.rnn.NASCell

  - tf.nn.bidirectional_dynamic_rnn的内部原理

  - tf.contrib.seq2seq.dynamic_decode

  - tf.nn.sparse_softmax_cross_entropy_with_logits

- 通过`_set_train_or_infer` 设置train与infer阶段的参数

  - 学习率分：warmup与decay两阶段 tf.train.exponential_decay
  - 优化器的选择：sgd与adam tf.train.AdamOptimizer
  - 梯度裁剪 tf.clip_by_global_norm
  - summary记录

- 通过 `tf.train.Saver` 保存结果

```python
class BaseModel(object):
  """Sequence-to-sequence base class.
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
    """Create the model.

    Args:
      hparams: Hyperparameter configurations.
      mode: TRAIN | EVAL | INFER
      iterator: Dataset Iterator that feeds data.
      source_vocab_table: Lookup table mapping source words to ids.
      target_vocab_table: Lookup table mapping target words to ids.
      reverse_target_vocab_table: Lookup table mapping ids to target words. Only
        required in INFER mode. Defaults to None.
      scope: scope of the model.
      extra_args: model_helper.ExtraArgs, for passing customizable functions.

    """
    # 1. Set params
    self._set_params_initializer(hparams, mode, iterator,
                                 source_vocab_table, target_vocab_table,
                                 scope, extra_args)

    # Not used in general seq2seq models; when True, ignore decoder & training
    self.extract_encoder_layers = (hasattr(hparams, "extract_encoder_layers")
                                   and hparams.extract_encoder_layers)

    # 2. Train graph
    res = self.build_graph(hparams, scope=scope)
    if not self.extract_encoder_layers:
      self._set_train_or_infer(res, reverse_target_vocab_table, hparams)

    # 3. Saver
    self.saver = tf.train.Saver(
        tf.global_variables(), max_to_keep=hparams.num_keep_ckpts)
```

#### 详解1：hparams

- `tf.contrib.training.HParams()` 参考 https://github.com/tensorflow/tensorflow/blob/r1.8/tensorflow/contrib/training/python/training/hparam.py

A `HParams` object holds hyperparameters used to build and train a model, such as the number of hidden units in a neural net layer or the learning rate to use when training.

You first create a `HParams` object by specifying the names and values of the hyperparameters.

```python
# Create a HParams object specifying names and values of the model
# hyperparameters:
hparams = HParams(learning_rate=0.1, num_hidden_units=100)
# The hyperparameter are available as attributes of the HParams object:
hparams.learning_rate ==> 0.1
hparams.num_hidden_units ==> 100
```

```python
# Define a command line flag to pass name=value pairs.
# For example using argparse:
import argparse
parser = argparse.ArgumentParser(description='Train my model.')
parser.add_argument('--hparams', type=str,
                    help='Comma separated list of "name=value" pairs.')
args = parser.parse_args()
...
def my_program():
    # Create a HParams object specifying the names and values of the
    # model hyperparameters:
    hparams = tf.HParams(learning_rate=0.1, num_hidden_units=100,
                         activations=['relu', 'tanh'])
    # Override hyperparameters values by parsing the command line
    hparams.parse(args.hparams)
    # If the user passed `--hparams=learning_rate=0.3` on the command line
    # then 'hparams' has the following attributes:
    hparams.learning_rate ==> 0.3
    hparams.num_hidden_units ==> 100
    hparams.activations ==> ['relu', 'tanh']
    # If the hyperparameters are in json format use parse_json:
    hparams.parse_json('{"learning_rate": 0.3, "activations": "relu"}')
```



### 1. Set params: `_set_params_initializer()`

比较重要的是在Embeddings

- `iterator_utils.BatchedInput()`作用？

- 一是定义了 `self.encoder_emb_lookup_fn = tf.nn.embedding_lookup`，**参见详解2**
- 二是定义了 `self.init_embeddings(hparams, scope)`，**参见详解3**

```python
def _set_params_initializer(self,
                              hparams,
                              mode,
                              iterator,
                              source_vocab_table,
                              target_vocab_table,
                              scope,
                              extra_args=None):
    """Set various params for self and initialize."""
    
    ...

    # Batch size
    self.batch_size = tf.size(self.iterator.source_sequence_length)

    # Global step
    self.global_step = tf.Variable(0, trainable=False)

    # Initializer
    self.random_seed = hparams.random_seed
    initializer = model_helper.get_initializer(
        hparams.init_op, self.random_seed, hparams.init_weight)
    tf.get_variable_scope().set_initializer(initializer)

    # Embeddings
    if extra_args and extra_args.encoder_emb_lookup_fn:
      self.encoder_emb_lookup_fn = extra_args.encoder_emb_lookup_fn
    else:
      self.encoder_emb_lookup_fn = tf.nn.embedding_lookup
    self.init_embeddings(hparams, scope)
```

#### 详解2：embedding_lookup

- `tf.nn.embedding_lookup(params, ids, partition_strategy='mod', max_norm=None)`作用

这个函数的目的是按照 ids 从 params这个矩阵中拿向量（行），所以 ids 就是这个矩阵索引（行号），需要 int 类型。

![img](https://pic2.zhimg.com/80/v2-9de68e5c46e9ea1ea480e295b0cc0b87_1440w.jpg)

![0jmaLd](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/0jmaLd.png)


#### 详解3：NMT项目中Embedding的构建过程

- **在模型的训练过程中，会自动更新embedding矩阵！** 等模型训练好了，这个数字矩阵的值也就确定下来了。如果想下次不再重复训练了，直接加载，这样可以吗？答案是：**当然可以!**。 实际上，tensorflow/nmt项目有一个参数`--embed_file`指的就是这个所谓的矩阵的值保存的文件！

- TensorFlow NMT的词嵌入代码入口位于**nmt/model.py**文件，**BaseModel**有一个`init_embeddings()`方法，NMT模型就是在此处完成词嵌入的初始化的。

##### step1: 从超参数获取需要的参数

```python
def init_embeddings(self, hparams, scope):
    """Init embeddings."""
    self.embedding_encoder, self.embedding_decoder = (
        model_helper.create_emb_for_encoder_and_decoder(
            # 源数据和目标数据是否使用相同的词典
            share_vocab=hparams.share_vocab,
            src_vocab_size=self.src_vocab_size,
            tgt_vocab_size=self.tgt_vocab_size,
            # 源数据词嵌入的维度，数值上等于指定的神经单元数量
            src_embed_size=self.num_units,
            # 目标数据词嵌入的维度，数值上等于指定的神经单元数量
            tgt_embed_size=self.num_units,
            # 词嵌入分块数量，分布式训练的时候，需要该值大于1
            num_enc_partitions=hparams.num_enc_emb_partitions,
            # 源数据的词典文件
            src_vocab_file=hparams.src_vocab_file,
            # 目标数据的词典文件
            tgt_vocab_file=hparams.tgt_vocab_file,
            # 源数据已经训练好的词嵌入文件
            src_embed_file=hparams.src_embed_file,
            # 目标数据已经训练好的词嵌入文件
            tgt_embed_file=hparams.tgt_embed_file,
            use_char_encode=hparams.use_char_encode,
            scope=scope,))
```

##### step2: 创建或者加载词嵌入矩阵

根据超参数，如果提供了**预训练**的词嵌入文件，则我们只需要根据词典，将词典中的词的嵌入表示，从词嵌入文件取出来即可。如果没有提供预训练的词嵌入文件，则我们自己创建一个即可。

```python
def create_emb_for_encoder_and_decoder(share_vocab,
                                       src_vocab_size,
                                       tgt_vocab_size,
                                       src_embed_size,
                                       tgt_embed_size,
                                       dtype=tf.float32,
                                       num_enc_partitions=0,
                                       num_dec_partitions=0,
                                       src_vocab_file=None,
                                       tgt_vocab_file=None,
                                       src_embed_file=None,
                                       tgt_embed_file=None,
                                       use_char_encode=False,
                                       scope=None):
  """Create embedding matrix for both encoder and decoder.

  Args:
	...
    scope: VariableScope for the created subgraph. Default to "embedding".

  Returns:
    embedding_encoder: Encoder's embedding matrix.
    embedding_decoder: Decoder's embedding matrix.

  Raises:
    ValueError: if use share_vocab but source and target have different vocab
      size.
  """
  # 分块器，用于分布式训练
  if num_enc_partitions <= 1:
    # 小于等于1，则不需要分块，不使用分布式训练
    enc_partitioner = None
  else:
    # Note: num_partitions > 1 is required for distributed training due to
    # embedding_lookup tries to colocate single partition-ed embedding variable
    # with lookup ops. This may cause embedding variables being placed on worker
    # jobs.
    enc_partitioner = tf.fixed_size_partitioner(num_enc_partitions)

  if num_dec_partitions <= 1:
    dec_partitioner = None
  else:
    # Note: num_partitions > 1 is required for distributed training due to
    # embedding_lookup tries to colocate single partition-ed embedding variable
    # with lookup ops. This may cause embedding variables being placed on worker
    # jobs.
    dec_partitioner = tf.fixed_size_partitioner(num_dec_partitions)

  if src_embed_file and enc_partitioner:
    raise ValueError(
        "Can't set num_enc_partitions > 1 when using pretrained encoder "
        "embedding")

  # 如果使用分布式训练，则不能使用已经训练好的词嵌入文件
  if tgt_embed_file and dec_partitioner:
    raise ValueError(
        "Can't set num_dec_partitions > 1 when using pretrained decdoer "
        "embedding")

  # 创建词嵌入的变量域
  with tf.variable_scope(
      scope or "embeddings", dtype=dtype, partitioner=enc_partitioner) as scope:
    # Share embedding
    if share_vocab:
      # 检查词典大小是否匹配
      if src_vocab_size != tgt_vocab_size:
        raise ValueError("Share embedding but different src/tgt vocab sizes"
                         " %d vs. %d" % (src_vocab_size, tgt_vocab_size))
      assert src_embed_size == tgt_embed_size
      utils.print_out("# Use the same embedding for source and target")
      vocab_file = src_vocab_file or tgt_vocab_file
      embed_file = src_embed_file or tgt_embed_file
      # 如果有训练好的词嵌入模型，则直接加载，否则创建新的
      embedding_encoder = _create_or_load_embed(
          "embedding_share", vocab_file, embed_file,
          src_vocab_size, src_embed_size, dtype)
      embedding_decoder = embedding_encoder
    # 不共享词典的话，需要根据不同的词典创建对应的编码器和解码器
    else:
      if not use_char_encode:
        with tf.variable_scope("encoder", partitioner=enc_partitioner):
          # 加载或者创建编码器
          embedding_encoder = _create_or_load_embed(
              "embedding_encoder", src_vocab_file, src_embed_file,
              src_vocab_size, src_embed_size, dtype)
      else:
        embedding_encoder = None

      with tf.variable_scope("decoder", partitioner=dec_partitioner):
        # 加载或创建解码器
        embedding_decoder = _create_or_load_embed(
            "embedding_decoder", tgt_vocab_file, tgt_embed_file,
            tgt_vocab_size, tgt_embed_size, dtype)

  return embedding_encoder, embedding_decoder
```

加载或者创建编码器，大小：[vocab_size, embed_size]

```python
def _create_or_load_embed(embed_name, vocab_file, embed_file,
                          vocab_size, embed_size, dtype):
  """Create a new or load an existing embedding matrix."""
  # 如果提供了训练好的词嵌入文件，则直接加载
  if vocab_file and embed_file:
    embedding = _create_pretrained_emb_from_txt(vocab_file, embed_file)
  else:
    # 否则创建新的词嵌入
    with tf.device(_get_embed_device(vocab_size)):
      embedding = tf.get_variable(
          embed_name, [vocab_size, embed_size], dtype)
  return embedding
```

##### step3.1: 加载预训练的词嵌入表示

如果超参数提供了embed_file这个预训练好的词嵌入文件，那么我么只需要读取该文件，创建出词嵌入矩阵，返回即可。

```python
def _create_pretrained_emb_from_txt(
    vocab_file, embed_file, num_trainable_tokens=3, dtype=tf.float32,
    scope=None):
  """Load pretrain embeding from embed_file, and return an embedding matrix.

  Args:
  	vocab_file: 词典文件
    embed_file: Path to a Glove formated embedding txt file.
    num_trainable_tokens: Make the first n tokens in the vocab file as trainable
      variables. Default is 3, which is "<unk>", "<s>" and "</s>".
  
  Returns:
    词嵌入矩阵
  """
  # 加载词典
  vocab, _ = vocab_utils.load_vocab(vocab_file)
  # 词典的前三行会加上三个特殊标记，取出三个特殊标记
  trainable_tokens = vocab[:num_trainable_tokens]

  utils.print_out("# Using pretrained embedding: %s." % embed_file)
  utils.print_out("  with trainable tokens: ")

  # 加载训练好的词嵌入
  emb_dict, emb_size = vocab_utils.load_embed_txt(embed_file)
  for token in trainable_tokens:
    utils.print_out("    %s" % token)
    # 如果三个标记不在训练好的词嵌入中
    if token not in emb_dict:
      # 初始化三个标记为0.0，维度为词嵌入的维度
      emb_dict[token] = [0.0] * emb_size
  # 从训练好的词嵌入矩阵中，取出词典中的词语的词嵌入表示，数据类型为tf.float32
  emb_mat = np.array(
      [emb_dict[token] for token in vocab], dtype=dtype.as_numpy_dtype())
  # 常量化词嵌入矩阵
  emb_mat = tf.constant(emb_mat)
  # 从词嵌入矩阵的第4行之后的所有行和列（因为num_trainable_tokens=3)
  # 也就是说取出除了3个标记之外所有的词嵌入表示
  # 这是常量，因为已经训练好了，不需要训练了
  emb_mat_const = tf.slice(emb_mat, [num_trainable_tokens, 0], [-1, -1])
  with tf.variable_scope(scope or "pretrain_embeddings", dtype=dtype) as scope:
    with tf.device(_get_embed_device(num_trainable_tokens)):
      # 获取3个标记的词嵌入表示，这3个标记的词嵌入是可以变的，通过训练可以学习
      emb_mat_var = tf.get_variable(
          "emb_mat_var", [num_trainable_tokens, emb_size])
  # 将3个标记的词嵌入和其余单词的词嵌入合并起来，得到完整的单词词嵌入表示
  return tf.concat([emb_mat_var, emb_mat_const], 0)
```

##### step3.2: 重新创建词嵌入表示

这个过程其实很简单，就是创建一个可训练的张量而已：

该张量的名字就是`embed_name`，shape即[vocab_size, embed_size]，其中`vocab_size`就是词典的大小，也就是二维矩阵的行数，`embed_size`就是词嵌入的维度，每个词用多少个数字来表示，也就是二维矩阵的列数。该张量的数据类型是单精度浮点数。当然，`tf.get_variable()`方法还有很多提供默认值的参数，其中一个就是`trainable=True`，这代表这个变量是可变的，也就是我们的词嵌入表示在训练过程中，数字是会改变的。

```python
def _create_or_load_embed(embed_name, vocab_file, embed_file,
                          vocab_size, embed_size, dtype):
  """Create a new or load an existing embedding matrix."""
  ...
  else:
    # 否则创建新的词嵌入
    with tf.device(_get_embed_device(vocab_size)):
      embedding = tf.get_variable(
          embed_name, [vocab_size, embed_size], dtype)
  return embedding
```




### 2. Train graph: `build_graph()`

#### 详解4: nmt构图过程

##### step1: Projection构建

```python
def build_graph(self, hparams, scope=None):
# Projection
    if not self.extract_encoder_layers:
      with tf.variable_scope(scope or "build_network"):
        with tf.variable_scope("decoder/output_projection"):
          # 构建一个tgt_vocab_size长度的Projection层
          self.output_layer = tf.layers.Dense(
              self.tgt_vocab_size, use_bias=False, name="output_projection")
```

##### step2: Encoder构建

```python
def build_graph(self, hparams, scope=None):
    ......
    with tf.variable_scope(scope or "dynamic_seq2seq", dtype=self.dtype):
      # Encoder
      if hparams.language_model:  # no encoder for language modeling
        utils.print_out("  language modeling: no encoder")
        self.encoder_outputs = None
        encoder_state = None
      else:
      # 如果不是 language modeling
        self.encoder_outputs, encoder_state = self._build_encoder(hparams)
```

```python
def _build_encoder(self, hparams):
    """Build encoder from source."""
    utils.print_out("# Build a basic encoder")
    return self._build_encoder_from_sequence(
        hparams, self.iterator.source, self.iterator.source_sequence_length)
```

##### step2.1: 如果是单向网络 "uni"

```python
def _build_encoder_from_sequence(self, hparams, sequence, sequence_length):    
    if self.time_major:
      sequence = tf.transpose(sequence)

    with tf.variable_scope("encoder") as scope:
      dtype = scope.dtype

      # 用sequence从embedding_encoder：[vocab_size, embed_size]取出对应的向量
      # 参考：embedding_lookup
      self.encoder_emb_inp = self.encoder_emb_lookup_fn(
          self.embedding_encoder, sequence)
        
      # 如果是单向网络
      if hparams.encoder_type == "uni":
        utils.print_out("  num_layers = %d, num_residual_layers=%d" %
                        (num_layers, num_residual_layers))
        cell = self._build_encoder_cell(hparams, num_layers,
                                        num_residual_layers)

        encoder_outputs, encoder_state = tf.nn.dynamic_rnn(
            cell,
            self.encoder_emb_inp,
            dtype=dtype,
            sequence_length=sequence_length,
            time_major=self.time_major,
            swap_memory=True)
        
        # Use the top layer for now
    	self.encoder_state_list = [encoder_outputs]

    	return encoder_outputs, encoder_state
```

```python
def _build_encoder_cell(self, hparams, num_layers, num_residual_layers,
                          base_gpu=0):
    """Build a multi-layer RNN cell that can be used by encoder."""

    return model_helper.create_rnn_cell(
        unit_type=hparams.unit_type,
        num_units=self.num_units,
        num_layers=num_layers,
        num_residual_layers=num_residual_layers,
        forget_bias=hparams.forget_bias,
        dropout=hparams.dropout,
        num_gpus=hparams.num_gpus,
        mode=self.mode,
        base_gpu=base_gpu,
        single_cell_fn=self.single_cell_fn)
```

```python
def create_rnn_cell(unit_type, num_units, num_layers, num_residual_layers,
                    forget_bias, dropout, mode, num_gpus, base_gpu=0,
                    single_cell_fn=None):
  """Create multi-layer RNN cell.

  Args:
    unit_type: string representing the unit type, i.e. "lstm".
    num_units: the depth of each unit.
    num_layers: number of cells.
    mode: either tf.contrib.learn.TRAIN/EVAL/INFER
    single_cell_fn: allow for adding customized cell.
      When not specified, we default to model_helper._single_cell
    ...
  Returns:
    An `RNNCell` instance.
  """
  cell_list = _cell_list(unit_type=unit_type,
                         num_units=num_units,
                         num_layers=num_layers,
                         num_residual_layers=num_residual_layers,
                         forget_bias=forget_bias,
                         dropout=dropout,
                         mode=mode,
                         num_gpus=num_gpus,
                         base_gpu=base_gpu,
                         single_cell_fn=single_cell_fn)

  if len(cell_list) == 1:  # Single layer.
    return cell_list[0]
  else:  # Multi layers
    # 如果有多层，则用tf.contrib.rnn.MultiRNNCell封装
    return tf.contrib.rnn.MultiRNNCell(cell_list)
```

```python
def _cell_list(unit_type, num_units, num_layers, num_residual_layers,
               forget_bias, dropout, mode, num_gpus, base_gpu=0,
               single_cell_fn=None, residual_fn=None):
  """Create a list of RNN cells."""
  # 如果未自定义single_cell_fn，那么采用_single_cell
    # _single_cell定义了多种类型的网络：
        # tf.contrib.rnn.BasicLSTMCell
        # tf.contrib.rnn.GRUCell
        # tf.contrib.rnn.LayerNormBasicLSTMCell
        # tf.contrib.rnn.NASCell
  if not single_cell_fn:
    single_cell_fn = _single_cell

  # Multi-GPU
  cell_list = []
  for i in range(num_layers):
    utils.print_out("  cell %d" % i, new_line=False)
    single_cell = single_cell_fn(
        unit_type=unit_type,
        num_units=num_units,
        forget_bias=forget_bias,
        dropout=dropout,
        mode=mode,
        residual_connection=(i >= num_layers - num_residual_layers),
        device_str=get_device_str(i + base_gpu, num_gpus),
        residual_fn=residual_fn
    )
    utils.print_out("")
    cell_list.append(single_cell)

  return cell_list
```

```python
def _single_cell(unit_type, num_units, forget_bias, dropout, mode,
                 residual_connection=False, device_str=None, residual_fn=None):
  """Create an instance of a single RNN cell."""
  # dropout (= 1 - keep_prob) is set to 0 during eval and infer
  dropout = dropout if mode == tf.contrib.learn.ModeKeys.TRAIN else 0.0

  # Cell Type
  # 如果类型是“lstm”，则调用tf.contrib.rnn.BasicLSTMCell构建
  if unit_type == "lstm":
    utils.print_out("  LSTM, forget_bias=%g" % forget_bias, new_line=False)
    single_cell = tf.contrib.rnn.BasicLSTMCell(
        num_units,
        forget_bias=forget_bias)
  # 如果类型是“gru”，则调用tf.contrib.rnn.GRUCell构建
  elif unit_type == "gru":
    utils.print_out("  GRU", new_line=False)
    single_cell = tf.contrib.rnn.GRUCell(num_units)
  # 如果类型是“layer_norm_lstm”，则调用tf.contrib.rnn.LayerNormBasicLSTMCell构建
  elif unit_type == "layer_norm_lstm":
    utils.print_out("  Layer Normalized LSTM, forget_bias=%g" % forget_bias,
                    new_line=False)
    single_cell = tf.contrib.rnn.LayerNormBasicLSTMCell(
        num_units,
        forget_bias=forget_bias,
        layer_norm=True)
  # 如果类型是“nas”，则调用tf.contrib.rnn.NASCell构建
  elif unit_type == "nas":
    utils.print_out("  NASCell", new_line=False)
    single_cell = tf.contrib.rnn.NASCell(num_units)
  else:
    raise ValueError("Unknown unit type %s!" % unit_type)

  # Dropout (= 1 - keep_prob)
  if dropout > 0.0:
    single_cell = tf.contrib.rnn.DropoutWrapper(
        cell=single_cell, input_keep_prob=(1.0 - dropout))
    utils.print_out("  %s, dropout=%g " %(type(single_cell).__name__, dropout),
                    new_line=False)

  # Residual
  if residual_connection:
    single_cell = tf.contrib.rnn.ResidualWrapper(
        single_cell, residual_fn=residual_fn)
    utils.print_out("  %s" % type(single_cell).__name__, new_line=False)

  # Device Wrapper
  if device_str:
    single_cell = tf.contrib.rnn.DeviceWrapper(single_cell, device_str)
    utils.print_out("  %s, device=%s" %
                    (type(single_cell).__name__, device_str), new_line=False)

  return single_cell
```

##### step2.2: 如是双向网络 “bi”

```python
def _build_encoder_from_sequence(self, hparams, sequence, sequence_length):    
    elif hparams.encoder_type == "bi":
        # 每两层构成一层“bi-rnns”层，故除以2
        num_bi_layers = int(num_layers / 2)
        num_bi_residual_layers = int(num_residual_layers / 2)
        utils.print_out("  num_bi_layers = %d, num_bi_residual_layers=%d" %
                        (num_bi_layers, num_bi_residual_layers))

        encoder_outputs, bi_encoder_state = (
            self._build_bidirectional_rnn(
                inputs=self.encoder_emb_inp,
                sequence_length=sequence_length,
                dtype=dtype,
                hparams=hparams,
                num_bi_layers=num_bi_layers,
                num_bi_residual_layers=num_bi_residual_layers))
		# 如果只有一层
        if num_bi_layers == 1:
          encoder_state = bi_encoder_state
        else:
          # 如果有多层，那么拼接成一个tuple
          # alternatively concat forward and backward states
          encoder_state = []
          for layer_id in range(num_bi_layers):
            encoder_state.append(bi_encoder_state[0][layer_id])  # forward
            encoder_state.append(bi_encoder_state[1][layer_id])  # backward
          encoder_state = tuple(encoder_state)
      else:
        raise ValueError("Unknown encoder_type %s" % hparams.encoder_type)

    # Use the top layer for now
    self.encoder_state_list = [encoder_outputs]

    return encoder_outputs, encoder_state
```

```python
def _build_bidirectional_rnn(self, inputs, sequence_length,
                               dtype, hparams,
                               num_bi_layers,
                               num_bi_residual_layers,
                               base_gpu=0):
    """Create and call biddirectional RNN cells.

    Args:
	...
    Returns:
      The concatenated bidirectional output and the bidirectional RNN cell"s
      state.
    """
    # Construct forward and backward cells
    # 前向采用单向网络中的_build_encoder_cell
    fw_cell = self._build_encoder_cell(hparams,
                                       num_bi_layers,
                                       num_bi_residual_layers,
                                       base_gpu=base_gpu)
    # 后向也采用单向网络中的_build_encoder_cell
    bw_cell = self._build_encoder_cell(hparams,
                                       num_bi_layers,
                                       num_bi_residual_layers,
                                       base_gpu=(base_gpu + num_bi_layers))
	#调用tf.nn.bidirectional_dynamic_rnn
    	# 内部实现是将bw_cell先逆序然后同正向一样输入，最后将输出结果再用tf.reverse_sequence
        # 注意，这两个逆序函数不同，所以结果也与正向不同
        # 返回：bi_outputs:一个(output_fw,output_bw)元组
        # 返回：bi_state:一个(output_state_fw,output_state_bw)的元组
    bi_outputs, bi_state = tf.nn.bidirectional_dynamic_rnn(
        fw_cell,
        bw_cell,
        inputs,
        dtype=dtype,
        sequence_length=sequence_length,
        time_major=self.time_major,
        swap_memory=True)
    # 将bi_outputs按最后一个轴拼接，bi_state还是两个state的tuple
   	return tf.concat(bi_outputs, -1), bi_state
```

##### step3: decoder构建

decoder做的就是利用encoder的 encoder_state 作预测，注意如果没有引入attention机制，encoder_outputs是用不到的。另外decoder 部分代码注意区分标志位 Train or eval 模式。

```python
def build_graph(self, hparams, scope=None):
	"""
	Returns:
    	logits: float32 Tensor [batch_size x num_decoder_symbols].
    	final_context_state: the final state of decoder RNN.
    	sample_id: sampling indices.
	"""
    ...
    # Skip decoder if extracting only encoder layers
      if self.extract_encoder_layers:
        return

      ## Decoder
      logits, decoder_cell_outputs, sample_id, final_context_state = (
          self._build_decoder(self.encoder_outputs, encoder_state, hparams))
```

```python
def _build_decoder(self, encoder_outputs, encoder_state, hparams):
    """Build and run a RNN decoder with a final projection layer.

    Args:
      encoder_outputs: The outputs of encoder for every time step.
      encoder_state: The final state of the encoder.
      hparams: The Hyperparameters configurations.

    Returns:
      A tuple of final logits and final decoder state:
        logits: size [time, batch_size, vocab_size] when time_major=True.
    """
    # 从tgt_vocab_table表中查询<sos>对应的id
    tgt_sos_id = tf.cast(self.tgt_vocab_table.lookup(tf.constant(hparams.sos)),
                         tf.int32)
    # 从tgt_vocab_table表中查询<sos>对应的id
    tgt_eos_id = tf.cast(self.tgt_vocab_table.lookup(tf.constant(hparams.eos)),
                         tf.int32)
    # 将iterator_utils.BatchedInput传入
    iterator = self.iterator

    # maximum_iteration: The maximum decoding steps.
    	# 如果设定了tgt_max_len_infer则将此作为最大infer长度，但是实际一般是none，所以
        # maximum_iterations = tf.to_int32(tf.round(
        #  tf.to_float(tf.reduce_max(source_sequence_length)) * 2.0))
    maximum_iterations = self._get_infer_maximum_iterations(
        hparams, iterator.source_sequence_length)

    ## Decoder.
    with tf.variable_scope("decoder") as decoder_scope:
      cell, decoder_initial_state = self._build_decoder_cell(
          hparams, encoder_outputs, encoder_state,
          iterator.source_sequence_length)

      # Optional ops depends on which mode we are in and which loss function we
      # are using.
      logits = tf.no_op()
      decoder_cell_outputs = None

      ## Train or eval
      if self.mode != tf.contrib.learn.ModeKeys.INFER:
        # decoder_emp_inp: [max_time, batch_size, num_units]
        target_input = iterator.target_input
        if self.time_major:
          target_input = tf.transpose(target_input)
        decoder_emb_inp = tf.nn.embedding_lookup(
            self.embedding_decoder, target_input)

        # Helper
        # TrainingHelper接收的参数主要有一个大小为[batch_size, seqlen, embed_size]的输入inputs；以及每个句子的真实长度sequence_length，是一个[batch_size]的向量；time_major为真则把seqlen作为第一维。注意下sequence_length是一个batch_size大小的数组，指明了每个句子的真实长度（因为有些长度是padding的
        helper = tf.contrib.seq2seq.TrainingHelper(
            decoder_emb_inp, iterator.target_sequence_length,
            time_major=self.time_major)

        # Decoder
        my_decoder = tf.contrib.seq2seq.BasicDecoder(
            cell,
            helper,
            decoder_initial_state,)

        # Dynamic decoding
        # 这个函数主要的一个思想是一步一步地调用Decoder的step函数（该函数接收当前的输入和隐层状态会生成下一个词），实现最后的一句话的生成。
        outputs, final_context_state, _ = tf.contrib.seq2seq.dynamic_decode(
            my_decoder,
            output_time_major=self.time_major,
            swap_memory=True,
            scope=decoder_scope)

        sample_id = outputs.sample_id

        if self.num_sampled_softmax > 0:
          # Note: this is required when using sampled_softmax_loss.
          decoder_cell_outputs = outputs.rnn_output

        # Note: there's a subtle difference here between train and inference.
        # We could have set output_layer when create my_decoder
        #   and shared more code between train and inference.
        # We chose to apply the output_layer to all timesteps for speed:
        #   10% improvements for small models & 20% for larger ones.
        # If memory is a concern, we should apply output_layer per timestep.
        num_layers = self.num_decoder_layers
        num_gpus = self.num_gpus
        device_id = num_layers if num_layers < num_gpus else (num_layers - 1)
        # Colocate output layer with the last RNN cell if there is no extra GPU
        # available. Otherwise, put last layer on a separate GPU.
        with tf.device(model_helper.get_device_str(device_id, num_gpus)):
          # 这里的output_layer是之前提及的Projection层
          logits = self.output_layer(outputs.rnn_output)

        if self.num_sampled_softmax > 0:
          logits = tf.no_op()  # unused when using sampled softmax loss.

      ## Inference
      else:
        infer_mode = hparams.infer_mode
        # creates a tensor of shape batch_size and fills it with value
        start_tokens = tf.fill([self.batch_size], tgt_sos_id)
        end_token = tgt_eos_id
        utils.print_out(
            "  decoder: infer_mode=%sbeam_width=%d, "
            "length_penalty=%f, coverage_penalty=%f"
            % (infer_mode, hparams.beam_width, hparams.length_penalty_weight,
               hparams.coverage_penalty_weight))

        if infer_mode == "beam_search":
          beam_width = hparams.beam_width
          length_penalty_weight = hparams.length_penalty_weight
          coverage_penalty_weight = hparams.coverage_penalty_weight

          my_decoder = tf.contrib.seq2seq.BeamSearchDecoder(
              cell=cell,
              embedding=self.embedding_decoder,
              start_tokens=start_tokens,
              end_token=end_token,
              initial_state=decoder_initial_state,
              beam_width=beam_width,
              output_layer=self.output_layer,
              length_penalty_weight=length_penalty_weight,
              coverage_penalty_weight=coverage_penalty_weight)
        elif infer_mode == "sample":
          # Helper
          sampling_temperature = hparams.sampling_temperature
          assert sampling_temperature > 0.0, (
              "sampling_temperature must greater than 0.0 when using sample"
              " decoder.")
          helper = tf.contrib.seq2seq.SampleEmbeddingHelper(
              self.embedding_decoder, start_tokens, end_token,
              softmax_temperature=sampling_temperature,
              seed=self.random_seed)
        elif infer_mode == "greedy":
          helper = tf.contrib.seq2seq.GreedyEmbeddingHelper(
              self.embedding_decoder, start_tokens, end_token)
        else:
          raise ValueError("Unknown infer_mode '%s'", infer_mode)

        if infer_mode != "beam_search":
          my_decoder = tf.contrib.seq2seq.BasicDecoder(
              cell,
              helper,
              decoder_initial_state,
              output_layer=self.output_layer  # applied per timestep
          )

        # Dynamic decoding
        outputs, final_context_state, _ = tf.contrib.seq2seq.dynamic_decode(
            my_decoder,
            maximum_iterations=maximum_iterations,
            output_time_major=self.time_major,
            swap_memory=True,
            scope=decoder_scope)

        if infer_mode == "beam_search":
          sample_id = outputs.predicted_ids
        else:
          logits = outputs.rnn_output
          sample_id = outputs.sample_id

    return logits, decoder_cell_outputs, sample_id, final_context_state
```

补充 _build_decoder_cell

```python
def _build_decoder_cell(self, hparams, encoder_outputs, encoder_state,
                          source_sequence_length, base_gpu=0):
    """Build an RNN cell that can be used by decoder."""
    # We only make use of encoder_outputs in attention-based models
    if hparams.attention:
      raise ValueError("BasicModel doesn't support attention.")
    # 这里与encoder/decoder中的create_rnn_cell一致
    cell = model_helper.create_rnn_cell(
        unit_type=hparams.unit_type,
        num_units=self.num_units,
        num_layers=self.num_decoder_layers,
        num_residual_layers=self.num_decoder_residual_layers,
        forget_bias=hparams.forget_bias,
        dropout=hparams.dropout,
        num_gpus=self.num_gpus,
        mode=self.mode,
        single_cell_fn=self.single_cell_fn,
        base_gpu=base_gpu
    )

    if hparams.language_model:
      encoder_state = cell.zero_state(self.batch_size, self.dtype)
    # 如果不是language_model，应该将encoder的输出hidden_state作为decoder的输入，并且
    # 将pass_hidden_state设置为true
    elif not hparams.pass_hidden_state:
      raise ValueError("For non-attentional model, "
                       "pass_hidden_state needs to be set to True")

    # For beam search, we need to replicate encoder infos beam_width times
    if (self.mode == tf.contrib.learn.ModeKeys.INFER and
        # infer模式也可以使用beam_search
        hparams.infer_mode == "beam_search"):
      decoder_initial_state = tf.contrib.seq2seq.tile_batch(
          encoder_state, multiplier=hparams.beam_width)
    else:
      decoder_initial_state = encoder_state

    return cell, decoder_initial_state
```

##### step4: Loss计算

```python
## Loss
# 计算train过程的loss
if self.mode != tf.contrib.learn.ModeKeys.INFER:
    with tf.device(model_helper.get_device_str(self.num_encoder_layers - 1,
                                                   self.num_gpus)):
        # 输入的logits为：self.output_layer(outputs.rnn_output)，即Projection
        	# 层的输出，大小为 [batch_size, tgt_vocab_size]
        # 输入的decoder_cell_outputs为：一般为none，除非采用num_sampled_softmax
        loss = self._compute_loss(logits, decoder_cell_outputs)
else:
    loss = tf.constant(0.0)
```

```python
def _compute_loss(self, logits, decoder_cell_outputs):
    """Compute optimization loss."""
    # target_output为标准答案即为labels，[batch_size, 1]
    target_output = self.iterator.target_output
    if self.time_major:
      target_output = tf.transpose(target_output)
    max_time = self.get_max_time(target_output)

    # 最终采用的是 tf.nn.sparse_softmax_cross_entropy_with_logits
    crossent = self._softmax_cross_entropy_loss(
        logits, decoder_cell_outputs, target_output)

    # sequence_mask是对句子的真实长度作boolen类型的掩码，反应的是句子真实长度
      # tf.sequence_mask生成序列长度掩码：
      # example：
      # test=tf.Variable([
      #                   [2,3],
      #                   [4,5],
      #                   [6,7]
      #                  ])
      # result = tf.sequence_mask(test, 7, dtype=tf.int32)
      # result.eval()
      # Out:
      # array([[[1, 1, 0, 0, 0, 0, 0],
      #         [1, 1, 1, 0, 0, 0, 0]],
      #
      #        [[1, 1, 1, 1, 0, 0, 0],
      #         [1, 1, 1, 1, 1, 0, 0]],
      #
      #        [[1, 1, 1, 1, 1, 1, 0],
      #         [1, 1, 1, 1, 1, 1, 1]]])
    target_weights = tf.sequence_mask(
        self.iterator.target_sequence_length, max_time, dtype=self.dtype)
    if self.time_major:
      target_weights = tf.transpose(target_weights)
	# 计算每个batch的平均损失
    loss = tf.reduce_sum(
        # crossent * target_weights的实际作用是将超出实际长度的输出的损失归零
        crossent * target_weights) / tf.to_float(self.batch_size)
    return loss
```

```python
def _softmax_cross_entropy_loss(
      self, logits, decoder_cell_outputs, labels):
    """Compute softmax loss or sampled softmax loss."""
    if self.num_sampled_softmax > 0:

      is_sequence = (decoder_cell_outputs.shape.ndims == 3)

      if is_sequence:
        labels = tf.reshape(labels, [-1, 1])
        inputs = tf.reshape(decoder_cell_outputs, [-1, self.num_units])

      crossent = tf.nn.sampled_softmax_loss(
          weights=tf.transpose(self.output_layer.kernel),
          biases=self.output_layer.bias or tf.zeros([self.tgt_vocab_size]),
          labels=labels,
          inputs=inputs,
          num_sampled=self.num_sampled_softmax,
          num_classes=self.tgt_vocab_size,
          partition_strategy="div",
          seed=self.random_seed)

      if is_sequence:
        if self.time_major:
          crossent = tf.reshape(crossent, [-1, self.batch_size])
        else:
          crossent = tf.reshape(crossent, [self.batch_size, -1])

    else:
      # 这个版本是tf.nn.softmax_cross_entropy_with_logits的易用版本，这个版本的logits的形状依然是[batch_size, num_classes]，但是labels的形状是[batch_size, 1]，每个label的取值是从[0, num_classes)的离散值，这也更加符合我们的使用习惯，是哪一类就标哪个类对应的label。如果已经对label进行了one hot编码，则可以直接使用tf.nn.softmax_cross_entropy_with_logits。
      crossent = tf.nn.sparse_softmax_cross_entropy_with_logits(
          labels=labels, logits=logits)

    return crossent
```



### 3. Train graph:  `_set_train_or_infer`

#### 详解5: 

```python
# Train graph
res = self.build_graph(hparams, scope=scope)
if not self.extract_encoder_layers:
    self._set_train_or_infer(res, reverse_target_vocab_table, hparams)
```

```python
def _set_train_or_infer(self, res, reverse_target_vocab_table, hparams):
    """Set up training and inference."""
    if self.mode == tf.contrib.learn.ModeKeys.TRAIN:
      self.train_loss = res[1]
      self.word_count = tf.reduce_sum(
          self.iterator.source_sequence_length) + tf.reduce_sum(
              self.iterator.target_sequence_length)
    elif self.mode == tf.contrib.learn.ModeKeys.EVAL:
      self.eval_loss = res[1]
    elif self.mode == tf.contrib.learn.ModeKeys.INFER:
      self.infer_logits, _, self.final_context_state, self.sample_id = res
      self.sample_words = reverse_target_vocab_table.lookup(
          tf.to_int64(self.sample_id))

    if self.mode != tf.contrib.learn.ModeKeys.INFER:
      ## Count the number of predicted words for compute ppl.
      self.predict_count = tf.reduce_sum(
          self.iterator.target_sequence_length)

    params = tf.trainable_variables()

    # Gradients and SGD update operation for training the model.
    # Arrange for the embedding vars to appear at the beginning.
    if self.mode == tf.contrib.learn.ModeKeys.TRAIN:
      self.learning_rate = tf.constant(hparams.learning_rate)
      # warm-up
      self.learning_rate = self._get_learning_rate_warmup(hparams)
      # decay
      self.learning_rate = self._get_learning_rate_decay(hparams)

      # Optimizer
      if hparams.optimizer == "sgd":
        opt = tf.train.GradientDescentOptimizer(self.learning_rate)
      elif hparams.optimizer == "adam":
        opt = tf.train.AdamOptimizer(self.learning_rate)
      else:
        raise ValueError("Unknown optimizer type %s" % hparams.optimizer)

      # Gradients
      gradients = tf.gradients(
          self.train_loss,
          params,
          colocate_gradients_with_ops=hparams.colocate_gradients_with_ops)

      clipped_grads, grad_norm_summary, grad_norm = model_helper.gradient_clip(
          gradients, max_gradient_norm=hparams.max_gradient_norm)
      self.grad_norm_summary = grad_norm_summary
      self.grad_norm = grad_norm

      self.update = opt.apply_gradients(
          zip(clipped_grads, params), global_step=self.global_step)

      # Summary
      self.train_summary = self._get_train_summary()
    elif self.mode == tf.contrib.learn.ModeKeys.INFER:
      self.infer_summary = self._get_infer_summary(hparams)

    # Print trainable variables
    utils.print_out("# Trainable variables")
    utils.print_out("Format: <name>, <shape>, <(soft) device placement>")
    for param in params:
      utils.print_out("  %s, %s, %s" % (param.name, str(param.get_shape()),
                                        param.op.device))
```

##### step1: warm-up

_get_learning_rate_warmup和_get_learning_rate_decay先后修改了学习率（其内部都是一个分支[`tf.cond`语句](https://stackoverflow.com/questions/45517940/whats-the-difference-between-tf-cond-and-if-else)），前者在训练的前一段时间**逐渐增大学习率至learning_rate**，**然后保持learning_rate**，**最后当达到start_decay_step时用指数衰减法逐渐减小学习率**，**具体什么时候执行由`self.global_step`决定**。

很自然的一个疑问是为什么这里不把两个函数合在一起写，这是因为合在一起就要写成分支语句（两个大分支，每个大分支还有两个小分支），计算图中的分支与普通程序的分支不同，这里大分支的判断条件是`self.global_step`，这里变量只有计算图执行的时候才有值，所以如果要写成分支必须用`tf.cond`（类似现在小分支写的那样），那样会使程序分支变得非常难看，因为这里没有这么做

![S75eSZ](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/S75eSZ.png)

```python
def _get_learning_rate_warmup(self, hparams):
    """Get learning rate warmup."""
    warmup_steps = hparams.warmup_steps
    warmup_scheme = hparams.warmup_scheme
    utils.print_out("  learning_rate=%g, warmup_steps=%d, warmup_scheme=%s" %
                    (hparams.learning_rate, warmup_steps, warmup_scheme))

    # Apply inverse decay if global steps less than warmup steps.
    # Inspired by https://arxiv.org/pdf/1706.03762.pdf (Section 5.3)
    # When step < warmup_steps,
    #   learing_rate *= warmup_factor ** (warmup_steps - step)
    if warmup_scheme == "t2t":
      # 0.01^(1/warmup_steps): we start with a lr, 100 times smaller
      # warmup_factor是一个小于1的数
      warmup_factor = tf.exp(tf.log(0.01) / warmup_steps)
      # inv_decay是一个小于1的数的n次方，n从warmup_steps减小至0，inv_decay由小逐渐升至1
      inv_decay = warmup_factor**(
          tf.to_float(warmup_steps - self.global_step))
    else:
      raise ValueError("Unknown warmup scheme %s" % warmup_scheme)

    return tf.cond(
        self.global_step < hparams.warmup_steps,
        lambda: inv_decay * self.learning_rate,
        lambda: self.learning_rate,
        name="learning_rate_warmup_cond")
```

##### step2: decay

在Tensorflow中，为解决设定学习率(learning rate)问题，提供了指数衰减法来解决。

通过tf.train.exponential_decay函数实现指数衰减学习率。

步骤：

1.首先使用较大学习率(目的：为快速得到一个比较优的解);

2.然后通过迭代逐步减小学习率(目的：为使模型在训练后期更加稳定);

公式：
$$
decayed\_learning\_rate=learining\_rate*decay\_rate^{(global\_step/decay\_steps)}
$$

```python
def _get_learning_rate_decay(self, hparams):
    """Get learning rate decay."""
    # 获取自定义的decay_scheme
    start_decay_step, decay_steps, decay_factor = self._get_decay_info(hparams)
    utils.print_out("  decay_scheme=%s, start_decay_step=%d, decay_steps %d, "
                    "decay_factor %g" % (hparams.decay_scheme,
                                         start_decay_step,
                                         decay_steps,
                                         decay_factor))

    return tf.cond(
        # 在global_step 到达 start_decay_step之前，一直按learning_rate进行学习，
        # 
        self.global_step < start_decay_step,
        lambda: self.learning_rate,
        # 指数衰减法
        lambda: tf.train.exponential_decay(
            self.learning_rate,
            (self.global_step - start_decay_step),
            decay_steps, decay_factor, staircase=True),
        name="learning_rate_decay_cond")
```

```python
def _get_decay_info(self, hparams):
    """Return decay info based on decay_scheme."""
    if hparams.decay_scheme in ["luong5", "luong10", "luong234"]:
      decay_factor = 0.5
      if hparams.decay_scheme == "luong5":
        # 从1/2训练步数开始decay
        start_decay_step = int(hparams.num_train_steps / 2)
        decay_times = 5
      elif hparams.decay_scheme == "luong10":
        # 从1/2训练步数开始decay
        start_decay_step = int(hparams.num_train_steps / 2)
        decay_times = 10
      elif hparams.decay_scheme == "luong234":
        # 从2/3训练步数开始decay
        start_decay_step = int(hparams.num_train_steps * 2 / 3)
        decay_times = 4
      # 剩余步数
      remain_steps = hparams.num_train_steps - start_decay_step
      # 剩余步数中每多少步衰减一次
      decay_steps = int(remain_steps / decay_times)
    elif not hparams.decay_scheme:  # no decay
      start_decay_step = hparams.num_train_steps
      decay_steps = 0
      decay_factor = 1.0
    elif hparams.decay_scheme:
      raise ValueError("Unknown decay scheme %s" % hparams.decay_scheme)
    # 返回的是：开始衰减的步数，剩余步数中每多少步衰减一次，衰减因子
    return start_decay_step, decay_steps, decay_factor
```

##### step3: Optimizer

```python
# Optimizer
if hparams.optimizer == "sgd":
	opt = tf.train.GradientDescentOptimizer(self.learning_rate)
elif hparams.optimizer == "adam":
	opt = tf.train.AdamOptimizer(self.learning_rate)
else:
	raise ValueError("Unknown optimizer type %s" % hparams.optimizer)
```

##### step4: Gradients

```python
# Gradients
# 计算梯度Gradients
# tf.gradients是一个计算梯度的低级api
gradients = tf.gradients(
    self.train_loss,
    # params包含所有的可训练变量
    params,
    colocate_gradients_with_ops=hparams.colocate_gradients_with_ops)

# 梯度裁剪至max_gradient_norm
#   执行梯度裁剪,实际调用tf.clip_by_global_norm
clipped_grads, grad_norm_summary, grad_norm = model_helper.gradient_clip(
    gradients, max_gradient_norm=hparams.max_gradient_norm)
self.grad_norm_summary = grad_norm_summary
self.grad_norm = grad_norm

self.update = opt.apply_gradients(
    zip(clipped_grads, params), global_step=self.global_step)
```

##### step5: Summary

```python
# Summary
	self.train_summary = self._get_train_summary()
elif self.mode == tf.contrib.learn.ModeKeys.INFER:
	self.infer_summary = self._get_infer_summary(hparams)
```

```python
def _get_train_summary(self):
    """Get train summary."""
    train_summary = tf.summary.merge(
        [tf.summary.scalar("lr", self.learning_rate),
         tf.summary.scalar("train_loss", self.train_loss)] +
        self.grad_norm_summary)
    return train_summary
```



### 4. Saver

```python
# Saver
self.saver = tf.train.Saver(
	tf.global_variables(), max_to_keep=hparams.num_keep_ckpts)
```















```python
def build_graph(self, hparams, scope=None):
    """Subclass must implement this method.

    Creates a sequence-to-sequence model with dynamic RNN decoder API.
    
    Args:
      hparams: Hyperparameter configurations.
      scope: VariableScope for the created subgraph; default "dynamic_seq2seq".

    Returns:
      A tuple of the form (logits, loss_tuple, final_context_state, sample_id),
      where:
        logits: float32 Tensor [batch_size x num_decoder_symbols].
        loss: loss = the total loss / batch_size.
        final_context_state: the final state of decoder RNN.
        sample_id: sampling indices.

    Raises:
      ValueError: if encoder_type differs from mono and bi, or
        attention_option is not (luong | scaled_luong |
        bahdanau | normed_bahdanau).
    """
    utils.print_out("# Creating %s graph ..." % self.mode)

    
      

      ## Loss
      if self.mode != tf.contrib.learn.ModeKeys.INFER:
        with tf.device(model_helper.get_device_str(self.num_encoder_layers - 1,
                                                   self.num_gpus)):
          loss = self._compute_loss(logits, decoder_cell_outputs)
      else:
        loss = tf.constant(0.0)

      return logits, loss, final_context_state, sample_id
```



