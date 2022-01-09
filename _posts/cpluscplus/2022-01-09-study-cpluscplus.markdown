---
layout:     post
title:      "C++ - SASM 환경설정 & Assembly"
subtitle:   "SASM 설치하고 어셈블리 알아보기"
date:       2021-09-18 12:00:00
author:     "yu2jeong"
header-style: text
catalog: true
tags:
    - C++
---



- 해당 내용은 [[C++과 언리얼로 만드는 MMORPG 게임 개발 시리즈] Part1: C++ 프로그래밍 입문 강의](https://www.inflearn.com/course/%EC%96%B8%EB%A6%AC%EC%96%BC-3d-mmorpg-1)를 듣고 요약한 내용입니다.

# [ 1 ] SASM 설치하기



### 1) SASM 설치하기

[SASM](https://dman95.github.io/SASM/english.html)

### 2) 설정

![SASMSetting](/img/in-post/cpluscplus/2022-01-09-study-cpluscplus/SASMSetting.png)

- Setting > Setting 창 열기
- Build 탭 선택
- 컴퓨터에 맞는 Mode 설정
- Assembly `NASM` 설정


<p id = "build"></p>

# [ 2 ] SASM Hello World 해보기

### 1) 새 프로젝트 생성

![SASMSetting0](/img/in-post/cpluscplus/2022-01-09-study-cpluscplus/SASMSetting0.png)

- Create new project 설정

### 2) Hello World 출력해보기

```assembly
%include "io64.inc"

section .text
global CMAIN
CMAIN:
	;write your code here

	PRINT_STRING msg
	
	xor rax, rax
	ret

section .data
	msg db 'Hello World' 0x00
```

### 3) 실행파일 만들기

![SASMSetting1](/img/in-post/cpluscplus/2022-01-09-study-cpluscplus/SASMSetting1.png)

### 4) 실행파일 터미널에서 실행

![SASMSetting2](/img/in-post/cpluscplus/2022-01-09-study-cpluscplus/SASMSetting2.png)

- 파일 브라우저에서 열면 결과 확인 안됨

# [ 3 ] 어셈블리 언어

------

- 언어 → 기계어로 변환하기
- 변환하는 것을 SASM이 해줌

## 1) 어셈블러 ?

- 번역기의 역할
- section .text
- section .data

## 2) 실행 파일 구조

![SASMSetting3](/img/in-post/cpluscplus/2022-01-09-study-cpluscplus/SASMSetting3.png)

- 코드는 `section. text` 영역에 저장
- 데이터는 `section .data` 영역에 저장
- 실행파일 : 코드 + 데이터가 하나의 **파일**로 되어있음

## 3) 컴퓨터 구조

![SASMSetting4](/img/in-post/cpluscplus/2022-01-09-study-cpluscplus/SASMSetting4.png)

### 주요 부품

- CPU : 뇌역할
- Main Memory :
  - 전원 내렸을때 데이터 보존 안됨 (휘발성)
  - 데이터 접근 빠름
- 레지스터 :
- 하드디스크 :
  - 전원 내렸을때 데이터 보존 됨
  - 데이터 접근 느림

### 상황별 메모리 

특정 프로그램을 설치하면

- 하드디스크에 위 실팽파일 구조로 저장됨

특정 프로그램을 실행하면

- 메인 메모리에 해당 파일 데이터가 복사되어 올라감
- CPU ↔ 레지스터 ↔ 메모리에 왔다갔다가 하며 프로그램 실행됨

## 4) 메모리 구조

![SASMSetting5](/img/in-post/cpluscplus/2022-01-09-study-cpluscplus/SASMSetting5.png)

- Yu2jeong Blog.
