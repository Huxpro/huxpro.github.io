---
title: "nmt工程「advanced」"
subtitle: "nmt"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - nmt

---



## Intermediate

Having gone through **the most basic seq2seq model**, let's get more **advanced**! To build state-of-the-art neural machine translation systems, we will need more "secret sauce": **the *attention mechanism***, which was first introduced by [Bahdanau et al., 2015](https://arxiv.org/abs/1409.0473), then later refined by [Luong et al., 2015](https://arxiv.org/abs/1508.04025) and others. The key idea of the attention mechanism is to **establish direct short-cut connections between the target and the source by paying "attention" to relevant source content as we translate.** 



Remember that in the **vanilla seq2seq model**, we **pass the last source state from the encoder to the decoder when starting the decoding process**. This works well for **short and medium-length sentences**; however, ***for long sentences, the single fixed-size hidden state becomes an information bottleneck***. Instead of discarding all of the hidden states computed in the source RNN, ***the attention mechanism*** provides an approach that ***allows the decoder to peek at them*** (treating them as a dynamic memory of the source information). By doing so, the attention mechanism improves the translation of longer sentences. 



## Background on the Attention Mechanism

> [**attention_model.py**](https://github.com/tensorflow/nmt/blob/tf-1.2/nmt/attention_model.py)

We now describe an instance of the attention mechanism proposed in (*Luong et al., 2015*), which has been used in several state-of-the-art systems including open-source toolkits such as [OpenNMT](http://opennmt.net/about/) and in the TF seq2seq API in this tutorial. We will also provide connections to other variants of the attention mechanism.

<img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/BVJo5b.jpg" alt="BVJo5b" style="zoom:67%;" />

- **Attention mechanism**

  the attention computation **happens at every decoder time step**. It consists of the following stages:

  1. The **current target hidden state** is compared with **all source states** to derive *attention weights*. 
  2. Based on the attention weights we compute a ***context vector*** as the **weighted average of the source states.**
  3. **Combine** the **context vector** with the **current target hidden state** to **yield** the **final *attention vector***
  4. The **attention vector** is **fed as an input to the next time step** (*input feeding*). The first three steps can be summarized by the equations below:

  ![0V27oQ](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/0V27oQ.jpg)

  Here, the function `score` is used to **compared the target hidden state $h_t$ with each of the source hidden states $h_s$** , and the result is **normalized** to produced attention weights (a distribution over source positions). There are ***various choices of the scoring function***; popular scoring functions include the multiplicative and additive forms given in Eq. (4). Once computed, the attention vector $a_t$ is used to derive the softmax logit and loss. This is similar to the target hidden state at the top layer of a vanilla seq2seq model. The function `f` can also take other forms.

  ![BpDqqJ](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/BpDqqJ.jpg)

  

  Specifically, **the set of source hidden states** (or their transformed versions, e.g., **$Wh_s$ in Luong's scoring style or $W_2h_s$ in Bahdanau's scoring style**) is **referred to as the *"memory"***. At each time step, **we use the current target hidden state as a *"query"* to decide on which parts of the memory to read**. Usually, the query needs to be compared with keys corresponding to individual memory slots. In the above presentation of the attention mechanism, we happen to use the set of source hidden states (or their transformed versions, e.g., **$W_1h_t$ in Bahdanau's scoring style**) as "**keys**". One can be inspired by this memory-network terminology to derive other forms of attention!

```python
# attention_states: [batch_size, max_time, num_units]
attention_states = tf.transpose(encoder_outputs, [1, 0, 2])

# Create an attention mechanism
attention_mechanism = tf.contrib.seq2seq.LuongAttention(
    num_units, attention_states,
    memory_sequence_length=source_sequence_length)
```

```python
decoder_cell = tf.contrib.seq2seq.AttentionWrapper(
    decoder_cell, attention_mechanism,
    attention_layer_size=num_units)
```

## Hands-on – building an attention-based NMT model

To enable attention, we need to use one of `luong`, `scaled_luong`, `bahdanau` or `normed_bahdanau` as the value of the `attention` flag during training. The flag specifies which attention mechanism we are going to use. In addition, we need to create a new directory for the attention model, so we don't reuse the previously trained basic NMT model. 

```python
mkdir /home/jiale/tmp/nmt_attention_model

CUDA_VISIBLE_DEVICES=0 python -m nmt.nmt \
    --attention=scaled_luong \
    --src=vi --tgt=en \
    --vocab_prefix=/home/jiale/tmp/nmt_data/vocab  \
    --train_prefix=/home/jiale/tmp/nmt_data/train \
    --dev_prefix=/home/jiale/tmp/nmt_data/tst2012  \
    --test_prefix=/home/jiale/tmp/nmt_data/tst2013 \
    --out_dir=/home/jiale/tmp/nmt_attention_model \
    --num_train_steps=12000 \
    --steps_per_stats=100 \
    --num_layers=2 \
    --num_units=128 \
    --dropout=0.2 \
    --metrics=bleu
```

After training, we can use the same inference command with the new out_dir for inference:

```python
CUDA_VISIBLE_DEVICES=0 python -m nmt.nmt \
    --out_dir=/home/jiale/tmp/nmt_attention_model \
    --inference_input_file=/home/jiale/tmp/my_infer_file.vi \
    --inference_output_file=/home/jiale/tmp/nmt_attention_model/output_infer
    
cat /home/jiale/tmp/nmt_attention_model/output_infer # To view the inference as output
```

![7prxYg](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/7prxYg.png)

## Tips & Tricks

### 1.Building Training, Eval, and Inference Graphs

When building a machine learning model in TensorFlow, it's often **best to build three separate graphs:**

- The **Training graph**, which:
  - Batches, buckets, and possibly subsamples input data from a set of files/external inputs.
  - Includes the forward and backprop ops.
  - Constructs the optimizer, and adds the training op.
- The **Eval graph**, which:
  - Batches and buckets input data from a set of files/external inputs.
  - Includes the training forward ops, and additional evaluation ops that aren't used for training.
- The **Inference graph**, which:
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

The primary source of complexity becomes how to share Variables across the three graphs in a single machine setting. This is solved by using a separate session for each graph. **The training session periodically saves checkpoints, and the eval session and the infer session restore parameters from checkpoints**.

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



### 2.Data Input Pipeline

Prior to TensorFlow 1.2, users had two options for feeding data to the TensorFlow training and eval pipelines:

1. Feed data directly via *feed_dict* at each training *session.run* call.
2. Use the queueing mechanisms in *tf.train* (e.g. *tf.train.batch*) and *tf.contrib.train*.
3. Use helpers from a higher level framework like *tf.contrib.learn* or *tf.contrib.slim* (which effectively use #2).

**The first approach is easier for users who aren't familiar with TensorFlow or need to do exotic input modification** (i.e., their own minibatch queueing) that can only be done in Python. **The second and third approaches are more standard but a little less flexible**; they also require starting multiple python threads (queue runners). Furthermore, if used incorrectly queues can lead to deadlocks or opaque error messages. Nevertheless, queues are significantly more efficient than using *feed_dict* and are the standard for both single-machine and distributed training.

**Starting in TensorFlow 1.2, there is a new system available for reading data into TensorFlow models: dataset iterators** , as found in the **tf.contrib.data** module. Data iterators are flexible, easy to reason about and to manipulate, and provide efficiency and multithreading by leveraging the TensorFlow C++ runtime.

A **dataset** can be created from a batch data Tensor, a filename, or a Tensor containing multiple filenames. Some examples:

```python
# Training dataset consists of multiple files.
train_dataset = tf.contrib.data.TextLineDataset(train_files)

# Evaluation dataset uses a single file, but we may
# point to a different file for each evaluation round.
eval_file = tf.placeholder(tf.string, shape=())
eval_dataset = tf.contrib.data.TextLineDataset(eval_file)

# For inference, feed input data to the dataset directly via feed_dict.
infer_batch = tf.placeholder(tf.string, shape=(num_infer_examples,))
infer_dataset = tf.contrib.data.Dataset.from_tensor_slices(infer_batch)
```



### 3.Other details for better NMT models

- **Bidirectional RNNs**

  ***Bidirectionality on the encoder side generally gives better performance*** (with some degradation in speed as more layers are used). Here, we give a simplified example of how to build an encoder with a single bidirectional layer:*

  ```python
  # Construct forward and backward cells
  forward_cell = tf.nn.rnn_cell.BasicLSTMCell(num_units)
backward_cell = tf.nn.rnn_cell.BasicLSTMCell(num_units)
  
  bi_outputs, encoder_state = tf.nn.bidirectional_dynamic_rnn(
      forward_cell, backward_cell, encoder_emb_inp,
      sequence_length=source_sequence_length, time_major=True)
  encoder_outputs = tf.concat(bi_outputs, -1)
  ```
  

> The variables *encoder_outputs* and *encoder_state* can be used in the same way as in Section Encoder. Note that, for multiple bidirectional layers, we need to manipulate the encoder_state a bit, **see [model.py](https://github.com/tensorflow/nmt/blob/tf-1.2/nmt/model.py), method *_build_bidirectional_rnn()* for more details.**

- Beam search

  While greedy decoding can give us quite reasonable translation quality, ***a beam search decoder can further boost performance.*** The idea of beam search is to better explore the search space of all possible translations by keeping around a small set of top candidates as we translate. The size of the beam is called *beam width*; a minimal beam width of, say size 10, is generally sufficient. For more information, we refer readers to Section 7.2.3 of [Neubig, (2017)](https://arxiv.org/abs/1703.01619). 

  ```python
  # Replicate encoder infos beam_width times
  decoder_initial_state = tf.contrib.seq2seq.tile_batch(
      encoder_state, multiplier=hparams.beam_width)
  
  # Define a beam-search decoder
  decoder = tf.contrib.seq2seq.BeamSearchDecoder(
          cell=decoder_cell,
          embedding=embedding_decoder,
          start_tokens=start_tokens,
          end_token=end_token,
          initial_state=decoder_initial_state,
          beam_width=beam_width,
          output_layer=projection_layer,
          length_penalty_weight=0.0)
  
  # Dynamic decoding
  outputs, _ = tf.contrib.seq2seq.dynamic_decode(decoder, ...)
  ```

  Note that the same *dynamic_decode()* API call is used, similar to the Section [Decoder](https://github.com/tensorflow/nmt/tree/tf-1.2#decoder). Once decoded, we can access the translations as follows:

  ```py
  translations = outputs.predicted_ids
  # Make sure translations shape is [batch_size, beam_width, time]
  if self.time_major:
     translations = tf.transpose(translations, perm=[1, 2, 0])
  ```

> **See [model.py](https://github.com/tensorflow/nmt/blob/tf-1.2/nmt/model.py), method *_build_decoder()* for more details.**

- **Hyperparameters**

  ***Optimizer***: while Adam can lead to reasonable results for "unfamiliar" architectures, SGD with scheduling will generally lead to better performance if you can train with SGD.

  ***Attention***: Bahdanau-style attention often requires bidirectionality on the encoder side to work well; whereas Luong-style attention tends to work well for different settings. For this tutorial code, we recommend using the two improved variants of Luong & Bahdanau-style attentions: *scaled_luong* & *normed bahdanau*.

## 参数调用

> **see [nmt.py](https://github.com/tensorflow/nmt/blob/tf-1.2/nmt/nmt.py)** and **[standard_hparams](https://github.com/tensorflow/nmt/tree/tf-1.2/nmt/standard_hparams)**

- default

  ```python
  mkdir /home/jiale/tmp/nmt_attention_model
  
  CUDA_VISIBLE_DEVICES=0 python -m nmt.nmt \
      --attention=scaled_luong \
      --src=vi --tgt=en \
      --vocab_prefix=/home/jiale/tmp/nmt_data/vocab  \
      --train_prefix=/home/jiale/tmp/nmt_data/train \
      --dev_prefix=/home/jiale/tmp/nmt_data/tst2012  \
      --test_prefix=/home/jiale/tmp/nmt_data/tst2013 \
      --out_dir=/home/jiale/tmp/nmt_attention_model \
      --num_train_steps=12000 \
      --steps_per_stats=100 \
      --num_layers=2 \
      --num_units=128 \
      --dropout=0.2 \
      --metrics=bleu
  ```

- Standard HParams

```python
python -m nmt.nmt \
    --src=de --tgt=en \
    --hparams_path=nmt/standard_hparams/wmt16_gnmt_4_layer.json \
    --out_dir=/tmp/deen_gnmt \
    --vocab_prefix=/tmp/wmt16/vocab.bpe.32000 \
    --train_prefix=/tmp/wmt16/train.tok.clean.bpe.32000 \
    --dev_prefix=/tmp/wmt16/newstest2013.tok.bpe.32000 \
    --test_prefix=/tmp/wmt16/newstest2015.tok.bpe.32000
```

- paraphrase

```python
CUDA_VISIBLE_DEVICES=2 nohup python -u -m nmt.nmt \
--attention="normed_bahdanau" \
--src=szh --tgt=tzh \
--vocab_prefix=/home/jiale/tmp/nmt_925271_data/vocab  \
--train_prefix=/home/jiale/tmp/nmt_925271_data/train_st \
--dev_prefix=/home/jiale/tmp/nmt_925271_data/val_st  \
--test_prefix=/home/jiale/tmp/nmt_925271_data/test_st \
--out_dir=/home/jiale/tmp/nmt_925271_model \
--num_train_steps=340000 \
--decay_scheme="luong234" \
--steps_per_stats=100 \
--num_units=512 \
--num_encoder_layers=4 \
--num_decoder_layers=4 \
--src_max_len=70 \
--tgt_max_len=70 \
--encoder_type="bi" \
--dropout=0.2 \
--beam_width=10 \
--metrics="bleu" \
> /home/jiale/tmp/nmt_925271_model/nohup.out 2>&1 &
```

- 参数设置对比

|          参数          | default  |                        iwslt15[133K]                         |     wmt16[4.6M]     |
| :--------------------: | :------: | :----------------------------------------------------------: | :-----------------: |
|       num_units        |    32    |                           **512**                            |        1024         |
|       num_layers       |    2     |                                                              |                     |
|   num_encoder_layers   |   None   |                              2                               |        **4**        |
|   num_decoder_layers   |   None   |                              2                               |        **4**        |
|      encoder_type      |   uni    |                              bi                              |       **bi**        |
|        residual        |  False   |                            false                             |        false        |
|       time_major       |   true   |                             true                             |        true         |
|       attention        |    ""    |                         scaled_luong                         | **normed_bahdanau** |
| attention_architecture | standard |                           standard                           |      standard       |
|       optimizer        |   sgd    |                             sgd                              |         sgd         |
|     learning_rate      |   1.0    |                             1.0                              |         1.0         |
|      decay_scheme      |    ""    |                         **luong234**                         |       luong10       |
|    num_train_steps     |  12000   |                            12000                             |     **340000**      |
|      src_max_len       |    50    |                              50                              |         50          |
|      tgt_max_len       |    50    |                              50                              |         50          |
|   src_max_len_infer    |   None   |                             None                             |        None         |
|   tgt_max_len_infer    |   None   |                             None                             |        None         |
|       unit_type        |   lstm   |                             lstm                             |        lstm         |
|      forget_bias       |   1.0    |                             1.0                              |         1.0         |
|        dropout         |   0.2    |                             0.2                              |         0.2         |
|       batch_size       |   128    |                             128                              |         128         |
|    steps_per_stats     |   100    |                             100                              |         100         |
|     subword_option     |    ""    |                              ""                              |         bpe         |
|    **hparams_path**    |   None   | Path to standard hparams json file that overrides hparams values from FLAGS. |                     |
|       beam_width       |    0     |                              10                              |       **10**        |




