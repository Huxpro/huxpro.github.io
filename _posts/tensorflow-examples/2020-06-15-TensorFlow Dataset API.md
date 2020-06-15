---
title: "TensorFlow Dataset API"
subtitle: "TF EXAMPLES「5.2」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - TensorFlow
  - 输出计划
---



Introducing TensorFlow Dataset API for optimizing the input data pipeline.

```python
# Create a dataset tensor from the images and the labels
dataset = tf.data.Dataset.from_tensor_slices(
    (mnist.train.images, mnist.train.labels))
# Automatically refill the data queue when empty
dataset = dataset.repeat()
# Create batches of data
dataset = dataset.batch(batch_size)
# Prefetch data for faster consumption
dataset = dataset.prefetch(batch_size)

# Create an iterator over the dataset
iterator = dataset.make_initializable_iterator()
# Initialize the iterator
sess.run(iterator.initializer)

# Neural Net Input (images, labels)
X, Y = iterator.get_next()
```

