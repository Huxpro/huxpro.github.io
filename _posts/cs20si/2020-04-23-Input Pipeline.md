---
title: "Convolutional Neural Networks"
subtitle: "CS 20SI「09」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - 课程
  - TensorFlow
---



## Input Pipeline

- Example to demonstrate how to use queues

```python
""" Example to demonstrate how to use queues
"""
import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'

import numpy as np
import tensorflow as tf

N_SAMPLES = 1000
NUM_THREADS = 4
# Generating some simple data
# create 1000 random samples, each is a 1D array from the normal distribution (10, 1)
data = 10 * np.random.randn(N_SAMPLES, 4) + 1 
# create 1000 random labels of 0 and 1
target = np.random.randint(0, 2, size=N_SAMPLES) 

queue = tf.FIFOQueue(capacity=50, dtypes=[tf.float32, tf.int32], shapes=[[4], []])

enqueue_op = queue.enqueue_many([data, target])
data_sample, label_sample = queue.dequeue()

# create ops that do something with data_sample and label_sample

# create NUM_THREADS to do enqueue
qr = tf.train.QueueRunner(queue, [enqueue_op] * NUM_THREADS)
with tf.Session() as sess:
	# create a coordinator, launch the queue runner threads.
	coord = tf.train.Coordinator()
	enqueue_threads = qr.create_threads(sess, coord=coord, start=True)
	try:
		for step in range(100): # do to 100 iterations
			if coord.should_stop():
				break
			data_batch, label_batch = sess.run([data_sample, label_sample])
			print(data_batch)
			print(label_batch)
	except Exception as e:
		coord.request_stop(e)
	finally:
		coord.request_stop()
		coord.join(enqueue_threads)
```

- Examples to demonstrate how to write an image file to a TFRecord, and how to read a TFRecord file using TFRecordReader.

```python
""" Examples to demonstrate how to write an image file to a TFRecord,
and how to read a TFRecord file using TFRecordReader.
"""
import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'

import sys
sys.path.append('..')

from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf

# image supposed to have shape: 480 x 640 x 3 = 921600
IMAGE_PATH = 'data/'

def _int64_feature(value):
  return tf.train.Feature(int64_list=tf.train.Int64List(value=[value]))

def _bytes_feature(value):
  return tf.train.Feature(bytes_list=tf.train.BytesList(value=[value]))

def get_image_binary(filename):
    """ You can read in the image using tensorflow too, but it's a drag
        since you have to create graphs. It's much easier using Pillow and NumPy
    """
    image = Image.open(filename)
    image = np.asarray(image, np.uint8)
    shape = np.array(image.shape, np.int32)
    return shape.tobytes(), image.tobytes() # convert image to raw data bytes in the array.

def write_to_tfrecord(label, shape, binary_image, tfrecord_file):
    """ This example is to write a sample to TFRecord file. If you want to write
    more samples, just use a loop.
    """
    writer = tf.python_io.TFRecordWriter(tfrecord_file)
    # write label, shape, and image content to the TFRecord file
    example = tf.train.Example(features=tf.train.Features(feature={
                'label': _int64_feature(label),
                'shape': _bytes_feature(shape),
                'image': _bytes_feature(binary_image)
                }))
    writer.write(example.SerializeToString())
    writer.close()

def write_tfrecord(label, image_file, tfrecord_file):
    shape, binary_image = get_image_binary(image_file)
    write_to_tfrecord(label, shape, binary_image, tfrecord_file)

def read_from_tfrecord(filenames):
    tfrecord_file_queue = tf.train.string_input_producer(filenames, name='queue')
    reader = tf.TFRecordReader()
    _, tfrecord_serialized = reader.read(tfrecord_file_queue)

    # label and image are stored as bytes but could be stored as 
    # int64 or float64 values in a serialized tf.Example protobuf.
    tfrecord_features = tf.parse_single_example(tfrecord_serialized,
                        features={
                            'label': tf.FixedLenFeature([], tf.int64),
                            'shape': tf.FixedLenFeature([], tf.string),
                            'image': tf.FixedLenFeature([], tf.string),
                        }, name='features')
    # image was saved as uint8, so we have to decode as uint8.
    image = tf.decode_raw(tfrecord_features['image'], tf.uint8)
    shape = tf.decode_raw(tfrecord_features['shape'], tf.int32)
    # the image tensor is flattened out, so we have to reconstruct the shape
    image = tf.reshape(image, shape)
    label = tfrecord_features['label']
    return label, shape, image

def read_tfrecord(tfrecord_file):
    label, shape, image = read_from_tfrecord([tfrecord_file])

    with tf.Session() as sess:
        coord = tf.train.Coordinator()
        threads = tf.train.start_queue_runners(coord=coord)
        label, image, shape = sess.run([label, image, shape])
        coord.request_stop()
        coord.join(threads)
    print(label)
    print(shape)
    plt.imshow(image)
    plt.show() 

def main():
    # assume the image has the label Chihuahua, which corresponds to class number 1
    label = 1 
    image_file = IMAGE_PATH + 'friday.jpg'
    tfrecord_file = IMAGE_PATH + 'friday.tfrecord'
    write_tfrecord(label, image_file, tfrecord_file)
    read_tfrecord(tfrecord_file)

if __name__ == '__main__':
    main()
```

