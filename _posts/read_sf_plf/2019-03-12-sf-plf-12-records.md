---
title: "「编程语言基础」 12. Adding Records To STLC"
subtitle: "Software Foundations Volume 2: Programming Language Foundations - Chapter 12"
layout: post
author: "Hux"
header-style: text
hidden: true
tags:
  - 软件基础
  - 编程语言基础
  - Coq
  - 笔记
---


## Adding Records


```coq
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





