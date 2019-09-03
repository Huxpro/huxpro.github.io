---
title: "「软件基础 - PLF」 12. Adding Records To STLC"
layout: post
author: "Hux"
header-style: text
hidden: true
tags:
  - 软件基础 SF
  - Coq
  - 笔记
---


## Adding Records


```BNF
t ::=                          Terms:
    | {i1=t1, ..., in=tn}         record
    | t.i                         projection
    | ...

v ::=                          Values:
    | {i1=v1, ..., in=vn}         record value
    | ...

T ::=                          Types:
    | {i1:T1, ..., in:Tn}         record type
    | ...
```


## Formalizing Records





