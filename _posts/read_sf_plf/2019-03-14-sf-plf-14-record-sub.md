---
title: "「编程语言基础」 14. Subtyping with Records"
subtitle: "Software Foundations Volume 2: Programming Language Foundations - Chapter 14"
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


```coq
Inductive ty : Type :=
  (* record types *)
  | RNil : ty
  | RCons : string → ty → ty → ty.
```

we need typecon to identify record...


```coq
Inductive tm : Type :=
  | rproj ...?  isn't it as well?
  (* record terms *)
  | rnil : tm
  | rcons : string → tm → tm → tm.
``

as a list...


for Record, can compiler reorder the fields? (SML and OCaml)





