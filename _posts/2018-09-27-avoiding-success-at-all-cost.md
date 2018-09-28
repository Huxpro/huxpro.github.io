---
layout: post
title: "Avoding success at all cost"
subtitle: 'Watching "Escape from the Ivory Tower: The Haskell Journey"'
author: "Hux"
header-style: text
lang: en
tags:
  - Haskell
  - PL
  - 笔记
  - 🇬🇧
---

"Avoiding success at all cost" is the informal motto behinds Haskell. It could be parenthesized in two ways, either "Avoiding (success at all cost)" or "(Avoiding sucess) (at all cost)". 

I'm not going to interpret them directly but rather share some thoughts on "the success vs. costs" basing on my very own understanding.

### The success vs. cost of language design

There're always trade offs (or compromises) in any software design, and programming language design has no exceptions.

In other words, all language design decision that made them "successful" i.e. being popular and widely-used in industry or education for some reason, all comes with theirs own "costs": being unsafe, limited expressiveness, bad performance, etc.

Whether or not the "cost" is a problem really depends on scenarios, or their goals. For instances, Python/JavaScript are both very expressive and beginner-friendly by being dynamically-typed, sacrifing the type safety and performance. Java, in constrast, use a much safer and optimization-friendly type system but being much less expressive. 

None of these "costs" really prevent them from being immortally popular.

For Haskell, the story becomes quite different: being research-oriented means the goal of it is to pursue some "ultimate" things: the "ultimate" simplicity of intermediate representation, the "ultimate" type system where safety and expressiveness can coexist, the "ultimate" compilation speed and runtime performance, the "ultimate" concise and elegant concrete syntax, the "ultimate"...I don't know. But it has to be some "ultimate" things that is very difficult, probably endless and impossible, to achieve. 

This, as a result, made all language decision in Haskell became very hard and slow, because **almost nothing can be scarified**. That's why Haskell insisted to be lazy to "guard" the purity regardless of its problems; a decent IO mechanisms is missing in the first 4 yrs after the project's start until P Walder found _Monad_; and the _Type Class_, which first proposed in P Walder's 1989 paper, spent yrs long to implement and popularize.

As a side note though, it doesn't mean there is no compromise in Haskell at all. It's just as minimized as it progress. When one audience asking why we have Haskell and OCaml, which're quite similar in very high level, both survived, SPJ replies:

> There's just a different set of compromises.

### The success vs. cost of language design process

Another common but extremely controversial (if not most) topics of programming language design is about its process: would you prefer dictatorship or a committee (a dictatorship of many?)? Would you go with proprietary or standardizing? How formal you want the standardization going, in human language, pseudo code or formal semantics? How many and frequently a breaking change dare you make? Do you let open source community involve in it?  

Again, I think there is no THE answer for this question. Majority of popular programming languages came and still on going with very different paths.

Python, whose creater, Guido van Rossum, known as the "Benevolent Dictator For Life" (BDFL), i.e. good kind of dictator, still play the central role (until July 2018) of the Python's development after Python getting popular and adapt a open source and community-based development model. This factor direcly contribute to the fact that Python 3, as a breaking (not completely backward-compatible and not easy to port) but good (in terms of language design and consistency) revision of the language can still be landed, despite of many communities' pressures. There're many language (Ruby, Perl, Elm) also choose to follow this route.

JavaScript, widely known as being created by Brendan Eich in 10 days, in comparision, quickly involved into a committee (TC39) and standardized (ECMAScript) language as both the open nature of the Web and its fast adoption. But Brendan, as the creater, wasn't even powerful enough to push the committee landing ES4, also a breaking revision, but ended up with the ES5 (Harmony), a backward-compatible, but much less ambitious version after some political "fights" between different parties (e.g. Mozilla, Microsoft, Yahoo etc.) and couldn't change the history. Even the latest rising of "modern" JavaScript (ES6, 7, 8...) is mainly driven by the new generation of committee parties (+Google, Facebook, Airbnb etc.) and still in a very open and standardized way.

Even the history and progress of two relatively similar community-based languege can be so different, not to mention more proprietary programming language e.g. Java in some terms, C# etc. from Microsoft, OC and Swift from Apple (though the latter was open sourced) or more academia and standardized language e.g. having formal standard (SML and Scheme). 

Haskell, being an academia language, while choosing a route closer to C++/OCaml i.e. the compiler implementation over standardization; having committee but very dictatorial in terms of making breaking changes, then trained a very change-tolerant community is quiet unique but avoid it "becoming too success too quickly"


### End thoughts

To be fair, Haskell has alreay been very "successful" nowdays, in particularly academia (as the sexy type laboratory etc.) but also industry, either being used in real business or being very reputable  among non-academic programmers (as being both hard and fun).

I am not confident to say Haskell is success in the right degree at the right time now, but it's great to see it, after more than 20 and now almost 30 yrs, very successfully avoiding the "success" they want to avoid and figure out its very unique way, to "Escape from the Ivory Tower", and going beyond.


