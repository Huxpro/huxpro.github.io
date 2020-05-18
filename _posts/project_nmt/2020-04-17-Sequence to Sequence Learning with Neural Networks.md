---
title: "读paper「nmt01」"
subtitle: "Sequence to Sequence Learning with Neural Networks, Google 2014"
layout: post
author: "echisenyang"
header-style: text
hidden: true
catalog: true
tags:
  - nmt
  - paper with code
---



![KqAVjB](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/KqAVjB.png)



### 贡献及trick

Surprisingly, the LSTM did not suffer on very long sentences, despite the recent experience of other researchers with related architectures [26]. We were able to do well on long sentences because we **reversed the order of words in the source sentence but not the target sentences in the training and test set**. By doing so, we introduced many **short term dependencies** that made the optimization problem much simpler (see sec. 2 and 3.3). As a result, SGD could learn LSTMs that had no trouble with long sentences. 

- The simple trick of reversing the words in the source sentence is one of the **key technical contributions** of this work.

Our actual models differ from the above description **in three important ways**.

1. First, we used **two different LSTMs: one for the input sequence and another for the output** sequence, because doing so increases the number model parameters at negligible computational cost and makes it natural to train the LSTM on multiple language pairs simultaneously
2. Second, we found that **deep LSTMs signiﬁcantly outperformed shallow LSTMs**, so we chose an LSTM with four layers.
3. Third, we found it extremely valuable to **reverse the order** of the words of the input sentence. We found this simple data transformation to **greatly boost the performance** of the LSTM.



### the model

The LSTM computes this conditional probability by ﬁrst obtaining the **ﬁxed dimensional representation v** of the input sequence $(x_1 , . . . , x_T)$ given by the **last hidden state of the LSTM**, and then computing the probability of $y_1 , . . . , y_T′$ with a standard LSTM-LM formulation whose **initial hidden state is set to the representation v** of $x_1 , . . . , x_T$ :

![iuqSpE](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/iuqSpE.png)

- Decoding and Rescoring

![ikVDr1](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/ikVDr1.png)

- Reversing the Source Sentences

While we do not have a complete explanation to this phenomenon, we believe that it is caused by the introduction of many **short term dependencies** to the dataset. Normally, when we concatenate a source sentence with a target sentence, **each word in the source sentence is far from its corresponding word in the target sentence**. As a result, the problem has a large “minimal time lag” [17]. By reversing the words in the source sentence, the average distance between corresponding words in the source and target language is unchanged. However, **the ﬁrst few words in the source language are now very close to the ﬁrst few words in the target language, so the problem’s minimal time lag is greatly reduced**. Thus, backpropagation has an easier time “establishing communication” between the source sentence and the target sentence, which in turn results in substantially improved overall performance.

- training details

![EMCLPn](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/EMCLPn.png)



### 实验结果

- it is the ﬁrst time that a pure neural translation system outperforms a phrase-based SMT baseline on a large MT task. 2014年

![khTJvo](https://gitee.com/echisenyang/GiteeForUpicUse/raw/master/uPic/khTJvo.png)

