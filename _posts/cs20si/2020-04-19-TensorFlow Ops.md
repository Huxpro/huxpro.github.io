---
title: "TensorFlow Ops"
subtitle: "CS 20SI「02」"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - 笔记
  - CS20SI
  - TensorFlow
---



## TensorFlow Ops

本章安排

1. Basic operations 
2. Tensor types 
3. Project speed dating 
4. Placeholders and feeding inputs 
5. Lazy loading 



### Basic operations 

- Visualize it with TensorBoard

  Learn to use TensorBoard well and often. It will help a lot when you build complicated models.


```python
writer = tf.summary.FileWriter('./graphs, sess.graph)
                               
tensorboard --logdir="./graphs" --host=localhost --port 6006
```

- Explicitly name them

```python
a = tf.constant(2, name="a") 
b = tf.constant(3, name="b")
```

- More constants

```python
# tf.constant(value, dtype=None, shape=None, name='Const', verify_shape=False)
a = tf.constant([2, 2], name="a")
b = tf.constant([[0, 1], [2, 3]], name="b")
```

- Tensors filled with a specific value

```python
# tf.zeros(shape, dtype=tf.float32, name=None)
tf.zeros([2, 3], tf.int32) ==> [[0, 0, 0], [0, 0, 0]]

# tf.zeros_like(input_tensor, dtype=None, name=None, optimize=True)
# input_tensor is [0, 1], [2, 3], [4, 5]] 
tf.zeros_like(input_tensor) ==> [[0, 0], [0, 0], [0, 0]]

tf.ones(shape, dtype=tf.float32, name=None) 
tf.ones_like(input_tensor, dtype=None, name=None, optimize=True)

# tf.fill(dims, value, name=None)
tf.fill([2, 3], 8) ==> [[8, 8, 8], [8, 8, 8]]
```

- Constants as sequences

```python
# tf.linspace(start, stop, num, name=None) # slightly different from np.linspace
tf.linspace(10.0, 13.0, 4) ==> [10.0 11.0 12.0 13.0] 

# tf.range(start, limit=None, delta=1, dtype=None, name='range') 
# 'start' is 3, 'limit' is 18, 'delta' is 3 
tf.range(start, limit, delta) ==> [3, 6, 9, 12, 15] 
# 'limit' is 5 
tf.range(limit) ==> [0, 1, 2, 3, 4]
```

- Randomly Generated Constants

  `tf.set_random_seed(seed)` : 确保实验结果可以复现

```python
tf.random_normal(shape, mean=0.0, stddev=1.0, dtype=tf.float32, seed=None, name=None) tf.truncated_normal(shape, mean=0.0, stddev=1.0, dtype=tf.float32, seed=None, name=None) 
tf.random_uniform(shape, minval=0, maxval=None, dtype=tf.float32, seed=None, name=None) 
tf.random_shuffle(value, seed=None, name=None) 
tf.random_crop(value, size, seed=None, name=None) 
tf.multinomial(logits, num_samples, seed=None, name=None) 
tf.random_gamma(shape, alpha, beta=None, dtype=tf.float32, seed=None, name=None)
```

- Operations

![dLPAW7](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/dLPAW7.png)

```python
a = tf.constant([3, 6]) 
b = tf.constant([2, 2]) 

tf.add(a, b) # >> [5 8] 
tf.add_n([a, b, b]) # >> [7 10]. Equivalent to a + b + b 
tf.mul(a, b) # >> [6 12] because mul is element wise 
tf.matmul(a, b) # >> ValueError 
tf.matmul(tf.reshape(a, [1, 2]), tf.reshape(b, [2, 1])) # >> [[18]] 
tf.div(a, b) # >> [1 3] 
tf.mod(a, b) # >> [1 0]
```

### Tensor types 

- TensorFlow Data Types

```python
# 0-d tensor, or "scalar"
t_0 = 19 tf.zeros_like(t_0) # ==> 0 
tf.ones_like(t_0) # ==> 1

# 1-d tensor, or "vector"
t_1 = ['apple', 'peach', 'banana'] 
tf.zeros_like(t_1) # ==> ['' '' ''] 
tf.ones_like(t_1) # ==> TypeError: Expected string, got 1 of type 'int' instead.

# 2x2 tensor, or "matrix"
t_2 = [[True, False, False], [False, False, True], [False, True, False]] tf.zeros_like(t_2) # ==> 2x2 tensor, all elements are False 
tf.ones_like(t_2) # ==> 2x2 tensor, all elements are True
```

- TF vs NP Data Types

  - Do not use Python native types for tensors because TensorFlow has to infer Python type

  - Beware when using NumPy arrays because NumPy and TensorFlow might become not so compatible in the future!

```python
# TensorFlow integrates seamlessly with NumPy
tf.int32 == np.int32 # True

# Can pass numpy types to TensorFlow ops
tf.ones([2, 2], np.float32) # ⇒ [[1.0 1.0], [1.0 1.0]]

For tf.Session.run(fetches):
# If the requested fetch is a Tensor , then the output of will be a NumPy ndarray.
```

### Project speed dating 

- What’s wrong with constants?
  - Constants are stored in the graph definition
  - This makes loading graphs expensive when constants are big
  - Only use constants for primitive types. Use variables or readers for more data that requires more memory

### Placeholders and feeding inputs 

- Variables
  - tf.Variable is a class, but tf.constant is an op

```python
# create variable a with scalar value 
a = tf.Variable(2, name="scalar")

# create variable b as a vector 
b = tf.Variable([2, 3], name="vector")

# create variable c as a 2x2 matrix 
c = tf.Variable([[0, 1], [2, 3]], name="matrix")

# create variable W as 784 x 10 tensor, filled with zeros 
W = tf.Variable(tf.zeros([784,10]))

#tf.Variable holds several ops:
x = tf.Variable(...)
x.initializer # init op 
x.value() # read op 
x.assign(...) # write op 
x.assign_add(...) # and more
```

- You have to initialize your variables

```python
# The easiest way is initializing all variables at once:
init = tf.global_variables_initializer() 
with tf.Session() as sess:
	sess.run(init)
    
# Initialize only a subset of variables:
init_ab = tf.variables_initializer([a, b], name="init_ab") 
with tf.Session() as sess:
	sess.run(init_ab)
    
# Initialize a single variable
W = tf.Variable(tf.zeros([784,10])) 
with tf.Session() as sess:
	sess.run(W.initializer)
```

- Eval() a variable

```python
# W is a random 700 x 100 variable object 
W = tf.Variable(tf.truncated_normal([700, 10])) 
with tf.Session() as sess:
	sess.run(W.initializer) 
	print W
>>> Tensor("Variable/read:0", shape=(700, 10), dtype=float32)

	print W.eval()
>>> [[-0.76781619 -0.67020458 1.15333688 ..., -0.98434633 -1.25692499
-0.90904623] [-0.36763489 -0.65037876 -1.52936983 ..., 0.19320194 -0.38379928
0.44387451] [ 0.12510735 -0.82649058 0.4321366 ..., -0.3816964 0.70466036
1.33211911] ..., [ 0.9203397 -0.99590844 0.76853162 ..., -0.74290705 0.37568584
0.64072722] [-0.12753558 0.52571583 1.03265858 ..., 0.59978199 -0.91293705
-0.02646019] [ 0.19076447 -0.6...]]
```

- tf.Variable.assign()

```python
W = tf.Variable(10) 
W.assign(100) 
with tf.Session() as sess:
	W.assign(100) 
	sess.run(W.initializer) 
	print W.eval() # >> 10
	# doesn’t assign the value 100 to W. It creates an assign op, and that op needs to be run to take effect.

W = tf.Variable(10)
assign_op = W.assign(100)
with tf.Session() as sess:
	sess.run(W.initializer)
	sess.run(assign_op)
	print W.eval() # >> 100
    # You don’t need to initialize variable because assign_op does it for you
    
W = tf.Variable(10)
assign_op = W.assign(100) 
with tf.Session() as sess:
	sess.run(assign_op)
	print W.eval() # >> 100
	# In fact, initializer op is the assign op that assigns the variable’s initial value to the variable itself.
```

```python
# create a variable whose original value is 2 
my_var = tf.Variable(2, name="my_var")

# assign a * 2 to a and call that op a_times_two 
my_var_times_two = my_var.assign(2 * my_var)

with tf.Session() as sess:
    sess.run(my_var.initializer) 
    sess.run(my_var_times_two) # >> 4 
    sess.run(my_var_times_two) # >> 8 
    sess.run(my_var_times_two) # >> 16
	# It assign 2 * my_var to a every time my_var_times_two is fetched.


```

- Each session maintains its own copy of variable
  - your graph nothing's gonna happen, **the only time when things really happen (the memory gets allocated, the value filled in) is only you run this op within a session** 

```python
W = tf.Variable(10)
sess1 = tf.Session() 
sess2 = tf.Session()

sess1.run(W.initializer) 
sess2.run(W.initializer)

print sess1.run(W.assign_add(10)) # >> 20 
print sess2.run(W.assign_sub(2)) # >> 8
```

- Use a variable to initialize another variable

```python
# Want to declare U = W * 2

# W is a random 700 x 100 tensor 
W = tf.Variable(tf.truncated_normal([700, 10]))
U = tf.Variable(2 * W.intialized_value())

# ensure that W is initialized before its value is used to initialize U
```

- Session vs InteractiveSession
  - You sometimes see InteractiveSession instead of Session The only difference is an InteractiveSession makes itself the default

```python
sess = tf.InteractiveSession() 
a = tf.constant(5.0) 
b = tf.constant(6.0) 
c = a * b 
# We can just use 'c.eval()' without specifying the context 'sess' 
print(c.eval()) 
sess.close()
```

- Placeholders
  - Can assemble the graph first without knowing the values needed for computation
  - **A TF program often has 2 phases:**
    1. Assemble a graph
    2. Use a session to execute operations in the graph.

- Why placeholders?

  - We, or our clients, can later supply their own data when they need to execute the computation.

  - Feed the values to placeholders using a dictionary

  - Placeholders are valid ops

  - You can feed_dict any feedable tensor. Placeholder is just a way to indicate that

    something must be fed

```python
# create operations, tensors, etc (using the default graph) 
a = tf.add(2, 5) 
b = tf.mul(a, 3)

with tf.Session() as sess:
	# define a dictionary that says to replace the value of 'a' with 15 
	replace_dict = {a: 15}
	# Run the session, passing in 'replace_dict' as the value to 'feed_dict' 		
    sess.run(b, feed_dict=replace_dict) # returns 45
```

### The trap of lazy loading

Defer creating/initializing an object until it is needed

- solution
  1. Separate definition of ops from computing/running ops

  2. Use **Python property** to ensure function is also loaded once the first time it is called

```python
mport tensorflow as tf

class Test():
    def __init__(self):
        self.x = tf.Variable(10, name='x')
        self.y = tf.Variable(20, name='y')

    @property
    def add(self):
        self._value = tf.add(self.x,self.y)
        return self._value

with tf.Session() as sess:
    test = Test()
    sess.run(tf.global_variables_initializer())
    for _ in range(10):
        sess.run(test.add)
    print(tf.get_default_graph().as_graph_def())
    # writer = tf.summary.FileWriter("tensorboard_model",tf.get_default_graph())
    # writer.close()

# print
...
node {
  name: "Add_9"
  op: "Add"
  input: "x/read"
  input: "y/read"
  attr {
    key: "T"
    value {
      type: DT_INT32
    }
  }
}
...
```

![ngQpns](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ngQpns.jpg)

But we can use use a [custom decorators](https://blog.apcelent.com/python-decorator-tutorial-with-example.html) that behaves like `@property` to ensure that your function is only loaded once when it’s first called. The following code is from [Structuring Your TensorFlow Models](https://danijar.com/structuring-your-tensorflow-models/).

```python
import functools
def lazy_property(function):
    attribute = '_cache_' + function.__name__
    @property
    @functools.wraps(function)
    def decorator(self):
        if not hasattr(self, attribute):
            setattr(self, attribute, function(self))
        return getattr(self, attribute)
    return decorator
```

```python
@lazy_property
def add(self):
    self._value = tf.add(self.x,self.y)
    return self._value
```

![KNGppS](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/KNGppS.jpg)

