---
layout:     post
title:      "statistica machine translation"
subtitle:   ""
date:       2018-07-25 12:00:00
author:     "Alex"
header-img: ""img/post-bg-xi.JPG""
---

统计机器翻译系统Moses的搭建
===========================

Moses系统简介
-------------

摩西是统计（或称基于数据的）机器翻译（MT）的一个实现方法。这是该领域目前的主要方法，并被谷歌和微软等公司部署的在线翻译系统所采用。在统计机器翻译（SMT）中，翻译系统接受大量并行数据的训练（系统从中学习如何翻译小段），以及更大量的单语数据（系统从中学习目标语言应该怎么组织）。平行数据是两种不同语言的句子集合，它们是句子对齐的，因为一种语言的每个句子都与另一种语言中相应的翻译句子相匹配，它也被称为bitext。

摩西的训练过程接收平行数据，并使用单词和语言片段（即为短语）的同时出现来推断两种语言之间的对应关系。在基于短语的机器翻译中，这些对应关系仅在连续的单词序列之间，而在基于分层短语的机器翻译或基于语法的翻译中，更多关于句子的结构被添加到对应关系中。例如，一个分层的机器翻译系统可以知道德国hat
X gegessen 对应于英语中的ate
X，其中Xs能被任何德语-英语单词对所替换。在这些类型的系统中使用的额外结构可能或并不能从并行语料的语言分析得到。摩西还实现了基于短语的机器翻译的扩展，称为因式翻译，可以将额外的语言信息添加到基于短语的翻译系统中。

有关摩西翻译模型的更多信息，请参见摩西网站上关于[基于短语的机器翻译系统](http://www.statmt.org/moses/?n=Moses.Tutorial)，基于[句法的翻译系统](http://www.statmt.org/moses/?n=Moses.SyntaxTutorial)或基于因子的翻译系统。

无论您使用哪种类型的机器翻译模型，创建一个表现良好的翻译系统的关键都是大量优质数据（语料）。您可以使用许多[免费的并行数据源](http://www.statmt.org/moses/?n=Moses.LinksToCorpora)来训练样本系统，比如：<http://www.statmt.org/moses/?n=Moses.LinksToCorpora>。但（通常）您使用的数据越接近您要翻译的语言类型，得到的结果就越好。这是使用像Moses这样的开源工具的优势之一，如果您拥有自己的数据，那么您可以根据需要定制自己的翻译系统，并且可能比通用翻译系统获得更好的性能。摩西用来训练翻译系统的过程中需要句子对齐的数据，但如果语料在文档级别对齐，则通常可以使用像[hunalign](http://mokk.bme.hu/resources/hunalign/)这样的工具将其转换为句子对齐的数据。

**Moses系统的组成部分**
-----------------------

摩西系统的两个主要组成部分是训练管道和解码器。还有各种开源社区贡献的工具和实用程序。训练管道实际上是一组工具（主要用perl编写，有些用C
++编写），它们采用原始数据（并行语料和单语言）并将其转换为机器翻译模型。解码器是一个单独的C
++应用程序，给定一个训练有素的机器翻译模型和源句子，将源语句翻译成目标语言。

1.培训管道：

从培训数据生成翻译系统涉及各个阶段，这些阶段在培训文档和基线系统指南中有更详细的描述。这些作为管道被完成，并且可由摩西实验管理系统所控制，而Moses通常可以轻松地将不同类型的外部工具插入到培训管道中

数据在被用于训练之前需要做一些准备工作，标记文本并且将标记转换为标准案例。启发式用于删除看起来未对齐的句子对，并删除长句子。然后，并行的句子需要词对齐，通常使用
GIZA
++来完成，它实现了80年代在IBM开发的一组统计模型。这些词对齐被用于根据需要提取短语-短语翻译或分层规则，并且使用这些规则的语料库范围统计来估计概率。

翻译系统的一个重要部分是语言模型，一种使用目标语言中的单语言数据构建的统计模型，并由解码器用来尝试确保输出的流畅性。摩西依靠[外部工具](http://www.statmt.org/moses/?n=FactoredTraining.BuildingLanguageModel)（http://www.statmt.org/moses/?n=FactoredTraining.BuildingLanguageModel）进行语言模型构建。

创建机器翻译系统的最后一步是*调优*，其中不同的统计模型相互加权以产生最佳可能的翻译。摩西系统包含了最流行的调优算法的实现。

2.解码器

摩西解码器的工作是找到与给定源句子相对应的目标语言（根据翻译模型）的最高评分句子。解码器还可以输出候选的翻译的从好到坏的排序列表，并且还提供关于其如何做出决策的各种类型的信息（例如，它使用的短语-短语对应关系）。

解码器以模块化方式编写，并允许用户以各种方式改变解码过程，例如：

-   输入：这可以是一个简单的句子，或者它可以用类似xml的元素的注释来指导翻译过程，或者它可以是更复杂的结构，如格子或混淆网络（例如，从语音识别的输出）

-   翻译模型：这可以使用短语-短语规则或分层（也可能是句法）规则。它可以编译成二进制形式，以加快加载速度。它可以通过将额外的信息添加到翻译过程中来补充一些特性，例如阐明短语对的来源以控制他们的可靠性的特性。

-   解码算法：解码问题是一个巨型的搜索问题，通常对于精确搜索来说太大了，而且Moses为这种搜索实现了几种不同的策略，例如基于堆栈，立方体修剪，图表解析等。

-   语言模型：
    Moses支持几种不同的语言模型工具包（SRILM，KenLM，IRSTLM，RandLM），每种工具包都有自己的优点和缺点，添加一个新的LM工具包很简单。

Moses解码器还支持多线程解码（因为翻译具有[很高的的并行性](https://en.wikipedia.org/wiki/Embarrassingly_parallel)），并且如果您有权访问群集服务器，摩西提供启用多进程解码的脚本。

贡献工具
--------

摩西有许多贡献工具，它们提供额外的功能和超越标准训练和解码管道的附加功能。这些包括：

-   Moses服务器：为解码器提供xml-rpc接口，需要安装xmlrpc-c。

-   Web翻译：一组脚本，使Moses可用于翻译网页

-   分析工具：与参考文献相比，是一个可以对摩西输出进行分析和可视化的脚本。

还有用于评估翻译的工具，替代短语评分方法，用于加权短语表的技术的实现，用于减小短语表的规模的工具以及其他贡献工具。

一 安装相关依赖项：
-------------------

在本教程中，我用来搭建Moses系统的服务器环境如下：

```Cbash
root\@VM-0-15-ubuntu:/home/ubuntu/mosesdecoder\# lsb_release -a

No LSB modules are available.

Distributor ID: Ubuntu

Description: Ubuntu 16.04.4 LTS

Release: 16.04

Codename: xenial
```

安装如下依赖：

sudo apt-get install build-essential git-core pkg-config automake libtool wget
zlib1g-dev python-dev libbz2-dev

从Github克隆Moses：

git clone <https://github.com/moses-smt/mosesdecoder.git>   
cd mosesdecoder

运行以下命令安装最新的boost库，cmph (for
CompactPT，即C Minimal Perfect Hashing Library), irstlm (language model from
FBK, required to pass the regression tests),和 xmlrpc-c (for moses
server)。这些都会默认安装在你的当前工作目录的./opt路径。其中xmlrpc不是必须，但是如果将moses作为服务提供必须安装xmlrpc。

make -f contrib/Makefiles/install-dependencies.gmake

编译Moses：

./compile.sh [additional options]

\--prefix=/destination/path --install-scripts 安装到其他目录

\--with-mm 使用基于后缀数组的短语表

其中，MOSES
SERVER使你可以把MOSES解码器作为一个服务器进程来运行，发送给其的句子将通过XMLRPC来翻译。这意味着无论客户使用java,python,perl,php还是其它别的XMLRPC集合里有的语言来编码，MOSES进程都可以服务客户且分布式地服务客户。

XMLRPC是Userland
Software公司设计的一种格式：是一种使用HTTP协议传输XML格式文件来获取远程程序调用（Remote
Procedure
Call）的传输方式。远程程序调用简单地讲是指，一台机器通过网络调用另一台机器里的应用程序，同时将执行结果返回。一般一台机器作为服务器端，另一台作为客户端。服务器端需要轮询是否有客户端进行RPC请求。一个简单的例子。一台服务器提供查询当前时间的RPC服务。其他任何一台机器通过网络，使用客户端，都可以到该服务器查询当前的时间。

MLRPC是RPC机制的实现方式之一。采用XML语言作为服务器与客户端的数据交互格式，方便使用者阅读。XMLRPC可以用很多种语言实现，包括perl，phyon，c等。使用c与c++实现的库，就是XMLRPC-c。

Boost
1.48版本在编译Moses时会出现一个严重的bug。在有些Linux的分发版本中，比如Ubuntu
12.04，Boost库存在着这种版本的Boost库。在这种情况下，你必须要手动下载和编译Boost。

下载编译boost：

wget <https://dl.bintray.com/boostorg/release/1.64.0/source/boost_1_64_0.tar.gz>

tar zxvf boost_1_64_0.tar.gz

cd boost_1_64_0/

./bootstrap.sh

./b2 -j4 --prefix=\$PWD --libdir=\$PWD/lib64 --layout=system link=static install
\|\| echo FAILURE \#或者执行./b2安装在当前目录下

上述命令在文件夹lib64中创建文件夹，并不是在系统目录下。因此，你不必使用系统root权限来执行上述命令。然而，你需要告诉Moses如何找到boost。当boost被暗账好以后，你可以开始编译Moses，你需要用 --with-boost标记告诉Moses系统
boost安装在哪里。

下载安装cmph:

wget
http://www.mirrorservice.org/sites/download.sourceforge.net/pub/sourceforge/c/cm/cmph/cmph/cmph-2.0.tar.gz

tar zxvf cmph-2.0.tar.gz

cd cd cmph-2.0/

./configure --prefix= /usr/local/cmph
\#指定安装路径，这里我选择了/usr/local/cmph

Make

Make install

下载安装xmlrpc-c：

wget
https://launchpad.net/ubuntu/+archive/primary/+sourcefiles/xmlrpc-c/1.33.14-8build1/xmlrpc-c_1.33.14.orig.tar.gz

tar zxvf xmlrpc-c_1.33.14.orig.tar.gz

cd xmlrpc-c-1.33.14/

./configure --prefix= /usr/local/xmlrpc-c
\#指定安装路径，这里我选择了/usr/local/xmlrpc-c

Make

Make install

接下来，用bjam编译Moses：

./bjam --with-boost=/home/ubuntu/boost_1_64_0 --with-cmph=/usr/local/cmph
--with-xmlrpc-c=/usr/local/xmlrpc-c -j4

注意： --with-boost
后的路径为你自己安装时指定的路径，-j4 用于指定核心数。Moses可选的语言模型有IRSTLM，SRILM，KenLM.其中，KenLM已经默认包含在Moses工具包中。我们在这里使用Moses自带的语言模型工具KenLM，不再安装irstlm。

二 安装词对齐工具GIZA++
-----------------------

接下来，安装词对齐工具GIZA++：

git clone <https://github.com/moses-smt/giza-pp.git>

cd giza-pp

make

编译完成后，将生成三个二进制文件：

· giza-pp/GIZA++-v2/GIZA++

· giza-pp/GIZA++-v2/snt2cooc.out

· giza-pp/mkcls-v2/mkcls

记得在编译完之后将上面的三个文件拷到一个目录下，便于访问使用。如下面的命令所示，我是直接将其放在tools文件夹下的。

cd \~/mosesdecoder

mkdir tools

cp \~/giza-pp/GIZA++-v2/GIZA++ \~/giza-pp/GIZA++-v2/snt2cooc.out \\

\~/giza-pp/mkcls-v2/mkcls tools

编译创建好GIZA++后，有两种方式来使用它，一是在编译Moses时将GIZA++的地址作为选项参数。如果在编译Moses时没有指定GIZA++的地址，可以采用另外一个方法，那就是在训练语言模型时指明GIZA++三个可执行文件的路径，例如：

train-model.perl -external-bin-dir \$HOME/external-bin-dir

我在实际操作中，采用的是第二种方法，即在使用Moses时，给一个参数指明GIZA++路径。

三 语料准备
-----------

接下来，准备平行语料：

我的英汉平行语料来自联合国的网站提供的英汉平行语料，（https://conferences.unite.un.org/uncorpus/zh），大约1600万对。因我使用的服务器内存只有4G，所以将原文件分成30份，从中截取了约60万对用来做此次实验。

我们的英文语料为：un_en-zh23.en，汉语语料为：un_en-zh23.cn。

在准备训练翻译系统之前，我们需要对语料做如下的处理：

1.  **tokenisation：**这一步主要是在单词和单词之间或者单词和标点之间插入空白，以便于后续识别和其他操作。

对于英文语料，我们运行如下命令：

\~/mosesdecoder/scripts/tokenizer/tokenizer.perl -l en \\

\< \~/corpus/training/un_en-zh23.en \\

\> \~/corpus/un_en-zh23.tok.en

>   注：命令当中的\~为Mosesdecoder的安装路径和语料所在的具体路径，下同

对于汉语语料。我们需要进行分词。在这里，我们使用清华大学自然语言处理与社会人文计算实验室研制推出的中文词法分析工具包（http://thulac.thunlp.org），具有中文分词和词性标注功能。具有能力强，准确率高，速度快的特点。具体使用方法请参照网页。在这里，我们使用Python版本来对中文语料进行分词，具体代码如下：

import thulac

thu1=thulac.thulac(user_dict="/home/ubuntu/corpus/un_en-zh_23/dict.txt",seg_only=True)

\#只进行分词，不进行词性标注

thu1.cut_f("/home/ubuntu/corpus/un_en-zh_23/un_en-zh23.cn",
"/home/ubuntu/corpus/un_en-zh_23/un_en-zh23.fc")
\#对un_en-zh23.cn文件内容进行分词，输出到un_en-zh23.fc

>   经过tokenisation，我们得到un_en-zh23.fc和un_en-zh23.tok.en两个文件。

1.  truecase：初始每句话的字和词组都被转换为没有格式的形式(例如统一为小写）。这有助于减少数据稀疏性问题。

>   Truecase首先需要训练，以便提取关于文本的一些统计信息

\~/mosesdecoder/scripts/recaser/train-truecaser.perl \\

\--model \~/corpus/truecase-model.en --corpus \\

\~/corpus/ un_en-zh23.tok.en

\~/mosesdecoder/scripts/recaser/train-truecaser.perl \\

\--model \~/corpus/truecase-model.cn --corpus \\

\~/corpus/ un_en-zh23.fc

>   经过此步，我们得到truecase-model.en和truecase-model.cn两个文件。

>   接下来，我们对tokenisation后的文件进行truecase：

\~/mosesdecoder/scripts/recaser/truecase.perl \\

\--model \~/corpus/truecase-model.en \\

\< \~/corpus/ un_en-zh23.tok.en \\

\> \~/corpus/ un_en-zh23.true.en

\~/mosesdecoder/scripts/recaser/truecase.perl \\

\--model \~/corpus/truecase-model.cn \\

\< \~/corpus/ un_en-zh23.fc \\

\> \~/corpus/un_en-zh23.true.cn

经过truecase，我们得到un_en-zh23.true.cn和un_en-zh23.true.en两个文件。

3.
cleaning：长句和空语句可引起训练过程中的问题，因此将其删除，同时删除明显不对齐的句子。

\~/mosesdecoder/scripts/training/clean-corpus-n.perl \\

\~/corpus/ un_en-zh23.true cn en \\

\~/corpus/ un_en-zh23.clean 1 80

需要注意的是，这句命令会对truecase-model.en和truecase-model.cn两个文件同时进行清洗。经过clean，我们得到un_en-zh23.clean.en和un_en-zh23.clean.cn两个文件。

四 语言模型训练（Language Model Training）
------------------------------------------

语言模型的训练是为了保证能够产生流利的输出，所以要用目标语言来建立。本例的目标语言是汉语。在这里，我们使用Moses系统中内置的语言语言模型工具KenLM，当然，你也可以使用其他一些开源的语言模型工具，比如，IRSTLM，BerkeleyLM，SRILM等。接下来，我们建立一个合适的3元文语言模型。

建立文件夹lm，然后运行如下命令：

mkdir \~/lm

cd \~/lm

\~/mosesdecoder/bin/lmplz -o 3 \<\~/corpus/ un_en-zh23.true.cn \>
un_en-zh23.arpa.cn

你会看到建立语言模型的五个步骤：

1/5 Counting and sorting n-grams

2/5 Calculating and sorting adjusted counts

3/5 Calculating and sorting initial probabilities

4/5 Calculating and writing order- interpolated probabilities

5/5 Writing ARPA model =FE Name

此步我们生成un_en-zh23.arpa.cn
文件，接下来我们为了加载的更快一些，我们使用KenLm来对\*.arpa.en文件二进制化。

\~/mosesdecoder/bin/build_binary \\

un_en-zh23.arpa.cn \\

un_en-zh23.blm.cn

当你看到绿色的SUCCESS字样时说明二进制化已经成功了。我们可以在这一步之后通过查询测试来判断训练的模型是否正确，运行如下的linux命令你会看到：

\$ echo "我 爱 北京 天安门" \\

\| \~/mosesdecoder/bin/query un_en-zh23.blm.cn

Loading statistics:

我=8872 2 -2.282969 爱=18074 1 -6.466906 北京=9416 1 -4.8714185

天安门=0 1 -6.4878592 \</s\>=2 1 -2.288369 Total: -22.397522 OOV: 1

Perplexity including OOVs: 30165.07396388977

Perplexity excluding OOVs: 9493.266676976866

OOVs: 1

Tokens: 5

Name:query VmPeak:151680 kB VmRSS:4088 kB RSSMax:136452 kB

user:0.008 sys:0 CPU:0.008 real:0.00995472

五 训练翻译模型（Training the Translation System）
--------------------------------------------------

接下来，我们进行到最主要的一步，训练翻译模型。在这一步，我们进行词对齐（用GIZA++），短语抽取，打分，创建词汇化重新排序表，并且创建属于我们自己的摩西配置文件(moses.ini)。我们运行如下的命令：

mkdir \~/working

cd \~/working

nohup nice \~/mosesdecoder/scripts/training/train-model.perl -root-dir train \\

\-corpus \~/corpus/ un_en-zh23.clean \\

\-f en -e cn -alignment grow-diag-final-and -reordering msd-bidirectional-fe \\

\-lm 0:3:\$HOME/lm/un_en-zh23.blm.cn:8 \\

\-external-bin-dir \~/mosesdecoder/tools \>& training.out &

如果你的CPU是多核的，建议你加上-cores
参数来加快词对齐的过程。注意，如果在训练翻译系统的过程中遇到了 Exit
code:137错误，一般是因为内存不足，需要增大服务器的内存配置。上述过程完成后，你可以在\~/working/train/model
文件夹下找到一个moses.ini配置文件，这是需要在moses解码时使用到的。但这里有几个问题，首先是它的加载速度很慢，这个问题我们可以通过二值化(binarising)短语表和短语重排序表来解决，即编译成一个可以很快地加载的格式。第二个问题是，该配置文件中moses解码系统用来权衡不同的模型之间重要程度的权重信息都是刚初始化的，即非最优的，如果你用VIM打开moses.ini文件看看的话，你会看到各种权重都被设置为默认值，如0.2，0.3等。要寻找更好的权重，我们需要调整(tuning)翻译系统，即下一步。

六 调优(Tuning)
---------------

这是整个过程中最慢的一步，Tuning需要一小部分的平行语料，与训练数据相分离开。这里，我们再次从联合国的平行语料中截取一部分。我们用来调优的语料文件名称为un_dev.cn和un_dev.en。我们将用这两个文件来完成调优的过程，所以我们在之前必须对着两个文件进行  tokenise
和 truecase。

cd \~/corpus

\~/mosesdecoder/scripts/tokenizer/tokenizer.perl -l en \\

\< dev/un_dev.en \> un_dev.tok.en

同样的，对un_dev.cn进行中文分词，得到un_dev.fc。

然后进行truecase：

\~/mosesdecoder/scripts/recaser/truecase.perl --model truecase-model.en \\

\< un_dev.tok.en \> un_dev.true.en

\~/mosesdecoder/scripts/recaser/truecase.perl --model truecase-model.fr \\

\< un_dev.fc \> un_dev.true.cn

然后回到我们用来训练的目录，开始调优的过程：

cd \~/working

nohup nice \~/mosesdecoder/scripts/training/mert-moses.pl \\

\~/corpus/ un_dev.true.en \~/corpus/ un_dev.true.cn \\

\~/mosesdecoder/bin/moses train/model/moses.ini --mertdir \~/mosesdecoder/bin/
\\

&\> mert.out &

如果你的CPU是多核的，那么用多线程来运行摩西会明显加快速度。在上面的最后一行加上--decoder-flags="-threads
4"可以用四线程来运行解码器。

最后的调优结果是一个包含训练权重的ini文件，如果你用的跟我一样的目录结构的话，应该存在于\~/working/mert-
work/moses.ini文件夹中。

七 测试
-------

接下来你可以运行下面的命令来翻译句子：

\~/mosesdecoder/bin/moses -f \~/working/mert-work/moses.ini

运行命令后，会得到下面的提示：

Defined parameters (per moses.ini or switch):

config: /home/ubuntu/corpus/un_en-zh_23/working/mert-work/moses.ini

distortion-limit: 6

feature: UnknownWordPenalty WordPenalty PhrasePenalty PhraseDictionaryMemory
name=TranslationMode l0 num-features=4
path=/home/ubuntu/corpus/un_en-zh_23/working/train/model/phrase-table.gz
input-factor=0 output-factor=0 LexicalReordering name=LexicalReordering0
num-features=6 type=wbe-msd-bidirectional-fe-a llff input-factor=0
output-factor=0
path=/home/ubuntu/corpus/un_enzh_23/working/train/model/reordering-t
able.wbe-msd-bidirectional-fe.gz Distortion KENLM name=LM0 factor=0
path=/home/ubuntu/corpus/un_en-zh_23/ lm/un_en-zh23.blm.cn order=3

input-factors: 0

mapping: 0 T 0

weight: LexicalReordering0= 0.0614344 0.0245557 0.242242 0.0725016 0.0539617
0.0566553 Distortion 0= 0.00534453 LM0= 0.0696027 WordPenalty0= -0.166007
PhrasePenalty0= 0.0688629 TranslationModel0= 0.03900 17 0.0457273 0.0730895
0.0210141 UnknownWordPenalty0= 1

line=UnknownWordPenalty

FeatureFunction: UnknownWordPenalty0 start: 0 end: 0

line=WordPenalty

FeatureFunction: WordPenalty0 start: 1 end: 1

line=PhrasePenalty

FeatureFunction: PhrasePenalty0 start: 2 end: 2

line=PhraseDictionaryMemory name=TranslationModel0 num-features=4
path=/home/ubuntu/corpus/un_en-zh_23/wo rking/train/model/phrase-table.gz
input-factor=0 output-factor=0

FeatureFunction: TranslationModel0 start: 3 end: 6

line=LexicalReordering name=LexicalReordering0 num-features=6
type=wbe-msd-bidirectional-fe-allff input-f actor=0 output-factor=0
path=/home/ubuntu/corpus/un_en-zh_23/working/train/model/reordering-table.wbe-msd
-bidirectional-fe.gz

Initializing Lexical Reordering Feature..

FeatureFunction: LexicalReordering0 start: 7 end: 12

line=Distortion

FeatureFunction: Distortion0 start: 13 end: 13

line=KENLM name=LM0 factor=0
path=/home/ubuntu/corpus/un_en-zh_23/lm/un_en-zh23.blm.cn order=3

FeatureFunction: LM0 start: 14 end: 14

Loading UnknownWordPenalty0

Loading WordPenalty0

Loading PhrasePenalty0

Loading LexicalReordering0

Loading table into memory...done.

Loading Distortion0

Loading LM0

Loading TranslationModel0

Start loading text phrase table. Moses format : [133.871] seconds

Reading /home/ubuntu/corpus/un_en-zh_23/working/train/model/phrase-table.gz

\----5---10---15---20---25---30---35---40---45---50---55---60---65---70---75---80---85---90---95--100

输入你喜欢的英语句子，然后查看结果。你会注意到，解码器会话费很长一段时间来启动。如上所示，我们此次启动花费了133.871秒，并且CPU和内存一直处于满载状态。为了让解码器启动的更快一些，我们可以将短语表和词汇化再排序模型二进制化。注意，binarise操作需要使用cmph，如果没有按照本文档事先安装cmph，在此时才安装cmph，那么必须进入mosesdecoder安装文件夹重新执行./bjam，并补全编译参数重新编译moses。否则执行moses.ini时会报错。

我们要创建一个合适的目录并且按如下的命令来二进制化模型：

mkdir \~/working/binarised-model

cd \~/working

\~/mosesdecoder/bin/processPhraseTableMin \\

\-in train/model/phrase-table.gz -nscores 4 \\

\-out binarised-model/phrase-table

\~/mosesdecoder/bin/processLexicalTableMin \\

\-in train/model/reordering-table.wbe-msd-bidirectional-fe.gz \\

\-out binarised-model/reordering-table

输入命令，你会看到如下的信息，分别是将短语表和重排序表二值化：

Used options:

Text phrase table will be read from: train/model/phrase-table.gz

Output phrase table will be written to: binarised-model/phrase-table.minphr

Step size for source landmark phrases: 2\^10=1024

Source phrase fingerprint size: 16 bits / P(fp)=1.52588e-05

Selected target phrase encoding: Huffman + PREnc

Maxiumum allowed rank for PREnc: 100

Number of score components in phrase table: 4

Single Huffman code set for score components: no

Using score quantization: no

Explicitly included alignment information: yes

Running with 1 threads

Pass 1/3: Creating hash function for rank assignment

..................................................[5000000]

..................................................[10000000]

...

Pass 2/3: Creating source phrase index + Encoding target phrases

..................................................[5000000]

..................................................[10000000]

...

Intermezzo: Calculating Huffman code sets

Creating Huffman codes for 90037 target phrase symbols

Creating Huffman codes for 69575 scores

Creating Huffman codes for 5814858 scores

Creating Huffman codes for 58305 scores

Creating Huffman codes for 5407479 scores

Creating Huffman codes for 50 alignment points

Pass 3/3: Compressing target phrases

..................................................[5000000]

..................................................[10000000]

...

Saving to binarised-model/phrase-table.minphr

Done

Used options:

Text reordering table will be read from:
train/model/reordering-table.wbe-msd-bidirectional-fe.gz

Output reordering table will be written to:
binarised-model/reordering-table.minlexr

Step size for source landmark phrases: 2\^10=1024

Phrase fingerprint size: 16 bits / P(fp)=1.52588e-05

Single Huffman code set for score components: no

Using score quantization: no

Running with 1 threads

Pass 1/2: Creating phrase index + Counting scores

..................................................[5000000]

..................................................[10000000]

..................................................[15000000]

........................

Intermezzo: Calculating Huffman code sets

Creating Huffman codes for 16117 scores

Creating Huffman codes for 8771 scores

Creating Huffman codes for 16117 scores

Creating Huffman codes for 15936 scores

Creating Huffman codes for 8975 scores

Creating Huffman codes for 16122 scores

Pass 2/2: Compressing scores

..................................................[5000000]

..................................................[10000000]

..................................................[15000000]

........................

Saving to binarised-model/reordering-table.minlexr

Done

注意：如果你遇到了如下的错误，请确保你在刚开始用CMPH来编译摩西。

 ...\~/mosesdecoder/bin/processPhraseTableMin: No such file or directory

将 \~/working/mert-work/moses.ini复制到binarised-model
目录中，并且改变短语和重排序表以让他们指向二进制版本，你可以按如下的命令运行：

1.  将 binarised-model目录下的Moses.ini文件中的\# feature
    functions一栏中的PhraseDictionaryMemory 改为 PhraseDictionaryCompact

2.  将 binarised-model目录下的Moses.ini文件中的\# feature
    functions一栏中的PhraseDictionary 的路径设置为如下：

\$HOME/working/binarised-model/phrase-table.minphr

1.  将 binarised-model目录下的Moses.ini文件中\# feature
    functions一栏中的LexicalReordering 的路径设置为如下：

\$HOME/working/binarised-model/reordering-table

修改后的Moses.ini中的feature function如下所示：

\# feature functions

[feature]

UnknownWordPenalty

WordPenalty

PhrasePenalty

PhraseDictionaryCompact name=TranslationModel0 num-features=4
path=/home/ubuntu/corpus/un_en-zh_23/working/binarised-model/phrase-table.minphr
input-factor=0 output-factor=0

LexicalReordering name=LexicalReordering0 num-features=6
type=wbe-msd-bidirectional-fe-allff input-factor=0 output-factor=0
path=/home/ubuntu/corpus/un_en-zh_23/working/binarised-model/reordering-table

Distortion

KENLM name=LM0 factor=0
path=/home/ubuntu/corpus/un_en-zh_23/lm/un_en-zh23.blm.cn order=3

再次运行Moses:

\~/mosesdecoder/bin/moses -f \~/working/binarised-model/moses.ini

接下来你会发现加载和运行一次翻译将会变得非常迅速。这里我们输入英语句子“however ,
there are good reasons for supporting the government .”

Defined parameters (per moses.ini or switch):

config: /home/ubuntu/corpus/un_en-zh_23/working/binarised-model/moses.ini

distortion-limit: 6

feature: UnknownWordPenalty WordPenalty PhrasePenalty PhraseDictionaryCompact
name=TranslationModel0 num -features=4
path=/home/ubuntu/corpus/un_en-zh_23/working/binarised-model/phrase-table.minphr
input-factor=0 outp ut-factor=0 LexicalReordering name=LexicalReordering0
num-features=6 type=wbe-msd-bidirectional-fe-allff input-f actor=0
output-factor=0
path=/home/ubuntu/corpus/un_en-zh_23/working/binarised-model/reordering-table
Distortion KENLM name=LM0 factor=0
path=/home/ubuntu/corpus/un_en-zh_23/lm/un_en-zh23.blm.cn order=3

input-factors: 0

mapping: 0 T 0

weight: LexicalReordering0= 0.0614344 0.0245557 0.242242 0.0725016 0.0539617
0.0566553 Distortion0= 0.00 534453 LM0= 0.0696027 WordPenalty0= -0.166007
PhrasePenalty0= 0.0688629 TranslationModel0= 0.0390017 0.0457273 0 .0730895
0.0210141 UnknownWordPenalty0= 1

line=UnknownWordPenalty

FeatureFunction: UnknownWordPenalty0 start: 0 end: 0

line=WordPenalty

FeatureFunction: WordPenalty0 start: 1 end: 1

line=PhrasePenalty

FeatureFunction: PhrasePenalty0 start: 2 end: 2

line=PhraseDictionaryCompact name=TranslationModel0 num-features=4
path=/home/ubuntu/corpus/un_en-zh_23/working/
binarised-model/phrase-table.minphr input-factor=0 output-factor=0

FeatureFunction: TranslationModel0 start: 3 end: 6

line=LexicalReordering name=LexicalReordering0 num-features=6
type=wbe-msd-bidirectional-fe-allff input-factor=0 output-factor=0
path=/home/ubuntu/corpus/un_en-zh_23/working/binarised-model/reordering-table

Initializing Lexical Reordering Feature..

FeatureFunction: LexicalReordering0 start: 7 end: 12

line=Distortion

FeatureFunction: Distortion0 start: 13 end: 13

line=KENLM name=LM0 factor=0
path=/home/ubuntu/corpus/un_en-zh_23/lm/un_en-zh23.blm.cn order=3

FeatureFunction: LM0 start: 14 end: 14

Loading UnknownWordPenalty0

Loading WordPenalty0

Loading PhrasePenalty0

Loading LexicalReordering0

Loading Distortion0

Loading LM0

Loading TranslationModel0

Created input-output object : [0.428] seconds

however , there are good reasons for supporting the government

Translating: however , there are good reasons for supporting the government

Line 0: Initialize search took 0.000 seconds total

Line 0: Collecting options took 0.567 seconds at moses/Manager.cpp Line 141

Line 0: Search took 0.308 seconds

然而 ， 有 充分 理由 支持 政府

BEST TRANSLATION: 然而 ， 有 充分 理由 支持 政府 [1111111111] [total=-3.462]
core=(0.000,-7.000,4.000,-13.611,-24.516,-3.431,-11.391,-3.059,0.000,0.000,-2.434,0.000,0.000,0.000,-34.379)

Line 0: Decision rule took 0.000 seconds total

Line 0: Additional reporting took 0.000 seconds total

Line 0: Translation took 0.877 seconds total \\

你会发现，此次加载运行一次翻译系统只需0.877秒，而且在此期间，CPU和内存的占用几乎可以忽略不计。说明我们的二值化取得了非常良好的效果。在这一步，你可能很想知道这个翻译系统的表现如何。为了衡量这一点，我们使用另一组之前没有使用过的平行数据（测试集）。我们的测试集文件名称是un_test.cn和un_test.en。首先，和之前一样，我们需要对测试集进行tokenise
和truecase。

此处对un_test.cn进行tokenise时依然采用thulac分词工具，得到un_test.fc文件。

cd \~/corpus

\~/mosesdecoder/scripts/tokenizer/tokenizer.perl -l en \\

\< dev/un_test.en \> un_test.tok.en

\~/mosesdecoder/scripts/recaser/truecase.perl --model truecase-model.en \\

\< un_test.tok.en \> un_test.true.en

\~/mosesdecoder/scripts/recaser/truecase.perl --model truecase-model.cn \\

\< un_test.fc \> un_test.true.cn

可以针对次测试机过滤我们训练过的模型，这意味着我们只保留需要的条目来翻译。这会使翻译速度加快一些。

cd \~/working

\~/mosesdecoder/scripts/training/filter-model-given-input.pl \\

filtered-newstest2011 \~/working/mert-work/moses.ini \~/corpus/un_test.true.en
\\

\-Binarizer \~/mosesdecoder/bin/processPhraseTableMin

运行命令后，你会看到如下的提示：

Executing: mkdir -p /home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test

Stripping XML...

Executing: /home/ubuntu/mosesdecoder/scripts/training/../generic/strip-xml.perl
\< /home/ubuntu/corpus/un_en-zh_23/test/un_test.true.en \>
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/input.16677

pt:PhraseDictionaryMemory name=TranslationModel0 num-features=4
path=/home/ubuntu/corpus/un_en-zh_23/working/train/model/phrase-table.gz
input-factor=0 output-factor=0

Considering factor 0

ro:LexicalReordering name=LexicalReordering0 num-features=6
type=wbe-msd-bidirectional-fe-allff input-factor=0 output-factor=0
path=/home/ubuntu/corpus/un_en-zh_23/working/train/model/reordering-table.wbe-msd-bidirectional-fe.gz

Considering factor 0

Filtering files...

filtering /home/ubuntu/corpus/un_en-zh_23/working/train/model/phrase-table.gz
-\>
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/phrase-table.0-0.1.1...

2351834 of 17491572 phrases pairs used (13.45%) - note: max length 10

binarizing...

Executing: gzip -cd
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/phrase-table.0-0.1.1.gz \|
LC_ALL=C sort --compress-program gzip -T
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test \| gzip - \>
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/phrase-table.0-0.1.1.gz.sorted.gz
&& /home/ubuntu/mosesdecoder/bin/processPhraseTableMin -in
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/phrase-table.0-0.1.1.gz.sorted.gz
-out /home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/phrase-table.0-0.1.1
-nscores 4 -threads 1 && rm
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/phrase-table.0-0.1.1.gz.sorted.gz

Used options:

Text phrase table will be read from:
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/phrase-table.0-0.1.1.gz.sorted.gz

Output phrase table will be written to:
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/phrase-table.0-0.1.1.minphr

Step size for source landmark phrases: 2\^10=1024

Source phrase fingerprint size: 16 bits / P(fp)=1.52588e-05

Selected target phrase encoding: Huffman + PREnc

Maxiumum allowed rank for PREnc: 100

Number of score components in phrase table: 4

Single Huffman code set for score components: no

Using score quantization: no

Explicitly included alignment information: yes

Running with 1 threads

Pass 1/3: Creating hash function for rank assignment

.

Pass 2/3: Creating source phrase index + Encoding target phrases

.

Intermezzo: Calculating Huffman code sets

Creating Huffman codes for 37180 target phrase symbols

Creating Huffman codes for 59255 scores

Creating Huffman codes for 779126 scores

Creating Huffman codes for 55190 scores

Creating Huffman codes for 1373326 scores

Creating Huffman codes for 50 alignment points

Pass 3/3: Compressing target phrases

.

Saving to
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/phrase-table.0-0.1.1.minphr

Done

filtering
/home/ubuntu/corpus/un_en-zh_23/working/train/model/reordering-table.wbe-msd-bidirectional-fe.gz
-\>
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/reordering-table.wbe-msd-bidirectional-fe.0-0.1...

2351834 of 17491572 phrases pairs used (13.45%) - note: max length 10

binarizing...

Executing: gzip -cd
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/reordering-table.wbe-msd-bidirectional-fe.0-0.1.gz
\| LC_ALL=C sort --compress-program gzip -T
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test \| gzip - \>
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/reordering-table.wbe-msd-bidirectional-fe.0-0.1.gz.sorted.gz
&& /home/ubuntu/mosesdecoder/bin/processLexicalTableMin -in
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/reordering-table.wbe-msd-bidirectional-fe.0-0.1.gz.sorted.gz
-out
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/reordering-table.wbe-msd-bidirectional-fe.0-0.1
-threads 1 && rm
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/reordering-table.wbe-msd-bidirectional-fe.0-0.1.gz.sorted.gz

Used options:

Text reordering table will be read from:
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/reordering-table.wbe-msd-bidirectional-fe.0-0.1.gz.sorted.gz

Output reordering table will be written to:
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/reordering-table.wbe-msd-bidirectional-fe.0-0.1.minlexr

Step size for source landmark phrases: 2\^10=1024

Phrase fingerprint size: 16 bits / P(fp)=1.52588e-05

Single Huffman code set for score components: no

Using score quantization: no

Running with 1 threads

Pass 1/2: Creating phrase index + Counting scores

.......................

Intermezzo: Calculating Huffman code sets

Creating Huffman codes for 14663 scores

Creating Huffman codes for 8197 scores

Creating Huffman codes for 14660 scores

Creating Huffman codes for 14562 scores

Creating Huffman codes for 8162 scores

Creating Huffman codes for 14774 scores

Pass 2/2: Compressing scores

.......................

Saving to
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/reordering-table.wbe-msd-bidirectional-fe.0-0.1.minlexr

Done

To run the decoder, please call:

moses -f /home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/moses.ini -i
/home/ubuntu/corpus/un_en-zh_23/test/filtered-un_test/input.16677

你可以在第一次翻译测试数据时运行BLEU脚本来测试解码器。当然，这需要很短一段时间。命令中的
-lc是无视大小写的BLEU评分，不使用参数-lc是大小写敏感的BLEU评分。 

nohup nice \~/mosesdecoder/bin/moses \\

\-f \~/working/filtered-un_test/moses.ini -i \\

\< \~/corpus/ un_test.true.en \\

\> \~/working/un_test.translated.cn \\

2\> \~/working/un_test.out

\~/mosesdecoder/scripts/generic/multi-bleu.perl \\

\-lc \~/corpus/un_test.true.cn \\

\< \~/working/un_test.translated.cn

上述命令中，un_test.true.en
是我们待翻译的文件，un_test.translated.cn是我们得到的翻译后的文件，un_test.out是我们在翻译过程中生成的日志文件，你可以用VIM工具查看其中的内容。

命令执行完成后，我们会得到如下的信息：

BLEU = 29.29, 68.1/36.9/22.0/13.3 (BP=1.000, ratio=1.001, hyp_len=106809,
ref_len=106725)

It is in-advisable to publish scores from multi-bleu.perl. The scores depend on
your tokenizer, which is unlikely to be reproducible from your paper or
consistent across research groups. Instead you should detokenize then use
mteval-v14.pl, which has a standard tokenization. Scores from multi-bleu.perl
can still be used for internal purposes when you have a consistent tokenizer.

从multi-bleu.perl得到的分数是可信的。
最终得到的分数取决于你的分词工具的好坏，在你的论文中或者整个研究小组中每次得到的分数都应该是不同的。相反，你应该使用mteval-v14.pl，它可以进行标准的符号化。当您拥有一致的标记生成器时，来自multi-bleu.perl的分数仍可用于内部目的。

我们这里得到的BLEU成绩是29.29分，每次进行翻译时，得到的BLEU分数应该是不一样的。在tuning和最终test的时候参考译文的数量以及使用不同分词工具所造成的预处理的不同，语言模型是n-gram的不同都会影响到最终BLEU分数。

八 搭建moses server
-------------------

如果希望把moses作为服务开放使用，必须通过设置将moses设为moses
server。具体步骤如下：   
1.
安装xmlrpc（如果前面按照本文档已经安装xmlrpc，该步可以略过。否则参见该文档前半部分。安装完成后重新编译moses）。   
2. 修改moses.pl参数   
进入\~/mosesdecoder/contrib/iSenWeb文件夹，打开moses.pl文件，在该文件中指定moses和moses.ini(配置文件)的位置。我这里的MOSES参数为“/home/ubuntu/mosesdecoder/bin/moses”，
MOSES_INI参数为”
/home/ubuntu/corpus/un_en-zh_23/working/binarised-model/moses.ini”。关闭并保存。如下所示： 

将Moses.pl文件中的

\#------------------------------------------------------------------------------

\# constants, global vars, config

my \$MOSES = '/home/tianliang/research/moses-smt/scripts/training/model/moses';

my \$MOSES_INI =
'/home/tianliang/research/moses-smt/scripts/training/model/moses.ini';

die "usage: daemon.pl \<hostname\> \<port\>" unless (\@ARGV == 2);

my \$LISTEN_HOST = shift;

my \$LISTEN_PORT = shift;

\#------------------------------------------------------------------------------

修改为：

\#------------------------------------------------------------------------------

\# constants, global vars, config

my \$MOSES = '/home/ubuntu/mosesdecoder/bin/moses';

my \$MOSES_INI =
'/home/ubuntu/corpus/un_en-zh_23/working/binarised-model/moses.ini';

die "usage: daemon.pl \<hostname\> \<port\>" unless (\@ARGV == 2);

my \$LISTEN_HOST = shift;

my \$LISTEN_PORT = shift;

\#------------------------------------------------------------------------------

3. 进入到\~/mosesdecoder/contrib/iSenWeb文件夹，在terminal中输入：

./moses.pl 192.168.0.1 9999

即：moses.pl \<hostname\> \<port\>

其中， 192.168.1.1 是本机地址，9999是端口号。TCP/IP协议中端口号的范围从0\~65535,1024以下的端口用于系统服务，1024\~65535端口我们可以使用。我们可以在/etc/service文件中看到各个端口的情况。

我们也可以持续运行moses server：

nohup \~ /mosesdecoder/contrib/iSenWeb/moses.pl 192.168.0.1 9999&

运行命令后会显示忽略输入并把输出追加到"nohup.out"。即成功运行了moses
server。在Linux中，nohup的意思是忽略SIGHUP信号， 所以当运行nohup ./a.out的时候，
关闭shell,
那么a.out进程还是存在的，即对SIGHUP信号免疫。后面的&符号意为让任务在后台运行。 运行后会在当前路径下产生一个文件nohup.out。

1.  测试翻译平台： 

2.  echo " may I help you" \| nc 192.168.0.1 9999

可以看到返回结果：

我 是 否 可以 帮助 你

5. 如果需要关闭moses server，使用killall moses.pl就可以了。
