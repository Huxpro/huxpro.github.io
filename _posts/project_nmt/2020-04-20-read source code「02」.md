---
title: "read source code「02」"
subtitle: "nmt「nmt.py」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - nmt
  - paper with code
---



## nmt入口

```python
if __name__ == "__main__":
  nmt_parser = argparse.ArgumentParser()
  add_arguments(nmt_parser)
  FLAGS, unparsed = nmt_parser.parse_known_args()
  tf.app.run(main=main, argv=[sys.argv[0]] + unparsed)
```

### argparse.ArgumentParser()

argparse是一个Python模块：命令行选项、参数和子命令解析器。

[`argparse`](https://docs.python.org/zh-cn/3/library/argparse.html#module-argparse) 模块可以让人轻松编写用户友好的命令行接口。程序定义它需要的参数，然后 [`argparse`](https://docs.python.org/zh-cn/3/library/argparse.html#module-argparse) 将弄清如何从 [`sys.argv`](https://docs.python.org/zh-cn/3/library/sys.html#sys.argv) 解析出那些参数。 [`argparse`](https://docs.python.org/zh-cn/3/library/argparse.html#module-argparse) 模块还会自动生成帮助和使用手册，并在用户给程序传入无效参数时报出错误信息。

#### 使用流程

##### step1: 创建解析器

使用 [`argparse`](https://docs.python.org/zh-cn/3/library/argparse.html#module-argparse) 的第一步是创建一个 [`ArgumentParser`](https://docs.python.org/zh-cn/3/library/argparse.html#argparse.ArgumentParser) 对象。[`ArgumentParser`](https://docs.python.org/zh-cn/3/library/argparse.html#argparse.ArgumentParser) 对象包含将命令行解析成 Python 数据类型所需的全部信息。

```python
import argparse
parser = argparse.ArgumentParser(description='Process some integers.')
```

##### step2: 添加参数

给一个 [`ArgumentParser`](https://docs.python.org/zh-cn/3/library/argparse.html#argparse.ArgumentParser) 添加程序参数信息是通过调用 [`add_argument()`](https://docs.python.org/zh-cn/3/library/argparse.html#argparse.ArgumentParser.add_argument) 方法完成的。

```python
parser.add_argument('integers', metavar='N', type=int, nargs='+', help='an integer for the accumulator')
```

##### step3: 解析参数

```
>>> parser.parse_args(['--sum', '7', '-1', '42'])
Namespace(accumulate=<built-in function sum>, integers=[7, -1, 42])
```

#### ArgumentParser 对象

```python
class argparse.ArgumentParser(
    prog=None, # 程序的名称（默认：sys.argv[0]）
    usage=None, # 描述程序用途的字符串（默认值：从添加到解析器的参数生成）
    description=None, # 在参数帮助文档之前显示的文本（默认值：无）
    epilog=None, # 在参数帮助文档之后显示的文本（默认值：无）
    parents=[], # 一个 ArgumentParser 对象的列表，它们的参数也应包含在内
    formatter_class=argparse.HelpFormatter, # 用于自定义帮助文档输出格式的类
    prefix_chars='-', # 可选参数的前缀字符集合（默认值：’-’）
	fromfile_prefix_chars=None, # 当需要从文件中读取其他参数时，用于标识文件名的前缀字符集合（默认值：None）
    argument_default=None, # 参数的全局默认值（默认值： None）
    conflict_handler='error', # 解决冲突选项的策略（通常是不必要的）
    add_help=True, # 为解析器添加一个 -h/--help 选项（默认值： True）
    allow_abbrev=True) # 如果缩写是无歧义的，则允许缩写长选项 （默认值：True）
```

#### add_argument() 方法

```python
ArgumentParser.add_argument(
    name or flags... # 一个命名或者一个选项字符串的列表，例如 foo 或 -f, --foo。
    [, action] # 当参数在命令行中出现时使用的动作基本类型。
    [, nargs] # 命令行参数应当消耗的数目。
    [, const] # 被一些 action 和 nargs 选择所需求的常数。
    [, default] # 当参数未在命令行中出现时使用的值。
    [, type] # 命令行参数应当被转换成的类型。
    [, choices] # 可用的参数的容器。
    [, required] # 此命令行选项是否可省略 （仅选项可用）。
    [, help] # 一个此选项作用的简单描述。
    [, metavar] # 在使用方法消息中使用的参数值示例。
    [, dest]) # 被添加到 parse_args() 所返回对象上的属性名。
```



## inference流程

##### step1: 从nmt_test.py中testInference开始分析

```python
def testInference(self):
    """Test inference is function with basic hparams."""
    nmt_parser = argparse.ArgumentParser()
    """
    nmt_parser: 
    	ArgumentParser(prog='_jb_pytest_runner.py', usage=None, description=None, 
    	formatter_class=<class 'argparse.HelpFormatter'>, conflict_handler='error', 
    	add_help=True)
    """
    nmt.add_arguments(nmt_parser)
    """
    调用nmt中add_arguments函数，传入参数为nmt_parser对象，
    add_arguments函数内部的实现逻辑是：
    	# 检查输入的type类型转为小写后是否是true
    	parser.register("type", "bool", lambda v: v.lower() == "true")
    	# 为nmt_parser添加命令行参数
		parser.add_argument("--num_units", type=int, default=32, help="Network 
			size.")
		...
    """
    FLAGS, unparsed = nmt_parser.parse_known_args()
    """
    arg=parse_args() 和 flags,unparsed=parse_known_args() 用法基本一样，都是解析输出参数的
    FLAGS输出以Namespace的形式：
    	Namespace(attention='', attention_architecture='standard', avg_ckpts=False, 
    	batch_size=128, beam_width=0, check_special_token=True, ckpt='', 
    	colocate_gradients_with_ops=True, coverage_penalty_weight=0.0, 
    	decay_scheme='', dev_prefix=None, dropout=0.2, embed_prefix=None, 
    	encoder_type='uni', eos='</s>', forget_bias=1.0, hparams_path=None, 
    	infer_batch_size=32, infer_mode='greedy', inference_input_file=None, 
    	inference_list=None, inference_output_file=None, inference_ref_file=None, 
    	init_op='uniform', init_weight=0.1, jobid=0, language_model=False, 
    	learning_rate=1.0, length_penalty_weight=0.0, log_device_placement=False, 
    	max_gradient_norm=5.0, max_train=0, metrics='bleu', num_buckets=5, 
    	num_decoder_layers=None, num_embeddings_partitions=0, 
    	num_encoder_layers=None, num_gpus=1, num_inter_threads=0, 
    	num_intra_threads=0, num_keep_ckpts=5, num_layers=2, num_sampled_softmax=0, 
    	num_train_steps=12000, num_translations_per_input=1, num_units=32, 
    	num_workers=1, optimizer='sgd', out_dir=None, output_attention=True, 
    	override_loaded_hparams=False, pass_hidden_state=True, random_seed=None, 
    	residual=False, sampling_temperature=0.0, scope=None, share_vocab=False, 
    	sos='<s>', src=None, src_max_len=50, src_max_len_infer=None, 
    	steps_per_external_eval=None, steps_per_stats=100, subword_option='', 
    	test_prefix=None, tgt=None, tgt_max_len=50, tgt_max_len_infer=None, 
    	time_major=True, train_prefix=None, unit_type='lstm', use_char_encode=False, 
    	vocab_prefix=None, warmup_scheme='t2t', warmup_steps=0)
   	unparsed输出路径：
   		<class 'list'>: ['/home/jiale/codes/nmt/nmt/nmt_test.py']
    """

    _update_flags(FLAGS, "nmt_train_infer")
    """
    对FLAGS内部分属性调用_update_flags函数进行更新，
    	flags.out_dir = "/home/jiale/tmp/nmt_925271_model"
  		flags.inference_input_file = 
  			"/home/jiale/tmp/my_infer_file_groundtrue100.szh"
  		flags.inference_output_file = 	
  			"/home/jiale/tmp/nmt_925271_model/output_20200519.debug"
    “nmt_train_infer”只是一个test_name，不重要
    """

    # Train one step so we have a checkpoint.
    FLAGS.num_train_steps = 1
    """
    通过直接调用属性的方式更新值，区别于_update_flags
    """
    default_hparams = nmt.create_hparams(FLAGS)
    """
    将 <class 'argparse.Namespace'> 类型转为
       <class 'tensorflow.contrib.training.python.training.hparam.HParams'>
    
    Class to hold a set of hyperparameters as name-value pairs.
        A HParams object holds hyperparameters used to build and train a model, such 
        as the number of hidden units in a neural net layer or the learning rate to 
        use when training.
    
    default_hparams：
    	[('attention', ''), ('attention_architecture', 'standard'), ('avg_ckpts', 
    	False), ('batch_size', 128), ('beam_width', 0), ('check_special_token', 
    	True), ('colocate_gradients_with_ops', True), ('coverage_penalty_weight', 
    	0.0), ('decay_scheme', ''), ('dev_prefix', 
    	'nmt/testdata/iwslt15.tst2013.100'), ('dropout', 0.2), ('embed_prefix', 
    	None), ('encoder_type', 'uni'), ('eos', '</s>'), ('epoch_step', 0), 
    	('forget_bias', 1.0), ('infer_batch_size', 32), ('infer_mode', 'greedy'), 
    	('init_op', 'uniform'), ('init_weight', 0.1), ('language_model', False), 
    	('learning_rate', 1.0), ('length_penalty_weight', 0.0), 
    	('log_device_placement', False), ('max_gradient_norm', 5.0), ('max_train', 
    	0), ('metrics', ['bleu']), ('num_buckets', 5), ('num_decoder_layers', 2), 
    	('num_embeddings_partitions', 0), ('num_encoder_layers', 2), ('num_gpus', 
    	1), ('num_inter_threads', 0), ('num_intra_threads', 0), ('num_keep_ckpts', 
    	5), ('num_sampled_softmax', 0), ('num_train_steps', 1), 
    	('num_translations_per_input', 1), ('num_units', 32), ('optimizer', 'sgd'), 
    	('out_dir', '/tmp/pydevdkgd34mha/nmt_train_infer'), ('output_attention', 
    	True), ('override_loaded_hparams', False), ('pass_hidden_state', True), 
    	('random_seed', None), ('residual', False), ('sampling_temperature', 0.0), 
    	('share_vocab', False), ('sos', '<s>'), ('src', 'en'), ('src_max_len', 50), 
    	('src_max_len_infer', None), ('steps_per_external_eval', None), 
    	('steps_per_stats', 5), ('subword_option', ''), ('test_prefix', 
    	'nmt/testdata/iwslt15.tst2013.100'), ('tgt', 'vi'), ('tgt_max_len', 50), 
    	('tgt_max_len_infer', None), ('time_major', True), ('train_prefix', 
    	'nmt/testdata/iwslt15.tst2013.100'), ('unit_type', 'lstm'), 
    	('use_char_encode', False), ('vocab_prefix', '
    	nmt/testdata/iwslt15.vocab.100'), ('warmup_scheme', 't2t'), ('warmup_steps', 
    	0)]
    """

    inference_fn = inference.inference
    # 转入 run_main函数 进行预测
    nmt.run_main(FLAGS, default_hparams, None, inference_fn)
```

##### step2: 转入nmt.py的run_main接口

```python
def run_main(flags, default_hparams, train_fn, inference_fn, target_session=""):
  """Run main."""
	"""
	flags: Namespace形式
	default_hparams: HParams形式
	train_fn: None，表示不进行训练
	inference_fn: 调用inference.py中inference函数接口
	"""
  # Job
  jobid = flags.jobid
  num_workers = flags.num_workers
  utils.print_out("# Job id %d" % jobid)

  # GPU device
  utils.print_out(
      "# Devices visible to TensorFlow: %s" % repr(tf.Session().list_devices()))

  # Random
  random_seed = flags.random_seed
  if random_seed is not None and random_seed > 0:
    utils.print_out("# Set random seed to %d" % random_seed)
    random.seed(random_seed + jobid)
    np.random.seed(random_seed + jobid)

  # Model output directory
  out_dir = flags.out_dir
  if out_dir and not tf.gfile.Exists(out_dir):
    utils.print_out("# Creating output directory %s ..." % out_dir)
    tf.gfile.MakeDirs(out_dir)

  # Load hparams.
  loaded_hparams = False
  	# ckpt为空，跳过
  if flags.ckpt:  # Try to load hparams from the same directory as ckpt
    ckpt_dir = os.path.dirname(flags.ckpt)
    ckpt_hparams_file = os.path.join(ckpt_dir, "hparams")
    if tf.gfile.Exists(ckpt_hparams_file) or flags.hparams_path:
      hparams = create_or_load_hparams(
          ckpt_dir, default_hparams, flags.hparams_path,
          save_hparams=False)
      loaded_hparams = True
  if not loaded_hparams:  # Try to load from out_dir
    assert out_dir
    # 如果out_dir目录下有hparams文件，则load；因为infer之前已经训练过了，所以肯定有hparams
    hparams = create_or_load_hparams(
        out_dir, default_hparams, flags.hparams_path,
        save_hparams=(jobid == 0))

  ## Train / Decode
	# 要预测的文件
  if flags.inference_input_file:
    # Inference output directory
    trans_file = flags.inference_output_file
    assert trans_file
    trans_dir = os.path.dirname(trans_file)
    if not tf.gfile.Exists(trans_dir): tf.gfile.MakeDirs(trans_dir)

    # Inference indices
    hparams.inference_indices = None
    if flags.inference_list:
      (hparams.inference_indices) = (
          [int(token)  for token in flags.inference_list.split(",")])

    # Inference
    ckpt = flags.ckpt
    if not ckpt:
        # 当前ckpt=“”，故load最新的ckpt
      ckpt = tf.train.latest_checkpoint(out_dir)
    # 调用inference_fn接口，进行推断
    inference_fn(ckpt, flags.inference_input_file,
                 trans_file, hparams, num_workers, jobid)

    # Evaluation
    ref_file = flags.inference_ref_file
    if ref_file and tf.gfile.Exists(trans_file):
      for metric in hparams.metrics:
        score = evaluation_utils.evaluate(
            ref_file,
            trans_file,
            metric,
            hparams.subword_option)
        utils.print_out("  %s: %.1f" % (metric, score))
  else:
    # Train
    train_fn(hparams, target_session=target_session)
```

##### step3: 转入inference.py进行预测

```python
def inference(ckpt_path,
              inference_input_file,
              inference_output_file,
              hparams,
              num_workers=1,
              jobid=0,
              scope=None):
  """Perform translation."""
  if hparams.inference_indices:
    assert num_workers == 1

  model_creator = get_model_creator(hparams)
  """
  返回attention_architecture
  model_creator：<class 'nmt.attention_model.AttentionModel'>
  """
  infer_model = model_helper.create_infer_model(model_creator, hparams, scope)
  sess, loaded_infer_model = start_sess_and_load_model(infer_model, ckpt_path)

  if num_workers == 1:
    # 真正开始做infer
    single_worker_inference(
        sess,
        infer_model,
        loaded_infer_model,
        inference_input_file,
        inference_output_file,
        hparams)
  else:
    multi_worker_inference(
        sess,
        infer_model,
        loaded_infer_model,
        inference_input_file,
        inference_output_file,
        hparams,
        num_workers=num_workers,
        jobid=jobid)
  sess.close()
```

##### step4: 转入single_worker_inference准备数据与初始化

```python
def single_worker_inference(sess,
                            infer_model,
                            loaded_infer_model,
                            inference_input_file,
                            inference_output_file,
                            hparams):
  """Inference with a single worker."""
	# 输出文件路径
  output_infer = inference_output_file

  # Read data
  infer_data = load_data(inference_input_file, hparams)
	"""
	infer_data:
		list of split(sentences):
		<class 'list'>: 
		['广 汽 本 田 完 成 对 本 田 汽 车 ( 中 国 ) 的 合 并 未 来 将 扩 大 产 能', 
		'全 球 疫 情 快 速 蔓 延 我 国 紧 急 向 国 外 提 供 1 7 0 0 多 台 呼 吸 机', 
		'宁 波 ： 对 进 出 口 额 1 亿 美 元 以 上 的 企 业 建 立 金 融 帮 扶 “ 白 名 单 ”', ]
	"""
  with infer_model.graph.as_default():
    sess.run(
        infer_model.iterator.initializer,
        feed_dict={
            infer_model.src_placeholder: infer_data, 
            infer_model.batch_size_placeholder: hparams.infer_batch_size # default:32
        })
    # Decode
    utils.print_out("# Start decoding")
    # 跳过
    if hparams.inference_indices:
      _decode_inference_indices(
          loaded_infer_model,
          sess,
          output_infer=output_infer,
          output_infer_summary_prefix=output_infer,
          inference_indices=hparams.inference_indices,
          tgt_eos=hparams.eos,
          subword_option=hparams.subword_option)
    else:
        # 转入 nmt_utils.decode_and_evaluate
      nmt_utils.decode_and_evaluate(
          "infer",
          loaded_infer_model,
          sess,
          output_infer,
          ref_file=None,
          metrics=hparams.metrics,
          subword_option=hparams.subword_option,
          beam_width=hparams.beam_width,
          tgt_eos=hparams.eos,
          num_translations_per_input=hparams.num_translations_per_input,
          infer_mode=hparams.infer_mode)

```

##### step5: 转入decode_and_evaluate

```python
def decode_and_evaluate(name,
                        model,
                        sess,
                        trans_file,
                        ref_file,
                        metrics,
                        subword_option,
                        beam_width,
                        tgt_eos,
                        num_translations_per_input=1,
                        decode=True,
                        infer_mode="greedy"):
  """Decode a test set and compute a score according to the evaluation task."""
  # Decode
  if decode:
    utils.print_out("  decoding to output %s" % trans_file)

    start_time = time.time()
    num_sentences = 0
    with codecs.getwriter("utf-8")(
        tf.gfile.GFile(trans_file, mode="wb")) as trans_f:
      trans_f.write("")  # Write empty string to ensure file is created.

      if infer_mode == "greedy":
        num_translations_per_input = 1
      elif infer_mode == "beam_search":
        num_translations_per_input = min(num_translations_per_input, beam_width)

      while True:
        try:
          nmt_outputs, _ = model.decode(sess)
          if infer_mode != "beam_search":
            nmt_outputs = np.expand_dims(nmt_outputs, 0)

          batch_size = nmt_outputs.shape[1]
          num_sentences += batch_size

          for sent_id in range(batch_size):
            for beam_id in range(num_translations_per_input):
                # 此处进行翻译
              translation = get_translation(
                  nmt_outputs[beam_id],
                  sent_id,
                  tgt_eos=tgt_eos,
                  subword_option=subword_option)
              trans_f.write((translation + b"\n").decode("utf-8"))
        except tf.errors.OutOfRangeError:
          utils.print_time(
              "  done, num sentences %d, num translations per input %d" %
              (num_sentences, num_translations_per_input), start_time)
          break

  # Evaluation
  evaluation_scores = {}
    # 无ref_file跳过
  if ref_file and tf.gfile.Exists(trans_file):
    for metric in metrics:
      score = evaluation_utils.evaluate(
          ref_file,
          trans_file,
          metric,
          subword_option=subword_option)
      evaluation_scores[metric] = score
      utils.print_out("  %s %s: %.1f" % (metric, name, score))

  return evaluation_scores
```

## 魔改inference

最终接口长这样，新增两个文件`paraphrase_main`、`paraphrase_inference`，然后就可以用python的方式而不是命令行启动了。并且可以保证模型只加载一次，`para_infer.predict` 函数可以多次调用。

```python
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import argparse
import os

import tensorflow as tf
import unittest

import nmt.paraphrase_main as para_nmt
import nmt.paraphrase_inference as para_infer

os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "2"


class ParaphraseInference(unittest.TestCase):

    def setUp(self):
        nmt_parser = argparse.ArgumentParser()
        para_nmt.add_arguments(nmt_parser)
        self.FLAGS, self.unparsed = nmt_parser.parse_known_args()
        self._update_flags(self.FLAGS, "paraphrase_infer")
        self.default_hparams = para_nmt.create_hparams(self.FLAGS)
        inference_fn = para_infer.inference
        self.sess,self.infer_model,self.loaded_infer_model,self.hparams = para_nmt.run_main(self.FLAGS, self.default_hparams, None, inference_fn)


    def _update_flags(self, flags, test_name):
        """Update flags for basic training."""

        flags.out_dir = "/home/jiale/tmp/nmt_925271_model"


    def test_paraphrase_infer(self):

        infer_sentence = [
            "广 汽 本 田 完 成 对 本 田 汽 车 ( 中 国 ) 的 合 并 未 来 将 扩 大 产 能",
            "全 球 疫 情 快 速 蔓 延 我 国 紧 急 向 国 外 提 供 1 7 0 0 多 台 呼 吸 机"]
        res = para_infer.predict(self.sess,
                                 self.infer_model,
                                 self.loaded_infer_model,
                                 self.hparams, 
                                 infer_sentence)
        assert(len(res)==2)


if __name__ == '__main__':
    unittest.main()


```





