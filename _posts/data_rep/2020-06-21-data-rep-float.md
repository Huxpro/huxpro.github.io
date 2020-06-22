---
title: "Data Representation - Floating Point Numbers"
subtitle: "「数据表示」浮点数"
layout: post
author: "Hux"
header-style: text
hidden: true
tags:
  - 笔记
  - 基础
  - C
  - C++
---

In the last episode we talked about the data representation of integer, a kind
of fixed-point numbers. Today we're going to learn about floating-point numbers. 

Floating-point numbers are used to _approximate_ real numbers. Because of the 
fact that all the stuffs in computers are, eventually, just a limited sequence 
of bits. The representation of floating-point number had to made trade-offs 
between _ranges_ and _precision_.

Due to its computational complexities, CPU also have a dedicated set of 
instructions to accelerate on floating-point arithmetics. 


Terminologies
-------------

The terminologies of floating-point number is coming from the 
[_scientific notation_](https://en.wikipedia.org/wiki/Scientific_notation), 
where a real number can be represented as such:

```
1.2345 = 12345 × 10 ** -4
         -----   --    --
  significand^   ^base  ^exponent
```

- _significand_, or _mantissa_, 有效数字, 尾数
- _base_, or _radix_ 底数
- _exponent_, 幂

So where is the _floating point_? It's the `.` of `1.2345`. Imaging the dot
can be float to the left by one to make the representation `.12345`.

The dot is called _radix point_, because to us it's seem to be a _decimal point_,
but it's really a _binary point_ in the computers.

Now it becomes clear that, to represent a floating-point number in computers,
we will simply assign some bits for _significand_ and some for _exponent_, and
potentially a bit for _sign_ and that's it.


IEEE-754 32-bits Single-Precision Floats 单精度浮点数
----------------------------------------

- <https://en.wikipedia.org/wiki/Single-precision_floating-point_format>

It was called **single** back to IEEE-754-1985 and now **binary32** in the 
relatively new IEEE-754-2008 standard.

```cpp
       (8 bits)             (23 bits)
sign   exponent             fraction 
  0   011 1111 1    000 0000 0000 0000 0000 0000

 31   30 .... 23    22 ....................... 0
```

- The _sign_ part took 1 bit to indicate the sign of the floats
- The _exponent_ part took 8 bits and represent a signed integer in _biased form_.
It's a variant of _excess-128_ since it took out the `-127` (all 0s) and `128` 
(all 1s) for special numbers, so instead of unsigned `128`, the `u127` represent 
the actual `0`, and ranges `[-126, 127]` instead of `[-127, 128]`.
- The _fraction_ part took 23 bits with an _implicit leading bit_ `1` and
represent the actual _significand_ in total precision of 24-bits. 

Don't be confused by why it's called _fraction_ instead of _significand_! 
It's all because that the 23 bits in the representation is indeed, representing 
the fraction part of the real significand in the scientific notation.

The floating-point version of "scientific notation" is more like:

```cpp
(leading 1) 
   1. fraction  ×  2 ^ exponent   ×  sign
      (base-2)           (base-2)
```

So what number does the above bits represent?

```cpp
S     F   ×  E  =  R
+  1.(0)  ×  0  =  1
```

Aha! It's the real number `1`! 
Recall that the `E = 0b0111 1111 = 0` because it used a biased representation!



Code Sample
-----------

Writing sample code converting between binaries (in hex) and floats are not
as straightforward as it for integers. Luckily, there are still some hacks to 
perform it: 

### C - Unsafe Cast

We unsafely cast a pointer to enable reinterpretation of the same binaries.

```cpp
float f1 = 0x3f800000; // C doesn't have a floating literal taking hex.
printf("%f \n", f1);   // 1065353216.000000 (???)

uint32_t u2 = 0x3f800000;
float* f2 = (float*)&u2;   // unsafe cast
printf("%f \n", *f2);      // 1.000000
```

### C - Union Trick

Oh I really enjoyed this one...Union in C is not only untagged union, but also
share the exact same chunk of memory. So we are doing the same reinterpretation,
but in a more structural and technically fancier way.

```cpp
#include <stdint.h>
#include <inttypes.h>
#include <math.h>

float pi = (float)M_PI;
union {
    float f;
    uint32_t u;
} f2u = { .f = pi };  // we took the data as float

printf ("pi : %f\n   : 0x%" PRIx32 "\n", pi, f2u.u);  // but interpret as uint32_t
pi : 3.141593
   : 0x40490fdb
```

N.B. this trick is well-known as [type punning](https://en.wikipedia.org/wiki/Type_punning):

> In computer science, type punning is a common term for any programming technique that subverts or circumvents the type system of a programming language in order to achieve an effect that would be difficult or impossible to achieve within the bounds of the formal language.

### C++ - `reinterpret_cast`

C++ does provide such type punning to the standard language:

```cpp
uint32_t u = 0x40490fdb;
float a = *reinterpret_cast<float*>(&u);
std::cout << a;  // 3.14159
```

N.B. it still need to be a conversion between pointers, 
see <https://en.cppreference.com/w/cpp/language/reinterpret_cast>.

Besides, C++ 17 does add a floating point literal that can take hex, but it
works in a different way, using an explicit radix point in the hex:

```cpp
float f = 0x1.2p3;  // 1.2 by 2^3
std::cout << f;     // 9
```


IEEE-754 64-bits Double-Precision Floats
----------------------------------------

- <https://en.wikipedia.org/wiki/Double-precision_floating-point_format>

Now, the 64-bit versions floating-point number, known as `double`, is just a
matter of scale:

```cpp
       (11 bits)            (52 bits)
sign   exponent             fraction 
  0                 

 63   62 .... 52    51 ....................... 0
```


References
----------

- <https://en.wikipedia.org/wiki/Floating-point_arithmetic>
- <https://www3.ntu.edu.sg/home/ehchua/programming/java/datarepresentation.html>