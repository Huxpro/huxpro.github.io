---
title: "Wide and Deep"
subtitle: "RecommendationSystemFundamentals"
layout: post
author: "echisenyang"
header-style: text
hidden: false
catalog: true
tags:
  - 推荐系统

---







##  Wide and Deep

### 1.点击率预估

**是什么：**

点击率预估是对每次广告点击情况作出预测，可以输出点击或者不点击，也可以输出该次点击的概率，后者有时候也称为pClick。

**需要做什么：**

点击率预估问题就是一个二分类的问题，在机器学习中可以使用逻辑回归作为模型的输出，其输出的就是一个概率值，我们可以将机器学习输出的这个概率值认为是某个用户点击某个广告的概率。

**点击率评估与推荐算法的差别：**

广告点击率预估是需要得到某个用户对某个广告的点击率，然后结合广告的出价用于排序；而推荐算法很多大多数情况下只需要得到一个最优的推荐次序，即TopN推荐的问题。当然也可以利用广告的点击率来排序，作为广告的推荐。

**FM模型的不足：**

之前我们已经学了FM模型，不是已经很好了吗，为啥还要整这个Wide&Deep呢？其缺点在于：当query-item矩阵是稀疏并且是high-rank的时候（比如user有特殊的爱好，或item比较小众），很难非常效率的学习出低维度的表示。这种情况下，大部分的query-item都没有什么关系。但是dense embedding会导致几乎所有的query-item预测值都是非0的，这就导致了推荐过度泛化，会推荐一些不那么相关的物品。相反，简单的linear model却可以通过cross-product transformation来记住这些**exception rules**，cross-product transformation是什么意思后面再提。

简而言之，就是特征太多导致有意义的特征（这里就是爱好或者item比较小众）的效果被稀释，最后所有item的预测、推荐值都是非0，就推荐不出有意义的结果



### 2.Wide & Deep模型的“记忆能力”与“泛化能力”

Memorization 和 Generalization是推荐系统很常见的两个概念，其中Memorization指的是通过用户与商品的交互信息矩阵学习规则，而Generalization则是泛化规则。我们前面介绍的FM算法就是很好的Generalization的例子，它可以根据交互信息学习到一个比较短的矩阵 V ，其中 vi 储存着每个用户特征的压缩表示（embedding），而协同过滤与SVD都是靠记住用户之前与哪些物品发生了交互从而推断出的推荐结果，这两者推荐结果当然存在一些差异，我们的Wide&Deep模型就能够融合这两种推荐结果做出最终的推荐，得到一个比之前的推荐结果都好的模型。 

融合怪！也就是要既有泛化性能，也要充分通过用户与商品信息交互来得到结论。Memorization趋向于更加保守，推荐用户之前有过行为的items。相比之下，generalization更加趋向于提高推荐系统的多样性（diversity）。Memorization只需要使用一个线性模型即可实现，而Generalization需要使用DNN实现。

如何根据自己的场景去选择那些特征放在Wide部分，哪些特征放在Deep部分，就是用好这一模型的关键了

wide部分是一个广义的线性模型，输入的特征主要有两部分组成，一部分是原始的部分特征，另一部分是原始特征的交互特征(cross-product transformation)，对于交互特征可以定义为：
$$
\phi_{k}(x)=\prod_{i=1}^d x_i^{c_{ki}}, c_{ki}\in \{0,1\}
$$
这个式子中$x_i^{c_{ki}} $项连乘，如果两个特征都同时为1这个新的特征才能为1，否则就是0

对于wide部分训练时候使用的优化器是带 L1 正则的FTRL算法(Follow-the-regularized-leader)，而L1 FTLR是非常注重模型稀疏性质的，也就是说W&D模型采用L1 FTRL是想让Wide部分变得更加的稀疏，即Wide部分的大部分参数都为0，这就大大压缩了模型权重及特征向量的维度。**Wide部分模型训练完之后留下来的特征都是非常重要的，那么模型的“记忆能力”就可以理解为发现"直接的"，“暴力的”，“显然的”关联规则的能力。** 例如Google W&D期望wide部分发现这样的规则：**用户安装了应用A，此时曝光应用B，用户安装应用B的概率大。**

Deep部分是一个DNN模型，输入的特征主要分为两大类，一类是数值特征(可直接输入DNN)，一类是类别特征(需要经过Embedding之后才能输入到DNN中)，Deep部分的数学形式如下：
$$
a^{(l+1)} = f(W^{l}a^{(l)} + b^{l})
$$
**DNN模型随着层数的增加，中间的特征就越抽象，也就提高了模型的泛化能力。** 对于Deep部分的DNN模型作者使用了深度学习常用的优化器AdaGrad，这也是为了使得模型可以得到更精确的解。

W&D模型是将两部分输出的结果结合起来联合训练，将deep和wide部分的输出重新使用一个逻辑回归模型做最终的预测，输出概率值。联合训练的数学形式如下： $$ P(Y=1|x)=\delta(w_{wide}^T[x,\phi(x)] + w_{deep}^T a^{(lf)} + b) $$



### 3.流程

**Retrieval **：利用机器学习模型和一些人为定义的规则，来返回最匹配当前Query的一个小的items集合，这个集合就是最终的推荐列表的候选集。

**Ranking**：

- 收集更细致的用户特征，如：

  - User features（年龄、性别、语言、民族等）
  - Contextual features(上下文特征：设备，时间等)
  - Impression features（展示特征：app age、app的历史统计信息等）

- 将特征分别传入Wide和Deep

  一起做训练

  。在训练的时候，根据最终的loss计算出gradient，反向传播到Wide和Deep两部分中，分别训练自己的参数（wide组件只需要填补deep组件的不足就行了，所以需要比较少的cross-product feature transformations，而不是full-size wide Model）

  - 训练方法是用mini-batch stochastic optimization。
  - Wide组件是用FTRL（Follow-the-regularized-leader） + L1正则化学习。
  - Deep组件是用AdaGrad来学习。

- 训练完之后推荐TopN

  重点：**要深入理解业务，确定wide部分使用哪部分特征，deep部分使用哪些特征，以及wide部分的交叉特征应该如何去选择**

  

### 4.使用numpy实现Wide & Deep

参考：https://zhuanlan.zhihu.com/p/53110408

**咱就是把大佬的思路和代码copy来看一看研究一下**：重点是embedding的过程

要点：

如何兼顾记忆与扩展、如何处理高维、稀疏的类别特征、如何实现特征交叉

关键点：

模块化设计

Embedding的稀疏实现

Embedding的权重共享

首先是把用户的动作转换为模型：

我们从“活跃App”+“新安装App”+“卸载App”三个方面来描述一个用户的手机使用习惯。而每个方面可以用“微信:0.9，微博:0.5，淘宝:0.3，……”这样的ke-value-pair来表示

- “活跃App”, “新安装App”, “卸载App”被称为三个**Field**
- “活跃 微信"，"安装 微博"，"卸载 淘宝”被称为**Feature**，分别隶属于某个Field。在经过字典映射后，每个Feature都有自己的feature id（整数）和feature value（浮点数）
- “微信"，"微博"，"淘宝”都来自一个叫“App”的**Vocabulary**。在以上例子中，App Vocabulary为“活跃App”, “新安装App”, “卸载App”三个Field所共享

这其中最重要的思想就是Feature，每个特征的id和属性值的量化Vocabulary

最上层是一个线性回归模型：
$$
Logit = {Logit}_{deep} + {Logit}_{wide} = {Logit}_{deep}+\Sigma{Logit}_{field}
$$
Wide主要功能是“记忆”，所以常接入一些ID类的特征，非常稀疏，所以需要使用FTRL算法来优化，以充分利用数据的稀疏性，并使得到的权重尽可能稀疏。

**将每个Field单独划分成一个模块**:

- 代码清晰、易读

- 方便扩展。比如某个Field下新增/删除了一个Feature，只有这个Field下的Feature需要重新编号，其他Field不受影响。

- 各个Field之间可以并行计算

  

Deep侧与Wide侧两个模块是如何设计的：

设计主要考虑的是代码复用，**同样的Deep侧与Wide侧代码，既能合起来实现Wide & Deep，也能够单独使用来实现DNN与LR**。

DNN是基于Mini-Batch优化的，而Wide侧使用的FTRL是一个Online Learning算法。Wide侧得到某个样本的Wide_Logit之后，需要与Deep侧得到的Deep_Logit相加，得到总的Logit之后，才能计算梯度，才能更新权重。

让外界传入一个proba_fn函数来根据logit计算概率。视Wide单独使用还是与Deep联合使用，proba_fn实现如下两种逻辑

- 当Wide侧单独使用来实现LR时，probability=sigmoid(logit)

- 在Wide & Deep中，

- - Deep侧先完成前代，得到这个batch下所有样本的Deep_Logits。

  - Wide侧在逐一学习每个样本时，先得到这条样本的Wide_Logit，再去已经计算好的Deep_Logits中找到这条样本的Deep_Logit，probability=sigmoid(wide_logit+deep_logit)

  - 再计算梯度，开始回代。

    

详细代码：

```python
class WideDeepEstimator(BaseEstimator):
    def __init__(self, wide_hparams, deep_hparams, data_source):
        self._current_deep_logits = None

        self._wide_layer = WideLayer(......,
                                     proba_fn=self._predict_proba)

        self._dnn = DeepNetwork(......)

        super().__init__(data_source)

    def _predict_proba(self, example_idx, wide_logit):
        deep_logit = self._current_deep_logits[example_idx]
        logit = deep_logit + wide_logit
        return 1 / (1 + np.exp(-logit))

    def train_batch(self, features, labels):
        self._current_deep_logits = self._dnn.forward(features)

        pred_probas = self._wide_layer.train(features, labels)

        self._dnn.backward(grads2logits=pred_probas - labels)

        return pred_probas
```

这其中_predict_proba函数接受了deep侧的的logit，并计算总的logit，最后用sigmoid函数输出值。

正如我之前所论述的，深度学习在推荐、搜索领域的运用，是围绕着稀疏的ID类特征所展开的，其主要方法就是Embedding，变ID类特征的“精确匹配”为“模糊查找”，以增强扩展。与传统MLP接收稠密输入不同，Embedding的输入高维且稀疏，One/Multi-Hot-Encoding之后进行矩阵运算代价太大，所以需要实现**稀疏的前代与回代**。推荐系统中，一个Field下往往有多个Feature，Embedding是将多个Feature Embedding合并成一个向量，即所谓的**Pooling**。

- example_indices: 是[n_non_zeros]的整数数组，表示样本在batch中的序号。而且要求其中的数值是从小到大排好序的

- feature_ids: 是[n_non_zeros]的整数数组，表示非零特征的序号，**可以重复**

- feature_values: 是[n_non_zeros]的浮点数组，表示非零特征的数值

  

```python
class EmbeddingLayer:
    def __init__(self, W, vocab_name, field_name):
        """
        :param W: dense weight matrix, [vocab_size,embed_size]
        :param b: bias, [embed_size]
        """
        self.vocab_name = vocab_name
        self.field_name = field_name
        self._W = W
        self._last_input = None

    def forward(self, X):
        """
        :param X: SparseInput
        :return: [batch_size, embed_size]
        """
        self._last_input = X

        # output: [batch_size, embed_size]
        output = np.zeros((X.n_total_examples, self._W.shape[1]))

        for example_idx, feat_id, feat_val in X.iterate_non_zeros():
            embedding = self._W[feat_id, :]
            output[example_idx, :] += embedding * feat_val

        return output

    def backward(self, prev_grads):
        """
        :param prev_grads: [batch_size, embed_size]
        :return: dw
        """
        dW = {}

        for example_idx, feat_id, feat_val in self._last_input.iterate_non_zeros():
            # [1,embed_size]
            grad_from_one_example = prev_grads[example_idx, :] * feat_val

            if feat_id in dW:
                dW[feat_id] += grad_from_one_example

            else:
                dW[feat_id] = grad_from_one_example

        return dW
```

在前向传播中原始输入中的非零特征self._W[feat_id, :]与后向传播中dW[feat_id]参与计算

利用计算好的导数对权重进行修正时，对**Embedding矩阵的梯度进行特殊处理，只更新局部**，见optimization.py中Adagrad.update函数。

```python
class Adagrad:
    def __init__(self, lr):
        self._lr = lr
        # variable name => sum of gradient square (also a vector)
        self._sum_grad2 = {}

    def update(self, variables, gradients):
        for gradname, gradient in gradients.items():
            # ------ update cache
            g2 = gradient * gradient
            if gradname in self._sum_grad2:
                self._sum_grad2[gradname] += g2
            else:
                self._sum_grad2[gradname] = g2

            # ------ calculate delta
            delta = self._lr * gradient / (np.sqrt(self._sum_grad2[gradname]) + 1e-6)

            # ------ update
            if '@' in gradname:
                # 对应着稀疏输入的权重与梯度，gradients中的key遵循着'vocab_name@feat_id'的格式
                varname, row = gradname.split('@')
                row = int(row)

                variable = variables[varname]
                variable[row, :] -= delta
            else:
                variable = variables[gradname]
                variable -= delta
```

### **Embedding的权重共享**

多个Field可能共享一个Vocabulary

```python
class EmbeddingCombineLayer:
    def __init__(self, vocab_infos):
        """
        :param vocab_infos: a list of tuple, each tuple is (vocab_name, vocab_size, embed_size)
        """
        self._weights = {}  # vocab_name ==> weight
        for vocab_name, vocab_size, embed_size in vocab_infos:
            stddev = 1 / np.sqrt(embed_size)
            initializer = TruncatedNormal(mean=0,stddev=stddev,lower=-2 * stddev,upper=2 * stddev)
            self._weights[vocab_name] = initializer(shape=[vocab_size, embed_size])

    def add_embedding(self, vocab_name, field_name):
        weight = self._weights[vocab_name]
        layer = EmbeddingLayer(W=weight, vocab_name=vocab_name, field_name=field_name)
        self._embed_layers.append(layer)
```

- 聚合梯度，比如**“活跃App”中对“微信”有梯度，“新安装App”对“微信”也有梯度，最终“微信”embedding向量的梯度应该是以上二者之和**。

```python
def backward(self, prev_grads):
        """
        :param prev_grads:  [batch_size, sum of all embed-layer's embed_size]
                            上一层传入的, Loss对本层输出的梯度
        """
        assert prev_grads.shape[1] == self.output_dim

        # 因为output是每列输出的拼接，自然上一层输入的导数也是各层所需要导数的拼接
        # prev_grads_splits是一个数组，存储对应各层的导数
        col_sizes = [layer.output_dim for layer in self._embed_layers]
        prev_grads_splits = utils.split_column(prev_grads, col_sizes)

        self._grads_to_embed.clear()  # reset
        for layer, layer_prev_grads in zip(self._embed_layers, prev_grads_splits):
            # layer_prev_grads: 上一层传入的，Loss对某个layer的输出的梯度
            # layer_grads_to_feat_embed: dict, feat_id==>grads，
            # 由这一个layer造成对某vocab的embedding矩阵的某feat_id对应行的梯度
            layer_grads_to_embed = layer.backward(layer_prev_grads)

            for feat_id, g in layer_grads_to_embed.items():
                # 表示"对某个vocab的embedding weight中的第feat_id行的总导数"
                key = "{}@{}".format(layer.vocab_name, feat_id)

                if key in self._grads_to_embed:
                    self._grads_to_embed[key] += g
                else:
                    self._grads_to_embed[key] = g
```

Dnn的实现分析：forward和backward

forward中先拼接了dense_input和embed_input,然后输出转换过维度的拼接结果。

```python
    def forward(self, features):
        """
        :param features: dict, mapping from field=>dense ndarray or field=>SparseInput
        :return: logits, [batch_size]
        """
        dense_input = self._dense_combine_layer.forward(features)

        embed_input = self._embed_combine_layer.forward(features)

        X = np.hstack([dense_input, embed_input])

        for hidden_layer in self._hidden_layers:
            X = hidden_layer.forward(X)

        return X.flatten()

    def backward(self, grads2logits):
        """
        :param grads2logits: gradients from loss to logits, [batch_size]
        """
        # ***************** 计算所有梯度
        prev_grads = grads2logits.reshape([-1, 1])  # reshape to [batch_size,1]

        # iterate hidden layers backwards
        for hidden_layer in self._hidden_layers[::-1]:
            prev_grads = hidden_layer.backward(prev_grads)

        col_sizes = [self._dense_combine_layer.output_dim, self._embed_combine_layer.output_dim]
        # 抛弃第一个split，因为其对应的是input，无可优化
        _, grads_for_all_embedding = utils.split_column(prev_grads, col_sizes)

        self._embed_combine_layer.backward(grads_for_all_embedding)

        # ***************** 优化
        # 这个操作必须每次backward都调用，这是因为，尽管dense部分的权重是固定的
        # 但是sparse部分，要优化哪个变量，是随着输入不同而不同的
        all_vars, all_grads2var = {}, {}
        for opt_layer in self._optimize_layers:
            all_vars.update(opt_layer.variables)
            all_grads2var.update(opt_layer.grads2var)

        self._optimizer.update(variables=all_vars, gradients=all_grads2var)

```

