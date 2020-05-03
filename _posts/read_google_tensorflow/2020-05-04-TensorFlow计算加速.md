---
title: "TensorFlow计算加速"
subtitle: "TensorFlow：实战Google深度学习框架「12」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
---



### TensorFlow使用GPU

TensorFlow程序可以通过tf.device函数来指定运行每一个操作的设备，这个设备可以是本地的CPU或者GPU，也可以是某一台远程的服务器。TensorFlow会给每一个可用的设备一个名称，tf.device函数可以通过设备的名称来指定执行运算的设备。

- 比如CPU在TensorFlow中的名称为/cpu:0，在默认情况下，即使机器有多个CPU,TensorFlow也不会区分它们，**所有的CPU都使用/cpu:0作为名称**。
- 而一台机器上不同GPU的名称是不同的，比如第一个GPU的名称为/gpu:0，第二个GPU名称/gpu:1，以此类推。

```python
# GPU基本操作
import tensorflow as tf

a = tf.constant([1.0, 2.0, 3.0], shape=[3], name='a')
b = tf.constant([1.0, 2.0, 3.0], shape=[3], name='b')
c = a + b

# 通过log_device_placement参数来记录运行每一个运算的设备。
sess = tf.Session(config=tf.ConfigProto(log_device_placement=True))
print sess.run(c)


# 通过tf.device将运算指定到特定的设备上。
with tf.device('/cpu:0'):
	a = tf.constant([1.0, 2.0, 3.0], shape=[3], name='a')
	b = tf.constant([1.0, 2.0, 3.0], shape=[3], name='b')
with tf.device('/gpu:1'):
    c = a + b

sess = tf.Session(config=tf.ConfigProto(log_device_placement=True))
print sess.run(c)


a_cpu = tf.Variable(0, name="a_cpu")
with tf.device('/gpu:0'):
	a_gpu = tf.Variable(0, name="a_gpu")
	# 通过allow_soft_placement参数自动将无法放在GPU上的操作放回CPU上。
sess = tf.Session(config=tf.ConfigProto(allow_soft_placement=True, log_device_placement=True))
sess.run(tf.global_variables_initializer())
```

- GPU基本操作
  - 通过log_device_placement参数来记录运行每一个运算的设备。
  - 通过tf.device将运算指定到特定的设备上。
  - 通过allow_soft_placement参数自动将无法放在GPU上的操作放回CPU上。
  - 虽然GPU可以加速TensorFlow的计算，但一般来说不会把所有的操作全部放在GPU上。**一个比较好的实践是将计算密集型的运算放在GPU上，而把其他操作放到CPU上**。GPU是机器中相对独立的资源，**将计算放入或者转出GPU都需要额外的时间**。而且**GPU需要将计算时用到的数据从内存复制到GPU设备上，这也需要额外的时间**。TensorFlow可以自动完成这些操作而不需要用户特别处理，但为了提高程序运行的速度，尽量将相关的运算放在同一个设备上。
  - 如果在一个TensorFlow程序中只需要使用部分GPU，可以通过设置CUDA_VISIBLE_DEVICES环境变量来控制。`CUDA_VISIBLE_DEVICES=O,l python demo_code.py` , TensorFlow也支持在程序中设置环境变量 `os.environ["CUDA_VISIBLE_DEVICES"]="2"` , 也支持动态分配 GPU 的显存 `config.gpu_ options.allow_growth = True` `config.gpu_options.per_process_gpu_memory_fraction = 0.4` 

### 深度学习训练并行模式

常用的并行化深度学习模型训练方式有两种，**同步模式和异步模式**。在并行化地训练深度学习模型时，不同设备 (GPU或CPU) 可以在不同训练数据上运行这个迭代的过程，而**不同并行模式的区别在于不同的参数更新方式**。

![4KUx6t](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/4KUx6t.png)

- 异步模式
  - 在每一轮选代时，不同设备会读取参数最新的取值，但因为不同设备读取参数取值的时间不一样，所以得到的值也有可能不一样。根据当前参数的取值和随机获取的一小部分训练数据，不同设备各自运行反向传播的过程并独立地更新参数。**可以简单地认为异步模式就是单机模式复制了多份，每一份使用不同的训练数据进行训练**。在异步模式下，不同设备之间是完全独立的。

![ZMlrRq](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ZMlrRq.png)

![njliAL](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/njliAL.png)

- 为了避免更新不同步的问题，可以使用同步模式
  - 在同步模式下，所有的设备同时读取参数的取值，并且当反向传播算法完成之后同步更新参数的取值。**单个设备不会单独对参数进行更新，而会等待所有设备都完成反向传播之后再统一更新参数**。

  - 在每一轮法代时，不同设备首先统一读取当前参数的取值，并随机获取一小部分数据。然后在不同设备上运行反向传播过程得到在各自训练数据上参数的梯度。注意虽然所有设备使用的参数是一致的，但是因为训练数据不同，所以得到参数的梯度就可能不一样。当所有设备完成反向传播的计算之后，需要计算出不同设备上参数梯度的平均值，最后再根据平均值对参数进行更新。

![CQKR5C](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/CQKR5C.png)

- **同步模式解决了异步模式中存在的参数更新问题，然而同步模式的效率却低于异步模式**。
  - 在同步模式下，**每一轮迭代都需要设备统一开始、统一结束**。如果设备的运行速度不一致，那么每一轮训练都需要等待最慢的设备结束才能开始更新参数，于是很多时间将被花在等待上。
  - 虽然理论上异步模式存在缺陷，但因为训练深度学习模型时使用的**随机梯度下降本身就是梯度下降的一个近似解法，而且即使是梯度下降也无法保证达到全局最优值**，所以在**实际应用**中，在相同时间内，使用异步模式训练的模型不一定比同步模式差。

### 多GPU并行

```python
# coding=utf-8
from datetime import datetime
import os
import time
import tensorflow as tf
import mnist_inference

# 定义训练神经网络时需要用到的参数。
BATCH_SIZE = 100 
LEARNING_RATE_BASE = 0.001
LEARNING_RATE_DECAY = 0.99
REGULARAZTION_RATE = 0.0001
TRAINING_STEPS = 1000
MOVING_AVERAGE_DECAY = 0.99 
N_GPU = 2

# 定义日志和模型输出的路径。
MODEL_SAVE_PATH = "logs_and_models/"
MODEL_NAME = "model.ckpt"

# 定义数据存储的路径。因为需要为不同的GPU提供不同的训练数据，所以通过placerholder
# 的方式就需要手动准备多份数据。为了方便训练数据的获取过程，可以采用第7章中介绍的Dataset
# 的方式从TFRecord中读取数据。于是在这里提供的数据文件路径为将MNIST训练数据
# 转化为TFRecords格式之后的路径。如何将MNIST数据转化为TFRecord格式在第7章中有
# 详细介绍，这里不再赘述。
DATA_PATH = "output.tfrecords" 

# 定义输入队列得到训练数据，具体细节可以参考第7章。
def get_input():
    dataset = tf.contrib.data.TFRecordDataset([DATA_PATH])

    # 定义数据解析格式。
    def parser(record):
        features = tf.parse_single_example(
            record,
            features={
                'image_raw': tf.FixedLenFeature([], tf.string),
                'pixels': tf.FixedLenFeature([], tf.int64),
                'label': tf.FixedLenFeature([], tf.int64),
            })

        # 解析图片和标签信息。
        decoded_image = tf.decode_raw(features['image_raw'], tf.uint8)
        reshaped_image = tf.reshape(decoded_image, [784])
        retyped_image = tf.cast(reshaped_image, tf.float32)
        label = tf.cast(features['label'], tf.int32)

        return retyped_image, label

    # 定义输入队列。
    dataset = dataset.map(parser)
    dataset = dataset.shuffle(buffer_size=10000)
    dataset = dataset.repeat(10)
    dataset = dataset.batch(BATCH_SIZE)
    iterator = dataset.make_one_shot_iterator()

    features, labels = iterator.get_next()
    return features, labels

# 定义损失函数。对于给定的训练数据、正则化损失计算规则和命名空间，计算在这个命名空间
# 下的总损失。之所以需要给定命名空间是因为不同的GPU上计算得出的正则化损失都会加入名为
# loss的集合，如果不通过命名空间就会将不同GPU上的正则化损失都加进来。
def get_loss(x, y_, regularizer, scope, reuse_variables=None):
    # 沿用5.5节中定义的函数来计算神经网络的前向传播结果。
    with tf.variable_scope(tf.get_variable_scope(), reuse=reuse_variables):
        y = mnist_inference.inference(x, regularizer)
    # 计算交叉熵损失。
    cross_entropy = tf.reduce_mean(tf.nn.sparse_softmax_cross_entropy_with_logits(
        logits=y, labels=y_))
    # 计算当前GPU上计算得到的正则化损失。
    regularization_loss = tf.add_n(tf.get_collection('losses', scope))
    # 计算最终的总损失。
    loss = cross_entropy + regularization_loss
    return loss

# 计算每一个变量梯度的平均值。
def average_gradients(tower_grads):
    average_grads = []

    # 枚举所有的变量和变量在不同GPU上计算得出的梯度。
    for grad_and_vars in zip(*tower_grads):
        # 计算所有GPU上的梯度平均值。
        grads = []
        for g, _ in grad_and_vars:
            expanded_g = tf.expand_dims(g, 0)
            grads.append(expanded_g)
        grad = tf.concat(grads, 0)
        grad = tf.reduce_mean(grad, 0)

        v = grad_and_vars[0][1]
        grad_and_var = (grad, v)
        # 将变量和它的平均梯度对应起来。
        average_grads.append(grad_and_var)
    # 返回所有变量的平均梯度，这个将被用于变量的更新。
    return average_grads

# 主训练过程。
def main(argv=None): 
    # 将简单的运算放在CPU上，只有神经网络的训练过程放在GPU上。
    with tf.Graph().as_default(), tf.device('/cpu:0'):
        # 定义基本的训练过程
        x, y_ = get_input()
        regularizer = tf.contrib.layers.l2_regularizer(REGULARAZTION_RATE)
        
        global_step = tf.get_variable('global_step', [], initializer=tf.constant_initializer(0), trainable=False)
        learning_rate = tf.train.exponential_decay(
            LEARNING_RATE_BASE, global_step, 60000 / BATCH_SIZE, LEARNING_RATE_DECAY)       
        
        opt = tf.train.GradientDescentOptimizer(learning_rate)
        
        tower_grads = []
        reuse_variables = False
        # 将神经网络的优化过程跑在不同的GPU上。
        for i in range(N_GPU):
            # 将优化过程指定在一个GPU上。
            with tf.device('/gpu:%d' % i):
                with tf.name_scope('GPU_%d' % i) as scope:
                    cur_loss = get_loss(x, y_, regularizer, scope, reuse_variables)
                    # 在第一次声明变量之后，将控制变量重用的参数设置为True。这样可以
                    # 让不同的GPU更新同一组参数。
                    reuse_variables = True
                    grads = opt.compute_gradients(cur_loss)
                    tower_grads.append(grads)
        
        # 计算变量的平均梯度。
        grads = average_gradients(tower_grads)
        for grad, var in grads:
            if grad is not None:
            	tf.summary.histogram('gradients_on_average/%s' % var.op.name, grad)

        # 使用平均梯度更新参数。
        apply_gradient_op = opt.apply_gradients(grads, global_step=global_step)
        for var in tf.trainable_variables():
            tf.summary.histogram(var.op.name, var)

        # 计算变量的滑动平均值。
        variable_averages = tf.train.ExponentialMovingAverage(MOVING_AVERAGE_DECAY, global_step)
        variables_to_average = (tf.trainable_variables() +tf.moving_average_variables())
        variables_averages_op = variable_averages.apply(variables_to_average)
        # 每一轮迭代需要更新变量的取值并更新变量的滑动平均值。
        train_op = tf.group(apply_gradient_op, variables_averages_op)

        saver = tf.train.Saver()
        summary_op = tf.summary.merge_all()        
        init = tf.global_variables_initializer()
        with tf.Session(config=tf.ConfigProto(
                allow_soft_placement=True, log_device_placement=True)) as sess:
            # 初始化所有变量并启动队列。
            init.run()
            summary_writer = tf.summary.FileWriter(MODEL_SAVE_PATH, sess.graph)

            for step in range(TRAINING_STEPS):
                # 执行神经网络训练操作，并记录训练操作的运行时间。
                start_time = time.time()
                _, loss_value = sess.run([train_op, cur_loss])
                duration = time.time() - start_time
                
                # 每隔一段时间数据当前的训练进度，并统计训练速度。
                if step != 0 and step % 10 == 0:
                    # 计算使用过的训练数据个数。因为在每一次运行训练操作时，每一个GPU
                    # 都会使用一个batch的训练数据，所以总共用到的训练数据个数为
                    # batch大小 × GPU个数。
                    num_examples_per_step = BATCH_SIZE * N_GPU

                    # num_examples_per_step为本次迭代使用到的训练数据个数，
                    # duration为运行当前训练过程使用的时间，于是平均每秒可以处理的训
                    # 练数据个数为num_examples_per_step / duration。
                    examples_per_sec = num_examples_per_step / duration

                    # duration为运行当前训练过程使用的时间，因为在每一个训练过程中，
                    # 每一个GPU都会使用一个batch的训练数据，所以在单个batch上的训
                    # 练所需要时间为duration / GPU个数。
                    sec_per_batch = duration / N_GPU
    
                    # 输出训练信息。
                    format_str = ('%s: step %d, loss = %.2f (%.1f examples/sec; %.3f sec/batch)')
                    print (format_str % (datetime.now(), step, loss_value, examples_per_sec, sec_per_batch))
                    
                    # 通过TensorBoard可视化训练过程。
                    summary = sess.run(summary_op)
                    summary_writer.add_summary(summary, step)
    
                # 每隔一段时间保存当前的模型。
                if step % 1000 == 0 or (step + 1) == TRAINING_STEPS:
                    checkpoint_path = os.path.join(MODEL_SAVE_PATH, MODEL_NAME)
                    saver.save(sess, checkpoint_path, global_step=step)
        
if __name__ == '__main__':
	tf.app.run()
```

### 分布式TensorFlow

通过多GPU并行的方式可以达到很好的加速效果。然而一台机器上能够安装的GPU有限，要进一步提升深度学习模型的训练速度，就需要将TensorFlow分布式运行在多台机器上。

```python
import tensorflow as tf


##############################################################################
# 创建一个本地集群。
c = tf.constant("Hello, distributed TensorFlow!")
# 在本地建立了一个只有一台机器的TensorFlow集群。然后在该集群上生成了一个会话，并通过生成的会话将运算运行在创建的TensorFlow集群上
server = tf.train.Server.create_local_server()
sess = tf.Session(server.target)
print sess.run(c)


##############################################################################
# 创建两个集群
# 当一个TensorFlow集群有多个任务时，需要使用tf.train.ClusterSpec来指定运行每一个任务的机器

c = tf.constant("Hello from server1!")
# 生成－个有两个任务的集群，一个任务跑在本地2222端口，另外一个跑在本地2223端口
cluster = tf.train.ClusterSpec({"local": ["localhost:2222", "localhost:2223"]})
# 通过上面生成的集群配置生成Server，并通过job_name和task_index指定当前所启动的任务。因为该任务是第一个任务，所以task_index为0
server = tf.train.Server(cluster, job_name="local", task_index=0)
# 通过server.target生成会话来使用TensorFlow集群中的资源。通过设置log_device_placement可以看到执行每一个操作的任务。
sess = tf.Session(server.target, config=tf.ConfigProto(log_device_placement=True)) 
print sess.run(c)
server.join()

import tensorflow as tf
c = tf.constant("Hello from server2!")
cluster = tf.train.ClusterSpec({"local": ["localhost:2222", "localhost:2223"]})
# 指定task_index为 1 ，所以这个程序将在localhost:2223启动服务
server = tf.train.Server(cluster, job_name="local", task_index=1)
sess = tf.Session(server.target, config=tf.ConfigProto(log_device_placement=True)) 
print sess.run(c)
server.join()
```

![afyjrS](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/afyjrS.png)

#### 分布式TensorFlow模型训练

```python
# -*- coding: utf-8 -*-
"""
异步更新模式样例程序
"""
import time
import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data

import mnist_inference

# 配置神经网络的参数。
BATCH_SIZE = 100
LEARNING_RATE_BASE = 0.01
LEARNING_RATE_DECAY = 0.99
REGULARAZTION_RATE = 0.0001
TRAINING_STEPS = 20000
MOVING_AVERAGE_DECAY = 0.99

# 模型保存的路径。
MODEL_SAVE_PATH = "logs/log_async"
# MNIST数据路径。
DATA_PATH = "../../datasets/MNIST_data"

# 通过flags指定运行的参数。在12.4.1小节中对于不同的任务（task）给出了不同的程序，
# 但这不是一种可扩展的方式。在这一小节中将使用运行程序时给出的参数来配置在不同
# 任务中运行的程序。
FLAGS = tf.app.flags.FLAGS

# 指定当前运行的是参数服务器还是计算服务器。参数服务器只负责TensorFlow中变量的维护
# 和管理，计算服务器负责每一轮迭代时运行反向传播过程。
tf.app.flags.DEFINE_string('job_name', 'worker', ' "ps" or "worker" ')
# 指定集群中的参数服务器地址。
tf.app.flags.DEFINE_string(
    'ps_hosts', ' tf-ps0:2222,tf-ps1:1111',
    'Comma-separated list of hostname:port for the parameter server jobs. e.g. "tf-ps0:2222,tf-ps1:1111" ')
# 指定集群中的计算服务器地址。
tf.app.flags.DEFINE_string(
    'worker_hosts', ' tf-worker0:2222,tf-worker1:1111',
    'Comma-separated list of hostname:port for the worker jobs. e.g. "tf-worker0:2222,tf-worker1:1111" ')
# 指定当前程序的任务ID。TensorFlow会自动根据参数服务器/计算服务器列表中的端口号
# 来启动服务。注意参数服务器和计算服务器的编号都是从0开始的。
tf.app.flags.DEFINE_integer('task_id', 0, 'Task ID of the worker/replica running the training.')

# 定义TensorFlow的计算图，并返回每一轮迭代时需要运行的操作。这个过程和5.5节中的主
# 函数基本一致，但为了使处理分布式计算的部分更加突出，本小节将此过程整理为一个函数。
def build_model(x, y_, is_chief):
    regularizer = tf.contrib.layers.l2_regularizer(REGULARAZTION_RATE)
    # 通过和5.5节给出的mnist_inference.py代码计算神经网络前向传播的结果。
    y = mnist_inference.inference(x, regularizer)
    global_step = tf.contrib.framework.get_or_create_global_step()

    # 计算损失函数并定义反向传播过程。
    cross_entropy = tf.nn.sparse_softmax_cross_entropy_with_logits(logits=y, labels=tf.argmax(y_, 1))
    cross_entropy_mean = tf.reduce_mean(cross_entropy)
    loss = cross_entropy_mean + tf.add_n(tf.get_collection('losses'))
    learning_rate = tf.train.exponential_decay(
        LEARNING_RATE_BASE,
        global_step,
        60000 / BATCH_SIZE,
        LEARNING_RATE_DECAY)
    
    train_op = tf.train.GradientDescentOptimizer(learning_rate).minimize(
        loss, global_step=global_step)

    # 定义每一轮迭代需要运行的操作。
    if is_chief:
        # 计算变量的滑动平均值。   
        variable_averages = tf.train.ExponentialMovingAverage(
            MOVING_AVERAGE_DECAY, global_step)
        variables_averages_op = variable_averages.apply(
            tf.trainable_variables())
        with tf.control_dependencies([variables_averages_op, train_op]):
            train_op = tf.no_op()
    return global_step, loss, train_op

def main(argv=None):
    # 解析flags并通过tf.train.ClusterSpec配置TensorFlow集群。
    ps_hosts = FLAGS.ps_hosts.split(',')
    worker_hosts = FLAGS.worker_hosts.split(',')
    cluster = tf.train.ClusterSpec({"ps": ps_hosts, "worker": worker_hosts})
    # 通过tf.train.ClusterSpec以及当前任务创建tf.train.Server。
    server = tf.train.Server(cluster,
                             job_name=FLAGS.job_name,
                             task_index=FLAGS.task_id)

    # 参数服务器只需要管理TensorFlow中的变量，不需要执行训练的过程。server.join()会
    # 一致停在这条语句上。
    if FLAGS.job_name == 'ps':
        with tf.device("/cpu:0"):
            server.join()

    # 定义计算服务器需要运行的操作。
    is_chief = (FLAGS.task_id == 0)
    mnist = input_data.read_data_sets(DATA_PATH, one_hot=True)

    # 通过tf.train.replica_device_setter函数来指定执行每一个运算的设备。
    # tf.train.replica_device_setter函数会自动将所有的参数分配到参数服务器上，而
    # 计算分配到当前的计算服务器上。图12-9展示了通过TensorBoard可视化得到的第一个计
    # 算服务器上运算分配的结果。
    device_setter = tf.train.replica_device_setter(
        worker_device="/job:worker/task:%d" % FLAGS.task_id,
        cluster=cluster)
    
    with tf.device(device_setter):
        # 定义输入并得到每一轮迭代需要运行的操作。
        x = tf.placeholder(tf.float32, [None, mnist_inference.INPUT_NODE], name='x-input')
        y_ = tf.placeholder(tf.float32, [None, mnist_inference.OUTPUT_NODE], name='y-input')
        global_step, loss, train_op = build_model(x, y_, is_chief)

        hooks=[tf.train.StopAtStepHook(last_step=TRAINING_STEPS)]
        sess_config = tf.ConfigProto(allow_soft_placement=True,
                                     log_device_placement=False)

        # 通过tf.train.MonitoredTrainingSession管理训练深度学习模型的通用功能。
        with tf.train.MonitoredTrainingSession(master=server.target,
                                               is_chief=is_chief,
                                               checkpoint_dir=MODEL_SAVE_PATH,
                                               hooks=hooks,
                                               save_checkpoint_secs=60,
                                               config=sess_config) as mon_sess:
            print "session started."
            step = 0
            start_time = time.time()

            # 执行迭代过程。在迭代过程中tf.train.MonitoredTrainingSession会帮助完成初始
            # 化、从checkpoint中加载训练过的模型、输出日志并保存模型， 所以下面的程序中不需要
            # 在调用这些过程。tf.train.StopAtStepHook会帮忙判断是否需要退出。
            while not mon_sess.should_stop():                
                xs, ys = mnist.train.next_batch(BATCH_SIZE)
                _, loss_value, global_step_value = mon_sess.run(
                    [train_op, loss, global_step], feed_dict={x: xs, y_: ys})

                # 每隔一段时间输出训练信息。不同的计算服务器都会更新全局的训练轮数，所以这里使用
                # global_step_value得到在训练中使用过的batch的总数。
                if step > 0 and step % 100 == 0:
                    duration = time.time() - start_time
                    sec_per_batch = duration / global_step_value
                    format_str = "After %d training steps (%d global steps), " +\
                                 "loss on training batch is %g. (%.3f sec/batch)"
                    print format_str % (step, global_step_value, loss_value, sec_per_batch)
                step += 1

if __name__ == "__main__":
    tf.app.run()
```

![ICEZ5r](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ICEZ5r.png)

```python
# -*- coding: utf-8 -*-
"""
同步更新模式样例程序
"""
import time
import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data

import mnist_inference

# 配置神经网络的参数。
BATCH_SIZE = 100
LEARNING_RATE_BASE = 0.01
LEARNING_RATE_DECAY = 0.99
REGULARAZTION_RATE = 0.0001
TRAINING_STEPS = 20000
MOVING_AVERAGE_DECAY = 0.99

MODEL_SAVE_PATH = "logs/log_sync"
DATA_PATH = "../../datasets/MNIST_data"

# 和异步模式类似的设置flags。
FLAGS = tf.app.flags.FLAGS

tf.app.flags.DEFINE_string('job_name', 'worker', ' "ps" or "worker" ')
tf.app.flags.DEFINE_string(
    'ps_hosts', ' tf-ps0:2222,tf-ps1:1111',
    'Comma-separated list of hostname:port for the parameter server jobs. e.g. "tf-ps0:2222,tf-ps1:1111" ')
tf.app.flags.DEFINE_string(
    'worker_hosts', ' tf-worker0:2222,tf-worker1:1111',
    'Comma-separated list of hostname:port for the worker jobs. e.g. "tf-worker0:2222,tf-worker1:1111" ')
tf.app.flags.DEFINE_integer('task_id', 0, 'Task ID of the worker/replica running the training.')

# 和异步模式类似的定义TensorFlow的计算图。唯一的区别在于使用
# tf.train.SyncReplicasOptimizer函数处理同步更新。
def build_model(x, y_, n_workers, is_chief):
    regularizer = tf.contrib.layers.l2_regularizer(REGULARAZTION_RATE)
    y = mnist_inference.inference(x, regularizer)
    global_step = tf.contrib.framework.get_or_create_global_step()

    cross_entropy = tf.nn.sparse_softmax_cross_entropy_with_logits(logits=y, labels=tf.argmax(y_, 1))
    cross_entropy_mean = tf.reduce_mean(cross_entropy)
    loss = cross_entropy_mean + tf.add_n(tf.get_collection('losses'))
    learning_rate = tf.train.exponential_decay(
        LEARNING_RATE_BASE,
        global_step,
        60000 / BATCH_SIZE,
        LEARNING_RATE_DECAY)
    
    # 通过tf.train.SyncReplicasOptimizer函数实现同步更新。
    opt = tf.train.SyncReplicasOptimizer(
        tf.train.GradientDescentOptimizer(learning_rate),
        replicas_to_aggregate=n_workers,
        total_num_replicas=n_workers)
    sync_replicas_hook = opt.make_session_run_hook(is_chief)
    train_op = opt.minimize(loss, global_step=global_step)
    
    if is_chief:
        variable_averages = tf.train.ExponentialMovingAverage(
            MOVING_AVERAGE_DECAY, global_step)
        variables_averages_op = variable_averages.apply(
            tf.trainable_variables())
        with tf.control_dependencies([variables_averages_op, train_op]):
            train_op = tf.no_op()
            
    return global_step, loss, train_op, sync_replicas_hook

def main(argv=None):
    # 和异步模式类似的创建TensorFlow集群。
    ps_hosts = FLAGS.ps_hosts.split(',')
    worker_hosts = FLAGS.worker_hosts.split(',')
    n_workers = len(worker_hosts)
    cluster = tf.train.ClusterSpec({"ps": ps_hosts, "worker": worker_hosts})

    server = tf.train.Server(cluster,
                             job_name=FLAGS.job_name,
                             task_index=FLAGS.task_id)

    if FLAGS.job_name == 'ps':
        with tf.device("/cpu:0"):
            server.join()

    is_chief = (FLAGS.task_id == 0)
    mnist = input_data.read_data_sets(DATA_PATH, one_hot=True)

    device_setter = tf.train.replica_device_setter(
        worker_device="/job:worker/task:%d" % FLAGS.task_id,
        cluster=cluster)
    
    with tf.device(device_setter):
        x = tf.placeholder(tf.float32, [None, mnist_inference.INPUT_NODE], name='x-input')
        y_ = tf.placeholder(tf.float32, [None, mnist_inference.OUTPUT_NODE], name='y-input')
        global_step, loss, train_op, sync_replicas_hook = build_model(x, y_, n_workers, is_chief)

        # 把处理同步更新的hook也加进来。
        hooks=[sync_replicas_hook, tf.train.StopAtStepHook(last_step=TRAINING_STEPS)]
        sess_config = tf.ConfigProto(allow_soft_placement=True,
                                     log_device_placement=False)

        # 训练过程和异步一致。
        with tf.train.MonitoredTrainingSession(master=server.target,
                                               is_chief=is_chief,
                                               checkpoint_dir=MODEL_SAVE_PATH,
                                               hooks=hooks,
                                               save_checkpoint_secs=60,
                                               config=sess_config) as mon_sess:
            print "session started."
            step = 0
            start_time = time.time()

            while not mon_sess.should_stop():                
                xs, ys = mnist.train.next_batch(BATCH_SIZE)
                _, loss_value, global_step_value = mon_sess.run(
                    [train_op, loss, global_step], feed_dict={x: xs, y_: ys})

                if step > 0 and step % 100 == 0:
                    duration = time.time() - start_time
                    sec_per_batch = duration / global_step_value
                    format_str = "After %d training steps (%d global steps), " +\
                                 "loss on training batch is %g. (%.3f sec/batch)"
                    print format_str % (step, global_step_value, loss_value, sec_per_batch)
                step += 1

if __name__ == "__main__":
    tf.app.run()
```

![sqN1nX](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/sqN1nX.png)

