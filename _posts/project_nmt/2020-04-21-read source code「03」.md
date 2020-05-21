---
title: "read source code「03」"
subtitle: "nmt「train.py」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - nmt
  - paper with code
---



## train流程

### step1: nmt_test入口

```python
def testTrain(self):
    """Test the training loop is functional with basic hparams."""
    nmt_parser = argparse.ArgumentParser()
    nmt.add_arguments(nmt_parser)
    FLAGS, unparsed = nmt_parser.parse_known_args()

    _update_flags(FLAGS, "nmt_train_test")

    default_hparams = nmt.create_hparams(FLAGS)

    train_fn = train.train
    nmt.run_main(FLAGS, default_hparams, train_fn, None)
```

### step2: 转入 run_main

```python
def run_main(flags, default_hparams, train_fn, inference_fn, target_session=""):
	...
	else:
    	# Train
    	train_fn(hparams, target_session=target_session)
```

### step3: 转入 train.train

```python
# Create model
# 返回 attention_architecture,如果没有采用attention机制，
# 则返回 Model(BaseModel)
model_creator = get_model_creator(hparams)

train_model = model_helper.create_train_model(model_creator, hparams, scope)
eval_model = model_helper.create_eval_model(model_creator, hparams, scope)
infer_model = model_helper.create_infer_model(model_creator, hparams, scope)
```

#### step3.1: create_train_model

```python
def create_train_model(
    model_creator, hparams, scope=None, num_workers=1, jobid=0,
    extra_args=None):
  """Create train graph, model, and iterator."""
  src_file = "%s.%s" % (hparams.train_prefix, hparams.src)
  tgt_file = "%s.%s" % (hparams.train_prefix, hparams.tgt)
  src_vocab_file = hparams.src_vocab_file
  tgt_vocab_file = hparams.tgt_vocab_file

  graph = tf.Graph()

  with graph.as_default(), tf.container(scope or "train"):
    # 创建词典表 create_vocab_tables
    	# 源数据词典的查找表和目标数据词典的查找表，实际上查找表就是一个字符串到数字的映射关系。
        # 对词典中的每一个词，从0开始递增的分配一个数字给这个词
    src_vocab_table, tgt_vocab_table = vocab_utils.create_vocab_tables(
        src_vocab_file, tgt_vocab_file, hparams.share_vocab)

    # 创建src_dataset和tgt_dataset训练数据集
    src_dataset = tf.data.TextLineDataset(tf.gfile.Glob(src_file))
    tgt_dataset = tf.data.TextLineDataset(tf.gfile.Glob(tgt_file))
    skip_count_placeholder = tf.placeholder(shape=(), dtype=tf.int64)
"""	
iterator返回值形式：

BatchedInput(
collections.namedtuple("BatchedInput",
					("initializer", "source", "target_input",
                    "target_output", "source_sequence_length",
                    "target_sequence_length"))):
"""   
    iterator = iterator_utils.get_iterator(
        src_dataset,
        tgt_dataset,
        src_vocab_table,
        tgt_vocab_table,
        batch_size=hparams.batch_size,
        sos=hparams.sos,
        eos=hparams.eos,
        random_seed=hparams.random_seed,
        num_buckets=hparams.num_buckets,
        src_max_len=hparams.src_max_len,
        tgt_max_len=hparams.tgt_max_len,
        skip_count=skip_count_placeholder,
        num_shards=num_workers,
        shard_index=jobid,
        use_char_encode=hparams.use_char_encode)

    # Note: One can set model_device_fn to
    # `tf.train.replica_device_setter(ps_tasks)` for distributed training.
    model_device_fn = None
    if extra_args: model_device_fn = extra_args.model_device_fn
    with tf.device(model_device_fn):
      model = model_creator(
          hparams,
          iterator=iterator,
          mode=tf.contrib.learn.ModeKeys.TRAIN,
          source_vocab_table=src_vocab_table,
          target_vocab_table=tgt_vocab_table,
          scope=scope,
          extra_args=extra_args)

  return TrainModel(
      graph=graph,
      model=model,
      iterator=iterator,
      skip_count_placeholder=skip_count_placeholder)
```

##### step3.1.1：vocab_utils.create_vocab_tables

**源数据词典的查找表**和**目标数据词典的查找表**，实际上查找表就是一个**字符串**到**数字**的映射关系。

我们看看这两个表是怎么构建出来的呢？代码很简单，利用tensorflow库中定义的**lookup_ops**即可：

- 我们可以发现，创建这两个表的过程，就是将词典中的每一个词，对应一个数字，然后返回这些数字的集合，这就是所谓的词典查找表。**效果上来说，就是对词典中的每一个词，从0开始递增的分配一个数字给这个词**。
- 将我们**自定义的标记**当成**词典的单词**，然后**加入到词典文件中**，这样一来，`lookup_ops`操作就把标记当成单词处理了，也就就解决了冲突！
- 如果我们指定了`share_vocab`参数，那么返回的源单词查找表和目标单词查找表是一样的。
- 用于构造词汇表，词到索引的映射表。**src_vocab_table.lookup(x)获得词x的id。**

```python
def create_vocab_tables(src_vocab_file, tgt_vocab_file, share_vocab):
  """Creates vocab tables for src_vocab_file and tgt_vocab_file."""
  src_vocab_table = lookup_ops.index_table_from_file(
      src_vocab_file, default_value=UNK_ID)
  if share_vocab:
    tgt_vocab_table = src_vocab_table
  else:
    tgt_vocab_table = lookup_ops.index_table_from_file(
        tgt_vocab_file, default_value=UNK_ID)
  return src_vocab_table, tgt_vocab_table
```

##### 【补充tensorflow数据读取机制】

**tensorflow使用文件名队列+内存队列双队列的形式读入文件**，可以**很好地管理epoch**。下面我们用图片的形式来说明这个机制的运行方式。如下图，还是以数据集A.jpg, B.jpg, C.jpg为例，假定我们要**跑一个epoch**，那么我们就在文件名队列中**把A、B、C各放入一次，并在之后标注队列结束**。

- 如果我们要跑**2个epoch**而不是1个epoch，那只要在**文件名队列中将A、B、C依次放入两次再标记结束**就可以了。

![yNGuWT](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/yNGuWT.jpg)

![phlzuP](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/phlzuP.jpg)

5个epoch

![Mp2hxC](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/Mp2hxC.jpg)

 ##### step3.1.2: tf.data.TextLineDataset

tf.contrib.data.TextLineDataset提供了一种简单的方式来提取这些文件的每一行。给定一个或多个文件名，TextLineDataset会对这些文件的每行生成一个值为字符串的元素。这个函数的输入是一个文件的列表，输出是一个dataset。**dataset中的每一个元素就对应了文件中的一行**。

- 默认下，TextLineDataset生成每个文件中的每一行，这可能不是你所需要的，例如文件中有标题行，或包含注释。可以使用**Dataset.skip()和Dataset.filter()来剔除这些行**。
- 为了对每个文件都各自应用这些变换，使用**Dataset.flat_map()来对每个文件创建一个嵌套的Dataset**。

```python
# 创建src_dataset和tgt_dataset训练数据集
src_dataset = tf.data.TextLineDataset(tf.gfile.Glob(src_file))
tgt_dataset = tf.data.TextLineDataset(tf.gfile.Glob(tgt_file))
```

##### step3.1.3: 处理训练数据的主要代码

```python
    iterator = iterator_utils.get_iterator(
        src_dataset,
        tgt_dataset,
        src_vocab_table,
        tgt_vocab_table,
        batch_size=hparams.batch_size,
        sos=hparams.sos,
        eos=hparams.eos,
        random_seed=hparams.random_seed,
        num_buckets=hparams.num_buckets,
        src_max_len=hparams.src_max_len,
        tgt_max_len=hparams.tgt_max_len,
        skip_count=skip_count_placeholder,
        num_shards=num_workers,
        shard_index=jobid,
        use_char_encode=hparams.use_char_encode)
```

iterator_utils.get_iterator内部

```python
  if not output_buffer_size:
    output_buffer_size = batch_size * 1000

  if use_char_encode:
    src_eos_id = vocab_utils.EOS_CHAR_ID
  else:
"""
我们逐步来分析，这个过程到底做了什么，数据张量又是如何变化的。

我们知道，对于源数据和目标数据，每一行数据，我们都可以使用一些标记来表示数据的开始和结束，在本项目中，我们可以通过sos和eos两个参数指定句子开始标记和结束标记，默认值分别为和。本部分代码一开始就是将这两个句子标记表示成一个整数

过程很简单，就是通过两个字符串到整形的查找表，根据sos和eos的字符串，找到对应的整数，用改整数来表示这两个标记，并且将这两个整数转型为int32类型。
"""
    src_eos_id = tf.cast(src_vocab_table.lookup(tf.constant(eos)), tf.int32)
    
  tgt_sos_id = tf.cast(tgt_vocab_table.lookup(tf.constant(sos)), tf.int32)
  tgt_eos_id = tf.cast(tgt_vocab_table.lookup(tf.constant(eos)), tf.int32)
# 通过zip操作将源数据集和目标数据集合并在一起
# 此时的张量变化 [src_dataset] + [tgt_dataset] ---> [src_dataset, tgt_dataset]
  src_tgt_dataset = tf.data.Dataset.zip((src_dataset, tgt_dataset))
# 数据集分片，分布式训练的时候可以分片来提高训练速度
  src_tgt_dataset = src_tgt_dataset.shard(num_shards, shard_index)
  if skip_count is not None:
    # 跳过数据，比如一些文件的头尾信息行
    src_tgt_dataset = src_tgt_dataset.skip(skip_count)
# 随机打乱数据，切断相邻数据之间的联系
# 根据文档，该步骤要尽早完成，完成该步骤之后在进行其他的数据集操作
  src_tgt_dataset = src_tgt_dataset.shuffle(
      output_buffer_size, random_seed, reshuffle_each_iteration)
```

**接下来就是重点了**

```python
  # 将每一行数据，根据“空格”切分开来
  # 这个步骤可以并发处理，用num_parallel_calls指定并发量
  # 通过prefetch来预获取一定数据到缓冲区，提升数据吞吐能力
  # 张量变化举例 ['上海　浦东', '上海　浦东'] ---> [['上海', '浦东'], ['上海', '浦东']]  
  src_tgt_dataset = src_tgt_dataset.map(
      lambda src, tgt: (
          tf.string_split([src]).values, tf.string_split([tgt]).values),
      num_parallel_calls=num_parallel_calls).prefetch(output_buffer_size)
  # 过滤掉长度为0的数据
  # Filter zero length input sequences.
  src_tgt_dataset = src_tgt_dataset.filter(
      lambda src, tgt: tf.logical_and(tf.size(src) > 0, tf.size(tgt) > 0))
　# 限制源数据最大长度
  if src_max_len:
    src_tgt_dataset = src_tgt_dataset.map(
        lambda src, tgt: (src[:src_max_len], tgt),
        num_parallel_calls=num_parallel_calls).prefetch(output_buffer_size)
　# 限制目标数据的最大长度
  if tgt_max_len:
    src_tgt_dataset = src_tgt_dataset.map(
        lambda src, tgt: (src, tgt[:tgt_max_len]),
        num_parallel_calls=num_parallel_calls).prefetch(output_buffer_size)
  # 通过map操作将字符串转换为数字
  # 张量变化举例 [['上海', '浦东'], ['上海', '浦东']] ---> [[1, 2], [1, 2]]
  # Convert the word strings to ids.  Word strings that are not in the
  # vocab get the lookup table's default_value integer.
  if use_char_encode:
    src_tgt_dataset = src_tgt_dataset.map(
        lambda src, tgt: (tf.reshape(vocab_utils.tokens_to_bytes(src), [-1]),
                          tf.cast(tgt_vocab_table.lookup(tgt), tf.int32)),
        num_parallel_calls=num_parallel_calls)
  else:
    src_tgt_dataset = src_tgt_dataset.map(
        lambda src, tgt: (tf.cast(src_vocab_table.lookup(src), tf.int32),
                          tf.cast(tgt_vocab_table.lookup(tgt), tf.int32)),
        num_parallel_calls=num_parallel_calls)

  src_tgt_dataset = src_tgt_dataset.prefetch(output_buffer_size)
  # Create a tgt_input prefixed with <sos> and a tgt_output suffixed with <eos>.
  # 给目标数据加上 sos, eos　标记
  # 张量变化举例 [[1, 2], [1, 2]] ---> [[1, 2], [sos_id, 1, 2], [1, 2, eos_id]]
  src_tgt_dataset = src_tgt_dataset.map(
      lambda src, tgt: (src,
                        tf.concat(([tgt_sos_id], tgt), 0),
                        tf.concat((tgt, [tgt_eos_id]), 0)),
      num_parallel_calls=num_parallel_calls).prefetch(output_buffer_size)
```

##### step3.1.4 数据对齐处理

其实到这里，基本上数据已经处理好了，可以拿去训练了。但是有一个问题，那就是我们的每一行数据长度大小不一。这样拿去训练其实是需要很大的运算量的，那么有没有办法优化一下呢？

- 有的，那就是**数据对齐处理**。

```python
# 参数x实际上就是我们的 dataset 对象
def batching_func(x):
     # 调用dataset的padded_batch方法，对齐的同时，也对数据集进行分批
    return x.padded_batch(
        batch_size,
        # The first three entries are the source and target line rows;
        # these have unknown-length vectors.  The last two entries are
        # the source and target row sizes; these are scalars.
        # 对齐数据的形状
        padded_shapes=(
            tf.TensorShape([None]),  # src
            tf.TensorShape([None]),  # tgt_input
            tf.TensorShape([None]),  # tgt_output
            tf.TensorShape([]),  # src_len
            tf.TensorShape([])),  # tgt_len
        # Pad the source and target sequences with eos tokens.
        # (Though notice we don't generally need to do this since
        # later on we will be masking out calculations past the true sequence.
        # 对齐数据的值
        padding_values=(
            # 用src_eos_id填充到 src 的末尾
            src_eos_id,  # src
            # 用tgt_eos_id填充到 tgt_input 的末尾
            tgt_eos_id,  # tgt_input
            # 用tgt_eos_id填充到 tgt_output 的末尾
            tgt_eos_id,  # tgt_output
            0,  # src_len -- unused
            0))  # tgt_len -- unused
```

这样就完成了数据的对齐，并且将数据集按照`batch_size`完成了分批。

##### step3.1.5: num_buckets分桶到底起什么作用

`key_func`是做什么的呢？通过源码和注释我们发现，它是用来将我们的数据集(由**源数据**和**目标数据**成对组成)按照一定的方式进行分类的。具体说来就是，根据我们数据集每一行的数据长度，将它放到合适的**桶**里面去，然后返回该数据所在桶的索引。

- 这个**分桶**的过程很简单。假设我们有一批数据，他们的长度分别为`3 8 11 16 20 21`，我们规定一个**bucket_width**为**10**，那么我们的数据分配到具体的桶的情况是怎么样的呢？因为桶的宽度为10，所以第一个桶放的是小于长度10的数据，第二个桶放的是10-20之间的数据，以此类推。
- 所以，要进行分桶，我们需要知道**数据**和**bucket_width**两个条件。然后根据一定的简单计算，即可确定如何分桶。上述代码首先根据`src_max_len`来计算`bucket_width`，然后分桶，然后返回数据分到的桶的索引。就是这么简单的一个过程。
- 分桶的目的，**相似长度的数据放在一起，能够提升计算效率**！！！

然后要看第二个函数`reduce_func`，这个函数做了什么呢？其实就做了一件事情，就是把刚刚分桶好的数据，做一个对齐！！！

```python
  if num_buckets > 1:

    def key_func(unused_1, unused_2, unused_3, src_len, tgt_len):
      # Calculate bucket_width by maximum source sequence length.
      # Pairs with length [0, bucket_width) go to bucket 0, length
      # [bucket_width, 2 * bucket_width) go to bucket 1, etc.  Pairs with length
      # over ((num_bucket-1) * bucket_width) words all go into the last bucket.
      if src_max_len:
        bucket_width = (src_max_len + num_buckets - 1) // num_buckets
      else:
        bucket_width = 10

      # Bucket sentence pairs by the length of their source sentence and target
      # sentence.
      bucket_id = tf.maximum(src_len // bucket_width, tgt_len // bucket_width)
      return tf.to_int64(tf.minimum(num_buckets, bucket_id))

    def reduce_func(unused_key, windowed_data):
      return batching_func(windowed_data)

    batched_dataset = src_tgt_dataset.apply(
        tf.contrib.data.group_by_window(
            key_func=key_func, reduce_func=reduce_func, window_size=batch_size))

  else:
    batched_dataset = batching_func(src_tgt_dataset)
  batched_iter = batched_dataset.make_initializable_iterator()
  (src_ids, tgt_input_ids, tgt_output_ids, src_seq_len,
   tgt_seq_len) = (batched_iter.get_next())
```

#### 3.2：Preload data for sample decoding

```python
# Preload data for sample decoding.
  dev_src_file = "%s.%s" % (hparams.dev_prefix, hparams.src)
  dev_tgt_file = "%s.%s" % (hparams.dev_prefix, hparams.tgt)
  sample_src_data = inference.load_data(dev_src_file)
  sample_tgt_data = inference.load_data(dev_tgt_file)
```

```python
def load_data(inference_input_file, hparams=None):
  """Load inference data."""
"""
['When I was little , I thought my country was the best on the planet , and I grew up singing a song called &quot; Nothing To Envy . &quot;', 
'And I was very proud .',
...]
"""
  with codecs.getreader("utf-8")(
      tf.gfile.GFile(inference_input_file, mode="rb")) as f:
    # 一行一句
    inference_data = f.read().splitlines()

  if hparams and hparams.inference_indices:
    inference_data = [inference_data[i] for i in hparams.inference_indices]

  return inference_data
```

#### 3.3: Log and output files

```python
# Log and output files
  log_file = os.path.join(out_dir, "log_%d" % time.time())
  log_f = tf.gfile.GFile(log_file, mode="a")
  utils.print_out("# log_file=%s" % log_file, log_f)
```

