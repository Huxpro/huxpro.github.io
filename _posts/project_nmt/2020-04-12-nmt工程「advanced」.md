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

- all 

  - "--**encoder_type**", type=str, default="uni", help="""\
      uni | bi | gnmt. For bi, we build num_layers/2 bi-directional layers.For
          gnmt, we build 1 bi-directional layer, and (num_layers - 1) uni-
      directional layers.\
        """
  - "--**residual**", type="bool", nargs="?", const=True,
                      default=False,
                        help="Whether to add residual connections."
  - "--**attention**", type=str, default="", help="""\
        luong | scaled_luong | bahdanau | normed_bahdanau or set to "" for no
        attention\
        """
  - "--**optimizer**", type=str, default="sgd", help="sgd | adam"
  - "--**vocab_prefix**", type=str, default=None, expect files with src\tgt suffixes.If None, extract from
          train files. 
  - "--**share_vocab**", type="bool", nargs="?", const=True,
                        default=False,
                        help="""\
        Whether to use the source vocab and embeddings for both source and
        target.\
        """
  - "--**beam_width**", type=int, default=0,
                        help=("""\
        beam width when using beam search decoder. If 0 (default), use standard
      decoder with greedy helper.\
        """
  
  ```python
  def add_arguments(parser):
  """Build ArgumentParser."""
  parser.register("type", "bool", lambda v: v.lower() == "true")
  
  # network
  parser.add_argument("--num_units", type=int, default=32, help="Network size.")
  parser.add_argument("--num_layers", type=int, default=2,
                      help="Network depth.")
  parser.add_argument("--encoder_type", type=str, default="uni", help="""\
      uni | bi | gnmt. For bi, we build num_layers/2 bi-directional layers.For
      gnmt, we build 1 bi-directional layer, and (num_layers - 1) uni-
      directional layers.\
      """)
  parser.add_argument("--residual", type="bool", nargs="?", const=True,
                      default=False,
                      help="Whether to add residual connections.")
  parser.add_argument("--time_major", type="bool", nargs="?", const=True,
                      default=True,
                      help="Whether to use time-major mode for dynamic RNN.")
  parser.add_argument("--num_embeddings_partitions", type=int, default=0,
                      help="Number of partitions for embedding vars.")

  # attention mechanisms
  parser.add_argument("--attention", type=str, default="", help="""\
      luong | scaled_luong | bahdanau | normed_bahdanau or set to "" for no
      attention\
      """)
  parser.add_argument(
      "--attention_architecture",
      type=str,
      default="standard",
      help="""\
      standard | gnmt | gnmt_v2.
      standard: use top layer to compute attention.
      gnmt: GNMT style of computing attention, use previous bottom layer to
          compute attention.
      gnmt_v2: similar to gnmt, but use current bottom layer to compute
          attention.\
      """)
parser.add_argument(
      "--pass_hidden_state", type="bool", nargs="?", const=True,
      default=True,
      help="""\
      Whether to pass encoder's hidden state to decoder when using an attention
      based model.\
      """)

  # optimizer
  parser.add_argument("--optimizer", type=str, default="sgd", help="sgd | adam")
  parser.add_argument("--learning_rate", type=float, default=1.0,
                      help="Learning rate. Adam: 0.001 | 0.0001")
  parser.add_argument("--start_decay_step", type=int, default=0,
                      help="When we start to decay")
  parser.add_argument("--decay_steps", type=int, default=10000,
                      help="How frequent we decay")
  parser.add_argument("--decay_factor", type=float, default=0.98,
                      help="How much we decay.")
  parser.add_argument(
      "--num_train_steps", type=int, default=12000, help="Num steps to train.")
  parser.add_argument("--colocate_gradients_with_ops", type="bool", nargs="?",
                    const=True,
                      default=True,
                      help=("Whether try colocating gradients with "
                            "corresponding op"))
  
  # initializer
  parser.add_argument("--init_op", type=str, default="uniform",
                      help="uniform | glorot_normal | glorot_uniform")
  parser.add_argument("--init_weight", type=float, default=0.1,
                      help=("for uniform init_op, initialize weights "
                           "between [-this, this]."))
  
  # data
  parser.add_argument("--src", type=str, default=None,
                      help="Source suffix, e.g., en.")
  parser.add_argument("--tgt", type=str, default=None,
                    help="Target suffix, e.g., de.")
  parser.add_argument("--train_prefix", type=str, default=None,
                      help="Train prefix, expect files with src/tgt suffixes.")
  parser.add_argument("--dev_prefix", type=str, default=None,
                      help="Dev prefix, expect files with src/tgt suffixes.")
  parser.add_argument("--test_prefix", type=str, default=None,
                      help="Test prefix, expect files with src/tgt suffixes.")
  parser.add_argument("--out_dir", type=str, default=None,
                      help="Store log/model files.")
  
  # Vocab
  parser.add_argument("--vocab_prefix", type=str, default=None, help="""\
      Vocab prefix, expect files with src/tgt suffixes.If None, extract from
    train files.\
      """)
  parser.add_argument("--sos", type=str, default="<s>",
                      help="Start-of-sentence symbol.")
  parser.add_argument("--eos", type=str, default="</s>",
                      help="End-of-sentence symbol.")
  parser.add_argument("--share_vocab", type="bool", nargs="?", const=True,
                      default=False,
                      help="""\
      Whether to use the source vocab and embeddings for both source and
      target.\
      """)
  
# Sequence lengths
  parser.add_argument("--src_max_len", type=int, default=50,
                      help="Max length of src sequences during training.")
  parser.add_argument("--tgt_max_len", type=int, default=50,
                      help="Max length of tgt sequences during training.")
  parser.add_argument("--src_max_len_infer", type=int, default=None,
                      help="Max length of src sequences during inference.")
  parser.add_argument("--tgt_max_len_infer", type=int, default=None,
                    help="""\
      Max length of tgt sequences during inference.  Also use to restrict the
      maximum decoding length.\
      """)

  # Default settings works well (rarely need to change)
  parser.add_argument("--unit_type", type=str, default="lstm",
                      help="lstm | gru | layer_norm_lstm")
  parser.add_argument("--forget_bias", type=float, default=1.0,
                      help="Forget bias for BasicLSTMCell.")
  parser.add_argument("--dropout", type=float, default=0.2,
                      help="Dropout rate (not keep_prob)")
  parser.add_argument("--max_gradient_norm", type=float, default=5.0,
                      help="Clip gradients to this norm.")
  parser.add_argument("--source_reverse", type="bool", nargs="?", const=True,
                      default=False, help="Reverse source sequence.")
  parser.add_argument("--batch_size", type=int, default=128, help="Batch size.")
  
  parser.add_argument("--steps_per_stats", type=int, default=100,
                      help=("How many training steps to do per stats logging."
                            "Save checkpoint every 10x steps_per_stats"))
  parser.add_argument("--max_train", type=int, default=0,
                      help="Limit on the size of training data (0: no limit).")
  parser.add_argument("--num_buckets", type=int, default=5,
                      help="Put data into similar-length buckets.")

  # BPE
  parser.add_argument("--bpe_delimiter", type=str, default=None,
                      help="Set to @@ to activate BPE")
  
  # Misc
  parser.add_argument("--num_gpus", type=int, default=1,
                      help="Number of gpus in each worker.")
  parser.add_argument("--log_device_placement", type="bool", nargs="?",
                      const=True, default=False, help="Debug GPU allocation.")
  parser.add_argument("--metrics", type=str, default="bleu",
                      help=("Comma-separated list of evaluations "
                            "metrics (bleu,rouge,accuracy)"))
  parser.add_argument("--steps_per_external_eval", type=int, default=None,
                      help="""\
      How many training steps to do per external evaluation.  Automatically set
      based on data if None.\
      """)
  parser.add_argument("--scope", type=str, default=None,
                      help="scope to put variables under")
  parser.add_argument("--hparams_path", type=str, default=None,
                      help=("Path to standard hparams json file that overrides"
                            "hparams values from FLAGS."))
  parser.add_argument("--random_seed", type=int, default=None,
                    help="Random seed (>0, set a specific seed).")
  
  # Inference
  parser.add_argument("--ckpt", type=str, default="",
                      help="Checkpoint file to load a model for inference.")
  parser.add_argument("--inference_input_file", type=str, default=None,
                      help="Set to the text to decode.")
  parser.add_argument("--inference_list", type=str, default=None,
                      help=("A comma-separated list of sentence indices "
                            "(0-based) to decode."))
  parser.add_argument("--infer_batch_size", type=int, default=32,
                      help="Batch size for inference mode.")
  parser.add_argument("--inference_output_file", type=str, default=None,
                      help="Output file to store decoding results.")
  parser.add_argument("--inference_ref_file", type=str, default=None,
                      help=("""\
      Reference file to compute evaluation scores (if provided).\
      """))
  parser.add_argument("--beam_width", type=int, default=0,
                      help=("""\
      beam width when using beam search decoder. If 0 (default), use standard
      decoder with greedy helper.\
      """))
  parser.add_argument("--length_penalty_weight", type=float, default=0.0,
                      help="Length penalty for beam search.")
  
  # Job info
  parser.add_argument("--jobid", type=int, default=0,
                      help="Task id of the worker.")
  parser.add_argument("--num_workers", type=int, default=1,
                      help="Number of workers (inference only).")
  ```

