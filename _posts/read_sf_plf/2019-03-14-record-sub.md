---
title: "「软件基础 - PLF」 14. Subtyping with Records"
layout: post
author: "Hux"
header-style: text
hidden: true
tags:
  - 软件基础 SF
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





