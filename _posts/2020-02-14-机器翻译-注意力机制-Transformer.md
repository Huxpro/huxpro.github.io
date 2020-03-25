---
layout:     post
title:      PyTorch系列之机器翻译｜注意力机制｜Transformer
subtitle:   机器翻译｜注意力机制｜Transformer
date:       2020-02-14
author:     Young
header-img: img/1*CNzKOooCM4hQgK4Z89sQLQ.png
catalog: true
tags:
    - PyTorch
---

## Task04：机器翻译及相关技术｜注意力机制与Seq2seq模型｜Transformer

### 机器翻译

- **困难之处**：输出序列的长度可能与源序列的长度不同

- **padding**：每个batch的句子长度不一样，所以需要padding，padding后句子长度保持一致

  ```python
  def pad(line, max_len, padding_token):
      if len(line) > max_len:
          return line[:max_len]
      return line + [padding_token] * (max_len - len(line))
  ```

- **Sequence to Sequence模型**

  The sequence to sequence (seq2seq) model is based on the **encoder-decoder architecture** to **generate a sequence output for a sequence input**. Both the **encoder and the decoder use recurrent neural networks (RNNs) to handle sequence inputs of variable length**. The hidden state of the encoder is used directly to initialize the decoder hidden state to pass information from the encoder to the decoder.
  
  - **Train** 
  
  <p align="center">
    <img src="https://d2l.ai/_images/seq2seq.svg" style="zoom:100%" />
  </p>
  
  - **Predict** 
  
    <p align="center">
      <img src="https://d2l.ai/_images/seq2seq_predict.svg" style="zoom:100%" />
    </p>
  
    -  预测时decoder每个单元输出得到的单词作为下一个单元的输入单词
    -  预测时decoder单元输出为句子结束符时跳出循环
  
  - **Layers**
  
    <p align="center">
      <img src="https://d2l.ai/_images/seq2seq-details.svg" style="zoom:100%" />
    </p>
  
    ```
    class Seq2SeqEncoder(d2l.Encoder):
        def __init__(self, vocab_size, embed_size, num_hiddens, num_layers,
                     dropout=0, **kwargs):
            super(Seq2SeqEncoder, self).__init__(**kwargs)
            self.num_hiddens=num_hiddens
            self.num_layers=num_layers
            self.embedding = nn.Embedding(vocab_size, embed_size)
            self.rnn = nn.LSTM(embed_size,num_hiddens, num_layers, dropout=dropout)
       
        def begin_state(self, batch_size, device):
            return [torch.zeros(size=(self.num_layers, batch_size, self.num_hiddens),  device=device),torch.zeros(size=(self.num_layers, batch_size, self.num_hiddens),  device=device)]
            
        def forward(self, X, *args):
            X = self.embedding(X) # X shape: (batch_size, seq_len, embed_size)
            X = X.transpose(0, 1)  # RNN needs first axes to be time
            # state = self.begin_state(X.shape[1], device=X.device)
            out, state = self.rnn(X)
            # The shape of out is (seq_len, batch_size, num_hiddens).
            # state contains the hidden state and the memory cell
            # of the last time step, the shape is (num_layers, batch_size, num_hiddens)
            return out, state
    ```
  
    ```
    class Seq2SeqDecoder(d2l.Decoder):
        def __init__(self, vocab_size, embed_size, num_hiddens, num_layers,
                     dropout=0, **kwargs):
            super(Seq2SeqDecoder, self).__init__(**kwargs)
            self.embedding = nn.Embedding(vocab_size, embed_size)
            self.rnn = nn.LSTM(embed_size,num_hiddens, num_layers, dropout=dropout)
            self.dense = nn.Linear(num_hiddens,vocab_size)
    
        def init_state(self, enc_outputs, *args):
            return enc_outputs[1]
    
        def forward(self, X, state):
            X = self.embedding(X).transpose(0, 1)
            out, state = self.rnn(X, state)
            # Make the batch to be the first dimension to simplify loss computation.
            out = self.dense(out).transpose(0, 1)
            return out, state
    ```
  
- **<font color=red>Softmax屏蔽｜损失函数</font>** ：只用有效长度

  ```
  def SequenceMask(X, X_len,value=0):
  		"""
  		X_len为有效列数，对X中每行数据，超出对应有效列数的部分赋值为value
  		
  		>>> X = torch.tensor([[1,2,3], [4,5,6]])
  				SequenceMask(X,torch.tensor([1,2]))
  		>>> tensor([[1, 0, 0],
          				[4, 5, 0]])
  		"""
      maxlen = X.size(1)
      mask = torch.arange(maxlen)[None, :].to(X_len.device) < X_len[:, None]   
      X[~mask]=value
      return X
    
  
  class MaskedSoftmaxCELoss(nn.CrossEntropyLoss):
      # pred shape: (batch_size, seq_len, vocab_size)
      # label shape: (batch_size, seq_len)
      # valid_length shape: (batch_size, )
      def forward(self, pred, label, valid_length):
          # the sample weights shape should be (batch_size, seq_len)
          weights = torch.ones_like(label)
          weights = SequenceMask(weights, valid_length).float()
          self.reduction='none'
          output=super(MaskedSoftmaxCELoss, self).forward(pred.transpose(1,2), label)
          return (output*weights).mean(dim=1)
  ```
  
- Beam Search 要解决的问题

  - 贪心算法：只考虑当前时刻的局部最优解，没有考虑前后语义是否连贯（非全局最优解）

  - 集束搜索使用beam size参数来限制在每一步保留下来的可能性词的数量

  - 集束搜索结合了greedy search和维特比算法

    <p align="center">
      <img src="https://d2l.ai/_images/beam-search.svg" style="zoom:100%" />
    </p>

### python知识点

- **<font color=red>魔术方法</font>** 之`__getitem__`

  - **当实例对象通过[] 运算符取值时，会调用它的方法`__getitem__`**

  - 凡是在类中定义了这个`__getitem__` 方法，那么它的实例对象（假定为p），可以像这样

    p[key] 取值，当实例对象做p[key] 运算时，会调用类中的方法`__getitem__`。

    **一般如果想使用索引访问元素时，就可以在类中定义这个方法`（__getitem__(self, key) ）`。**

- **<font color=red>Python编程中NotImplementedError的使用</font>** 

  - Python编程中raise可以实现报出错误的功能，而报错的条件可以由程序员自己去定制。**在面向对象编程中，可以先预留一个方法接口不实现，在其子类中实现。如果要求其子类一定要实现，不实现的时候会导致问题，那么采用raise的方式就很好。而此时产生的问题分类是NotImplementedError**。

  - **Encoder-Decoder中的应用**

    <p align="center">
      <img src="https://d2l.ai/_images/encoder-decoder.svg" style="zoom:100%" />
    </p>

    - The encoder is a normal neural network that takes inputs, e.g., a source sentence, to return outputs.

      ```python
      class Encoder(nn.Module):
          def __init__(self, **kwargs):
              super(Encoder, self).__init__(**kwargs)
      
          def forward(self, X, *args):
              raise NotImplementedError
      ```

    - The decoder has an additional method `init_state` to parse the outputs of the encoder with possible additional information, e.g., the valid lengths of inputs, to return the state it needs. In the forward method, the decoder takes both inputs, e.g., a target sentence and the state. It returns outputs, with potentially modified state if the encoder contains RNN layers.

      ```python
      class Decoder(nn.Module):
          def __init__(self, **kwargs):
              super(Decoder, self).__init__(**kwargs)
      
          def init_state(self, enc_outputs, *args):
              raise NotImplementedError
      
          def forward(self, X, state):
              raise NotImplementedError
      ```

    - The encoder-decoder model contains both an encoder and a decoder. We implement its forward method for training. It takes both encoder inputs and decoder inputs, with optional additional arguments. During computation, it first computes encoder outputs to initialize the decoder state, and then returns the decoder outputs.

      ```python
      class EncoderDecoder(nn.Module):
          def __init__(self, encoder, decoder, **kwargs):
              super(EncoderDecoder, self).__init__(**kwargs)
              self.encoder = encoder
              self.decoder = decoder
      
          def forward(self, enc_X, dec_X, *args):
              enc_outputs = self.encoder(enc_X, *args)
              dec_state = self.decoder.init_state(enc_outputs, *args)
              return self.decoder(dec_X, dec_state)
      ```

      

### 注意力机制

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/vjKtq1.jpg" style="zoom:80%" />
</p>

<p align="center">
  <img src="https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/E2QWyP.jpg" style="zoom:80%" />
</p>

- 背景

  - 在“编码器—解码器（seq2seq）”⼀节⾥，解码器在各个时间步依赖相同的背景变量（context vector）来获取输⼊序列信息。**当编码器为循环神经⽹络时，背景变量来⾃它最终时间步的隐藏状态。将源序列输入信息以循环单位状态编码，然后将其传递给解码器以生成目标序列**。然而这种结构存在着问题，尤其是**RNN机制实际中存在长程梯度消失的问题**，对于较长的句子，我们很难寄希望于将输入的序列转化为定长的向量而保存所有的有效信息，所以随着所需翻译句子的长度的增加，这种结构的效果会显著下降。

    与此同时，解码的目标词语可能只与原输入的部分词语有关，而并不是与所有的输入有关。例如，当把“Hello world”翻译成“Bonjour le monde”时，“Hello”映射成“Bonjour”，“world”映射成“monde”。**在seq2seq模型中，解码器只能隐式地从编码器的最终状态中选择相应的信息。然而，注意力机制可以将这种选择过程显式地建模。**

    <p align="center">
      <img src="https://d2l.ai/_images/attention.svg" style="zoom:100%" />
    </p>

    

- **注意力机制框架**

  - Attention 是一种通用的带权池化方法，**输入由两部分构成：询问（query）和键值对（key-value pairs）。**

  - **完整过程**：

    - first use **score function $\alpha$** that measures the similarity between the query and key $a_{i}=\alpha\left(\mathbf{q}, \mathbf{k}_{i}\right)$
    
    - Next we use **softmax** to obtain the attention weights 
    
      $\mathbf{b}=softmax(\mathbf{a}) \quad,$ where $\quad b_{i}=\frac{\exp \left(a_{i}\right)}{\sum_{j} \exp \left(a_{j}\right)}, \mathbf{b}=\left[b_{1}, \ldots, b_{n}\right]^{T}$
    
    - Finally, the output is a **weighted sum of the values**:
    
      $\mathbf{o}=\sum_{i=1}^{n} b_{i} \mathbf{v}_{i}$
    
    <p align="center">
      <img src="https://d2l.ai/_images/attention_output.svg" style="zoom:100%" />
    </p>
    
  - **不同的attetion layer的区别在于score函数的选择**

- **两个常用的注意层 Dot-product Attention 和 Multilayer Perceptron Attention**

  - **点积注意力 Dot-product Attention**
  - The dot product 假设query和keys有相同的维度, 即 $\forall i, 𝐪,𝐤_𝑖 ∈ ℝ_𝑑 $. 通过计算query和key转置的乘积来计算attention score,通常还会除去 $\sqrt{d}$ 减少计算出来的score对维度𝑑的依赖性，如下 
    
    <p align="center">
    $$
    𝛼(𝐪,𝐤)=⟨𝐪,𝐤⟩/ \sqrt{d}
    $$
    </p>
    
    假设 $ 𝐐∈ℝ^{𝑚×𝑑}$ 有 $m$ 个query，$𝐊∈ℝ^{𝑛×𝑑}$ 有 $n$ 个keys. 我们可以通过矩阵运算的方式计算所有 $mn$ 个score：
    
    <p align="center">
    $$
    𝛼(𝐪,𝐤)=⟨𝐪,𝐤⟩/ \sqrt{d}
    $$
    </p>

    ```
    # Save to the d2l package.
    class DotProductAttention(nn.Module): 
        def __init__(self, dropout, **kwargs):
            super(DotProductAttention, self).__init__(**kwargs)
            self.dropout = nn.Dropout(dropout)
    
        # query: (batch_size, #queries, d)
        # key: (batch_size, #kv_pairs, d)
        # value: (batch_size, #kv_pairs, dim_v)
        # valid_length: either (batch_size, ) or (batch_size, xx)
        def forward(self, query, key, value, valid_length=None):
            d = query.shape[-1]
            # set transpose_b=True to swap the last two dimensions of key
            
            scores = torch.bmm(query, key.transpose(1,2)) / math.sqrt(d)
            attention_weights = self.dropout(masked_softmax(scores, valid_length))
            print("attention_weight\n",attention_weights)
            return torch.bmm(attention_weights, value)
    ```
  
    
  
  - **多层感知机注意力 Multilayer Perceptron Attention**
  
    - 在多层感知器中，我们首先将 query and keys 投影到  $ℝ^ℎ$ .为了更具体，我们将可以学习的参数做如下映射 $𝐖_𝑘∈ℝ^{ℎ×𝑑_𝑘}$ ,  $𝐖_𝑞∈ℝ^{ℎ×𝑑_𝑞}$ , and  $𝐯∈ℝ^h$ . 将score函数定义
      
      <p align="center">
      $$
      𝛼(𝐤,𝐪)=𝐯^𝑇tanh(𝐖_𝑘𝐤+𝐖_𝑞𝐪)
      $$
      </p>
      
      然后将key 和 value 在特征的维度上合并（concatenate），然后送至 a single hidden layer perceptron 这层中 hidden layer 为  ℎ  and 输出的size为 1 .隐层激活函数为tanh，无偏置.
    
    ```
    # Save to the d2l package.
    class MLPAttention(nn.Module):  
        def __init__(self, units,ipt_dim,dropout, **kwargs):
            super(MLPAttention, self).__init__(**kwargs)
            # Use flatten=True to keep query's and key's 3-D shapes.
            self.W_k = nn.Linear(ipt_dim, units, bias=False)
            self.W_q = nn.Linear(ipt_dim, units, bias=False)
            self.v = nn.Linear(units, 1, bias=False)
            self.dropout = nn.Dropout(dropout)
    
        def forward(self, query, key, value, valid_length):
            query, key = self.W_k(query), self.W_q(key)
            #print("size",query.size(),key.size())
            # expand query to (batch_size, #querys, 1, units), and key to
            # (batch_size, 1, #kv_pairs, units). Then plus them with broadcast.
            features = query.unsqueeze(2) + key.unsqueeze(1)
            #print("features:",features.size())  #--------------开启
            scores = self.v(features).squeeze(-1) 
            attention_weights = self.dropout(masked_softmax(scores, valid_length))
            return torch.bmm(attention_weights, value)
    ```
    
  
- **Sequence to Sequence with Attention Mechanisms**

  - Here, the memory of the attention layer consists of **all the information** that the encoder has seen—**the encoder output at each timestep**. During the decoding, the **decoder output** from the **previous timestep** $t−1$ is used as the **query**. The **output of the attention model** is viewed as the **context information**, and such **context** is **concatenated** with the **decoder input** $D_t$. Finally, we feed the concatenation into the decoder.

    <p align="center">
      <img src="https://d2l.ai/_images/seq2seq_attention.svg" style="zoom:100%" />
    </p>

    <p align="center">
      <img src="https://d2l.ai/_images/seq2seq-attention-details.svg" style="zoom:100%" />
    </p>

    - we initialize the state of the decoder by passing three items from the encoder:
      - **the encoder outputs of all timesteps**: they are used as the attention layer’s memory with **identical keys and values**;**（keys与values相同）**
      - **the hidden state of the encoder’s final timestep**: it is used as the **initial decoder’s hidden state**;
      - **the encoder valid length**: so the attention layer will not consider the padding tokens with in the encoder outputs.

    ```
    class Seq2SeqAttentionDecoder(d2l.Decoder):
        def __init__(self, vocab_size, embed_size, num_hiddens, num_layers,
                     dropout=0, **kwargs):
            super(Seq2SeqAttentionDecoder, self).__init__(**kwargs)
            self.attention_cell = MLPAttention(num_hiddens,num_hiddens, dropout)
            self.embedding = nn.Embedding(vocab_size, embed_size)
            self.rnn = nn.LSTM(embed_size+ num_hiddens,num_hiddens, num_layers, dropout=dropout)
            self.dense = nn.Linear(num_hiddens,vocab_size)
    
        def init_state(self, enc_outputs, enc_valid_len, *args):
            outputs, hidden_state = enc_outputs
    #         print("first:",outputs.size(),hidden_state[0].size(),hidden_state[1].size())
            # Transpose outputs to (batch_size, seq_len, hidden_size)
            return (outputs.permute(1,0,-1), hidden_state, enc_valid_len)
            #outputs.swapaxes(0, 1)
            
        def forward(self, X, state):
            enc_outputs, hidden_state, enc_valid_len = state
            #("X.size",X.size())
            X = self.embedding(X).transpose(0,1)
    #         print("Xembeding.size2",X.size())
            outputs = []
            for l, x in enumerate(X):
    #             print(f"\n{l}-th token")
    #             print("x.first.size()",x.size())
                # query shape: (batch_size, 1, hidden_size)
                # select hidden state of the last rnn layer as query
                query = hidden_state[0][-1].unsqueeze(1) # np.expand_dims(hidden_state[0][-1], axis=1)
                # context has same shape as query
    #             print("query enc_outputs, enc_outputs:\n",query.size(), enc_outputs.size(), enc_outputs.size())
                context = self.attention_cell(query, enc_outputs, enc_outputs, enc_valid_len)
                # Concatenate on the feature dimension
    #             print("context.size:",context.size())
                x = torch.cat((context, x.unsqueeze(1)), dim=-1)
                # Reshape x to (1, batch_size, embed_size+hidden_size)
    #             print("rnn",x.size(), len(hidden_state))
                out, hidden_state = self.rnn(x.transpose(0,1), hidden_state)
                outputs.append(out)
            outputs = self.dense(torch.cat(outputs, dim=0))
            return outputs.transpose(0, 1), [enc_outputs, hidden_state,
                                            enc_valid_len]
    ```

    

### Transformer

- **self-attention**

  - The self-attention model is a normal attention model, with **its query, its key, and its value being copied exactly the same from each item of the sequential inputs**. self-attention **outputs** a **same-length sequential output for each input item**. Compared with a recurrent layer, output items of a self-attention layer can be **computed in parallel and, therefore, it is easy to obtain a highly-efficient implementation**.

    <p align="center">
      <img src="https://d2l.ai/_images/self-attention.svg" style="zoom:100%" />
    </p>

- **multi-head attention**

  - **在Transformer模型中，注意力头数为h，嵌入向量和隐藏状态维度均为d，那么一个多头注意力层所含的参数量是：**

    - *h*个注意力头中，每个的参数量为$3d^2$，最后的输出层形状为$hd \times d$，所以参数量共为$4hd^2$。
  
  - The *multi-head attention* layer **consists of $h$ parallel self-attention layers**, **each one is called a head**. For each head, before feeding into the attention layer, we project the queries, keys, and values with three dense layers with hidden sizes $p_q$, $p_k$, and $p_v$, respectively. The outputs of these $h$ attention heads are **concatenated** and then processed by a final dense layer.

    <p align="center">
    <img src="https://d2l.ai/_images/multi-head-attention.svg" style="zoom:100%" />
    </p>

  - Assume that the dimension for a query, a key, and a value are $d_q$, $d_k$, and $d_v$, respectively. Then, for each head $𝑖=1,…,ℎ$, we can train learnable parameters $𝐖^{(𝑖)}_𝑞∈ℝ^{𝑝_𝑞×𝑑_𝑞}$, $𝐖^{(𝑖)}_𝑘∈ℝ^{𝑝_𝑘×𝑑_𝑘}$, and $𝐖^{(𝑖)}_𝑣∈ℝ^{𝑝_𝑣×𝑑_𝑣}$. Therefore, the output for each head is $𝐨^{(𝑖)}=attention(𝐖^{(𝑖)}_𝐪,𝐖^{(𝑖)}_𝐤,𝐖^{(𝑖)}_𝑣𝐯)$,where attention can be any attention layer, such as the `DotProductAttention` and `MLPAttention`. 

    After that, the output with length $p_v$ from each of the $h$ attention heads are concatenated to be an output of length $hp_v$, which is then passed the final dense layer with $d_o$ hidden units. The weights of this dense layer can be denoted by $𝐖𝑜∈ℝ^{𝑑_𝑜×ℎ𝑝_𝑣}$. As a result, the multi-head attention output will be $\mathbf{o}=\mathbf{W}_{o}\left[\begin{array}{c}{\mathbf{o}^{(1)}} \\ {\vdots} \\ {\mathbf{o}^{(h)}}\end{array}\right]$.
  
    ```
    class MultiHeadAttention(nn.Module):
    		"""
    		Assume that the multi-head attention contain the number heads num_heads  =ℎ , the hidden size hidden_size  =𝑝𝑞=𝑝𝑘=𝑝𝑣  are the same for the query, key, and value dense layers. In addition, since the multi-head attention keeps the same dimensionality between its input and its output, we have the output feature size  𝑑𝑜=  hidden_size as well.
    		"""
        def __init__(self, input_size, hidden_size, num_heads, dropout, **kwargs):
            super(MultiHeadAttention, self).__init__(**kwargs)
            self.num_heads = num_heads
            self.attention = DotProductAttention(dropout)
            self.W_q = nn.Linear(input_size, hidden_size, bias=False)
            self.W_k = nn.Linear(input_size, hidden_size, bias=False)
            self.W_v = nn.Linear(input_size, hidden_size, bias=False)
            self.W_o = nn.Linear(hidden_size, hidden_size, bias=False)
        
        def forward(self, query, key, value, valid_length):
            # query, key, and value shape: (batch_size, seq_len, dim),
            # where seq_len is the length of input sequence
            # valid_length shape is either (batch_size, )
            # or (batch_size, seq_len).
    
            # Project and transpose query, key, and value from
            # (batch_size, seq_len, hidden_size * num_heads) to
            # (batch_size * num_heads, seq_len, hidden_size).
            
            query = transpose_qkv(self.W_q(query), self.num_heads)
            key = transpose_qkv(self.W_k(key), self.num_heads)
            value = transpose_qkv(self.W_v(value), self.num_heads)
            
            if valid_length is not None:
                # Copy valid_length by num_heads times
                device = valid_length.device
                valid_length = valid_length.cpu().numpy() if valid_length.is_cuda else valid_length.numpy()
                if valid_length.ndim == 1:
                    valid_length = torch.FloatTensor(np.tile(valid_length, self.num_heads))
                else:
                    valid_length = torch.FloatTensor(np.tile(valid_length, (self.num_heads,1)))
    
                valid_length = valid_length.to(device)
            
            output = self.attention(query, key, value, valid_length)
            
            # Transpose from (batch_size * num_heads, seq_len, hidden_size) back
            # to (batch_size, seq_len, hidden_size * num_heads)
            output_concat = transpose_output(output, self.num_heads)
            return self.W_o(output_concat)
    ```
  
    ```
    def transpose_qkv(X, num_heads):
        # Original X shape: (batch_size, seq_len, hidden_size * num_heads),
        # -1 means inferring its value, after first reshape, X shape:
        # (batch_size, seq_len, num_heads, hidden_size)
        X = X.view(X.shape[0], X.shape[1], num_heads, -1)
        
        # After transpose, X shape: (batch_size, num_heads, seq_len, hidden_size)
        X = X.transpose(2, 1).contiguous()
    
        # Merge the first two dimensions. Use reverse=True to infer shape from
        # right to left.
        # output shape: (batch_size * num_heads, seq_len, hidden_size)
        output = X.view(-1, X.shape[2], X.shape[3])
        return output
    
    
    # Saved in the d2l package for later use
    def transpose_output(X, num_heads):
        # A reversed version of transpose_qkv
        X = X.view(-1, num_heads, X.shape[1], X.shape[2])
        X = X.transpose(2, 1).contiguous()
        return X.view(X.shape[0], X.shape[1], -1)
    ```
  
- **Position-wise Feed-Forward Networks**

  - Transformer 模块另一个非常重要的部分就是基于位置的前馈网络（FFN），它接受一个形状为（batch_size，seq_length, feature_size）的三维张量。Position-wise FFN由两个全连接层组成，他们作用在最后一维上。因为序列的每个位置的状态都会被单独地更新，所以我们称他为position-wise，这等效于一个1x1的卷积。

  - 与多头注意力层相似，**FFN层同样只会对最后一维的大小进行改变**

    ```python
    class PositionWiseFFN(nn.Module):
      	"""
      	>>> ffn = PositionWiseFFN(4, 4, 8)
    				out = ffn(torch.ones((2,3,4)))
    
    		>>> print(out, out.shape)
    				torch.Size([2, 3, 8])
      	"""
        def __init__(self, input_size, ffn_hidden_size, hidden_size_out, **kwargs):
            super(PositionWiseFFN, self).__init__(**kwargs)
            self.ffn_1 = nn.Linear(input_size, ffn_hidden_size)
            self.ffn_2 = nn.Linear(ffn_hidden_size, hidden_size_out)
            
            
        def forward(self, X):
            return self.ffn_2(F.relu(self.ffn_1(X)))
    ```

- **相加归一化层 Add and Norm**

  - 相加归一化层可以**平滑地整合输入和其他层的输出**，因此我们**在每个多头注意力层和FFN层后面都添加一个含残差连接的Layer Norm层**。这里 Layer Norm 与Batch Norm很相似，唯一的区别在于Batch Norm是对于batch size这个维度进行计算均值和方差的，而Layer Norm则是对最后一维进行计算。**层归一化可以防止层内的数值变化过大，从而有利于加快训练速度并且提高泛化性能。**

    ```python
    class AddNorm(nn.Module):
      	"""
      	>>> add_norm = AddNorm(4, 0.5)
    				add_norm(torch.ones((2,3,4)), torch.ones((2,3,4))).shape
    		>>> torch.Size([2, 3, 4])
      	"""
        def __init__(self, hidden_size, dropout, **kwargs):
            super(AddNorm, self).__init__(**kwargs)
            self.dropout = nn.Dropout(dropout)
            self.norm = nn.LayerNorm(hidden_size)
        
        def forward(self, X, Y):
            return self.norm(self.dropout(Y) + X)
    ```

- **位置编码**

  - 与循环神经网络不同，无论是多头注意力网络还是前馈神经网络都是独立地对每个位置的元素进行更新，这种特性帮助我们实现了高效的并行，却丢失了重要的序列顺序的信息。为了更好的捕捉序列信息，Transformer模型引入了位置编码去保持输入序列元素的位置。

    <p align="center">
      <img src="https://d2l.ai/_images/positional_encoding.svg" style="zoom:100%" />
    </p>

- **编码器**

  <p align="center">
    <img src="https://d2l.ai/_images/transformer.svg" style="zoom:100%" />
  </p>

  - 我们已经有了组成Transformer的各个模块，现在我们可以开始搭建了！**编码器包含一个多头注意力层，一个position-wise FFN，和两个 Add and Norm层**。对于**<font color=red>attention模型以及FFN模型，我们的输出维度都是与embedding维度一致的</font>**，这也是由于残差连接天生的特性导致的，因为我们要将前一层的输出与原始输入相加并归一化。

    ```python
    class EncoderBlock(nn.Module):
      	"""
      	# batch_size = 2, seq_len = 100, embedding_size = 24
    		# ffn_hidden_size = 48, num_head = 8, dropout = 0.5
    
        >>>	X = torch.ones((2, 100, 24))
            encoder_blk = EncoderBlock(24, 48, 8, 0.5)
            encoder_blk(X, valid_length).shape
        >>> torch.Size([2, 100, 24])
      	"""
        def __init__(self, embedding_size, ffn_hidden_size, num_heads,
                     dropout, **kwargs):
            super(EncoderBlock, self).__init__(**kwargs)
            self.attention = MultiHeadAttention(embedding_size, embedding_size, num_heads, dropout)
            self.addnorm_1 = AddNorm(embedding_size, dropout)
            self.ffn = PositionWiseFFN(embedding_size, ffn_hidden_size, embedding_size)
            self.addnorm_2 = AddNorm(embedding_size, dropout)
    
        def forward(self, X, valid_length):
            Y = self.addnorm_1(X, self.attention(X, X, X, valid_length))
            return self.addnorm_2(Y, self.ffn(Y))
    ```

- **整个Transformer 编码器模型**

  - 整个编码器由n个刚刚定义的Encoder Block堆叠而成

    ```python
    class TransformerEncoder(d2l.Encoder):
      	"""
      	# test encoder
        >>> encoder = TransformerEncoder(200, 24, 48, 8, 2, 0.5)
        		encoder(torch.ones((2, 100)).long(), valid_length).shape
        >>> torch.Size([2, 100, 24])
      	"""
      	
        def __init__(self, vocab_size, embedding_size, ffn_hidden_size,
                     num_heads, num_layers, dropout, **kwargs):
            super(TransformerEncoder, self).__init__(**kwargs)
            self.embedding_size = embedding_size
            self.embed = nn.Embedding(vocab_size, embedding_size)
            self.pos_encoding = PositionalEncoding(embedding_size, dropout)
            self.blks = nn.ModuleList()
            for i in range(num_layers):
                self.blks.append(
                    EncoderBlock(embedding_size, ffn_hidden_size,
                                 num_heads, dropout))
    
        def forward(self, X, valid_length, *args):
            X = self.pos_encoding(self.embed(X) * math.sqrt(self.embedding_size))
            for blk in self.blks:
                X = blk(X, valid_length)
            return X
    ```
  
- **解码器**
  
  <p align="center">
    <img src="https://d2l.ai/_images/self-attention-predict.svg" style="zoom:100%" />
  </p>
  - The Transformer decoder block looks similar to the Transformer encoder block. However, besides the two sub-layers—the multi-head attention layer and the positional encoding network, the decoder Transformer block contains a **third sub-layer**, which **applies multi-head attention on the output of the encoder stack**. To be specific, **at timestep $t$**, assume that **$x_t$ is the current input**, i.e., the query. the keys and values of the self-attention layer consist of the current query with all the **past queries** $𝐱_1,…,𝐱_{𝑡−1}.$
  
  - During training, the **output** for the $t$-​query​ could **observe all the previous key-value pairs**. It results in an different behavior from prediction. Thus, during prediction we can eliminate the unnecessary information by specifying the valid length to be $𝑡$ for the $𝑡^{th}$ query.
  
    ```
    class DecoderBlock(nn.Module):
        def __init__(self, embedding_size, ffn_hidden_size, num_heads,dropout,i,**kwargs):
            super(DecoderBlock, self).__init__(**kwargs)
            self.i = i
            self.attention_1 = MultiHeadAttention(embedding_size, embedding_size, num_heads, dropout)
            self.addnorm_1 = AddNorm(embedding_size, dropout)
            self.attention_2 = MultiHeadAttention(embedding_size, embedding_size, num_heads, dropout)
            self.addnorm_2 = AddNorm(embedding_size, dropout)
            self.ffn = PositionWiseFFN(embedding_size, ffn_hidden_size, embedding_size)
            self.addnorm_3 = AddNorm(embedding_size, dropout)
        
        def forward(self, X, state):
            enc_outputs, enc_valid_length = state[0], state[1]
            
            # state[2][self.i] stores all the previous t-1 query state of layer-i
            # len(state[2]) = num_layers
            
            if state[2][self.i] is None:
                key_values = X
            else:
                # shape of key_values = (batch_size, t, hidden_size)
                key_values = torch.cat((state[2][self.i], X), dim=1) 
            state[2][self.i] = key_values
            
            if self.training:
                batch_size, seq_len, _ = X.shape
                # Shape: (batch_size, seq_len), the values in the j-th column are j+1
                valid_length = torch.FloatTensor(np.tile(np.arange(1, seq_len+1), (batch_size, 1))) 
                valid_length = valid_length.to(X.device)
            else:
                valid_length = None
    
            X2 = self.attention_1(X, key_values, key_values, valid_length)
            Y = self.addnorm_1(X, X2)
            Y2 = self.attention_2(Y, enc_outputs, enc_outputs, enc_valid_length)
            Z = self.addnorm_2(Y, Y2)
            return self.addnorm_3(Z, self.ffn(Z)), state
    ```
  
    ```
    class TransformerDecoder(d2l.Decoder):
        def __init__(self, vocab_size, embedding_size, ffn_hidden_size,
                     num_heads, num_layers, dropout, **kwargs):
            super(TransformerDecoder, self).__init__(**kwargs)
            self.embedding_size = embedding_size
            self.num_layers = num_layers
            self.embed = nn.Embedding(vocab_size, embedding_size)
            self.pos_encoding = PositionalEncoding(embedding_size, dropout)
            self.blks = nn.ModuleList()
            for i in range(num_layers):
                self.blks.append(
                    DecoderBlock(embedding_size, ffn_hidden_size, num_heads,
                                 dropout, i))
            self.dense = nn.Linear(embedding_size, vocab_size)
    
        def init_state(self, enc_outputs, enc_valid_length, *args):
            return [enc_outputs, enc_valid_length, [None]*self.num_layers]
    
        def forward(self, X, state):
            X = self.pos_encoding(self.embed(X) * math.sqrt(self.embedding_size))
            for blk in self.blks:
                X, state = blk(X, state)
            return self.dense(X), state
    ```
  
    
  
