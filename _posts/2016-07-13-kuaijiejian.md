---
layout:     post
title:      "Emmet使用手册"
subtitle:   "资料备忘"
date:       2016-07-13
author:     "Teng"
header-img: "img/post-bg-ppt.jpg"
catalog: true
tags:
    - 编程
    - Reading
    - Learning
---


<!DOCTYPE html>
<!-- saved from url=(0033)http://docs.emmet.io/cheat-sheet/ -->
<html class="no-js"><!--<![endif]--><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<meta http-equiv="X-UA-Compatible" content="chrome=1">
<title>Cheat Sheet</title>
<link rel="shortcut icon" href="http://docs.emmet.io/-/3755353140/favicon.ico">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<link rel="stylesheet" href="./Cheat Sheet_files/main.css"><link rel="stylesheet" href="./Cheat Sheet_files/cheatsheet.css">
<script type="text/javascript" async="" src="./Cheat Sheet_files/ga.js"></script><script id="_carbonads_projs" type="text/javascript" src="http://srv.carbonads.net/ads/C6AILKT.json?segment=placement:emmetio&amp;callback=_carbonads_go"></script><style id="style-1-cropbar-clipper">/* Copyright 2014 Evernote Corporation. All rights reserved. */
.en-markup-crop-options {
    top: 18px !important;
    left: 50% !important;
    margin-left: -100px !important;
    width: 200px !important;
    border: 2px rgba(255,255,255,.38) solid !important;
    border-radius: 4px !important;
}

.en-markup-crop-options div div:first-of-type {
    margin-left: 0px !important;
}
</style></head>
<body>
	<div class="wrapper">
		<header class="page-header">
			<h1 class="site-title">

				<a href="http://docs.emmet.io/">Emmet Documentation</a>

			</h1>
			<p class="back-to-main"><a href="http://emmet.io/">Back to main website</a></p>
			<div id="carbonads-container">
				<div class="carbonad">
					<script async="" type="text/javascript" src="./Cheat Sheet_files/carbon.js" id="_carbonads_js"></script><div id="carbonads"><span><span class="carbon-wrap"><a href="http://srv.carbonads.net/ads/click/x/GTND423NFT7IK27NFTS4YKQWCYADC2QUF6SDVZ3JCESDEKJUCEADKK7KC6BDK53ICYADTK3EHJNCLSIZ?segment=placement:emmetio;" class="carbon-img" target="_blank"><img src="./Cheat Sheet_files/28114" alt="" border="0" height="100" width="130" style="max-width:130px;"></a><a href="http://srv.carbonads.net/ads/click/x/GTND423NFT7IK27NFTS4YKQWCYADC2QUF6SDVZ3JCESDEKJUCEADKK7KC6BDK53ICYADTK3EHJNCLSIZ?segment=placement:emmetio;" class="carbon-text" target="_blank">Integrate once. Access 180+ different analytics and marketing tools. Try Segment today. </a></span><a href="http://carbonads.net/" class="carbon-poweredby" target="_blank">ads via Carbon</a></span></div>
				</div>
			</div>
			<nav>


<ul class="nav">

		<li class="nav__item">

				<a href="http://docs.emmet.io/abbreviations/">Abbreviations</a>



<ul class="nav">

		<li class="nav__item">

				<a href="http://docs.emmet.io/abbreviations/syntax/">Syntax</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/abbreviations/types/">Element types</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/abbreviations/implicit-names/">Implicit tag names</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/abbreviations/lorem-ipsum/">“Lorem Ipsum” generator</a>


		</li>

</ul>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/css-abbreviations/">CSS Abbreviations</a>



<ul class="nav">

		<li class="nav__item">

				<a href="http://docs.emmet.io/css-abbreviations/vendor-prefixes/">Vendor prefixes</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/css-abbreviations/gradients/">Gradients</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/css-abbreviations/fuzzy-search/">Fuzzy search</a>


		</li>

</ul>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/actions/">Actions</a>



<ul class="nav">

		<li class="nav__item">

				<a href="http://docs.emmet.io/actions/expand-abbreviation/">Expand Abbreviation</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/actions/match-pair/">Balance</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/actions/go-to-pair/">Go to Matching Pair</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/actions/wrap-with-abbreviation/">Wrap with Abbreviation</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/actions/go-to-edit-point/">Go to Edit Point</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/actions/select-item/">Select Item</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/actions/toggle-comment/">Toggle Comment</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/actions/split-join-tag/">Split/Join Tag</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/actions/remove-tag/">Remove Tag</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/actions/merge-lines/">Merge Lines</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/actions/update-image-size/">Update Image Size</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/actions/evaluate-math/">Evaluate Math Expression</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/actions/inc-dec-number/">Increment/Decrement Number</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/actions/reflect-css-value/">Reflect CSS Value</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/actions/base64/">Encode/Decode Image to data:URL</a>


		</li>

</ul>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/filters/">Filters</a>



<ul class="nav">

		<li class="nav__item">

				<a href="http://docs.emmet.io/filters/bem/">Yandex BEM/OOCSS</a>


		</li>

</ul>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/customization/">Customization</a>



<ul class="nav">

		<li class="nav__item">

				<a href="http://docs.emmet.io/customization/snippets/">snippets.json</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/customization/preferences/">preferences.json</a>


		</li>

		<li class="nav__item">

				<a href="http://docs.emmet.io/customization/syntax-profiles/">syntaxProfiles.json</a>


		</li>

</ul>


		</li>

		<li class="nav__item nav__item_selected">

				<strong>Cheat Sheet</strong>


		</li>

</ul>

			</nav>
			<div class="more-tools">
				<p class="more-tools__title">More developer tools:</p>
				<ul class="more-tools__list">
					<li class="more-tools__list-item more-tools__list-item_livestyle">
						<a href="http://livestyle.io/" class="more-tools__list-item-link">
							Emmet LiveStyle
							<div class="more-tools__list-item-info">Real-time bi-directional edit tool for CSS, LESS and SCSS.</div>
						</a>
					</li>
					<li class="more-tools__list-item more-tools__list-item_review">
						<a href="http://re-view.emmet.io/" class="more-tools__list-item-link">
							Emmet Re:view
							<div class="more-tools__list-item-info">Fast and easy way to test responsive design side-by-side.</div>
						</a>
					</li>
				</ul>
			</div>
		</header>
		<section class="page-content">
			<div id="cheatsheet"><section class="ch-section ch-section_syntax">
	<h2 class="ch-section__title">Syntax</h2>
	<div class="ch-section__desc"></div>
	<div class="ch-section__content"><section class="ch-subsection">
	<h3 class="ch-subsection__title">Child: &gt;</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">nav&gt;ul&gt;li</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;nav&gt;
    &lt;ul&gt;
        &lt;li&gt;&lt;/li&gt;
    &lt;/ul&gt;
&lt;/nav&gt;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Sibling: +</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">div+p+bq</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;div&gt;&lt;/div&gt;
&lt;p&gt;&lt;/p&gt;
&lt;blockquote&gt;&lt;/blockquote&gt;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Climb-up: ^</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">div+div&gt;p&gt;span+em^bq</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;div&gt;&lt;/div&gt;
&lt;div&gt;
    &lt;p&gt;&lt;span&gt;&lt;/span&gt;&lt;em&gt;&lt;/em&gt;&lt;/p&gt;
    &lt;blockquote&gt;&lt;/blockquote&gt;
&lt;/div&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">div+div&gt;p&gt;span+em^^bq</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;div&gt;&lt;/div&gt;
&lt;div&gt;
    &lt;p&gt;&lt;span&gt;&lt;/span&gt;&lt;em&gt;&lt;/em&gt;&lt;/p&gt;
&lt;/div&gt;
&lt;blockquote&gt;&lt;/blockquote&gt;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Grouping: ()</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">div&gt;(header&gt;ul&gt;li*2&gt;a)+footer&gt;p</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;div&gt;
    &lt;header&gt;
        &lt;ul&gt;
            &lt;li&gt;&lt;a href=""&gt;&lt;/a&gt;&lt;/li&gt;
            &lt;li&gt;&lt;a href=""&gt;&lt;/a&gt;&lt;/li&gt;
        &lt;/ul&gt;
    &lt;/header&gt;
    &lt;footer&gt;
        &lt;p&gt;&lt;/p&gt;
    &lt;/footer&gt;
&lt;/div&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">(div&gt;dl&gt;(dt+dd)*3)+footer&gt;p</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;div&gt;
    &lt;dl&gt;
        &lt;dt&gt;&lt;/dt&gt;
        &lt;dd&gt;&lt;/dd&gt;
        &lt;dt&gt;&lt;/dt&gt;
        &lt;dd&gt;&lt;/dd&gt;
        &lt;dt&gt;&lt;/dt&gt;
        &lt;dd&gt;&lt;/dd&gt;
    &lt;/dl&gt;
&lt;/div&gt;
&lt;footer&gt;
    &lt;p&gt;&lt;/p&gt;
&lt;/footer&gt;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Multiplication: *</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">ul&gt;li*5</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;ul&gt;
    &lt;li&gt;&lt;/li&gt;
    &lt;li&gt;&lt;/li&gt;
    &lt;li&gt;&lt;/li&gt;
    &lt;li&gt;&lt;/li&gt;
    &lt;li&gt;&lt;/li&gt;
&lt;/ul&gt;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Item numbering: $</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">ul&gt;li.item$*5</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;ul&gt;
    &lt;li class="item1"&gt;&lt;/li&gt;
    &lt;li class="item2"&gt;&lt;/li&gt;
    &lt;li class="item3"&gt;&lt;/li&gt;
    &lt;li class="item4"&gt;&lt;/li&gt;
    &lt;li class="item5"&gt;&lt;/li&gt;
&lt;/ul&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">h$[title=item$]{Header $}*3</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;h1 title="item1"&gt;Header 1&lt;/h1&gt;
&lt;h2 title="item2"&gt;Header 2&lt;/h2&gt;
&lt;h3 title="item3"&gt;Header 3&lt;/h3&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ul&gt;li.item$$$*5</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;ul&gt;
    &lt;li class="item001"&gt;&lt;/li&gt;
    &lt;li class="item002"&gt;&lt;/li&gt;
    &lt;li class="item003"&gt;&lt;/li&gt;
    &lt;li class="item004"&gt;&lt;/li&gt;
    &lt;li class="item005"&gt;&lt;/li&gt;
&lt;/ul&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ul&gt;li.item$@-*5</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;ul&gt;
    &lt;li class="item5"&gt;&lt;/li&gt;
    &lt;li class="item4"&gt;&lt;/li&gt;
    &lt;li class="item3"&gt;&lt;/li&gt;
    &lt;li class="item2"&gt;&lt;/li&gt;
    &lt;li class="item1"&gt;&lt;/li&gt;
&lt;/ul&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ul&gt;li.item$@3*5</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;ul&gt;
    &lt;li class="item3"&gt;&lt;/li&gt;
    &lt;li class="item4"&gt;&lt;/li&gt;
    &lt;li class="item5"&gt;&lt;/li&gt;
    &lt;li class="item6"&gt;&lt;/li&gt;
    &lt;li class="item7"&gt;&lt;/li&gt;
&lt;/ul&gt;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">ID and CLASS attributes</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">#header</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;div id="header"&gt;&lt;/div&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">.title</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;div class="title"&gt;&lt;/div&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">form#search.wide</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;form id="search" class="wide"&gt;&lt;/form&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">p.class1.class2.class3</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;p class="class1 class2 class3"&gt;&lt;/p&gt;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Custom attributes</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">p[title="Hello world"]</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;p title="Hello world"&gt;&lt;/p&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">td[rowspan=2 colspan=3 title]</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;td rowspan="2" colspan="3" title=""&gt;&lt;/td&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">[a='value1' b="value2"]</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;div a="value1" b="value2"&gt;&lt;/div&gt;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Text: {}</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">a{Click me}</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;a href=""&gt;Click me&lt;/a&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">p&gt;{Click }+a{here}+{ to continue}</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;p&gt;Click &lt;a href=""&gt;here&lt;/a&gt; to continue&lt;/p&gt;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Implicit tag names</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">.class</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;div class="class"&gt;&lt;/div&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">em&gt;.class</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;em&gt;&lt;span class="class"&gt;&lt;/span&gt;&lt;/em&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ul&gt;.class</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;ul&gt;
    &lt;li class="class"&gt;&lt;/li&gt;
&lt;/ul&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">table&gt;.row&gt;.col</dt>
	<dd class="ch-snippet__value ch-snippet__value_undefined">&lt;table&gt;
    &lt;tr class="row"&gt;
        &lt;td class="col"&gt;&lt;/td&gt;
    &lt;/tr&gt;
&lt;/table&gt;</dd>
	</dl>
	</section></div>
	</section><section class="ch-section ch-section_html">
	<h2 class="ch-section__title">HTML</h2>
	<div class="ch-section__desc"><p>All unknown abbreviations will be transformed to tag, e.g. <code>foo</code> → <code>&lt;foo&gt;&lt;/foo&gt;</code>.</p></div>
	<div class="ch-section__content"><dl class="ch-snippet">
	<dt class="ch-snippet__name">!</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">html:5</span></p>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8" /&gt;
    &lt;title&gt;<span class="ch-tabstop" title="Tabstop">Document</span>&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    <span class="ch-caret" title="Caret position"></span>
&lt;/body&gt;
&lt;/html&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">a</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;a href="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/a&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">a:link</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;a href="http://<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/a&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">a:mail</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;a href="mailto:<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/a&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">abbr</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;abbr title="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/abbr&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">acronym, acr</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;acronym title="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/acronym&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">base</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;base href="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">basefont</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;basefont /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">br</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;br /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">frame</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;frame /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">hr</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;hr /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdo</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;bdo dir="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/bdo&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdo:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;bdo dir="rtl"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/bdo&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdo:l</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;bdo dir="ltr"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/bdo&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">col</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;col /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">link</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;link rel="stylesheet" href="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">link:css</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;link rel="stylesheet" href="<span class="ch-tabstop" title="Tabstop">style</span>.css" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">link:print</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;link rel="stylesheet" href="<span class="ch-tabstop" title="Tabstop">print</span>.css" media="print" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">link:favicon</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;link rel="shortcut icon" type="image/x-icon" href="<span class="ch-tabstop" title="Tabstop">favicon.ico</span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">link:touch</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;link rel="apple-touch-icon" href="<span class="ch-tabstop" title="Tabstop">favicon.png</span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">link:rss</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;link rel="alternate" type="application/rss+xml" title="RSS" href="<span class="ch-tabstop" title="Tabstop">rss.xml</span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">link:atom</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;link rel="alternate" type="application/atom+xml" title="Atom" href="<span class="ch-tabstop" title="Tabstop">atom.xml</span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">link:import, link:im</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;link rel="import" href="<span class="ch-tabstop" title="Tabstop">component</span>.html" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">meta</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;meta /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">meta:utf</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;meta http-equiv="Content-Type" content="text/html;charset=UTF-8" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">meta:win</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;meta http-equiv="Content-Type" content="text/html;charset=windows-1251" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">meta:vp</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;meta name="viewport" content="width=<span class="ch-tabstop" title="Tabstop">device-width</span>, user-scalable=<span class="ch-tabstop" title="Tabstop">no</span>, initial-scale=<span class="ch-tabstop" title="Tabstop">1.0</span>, maximum-scale=<span class="ch-tabstop" title="Tabstop">1.0</span>, minimum-scale=<span class="ch-tabstop" title="Tabstop">1.0</span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">meta:compat</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;meta http-equiv="X-UA-Compatible" content="<span class="ch-tabstop" title="Tabstop">IE=7</span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">style</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;style&gt;<span class="ch-caret" title="Caret position"></span>&lt;/style&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">script</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;script&gt;<span class="ch-caret" title="Caret position"></span>&lt;/script&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">script:src</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;script src="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/script&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">img</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;img src="<span class="ch-caret" title="Caret position"></span>" alt="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">img:srcset, img:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;img srcset="<span class="ch-caret" title="Caret position"></span>" src="<span class="ch-caret" title="Caret position"></span>" alt="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">img:sizes, img:z</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;img sizes="<span class="ch-caret" title="Caret position"></span>" srcset="<span class="ch-caret" title="Caret position"></span>" src="<span class="ch-caret" title="Caret position"></span>" alt="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">picture</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;picture&gt;<span class="ch-caret" title="Caret position"></span>&lt;/picture&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">source, src</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;source /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">source:src, src:sc</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;source src="<span class="ch-caret" title="Caret position"></span>" type="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">source:srcset, src:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;source srcset="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">source:media, src:m</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;source media="(<span class="ch-tabstop" title="Tabstop">min-width: </span>)" srcset="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">source:type, src:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;source srcset="<span class="ch-caret" title="Caret position"></span>" type="<span class="ch-tabstop" title="Tabstop">image/</span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">source:sizes, src:z</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;source sizes="<span class="ch-caret" title="Caret position"></span>" srcset="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">source:media:type, src:mt</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;source media="(<span class="ch-tabstop" title="Tabstop">min-width: </span>)" srcset="<span class="ch-caret" title="Caret position"></span>" type="<span class="ch-tabstop" title="Tabstop">image/</span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">source:media:sizes, src:mz</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;source media="(<span class="ch-tabstop" title="Tabstop">min-width: </span>)" sizes="<span class="ch-caret" title="Caret position"></span>" srcset="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">source:sizes:type, src:zt</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;source sizes="<span class="ch-caret" title="Caret position"></span>" srcset="<span class="ch-caret" title="Caret position"></span>" type="<span class="ch-tabstop" title="Tabstop">image/</span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">iframe</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;iframe src="<span class="ch-caret" title="Caret position"></span>" frameborder="0"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/iframe&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">embed</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;embed src="<span class="ch-caret" title="Caret position"></span>" type="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">object</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;object data="<span class="ch-caret" title="Caret position"></span>" type="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/object&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">param</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;param name="<span class="ch-caret" title="Caret position"></span>" value="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">map</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;map name="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/map&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">area</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;area shape="<span class="ch-caret" title="Caret position"></span>" coords="<span class="ch-caret" title="Caret position"></span>" href="<span class="ch-caret" title="Caret position"></span>" alt="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">area:d</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;area shape="default" href="<span class="ch-caret" title="Caret position"></span>" alt="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">area:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;area shape="circle" coords="<span class="ch-caret" title="Caret position"></span>" href="<span class="ch-caret" title="Caret position"></span>" alt="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">area:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;area shape="rect" coords="<span class="ch-caret" title="Caret position"></span>" href="<span class="ch-caret" title="Caret position"></span>" alt="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">area:p</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;area shape="poly" coords="<span class="ch-caret" title="Caret position"></span>" href="<span class="ch-caret" title="Caret position"></span>" alt="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">form</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;form action="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/form&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">form:get</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;form action="<span class="ch-caret" title="Caret position"></span>" method="get"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/form&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">form:post</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;form action="<span class="ch-caret" title="Caret position"></span>" method="post"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/form&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">label</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;label for="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/label&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;input type="<span class="ch-tabstop" title="Tabstop">text</span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">inp</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;input type="<span class="ch-tabstop" title="Tabstop">text</span>" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:hidden, input:h</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">input[type=hidden name]</span></p>&lt;input type="hidden" name="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:text, input:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp</span></p>&lt;input type="<span class="ch-tabstop" title="Tabstop">text</span>" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:search</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=search]</span></p>&lt;input type="search" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:email</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=email]</span></p>&lt;input type="email" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:url</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=url]</span></p>&lt;input type="url" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:password, input:p</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=password]</span></p>&lt;input type="password" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:datetime</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=datetime]</span></p>&lt;input type="datetime" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:date</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=date]</span></p>&lt;input type="date" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:datetime-local</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=datetime-local]</span></p>&lt;input type="datetime-local" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:month</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=month]</span></p>&lt;input type="month" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:week</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=week]</span></p>&lt;input type="week" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:time</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=time]</span></p>&lt;input type="time" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:tel</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=tel]</span></p>&lt;input type="tel" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:number</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=number]</span></p>&lt;input type="number" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:color</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=color]</span></p>&lt;input type="color" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:checkbox, input:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=checkbox]</span></p>&lt;input type="checkbox" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:radio, input:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=radio]</span></p>&lt;input type="radio" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:range</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=range]</span></p>&lt;input type="range" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:file, input:f</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">inp[type=file]</span></p>&lt;input type="file" name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:submit, input:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;input type="submit" value="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:image, input:i</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;input type="image" src="<span class="ch-caret" title="Caret position"></span>" alt="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:button, input:b</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;input type="button" value="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">isindex</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;isindex /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">input:reset</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">input:button[type=reset]</span></p>&lt;input type="reset" value="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">select</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;select name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/select&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">select:disabled, select:d</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">select[disabled.]</span></p>&lt;select name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" disabled="disabled"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/select&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">option, opt</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;option value="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/option&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">textarea</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;textarea name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" cols="<span class="ch-tabstop" title="Tabstop">30</span>" rows="<span class="ch-tabstop" title="Tabstop">10</span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/textarea&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">marquee</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;marquee behavior="<span class="ch-caret" title="Caret position"></span>" direction="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/marquee&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">menu:context, menu:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">menu[type=context]&gt;</span></p>&lt;menu type="context"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/menu&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">menu:toolbar, menu:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">menu[type=toolbar]&gt;</span></p>&lt;menu type="toolbar"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/menu&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">video</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;video src="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/video&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">audio</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;audio src="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/audio&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">html:xml</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/html&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">keygen</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;keygen /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">command</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;command /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">button:submit, button:s, btn:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">button[type=submit]</span></p>&lt;button type="submit"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/button&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">button:reset, button:r, btn:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">button[type=reset]</span></p>&lt;button type="reset"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/button&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">button:disabled, button:d, btn:d</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">button[disabled.]</span></p>&lt;button disabled="disabled"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/button&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fieldset:disabled, fieldset:d, fset:d, fst:d</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">fieldset[disabled.]</span></p>&lt;fieldset disabled="disabled"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/fieldset&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bq</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">blockquote</span></p>&lt;blockquote&gt;<span class="ch-caret" title="Caret position"></span>&lt;/blockquote&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fig</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">figure</span></p>&lt;figure&gt;<span class="ch-caret" title="Caret position"></span>&lt;/figure&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">figc</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">figcaption</span></p>&lt;figcaption&gt;<span class="ch-caret" title="Caret position"></span>&lt;/figcaption&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pic</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">picture</span></p>&lt;picture&gt;<span class="ch-caret" title="Caret position"></span>&lt;/picture&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ifr</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">iframe</span></p>&lt;iframe src="<span class="ch-caret" title="Caret position"></span>" frameborder="0"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/iframe&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">emb</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">embed</span></p>&lt;embed src="<span class="ch-caret" title="Caret position"></span>" type="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">obj</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">object</span></p>&lt;object data="<span class="ch-caret" title="Caret position"></span>" type="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/object&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cap</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">caption</span></p>&lt;caption&gt;<span class="ch-caret" title="Caret position"></span>&lt;/caption&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">colg</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">colgroup</span></p>&lt;colgroup&gt;<span class="ch-caret" title="Caret position"></span>&lt;/colgroup&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fst, fset</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">fieldset</span></p>&lt;fieldset&gt;<span class="ch-caret" title="Caret position"></span>&lt;/fieldset&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">btn</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">button</span></p>&lt;button&gt;<span class="ch-caret" title="Caret position"></span>&lt;/button&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">optg</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">optgroup</span></p>&lt;optgroup&gt;<span class="ch-caret" title="Caret position"></span>&lt;/optgroup&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tarea</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">textarea</span></p>&lt;textarea name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>" cols="<span class="ch-tabstop" title="Tabstop">30</span>" rows="<span class="ch-tabstop" title="Tabstop">10</span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/textarea&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">leg</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">legend</span></p>&lt;legend&gt;<span class="ch-caret" title="Caret position"></span>&lt;/legend&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">sect</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">section</span></p>&lt;section&gt;<span class="ch-caret" title="Caret position"></span>&lt;/section&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">art</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">article</span></p>&lt;article&gt;<span class="ch-caret" title="Caret position"></span>&lt;/article&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">hdr</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">header</span></p>&lt;header&gt;<span class="ch-caret" title="Caret position"></span>&lt;/header&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ftr</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">footer</span></p>&lt;footer&gt;<span class="ch-caret" title="Caret position"></span>&lt;/footer&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">adr</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">address</span></p>&lt;address&gt;<span class="ch-caret" title="Caret position"></span>&lt;/address&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">dlg</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">dialog</span></p>&lt;dialog&gt;<span class="ch-caret" title="Caret position"></span>&lt;/dialog&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">str</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">strong</span></p>&lt;strong&gt;<span class="ch-caret" title="Caret position"></span>&lt;/strong&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">prog</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">progress</span></p>&lt;progress&gt;<span class="ch-caret" title="Caret position"></span>&lt;/progress&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">mn</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">main</span></p>&lt;main&gt;<span class="ch-caret" title="Caret position"></span>&lt;/main&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tem</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">template</span></p>&lt;template&gt;<span class="ch-caret" title="Caret position"></span>&lt;/template&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">datag</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">datagrid</span></p>&lt;datagrid&gt;<span class="ch-caret" title="Caret position"></span>&lt;/datagrid&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">datal</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">datalist</span></p>&lt;datalist&gt;<span class="ch-caret" title="Caret position"></span>&lt;/datalist&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">kg</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">keygen</span></p>&lt;keygen /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">out</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">output</span></p>&lt;output&gt;<span class="ch-caret" title="Caret position"></span>&lt;/output&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">det</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">details</span></p>&lt;details&gt;<span class="ch-caret" title="Caret position"></span>&lt;/details&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cmd</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">command</span></p>&lt;command /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">doc</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">html&gt;(head&gt;meta[charset=${charset}]+title{${1:Document}})+body</span></p>&lt;html&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8" /&gt;
    &lt;title&gt;<span class="ch-tabstop" title="Tabstop">Document</span>&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    <span class="ch-caret" title="Caret position"></span>
&lt;/body&gt;
&lt;/html&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">doc4</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">html&gt;(head&gt;meta[http-equiv="Content-Type" content="text/html;charset=${charset}"]+title{${1:Document}})+body</span></p>&lt;html&gt;
&lt;head&gt;
    &lt;meta http-equiv="Content-Type" content="text/html;charset=UTF-8" /&gt;
    &lt;title&gt;<span class="ch-tabstop" title="Tabstop">Document</span>&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    <span class="ch-caret" title="Caret position"></span>
&lt;/body&gt;
&lt;/html&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ri:dpr, ri:d</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">img:s</span></p>&lt;img srcset="<span class="ch-caret" title="Caret position"></span>" src="<span class="ch-caret" title="Caret position"></span>" alt="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ri:viewport, ri:v</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">img:z</span></p>&lt;img sizes="<span class="ch-caret" title="Caret position"></span>" srcset="<span class="ch-caret" title="Caret position"></span>" src="<span class="ch-caret" title="Caret position"></span>" alt="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ri:art, ri:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">pic&gt;src:m+img</span></p>&lt;picture&gt;
    &lt;source media="(<span class="ch-tabstop" title="Tabstop">min-width: </span>)" srcset="<span class="ch-caret" title="Caret position"></span>" /&gt;
    &lt;img src="<span class="ch-caret" title="Caret position"></span>" alt="<span class="ch-caret" title="Caret position"></span>" /&gt;
&lt;/picture&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ri:type, ri:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">pic&gt;src:t+img</span></p>&lt;picture&gt;
    &lt;source srcset="<span class="ch-caret" title="Caret position"></span>" type="<span class="ch-tabstop" title="Tabstop">image/</span>" /&gt;
    &lt;img src="<span class="ch-caret" title="Caret position"></span>" alt="<span class="ch-caret" title="Caret position"></span>" /&gt;
&lt;/picture&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">html:4t</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">!!!4t+doc4[lang=${lang}]</span></p>&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta http-equiv="Content-Type" content="text/html;charset=UTF-8" /&gt;
    &lt;title&gt;<span class="ch-tabstop" title="Tabstop">Document</span>&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    <span class="ch-caret" title="Caret position"></span>
&lt;/body&gt;
&lt;/html&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">html:4s</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">!!!4s+doc4[lang=${lang}]</span></p>&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta http-equiv="Content-Type" content="text/html;charset=UTF-8" /&gt;
    &lt;title&gt;<span class="ch-tabstop" title="Tabstop">Document</span>&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    <span class="ch-caret" title="Caret position"></span>
&lt;/body&gt;
&lt;/html&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">html:xt</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">!!!xt+doc4[xmlns=http://www.w3.org/1999/xhtml xml:lang=${lang}]</span></p>&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"&gt;
&lt;head&gt;
    &lt;meta http-equiv="Content-Type" content="text/html;charset=UTF-8" /&gt;
    &lt;title&gt;<span class="ch-tabstop" title="Tabstop">Document</span>&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    <span class="ch-caret" title="Caret position"></span>
&lt;/body&gt;
&lt;/html&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">html:xs</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">!!!xs+doc4[xmlns=http://www.w3.org/1999/xhtml xml:lang=${lang}]</span></p>&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"&gt;
&lt;head&gt;
    &lt;meta http-equiv="Content-Type" content="text/html;charset=UTF-8" /&gt;
    &lt;title&gt;<span class="ch-tabstop" title="Tabstop">Document</span>&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    <span class="ch-caret" title="Caret position"></span>
&lt;/body&gt;
&lt;/html&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">html:xxs</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">!!!xxs+doc4[xmlns=http://www.w3.org/1999/xhtml xml:lang=${lang}]</span></p>&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"&gt;
&lt;head&gt;
    &lt;meta http-equiv="Content-Type" content="text/html;charset=UTF-8" /&gt;
    &lt;title&gt;<span class="ch-tabstop" title="Tabstop">Document</span>&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    <span class="ch-caret" title="Caret position"></span>
&lt;/body&gt;
&lt;/html&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">html:5</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">!!!+doc[lang=${lang}]</span></p>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8" /&gt;
    &lt;title&gt;<span class="ch-tabstop" title="Tabstop">Document</span>&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    <span class="ch-caret" title="Caret position"></span>
&lt;/body&gt;
&lt;/html&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ol+</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">ol&gt;li</span></p>&lt;ol&gt;
    &lt;li&gt;<span class="ch-caret" title="Caret position"></span>&lt;/li&gt;
&lt;/ol&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ul+</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">ul&gt;li</span></p>&lt;ul&gt;
    &lt;li&gt;<span class="ch-caret" title="Caret position"></span>&lt;/li&gt;
&lt;/ul&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">dl+</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">dl&gt;dt+dd</span></p>&lt;dl&gt;
    &lt;dt&gt;<span class="ch-caret" title="Caret position"></span>&lt;/dt&gt;
    &lt;dd&gt;<span class="ch-caret" title="Caret position"></span>&lt;/dd&gt;
&lt;/dl&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">map+</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">map&gt;area</span></p>&lt;map name="<span class="ch-caret" title="Caret position"></span>"&gt;
    &lt;area shape="<span class="ch-caret" title="Caret position"></span>" coords="<span class="ch-caret" title="Caret position"></span>" href="<span class="ch-caret" title="Caret position"></span>" alt="<span class="ch-caret" title="Caret position"></span>" /&gt;
&lt;/map&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">table+</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">table&gt;tr&gt;td</span></p>&lt;table&gt;
    &lt;tr&gt;
        &lt;td&gt;<span class="ch-caret" title="Caret position"></span>&lt;/td&gt;
    &lt;/tr&gt;
&lt;/table&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">colgroup+, colg+</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">colgroup&gt;col</span></p>&lt;colgroup&gt;
    &lt;col /&gt;
&lt;/colgroup&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tr+</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">tr&gt;td</span></p>&lt;tr&gt;
    &lt;td&gt;<span class="ch-caret" title="Caret position"></span>&lt;/td&gt;
&lt;/tr&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">select+</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">select&gt;option</span></p>&lt;select name="<span class="ch-caret" title="Caret position"></span>" id="<span class="ch-caret" title="Caret position"></span>"&gt;
    &lt;option value="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/option&gt;
&lt;/select&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">optgroup+, optg+</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">optgroup&gt;option</span></p>&lt;optgroup&gt;
    &lt;option value="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/option&gt;
&lt;/optgroup&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pic+</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">picture&gt;source:srcset+img</span></p>&lt;picture&gt;
    &lt;source srcset="<span class="ch-caret" title="Caret position"></span>" /&gt;
    &lt;img src="<span class="ch-caret" title="Caret position"></span>" alt="<span class="ch-caret" title="Caret position"></span>" /&gt;
&lt;/picture&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">!!!</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">&lt;!DOCTYPE html&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">!!!4t</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">!!!4s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">!!!xt</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">!!!xs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">!!!xxs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">&lt;!-- <span class="ch-caret" title="Caret position"></span>${child} --&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cc:ie6</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">&lt;!--[if lte IE 6]&gt;
    ${child}<span class="ch-caret" title="Caret position"></span>
&lt;![endif]--&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cc:ie</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">&lt;!--[if IE]&gt;
    ${child}<span class="ch-caret" title="Caret position"></span>
&lt;![endif]--&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cc:noie</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">&lt;!--[if !IE]&gt;&lt;!--&gt;
    ${child}<span class="ch-caret" title="Caret position"></span>
&lt;!--&lt;![endif]--&gt;</dd>
	</dl></div>
	</section><section class="ch-section ch-section_css">
	<h2 class="ch-section__title">CSS</h2>
	<div class="ch-section__desc"><p>CSS module uses fuzzy search to find unknown abbreviations, e.g. <code>ov:h</code> == <code>ov-h</code> == <code>ovh</code> == <code>oh</code>.</p>
		<p>If abbreviation wasn’t found, it is transformed into property name: <code>foo-bar</code> → <code>foo-bar: |;</code></p>
		<p>You can prefix abbreviations with hyphen to produce vendor-prefixed properties: <code>-foo</code></p></div>
	<div class="ch-section__content"><section class="ch-subsection">
	<h3 class="ch-subsection__title">Visual Formatting</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">pos</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">position:<span class="ch-tabstop" title="Tabstop">relative</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pos:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">position:static;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pos:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">position:absolute;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pos:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">position:relative;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pos:f</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">position:fixed;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">t</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">top:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">t:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">top:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">right:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">r:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">right:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">b</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">bottom:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">b:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">bottom:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">l</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">left:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">l:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">left:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">z</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">z-index:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">z:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">z-index:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fl</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">float:<span class="ch-tabstop" title="Tabstop">left</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fl:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">float:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fl:l</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">float:left;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fl:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">float:right;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cl</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">clear:<span class="ch-tabstop" title="Tabstop">both</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cl:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">clear:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cl:l</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">clear:left;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cl:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">clear:right;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cl:b</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">clear:both;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:<span class="ch-tabstop" title="Tabstop">block</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:b</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:block;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:f</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:flex;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:if</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:inline-flex;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:i</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:inline;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:ib</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:inline-block;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:li</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:list-item;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:ri</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:run-in;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:cp</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:compact;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:tb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:table;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:itb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:inline-table;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:tbcp</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:table-caption;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:tbcl</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:table-column;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:tbclg</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:table-column-group;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:tbhg</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:table-header-group;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:tbfg</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:table-footer-group;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:tbr</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:table-row;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:tbrg</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:table-row-group;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:tbc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:table-cell;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:rb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:ruby;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:rbb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:ruby-base;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:rbbg</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:ruby-base-group;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:rbt</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:ruby-text;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:rbtg</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display:ruby-text-group;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">v</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">visibility:<span class="ch-tabstop" title="Tabstop">hidden</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">v:v</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">visibility:visible;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">v:h</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">visibility:hidden;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">v:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">visibility:collapse;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ov</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow:<span class="ch-tabstop" title="Tabstop">hidden</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ov:v</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow:visible;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ov:h</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow:hidden;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ov:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow:scroll;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ov:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ovx</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow-x:<span class="ch-tabstop" title="Tabstop">hidden</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ovx:v</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow-x:visible;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ovx:h</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow-x:hidden;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ovx:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow-x:scroll;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ovx:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow-x:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ovy</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow-y:<span class="ch-tabstop" title="Tabstop">hidden</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ovy:v</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow-y:visible;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ovy:h</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow-y:hidden;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ovy:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow-y:scroll;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ovy:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow-y:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ovs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow-style:<span class="ch-tabstop" title="Tabstop">scrollbar</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ovs:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow-style:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ovs:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow-style:scrollbar;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ovs:p</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow-style:panner;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ovs:m</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow-style:move;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ovs:mq</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">overflow-style:marquee;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">zoo, zm</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">zoom:1;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cp</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">clip:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cp:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">clip:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cp:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">clip:rect(<span class="ch-tabstop" title="Tabstop">top</span> <span class="ch-tabstop" title="Tabstop">right</span> <span class="ch-tabstop" title="Tabstop">bottom</span> <span class="ch-tabstop" title="Tabstop">left</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">rsz</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">resize:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">rsz:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">resize:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">rsz:b</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">resize:both;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">rsz:h</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">resize:horizontal;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">rsz:v</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">resize:vertical;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cur</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">cursor:${pointer};</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cur:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">cursor:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cur:d</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">cursor:default;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cur:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">cursor:crosshair;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cur:ha</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">cursor:hand;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cur:he</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">cursor:help;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cur:m</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">cursor:move;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cur:p</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">cursor:pointer;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cur:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">cursor:text;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Margin &amp; Padding</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">m</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">margin:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">m:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">margin:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">mt</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">margin-top:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">mt:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">margin-top:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">mr</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">margin-right:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">mr:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">margin-right:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">mb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">margin-bottom:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">mb:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">margin-bottom:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ml</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">margin-left:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ml:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">margin-left:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">p</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">padding:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pt</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">padding-top:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pr</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">padding-right:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">padding-bottom:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pl</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">padding-left:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Box Sizing</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">bxz</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">box-sizing:<span class="ch-tabstop" title="Tabstop">border-box</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bxz:cb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">box-sizing:content-box;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bxz:bb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">box-sizing:border-box;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bxsh</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">box-shadow:<span class="ch-tabstop" title="Tabstop">inset </span><span class="ch-tabstop" title="Tabstop">hoff</span> <span class="ch-tabstop" title="Tabstop">voff</span> <span class="ch-tabstop" title="Tabstop">blur</span> <span class="ch-tabstop" title="Tabstop">color</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bxsh:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">box-shadow:<span class="ch-tabstop" title="Tabstop">inset </span><span class="ch-tabstop" title="Tabstop">hoff</span> <span class="ch-tabstop" title="Tabstop">voff</span> <span class="ch-tabstop" title="Tabstop">blur</span> <span class="ch-tabstop" title="Tabstop">spread </span>rgb(<span class="ch-tabstop" title="Tabstop">0</span>, <span class="ch-tabstop" title="Tabstop">0</span>, <span class="ch-tabstop" title="Tabstop">0</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bxsh:ra</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">box-shadow:<span class="ch-tabstop" title="Tabstop">inset </span><span class="ch-tabstop" title="Tabstop">h</span> <span class="ch-tabstop" title="Tabstop">v</span> <span class="ch-tabstop" title="Tabstop">blur</span> <span class="ch-tabstop" title="Tabstop">spread </span>rgba(<span class="ch-tabstop" title="Tabstop">0</span>, <span class="ch-tabstop" title="Tabstop">0</span>, <span class="ch-tabstop" title="Tabstop">0</span>, .<span class="ch-tabstop" title="Tabstop">5</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bxsh:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">box-shadow:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">w</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">width:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">w:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">width:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">h</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">height:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">h:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">height:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">maw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">max-width:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">maw:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">max-width:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">mah</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">max-height:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">mah:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">max-height:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">miw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">min-width:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">mih</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">min-height:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Font</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">f</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">f+</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font:<span class="ch-tabstop" title="Tabstop">1em</span> <span class="ch-tabstop" title="Tabstop">Arial,sans-serif</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-weight:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fw:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-weight:normal;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fw:b</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-weight:bold;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fw:br</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-weight:bolder;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fw:lr</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-weight:lighter;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-style:${italic};</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fs:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-style:normal;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fs:i</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-style:italic;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fs:o</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-style:oblique;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fv</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-variant:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fv:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-variant:normal;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fv:sc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-variant:small-caps;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fz</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-size:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fza</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-size-adjust:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fza:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-size-adjust:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ff</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-family:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ff:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-family:serif;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ff:ss</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-family:sans-serif;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ff:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-family:cursive;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ff:f</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-family:fantasy;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ff:m</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-family:monospace;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ff:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ff:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-family: "Times New Roman", Times, Baskerville, Georgia, serif;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ff:v</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-family: Verdana, Geneva, sans-serif;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fef</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-effect:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fef:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-effect:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fef:eg</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-effect:engrave;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fef:eb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-effect:emboss;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fef:o</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-effect:outline;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fem</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-emphasize:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">femp</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-emphasize-position:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">femp:b</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-emphasize-position:before;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">femp:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-emphasize-position:after;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fems</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-emphasize-style:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fems:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-emphasize-style:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fems:ac</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-emphasize-style:accent;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fems:dt</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-emphasize-style:dot;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fems:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-emphasize-style:circle;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fems:ds</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-emphasize-style:disc;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fsm</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-smooth:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fsm:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-smooth:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fsm:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-smooth:never;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fsm:aw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-smooth:always;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fst</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-stretch:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fst:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-stretch:normal;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fst:uc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-stretch:ultra-condensed;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fst:ec</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-stretch:extra-condensed;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fst:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-stretch:condensed;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fst:sc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-stretch:semi-condensed;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fst:se</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-stretch:semi-expanded;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fst:e</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-stretch:expanded;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fst:ee</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-stretch:extra-expanded;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fst:ue</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">font-stretch:ultra-expanded;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Text</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">va</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">vertical-align:<span class="ch-tabstop" title="Tabstop">top</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">va:sup</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">vertical-align:super;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">va:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">vertical-align:top;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">va:tt</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">vertical-align:text-top;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">va:m</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">vertical-align:middle;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">va:bl</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">vertical-align:baseline;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">va:b</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">vertical-align:bottom;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">va:tb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">vertical-align:text-bottom;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">va:sub</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">vertical-align:sub;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ta</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-align:<span class="ch-tabstop" title="Tabstop">left</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ta:l</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-align:left;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ta:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-align:center;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ta:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-align:right;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ta:j</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-align:justify;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ta-lst</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-align-last:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tal:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-align-last:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tal:l</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-align-last:left;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tal:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-align-last:center;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tal:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-align-last:right;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">td</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-decoration:<span class="ch-tabstop" title="Tabstop">none</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">td:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-decoration:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">td:u</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-decoration:underline;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">td:o</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-decoration:overline;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">td:l</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-decoration:line-through;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">te</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-emphasis:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">te:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-emphasis:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">te:ac</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-emphasis:accent;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">te:dt</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-emphasis:dot;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">te:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-emphasis:circle;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">te:ds</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-emphasis:disc;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">te:b</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-emphasis:before;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">te:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-emphasis:after;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">th</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-height:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">th:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-height:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">th:f</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-height:font-size;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">th:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-height:text-size;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">th:m</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-height:max-size;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ti</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-indent:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ti:-</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-indent:-9999px;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tj</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-justify:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tj:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-justify:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tj:iw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-justify:inter-word;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tj:ii</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-justify:inter-ideograph;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tj:ic</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-justify:inter-cluster;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tj:d</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-justify:distribute;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tj:k</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-justify:kashida;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tj:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-justify:tibetan;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">to</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-outline:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">to+</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-outline:<span class="ch-tabstop" title="Tabstop">0</span> <span class="ch-tabstop" title="Tabstop">0</span> <span class="ch-tabstop" title="Tabstop">#000</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">to:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-outline:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tr</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-replace:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tr:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-replace:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tt</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-transform:<span class="ch-tabstop" title="Tabstop">uppercase</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tt:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-transform:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tt:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-transform:capitalize;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tt:u</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-transform:uppercase;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tt:l</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-transform:lowercase;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-wrap:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tw:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-wrap:normal;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tw:no</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-wrap:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tw:u</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-wrap:unrestricted;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tw:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-wrap:suppress;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tsh</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-shadow:<span class="ch-tabstop" title="Tabstop">hoff</span> <span class="ch-tabstop" title="Tabstop">voff</span> <span class="ch-tabstop" title="Tabstop">blur</span> <span class="ch-tabstop" title="Tabstop">#000</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tsh:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-shadow:<span class="ch-tabstop" title="Tabstop">h</span> <span class="ch-tabstop" title="Tabstop">v</span> <span class="ch-tabstop" title="Tabstop">blur</span> rgb(<span class="ch-tabstop" title="Tabstop">0</span>, <span class="ch-tabstop" title="Tabstop">0</span>, <span class="ch-tabstop" title="Tabstop">0</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tsh:ra</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-shadow:<span class="ch-tabstop" title="Tabstop">h</span> <span class="ch-tabstop" title="Tabstop">v</span> <span class="ch-tabstop" title="Tabstop">blur</span> rgba(<span class="ch-tabstop" title="Tabstop">0</span>, <span class="ch-tabstop" title="Tabstop">0</span>, <span class="ch-tabstop" title="Tabstop">0</span>, .<span class="ch-tabstop" title="Tabstop">5</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tsh+</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-shadow:<span class="ch-tabstop" title="Tabstop">0</span> <span class="ch-tabstop" title="Tabstop">0</span> <span class="ch-tabstop" title="Tabstop">0</span> <span class="ch-tabstop" title="Tabstop">#000</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tsh:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-shadow:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">lh</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">line-height:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">lts</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">letter-spacing:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">lts-n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">letter-spacing:normal;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">whs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">white-space:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">whs:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">white-space:normal;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">whs:p</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">white-space:pre;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">whs:nw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">white-space:nowrap;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">whs:pw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">white-space:pre-wrap;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">whs:pl</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">white-space:pre-line;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">whsc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">white-space-collapse:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">whsc:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">white-space-collapse:normal;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">whsc:k</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">white-space-collapse:keep-all;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">whsc:l</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">white-space-collapse:loose;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">whsc:bs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">white-space-collapse:break-strict;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">whsc:ba</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">white-space-collapse:break-all;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wob</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">word-break:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wob:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">word-break:normal;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wob:k</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">word-break:keep-all;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wob:ba</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">word-break:break-all;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wos</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">word-spacing:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wow</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">word-wrap:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wow:nm</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">word-wrap:normal;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wow:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">word-wrap:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wow:u</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">word-wrap:unrestricted;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wow:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">word-wrap:suppress;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wow:b</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">word-wrap:break-word;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Background</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">bg</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background:#<span class="ch-tabstop" title="Tabstop">000</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bg+</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background:<span class="ch-tabstop" title="Tabstop">#fff</span> url(<span class="ch-caret" title="Caret position"></span>) <span class="ch-tabstop" title="Tabstop">0</span> <span class="ch-tabstop" title="Tabstop">0</span> <span class="ch-tabstop" title="Tabstop">no-repeat</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bg:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-color:#<span class="ch-tabstop" title="Tabstop">fff</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgc:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-color:transparent;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgi</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-image:url(<span class="ch-caret" title="Caret position"></span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgi:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-image:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgr</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-repeat:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgr:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-repeat:no-repeat;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgr:x</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-repeat:repeat-x;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgr:y</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-repeat:repeat-y;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgr:sp</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-repeat:space;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgr:rd</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-repeat:round;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bga</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-attachment:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bga:f</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-attachment:fixed;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bga:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-attachment:scroll;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgp</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-position:<span class="ch-tabstop" title="Tabstop">0</span> <span class="ch-tabstop" title="Tabstop">0</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgpx</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-position-x:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgpy</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-position-y:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgbk</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-break:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgbk:bb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-break:bounding-box;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgbk:eb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-break:each-box;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgbk:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-break:continuous;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgcp</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-clip:<span class="ch-tabstop" title="Tabstop">padding-box</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgcp:bb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-clip:border-box;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgcp:pb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-clip:padding-box;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgcp:cb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-clip:content-box;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgcp:nc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-clip:no-clip;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgo</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-origin:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgo:pb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-origin:padding-box;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgo:bb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-origin:border-box;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgo:cb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-origin:content-box;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgsz</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-size:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgsz:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-size:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgsz:ct</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-size:contain;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bgsz:cv</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">background-size:cover;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Color</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">color:#<span class="ch-tabstop" title="Tabstop">000</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">c:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">color:rgb(<span class="ch-tabstop" title="Tabstop">0</span>, <span class="ch-tabstop" title="Tabstop">0</span>, <span class="ch-tabstop" title="Tabstop">0</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">c:ra</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">color:rgba(<span class="ch-tabstop" title="Tabstop">0</span>, <span class="ch-tabstop" title="Tabstop">0</span>, <span class="ch-tabstop" title="Tabstop">0</span>, .<span class="ch-tabstop" title="Tabstop">5</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">op</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">opacity:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Generated content</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">cnt</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">content:'<span class="ch-caret" title="Caret position"></span>';</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cnt:n, ct:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">content:normal;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cnt:oq, ct:oq</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">content:open-quote;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cnt:noq, ct:noq</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">content:no-open-quote;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cnt:cq, ct:cq</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">content:close-quote;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cnt:ncq, ct:ncq</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">content:no-close-quote;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cnt:a, ct:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">content:attr(<span class="ch-caret" title="Caret position"></span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cnt:c, ct:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">content:counter(<span class="ch-caret" title="Caret position"></span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cnt:cs, ct:cs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">content:counters(<span class="ch-caret" title="Caret position"></span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ct</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">content:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">q</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">quotes:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">q:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">quotes:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">q:ru</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">quotes:'\00AB' '\00BB' '\201E' '\201C';</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">q:en</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">quotes:'\201C' '\201D' '\2018' '\2019';</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">coi</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">counter-increment:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cor</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">counter-reset:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Outline</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">ol</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ol:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">olo</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-offset:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">olw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-width:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">olw:tn</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-width:thin;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">olw:m</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-width:medium;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">olw:tc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-width:thick;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ols</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-style:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ols:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-style:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ols:dt</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-style:dotted;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ols:ds</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-style:dashed;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ols:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-style:solid;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ols:db</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-style:double;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ols:g</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-style:groove;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ols:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-style:ridge;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ols:i</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-style:inset;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ols:o</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-style:outset;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">olc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-color:#<span class="ch-tabstop" title="Tabstop">000</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">olc:i</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">outline-color:invert;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Tables</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">tbl</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">table-layout:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tbl:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">table-layout:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tbl:f</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">table-layout:fixed;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cps</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">caption-side:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cps:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">caption-side:top;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cps:b</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">caption-side:bottom;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ec</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">empty-cells:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ec:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">empty-cells:show;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ec:h</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">empty-cells:hide;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Border</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">bd</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bd+</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border:<span class="ch-tabstop" title="Tabstop">1px</span> <span class="ch-tabstop" title="Tabstop">solid</span> <span class="ch-tabstop" title="Tabstop">#000</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bd:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdbk</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-break:<span class="ch-tabstop" title="Tabstop">close</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdbk:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-break:close;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdcl</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-collapse:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdcl:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-collapse:collapse;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdcl:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-collapse:separate;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-color:#<span class="ch-tabstop" title="Tabstop">000</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdc:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-color:transparent;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdi</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-image:url(<span class="ch-caret" title="Caret position"></span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdi:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-image:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdti</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top-image:url(<span class="ch-caret" title="Caret position"></span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdti:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top-image:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdri</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-right-image:url(<span class="ch-caret" title="Caret position"></span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdri:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-right-image:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdbi</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom-image:url(<span class="ch-caret" title="Caret position"></span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdbi:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom-image:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdli</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-left-image:url(<span class="ch-caret" title="Caret position"></span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdli:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-left-image:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdci</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-corner-image:url(<span class="ch-caret" title="Caret position"></span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdci:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-corner-image:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdci:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-corner-image:continue;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdtli</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top-left-image:url(<span class="ch-caret" title="Caret position"></span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdtli:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top-left-image:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdtli:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top-left-image:continue;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdtri</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top-right-image:url(<span class="ch-caret" title="Caret position"></span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdtri:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top-right-image:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdtri:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top-right-image:continue;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdbri</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom-right-image:url(<span class="ch-caret" title="Caret position"></span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdbri:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom-right-image:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdbri:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom-right-image:continue;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdbli</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom-left-image:url(<span class="ch-caret" title="Caret position"></span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdbli:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom-left-image:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdbli:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom-left-image:continue;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdf</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-fit:<span class="ch-tabstop" title="Tabstop">repeat</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdf:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-fit:clip;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdf:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-fit:repeat;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdf:sc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-fit:scale;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdf:st</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-fit:stretch;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdf:ow</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-fit:overwrite;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdf:of</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-fit:overflow;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdf:sp</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-fit:space;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdlen</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-length:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdlen:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-length:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdsp</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-spacing:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bds</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-style:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bds:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-style:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bds:h</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-style:hidden;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bds:dt</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-style:dotted;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bds:ds</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-style:dashed;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bds:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-style:solid;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bds:db</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-style:double;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bds:dtds</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-style:dot-dash;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bds:dtdtds</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-style:dot-dot-dash;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bds:w</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-style:wave;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bds:g</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-style:groove;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bds:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-style:ridge;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bds:i</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-style:inset;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bds:o</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-style:outset;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-width:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdt, bt</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdt+</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top:<span class="ch-tabstop" title="Tabstop">1px</span> <span class="ch-tabstop" title="Tabstop">solid</span> <span class="ch-tabstop" title="Tabstop">#000</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdt:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdtw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top-width:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdts</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top-style:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdts:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top-style:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdtc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top-color:#<span class="ch-tabstop" title="Tabstop">000</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdtc:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top-color:transparent;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdr, br</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-right:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdr+</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-right:<span class="ch-tabstop" title="Tabstop">1px</span> <span class="ch-tabstop" title="Tabstop">solid</span> <span class="ch-tabstop" title="Tabstop">#000</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdr:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-right:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdrw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-right-width:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdrst</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-right-style:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdrst:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-right-style:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdrc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-right-color:#<span class="ch-tabstop" title="Tabstop">000</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdrc:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-right-color:transparent;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdb, bb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdb+</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom:<span class="ch-tabstop" title="Tabstop">1px</span> <span class="ch-tabstop" title="Tabstop">solid</span> <span class="ch-tabstop" title="Tabstop">#000</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdb:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdbw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom-width:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdbs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom-style:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdbs:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom-style:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdbc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom-color:#<span class="ch-tabstop" title="Tabstop">000</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdbc:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom-color:transparent;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdl, bl</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-left:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdl+</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-left:<span class="ch-tabstop" title="Tabstop">1px</span> <span class="ch-tabstop" title="Tabstop">solid</span> <span class="ch-tabstop" title="Tabstop">#000</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdl:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-left:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdlw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-left-width:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdls</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-left-style:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdls:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-left-style:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdlc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-left-color:#<span class="ch-tabstop" title="Tabstop">000</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdlc:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-left-color:transparent;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdrs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-radius:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdtrrs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top-right-radius:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdtlrs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-top-left-radius:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdbrrs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom-right-radius:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bdblrs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">border-bottom-left-radius:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Lists</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">lis</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">list-style:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">lis:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">list-style:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">lisp</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">list-style-position:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">lisp:i</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">list-style-position:inside;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">lisp:o</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">list-style-position:outside;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">list</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">list-style-type:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">list:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">list-style-type:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">list:d</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">list-style-type:disc;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">list:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">list-style-type:circle;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">list:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">list-style-type:square;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">list:dc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">list-style-type:decimal;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">list:dclz</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">list-style-type:decimal-leading-zero;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">list:lr</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">list-style-type:lower-roman;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">list:ur</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">list-style-type:upper-roman;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">lisi</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">list-style-image:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">lisi:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">list-style-image:none;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Print</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">pgbb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">page-break-before:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pgbb:au</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">page-break-before:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pgbb:al</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">page-break-before:always;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pgbb:l</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">page-break-before:left;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pgbb:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">page-break-before:right;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pgbi</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">page-break-inside:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pgbi:au</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">page-break-inside:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pgbi:av</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">page-break-inside:avoid;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pgba</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">page-break-after:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pgba:au</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">page-break-after:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pgba:al</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">page-break-after:always;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pgba:l</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">page-break-after:left;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pgba:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">page-break-after:right;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">orp</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">orphans:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wid</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">widows:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl>
	</section><section class="ch-subsection">
	<h3 class="ch-subsection__title">Others</h3>
	<dl class="ch-snippet">
	<dt class="ch-snippet__name">!</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">!important</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">@f</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">@font-face {
    font-family:<span class="ch-caret" title="Caret position"></span>;
    src:url(|);
}</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">@f+</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">@font-face {
    font-family: '<span class="ch-tabstop" title="Tabstop">FontName</span>';
    src: url('<span class="ch-tabstop" title="Tabstop">FileName</span>.eot');
    src: url('<span class="ch-tabstop" title="Tabstop">FileName</span>.eot?#iefix') format('embedded-opentype'),
         url('<span class="ch-tabstop" title="Tabstop">FileName</span>.woff') format('woff'),
         url('<span class="ch-tabstop" title="Tabstop">FileName</span>.ttf') format('truetype'),
         url('<span class="ch-tabstop" title="Tabstop">FileName</span>.svg#<span class="ch-tabstop" title="Tabstop">FontName</span>') format('svg');
    font-style: <span class="ch-tabstop" title="Tabstop">normal</span>;
    font-weight: <span class="ch-tabstop" title="Tabstop">normal</span>;
}</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">@i, @import</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">@import url(<span class="ch-caret" title="Caret position"></span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">@kf</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">@-webkit-keyframes <span class="ch-tabstop" title="Tabstop">identifier</span> {
    <span class="ch-tabstop" title="Tabstop">from</span> { <span class="ch-caret" title="Caret position"></span> }<span class="ch-caret" title="Caret position"></span>
    <span class="ch-tabstop" title="Tabstop">to</span> { <span class="ch-caret" title="Caret position"></span> }
}
@-o-keyframes <span class="ch-tabstop" title="Tabstop">identifier</span> {
    <span class="ch-tabstop" title="Tabstop">from</span> { <span class="ch-caret" title="Caret position"></span> }<span class="ch-caret" title="Caret position"></span>
    <span class="ch-tabstop" title="Tabstop">to</span> { <span class="ch-caret" title="Caret position"></span> }
}
@-moz-keyframes <span class="ch-tabstop" title="Tabstop">identifier</span> {
    <span class="ch-tabstop" title="Tabstop">from</span> { <span class="ch-caret" title="Caret position"></span> }<span class="ch-caret" title="Caret position"></span>
    <span class="ch-tabstop" title="Tabstop">to</span> { <span class="ch-caret" title="Caret position"></span> }
}
@keyframes <span class="ch-tabstop" title="Tabstop">identifier</span> {
    <span class="ch-tabstop" title="Tabstop">from</span> { <span class="ch-caret" title="Caret position"></span> }<span class="ch-caret" title="Caret position"></span>
    <span class="ch-tabstop" title="Tabstop">to</span> { <span class="ch-caret" title="Caret position"></span> }
}</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">@m, @media</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">@media <span class="ch-tabstop" title="Tabstop">screen</span> {
    <span class="ch-caret" title="Caret position"></span>
}</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ac</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-content:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ac:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-content:center;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ac:fe</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-content:flex-end;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ac:fs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-content:flex-start;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ac:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-content:stretch;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ac:sa</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-content:space-around;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ac:sb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-content:space-between;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ai</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-items:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ai:b</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-items:baseline;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ai:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-items:center;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ai:fe</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-items:flex-end;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ai:fs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-items:flex-start;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ai:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-items:stretch;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">anim</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">anim-</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation:<span class="ch-tabstop" title="Tabstop">name</span> <span class="ch-tabstop" title="Tabstop">duration</span> <span class="ch-tabstop" title="Tabstop">timing-function</span> <span class="ch-tabstop" title="Tabstop">delay</span> <span class="ch-tabstop" title="Tabstop">iteration-count</span> <span class="ch-tabstop" title="Tabstop">direction</span> <span class="ch-tabstop" title="Tabstop">fill-mode</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animdel</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-delay:<span class="ch-tabstop" title="Tabstop">time</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animdir</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-direction:<span class="ch-tabstop" title="Tabstop">normal</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animdir:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-direction:alternate;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animdir:ar</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-direction:alternate-reverse;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animdir:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-direction:normal;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animdir:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-direction:reverse;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animdur</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-duration:<span class="ch-tabstop" title="Tabstop">0</span>s;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animfm</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-fill-mode:<span class="ch-tabstop" title="Tabstop">both</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animfm:b</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-fill-mode:backwards;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animfm:bt, animfm:bh</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-fill-mode:both;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animfm:f</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-fill-mode:forwards;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animic</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-iteration-count:<span class="ch-tabstop" title="Tabstop">1</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animic:i</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-iteration-count:infinite;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animn</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-name:<span class="ch-tabstop" title="Tabstop">none</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animps</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-play-state:<span class="ch-tabstop" title="Tabstop">running</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animps:p</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-play-state:paused;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animps:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-play-state:running;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animtf</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-timing-function:<span class="ch-tabstop" title="Tabstop">linear</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animtf:cb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-timing-function:cubic-bezier(<span class="ch-tabstop" title="Tabstop">0.1</span>, <span class="ch-tabstop" title="Tabstop">0.7</span>, <span class="ch-tabstop" title="Tabstop">1.0</span>, <span class="ch-tabstop" title="Tabstop">0.1</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animtf:e</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-timing-function:ease;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animtf:ei</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-timing-function:ease-in;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animtf:eio</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-timing-function:ease-in-out;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animtf:eo</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-timing-function:ease-out;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">animtf:l</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">animation-timing-function:linear;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ap</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">appearance:${none};</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">as</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-self:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">as:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-self:auto;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">as:b</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-self:baseline;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">as:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-self:center;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">as:fe</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-self:flex-end;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">as:fs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-self:flex-start;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">as:s</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">align-self:stretch;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bfv</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">backface-visibility:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bfv:h</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">backface-visibility:hidden;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bfv:v</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">backface-visibility:visible;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">bg:ie</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='<span class="ch-tabstop" title="Tabstop">x</span>.png',sizingMethod='<span class="ch-tabstop" title="Tabstop">crop</span>');</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cm</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">/* <span class="ch-caret" title="Caret position"></span>${child} */</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">colm</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">columns:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">colmc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">column-count:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">colmf</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">column-fill:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">colmg</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">column-gap:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">colmr</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">column-rule:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">colmrc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">column-rule-color:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">colmrs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">column-rule-style:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">colmrw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">column-rule-width:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">colms</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">column-span:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">colmw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">column-width:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">d:ib+</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">display: inline-block;
*display: inline;
*zoom: 1;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fx</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">flex:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fxb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">flex-basis:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fxd</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">flex-direction:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fxd:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">flex-direction:column;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fxd:cr</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">flex-direction:column-reverse;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fxd:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">flex-direction:row;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fxd:rr</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">flex-direction:row-reverse;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fxf</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">flex-flow:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fxg</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">flex-grow:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fxsh</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">flex-shrink:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fxw</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">flex-wrap: <span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fxw:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">flex-wrap:nowrap;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fxw:w</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">flex-wrap:wrap;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fxw:wr</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">flex-wrap:wrap-reverse;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">jc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">justify-content:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">jc:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">justify-content:center;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">jc:fe</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">justify-content:flex-end;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">jc:fs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">justify-content:flex-start;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">jc:sa</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">justify-content:space-around;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">jc:sb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">justify-content:space-between;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">mar</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">max-resolution:<span class="ch-tabstop" title="Tabstop">res</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">mir</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">min-resolution:<span class="ch-tabstop" title="Tabstop">res</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">op+</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">opacity: <span class="ch-caret" title="Caret position"></span>;
filter: alpha(opacity=<span class="ch-caret" title="Caret position"></span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">op:ie</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=100);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">op:ms</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">-ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=100)';</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ord</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">order:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ori</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">orientation:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ori:l</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">orientation:landscape;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ori:p</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">orientation:portrait;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tov</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-overflow:${ellipsis};</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tov:c</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-overflow:clip;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tov:e</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">text-overflow:ellipsis;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf:r</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform: rotate(<span class="ch-tabstop" title="Tabstop">angle</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf:rx</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform: rotateX(<span class="ch-tabstop" title="Tabstop">angle</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf:ry</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform: rotateY(<span class="ch-tabstop" title="Tabstop">angle</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf:rz</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform: rotateZ(<span class="ch-tabstop" title="Tabstop">angle</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf:sc</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform: scale(<span class="ch-tabstop" title="Tabstop">x</span>, <span class="ch-tabstop" title="Tabstop">y</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf:sc3</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform: scale3d(<span class="ch-tabstop" title="Tabstop">x</span>, <span class="ch-tabstop" title="Tabstop">y</span>, <span class="ch-tabstop" title="Tabstop">z</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf:scx</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform: scaleX(<span class="ch-tabstop" title="Tabstop">x</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf:scy</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform: scaleY(<span class="ch-tabstop" title="Tabstop">y</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf:scz</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform: scaleZ(<span class="ch-tabstop" title="Tabstop">z</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf:skx</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform: skewX(<span class="ch-tabstop" title="Tabstop">angle</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf:sky</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform: skewY(<span class="ch-tabstop" title="Tabstop">angle</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf:t</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform: translate(<span class="ch-tabstop" title="Tabstop">x</span>, <span class="ch-tabstop" title="Tabstop">y</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf:t3</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform: translate3d(<span class="ch-tabstop" title="Tabstop">tx</span>, <span class="ch-tabstop" title="Tabstop">ty</span>, <span class="ch-tabstop" title="Tabstop">tz</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf:tx</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform: translateX(<span class="ch-tabstop" title="Tabstop">x</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf:ty</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform: translateY(<span class="ch-tabstop" title="Tabstop">y</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trf:tz</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform: translateZ(<span class="ch-tabstop" title="Tabstop">z</span>);</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trfo</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform-origin:<span class="ch-caret" title="Caret position"></span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trfs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transform-style:<span class="ch-tabstop" title="Tabstop">preserve-3d</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trs</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transition:<span class="ch-tabstop" title="Tabstop">prop</span> <span class="ch-tabstop" title="Tabstop">time</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trsde</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transition-delay:<span class="ch-tabstop" title="Tabstop">time</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trsdu</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transition-duration:<span class="ch-tabstop" title="Tabstop">time</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trsp</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transition-property:<span class="ch-tabstop" title="Tabstop">prop</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">trstf</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">transition-timing-function:<span class="ch-tabstop" title="Tabstop">tfunc</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">us</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">user-select:${none};</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wfsm</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">-webkit-font-smoothing:${antialiased};</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wfsm:a</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">-webkit-font-smoothing:antialiased;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wfsm:n</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">-webkit-font-smoothing:none;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wfsm:s, wfsm:sa</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">-webkit-font-smoothing:subpixel-antialiased;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wm</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">writing-mode:<span class="ch-tabstop" title="Tabstop">lr-tb</span>;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wm:btl</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">writing-mode:bt-lr;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wm:btr</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">writing-mode:bt-rl;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wm:lrb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">writing-mode:lr-bt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wm:lrt</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">writing-mode:lr-tb;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wm:rlb</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">writing-mode:rl-bt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wm:rlt</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">writing-mode:rl-tb;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wm:tbl</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">writing-mode:tb-lr;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wm:tbr</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">writing-mode:tb-rl;</dd>
	</dl>
	</section></div>
	</section><section class="ch-section ch-section_xsl">
	<h2 class="ch-section__title">XSL</h2>
	<div class="ch-section__desc"></div>
	<div class="ch-section__content"><dl class="ch-snippet">
	<dt class="ch-snippet__name">tmatch, tm</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:template match="<span class="ch-caret" title="Caret position"></span>" mode="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:template&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tname, tn</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:template name="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:template&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">call</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:call-template name="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ap</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:apply-templates select="<span class="ch-caret" title="Caret position"></span>" mode="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">api</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:apply-imports /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">imp</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:import href="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">inc</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:include href="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ch</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:choose&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:choose&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">xsl:when, wh</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:when test="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:when&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">ot</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:otherwise&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:otherwise&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">if</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:if test="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:if&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">par</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:param name="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:param&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pare</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:param name="<span class="ch-caret" title="Caret position"></span>" select="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">var</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:variable name="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:variable&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">vare</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:variable name="<span class="ch-caret" title="Caret position"></span>" select="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">wp</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:with-param name="<span class="ch-caret" title="Caret position"></span>" select="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">key</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:key name="<span class="ch-caret" title="Caret position"></span>" match="<span class="ch-caret" title="Caret position"></span>" use="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">elem</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:element name="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:element&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">attr</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:attribute name="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:attribute&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">attrs</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:attribute-set name="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:attribute-set&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">cp</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:copy select="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">co</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:copy-of select="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">val</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:value-of select="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">each, for</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:for-each select="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:for-each&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">tex</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:text&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:text&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">com</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:comment&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:comment&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">msg</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:message terminate="no"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:message&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">fall</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:fallback&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:fallback&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">num</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:number value="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">nam</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;namespace-alias stylesheet-prefix="<span class="ch-caret" title="Caret position"></span>" result-prefix="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">pres</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:preserve-space elements="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">strip</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:strip-space elements="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">proc</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:processing-instruction name="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:processing-instruction&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">sort</dt>
	<dd class="ch-snippet__value ch-snippet__value_abbreviation">&lt;xsl:sort select="<span class="ch-caret" title="Caret position"></span>" order="<span class="ch-caret" title="Caret position"></span>" /&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">choose+</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">xsl:choose&gt;xsl:when+xsl:otherwise</span></p>&lt;xsl:choose&gt;
    &lt;xsl:when test="<span class="ch-caret" title="Caret position"></span>"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:when&gt;
    &lt;xsl:otherwise&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:otherwise&gt;
&lt;/xsl:choose&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">xsl</dt>
	<dd class="ch-snippet__value ch-snippet__value_alias"><p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">!!!+xsl:stylesheet[version=1.0 xmlns:xsl=http://www.w3.org/1999/XSL/Transform]&gt;{
|}</span></p>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"&gt;<span class="ch-caret" title="Caret position"></span>&lt;/xsl:stylesheet&gt;</dd>
	</dl><dl class="ch-snippet">
	<dt class="ch-snippet__name">!!!</dt>
	<dd class="ch-snippet__value ch-snippet__value_snippet">&lt;?xml version="1.0" encoding="UTF-8"?&gt;</dd>
	</dl></div>
	</section></div>
		</section>
		<div class="clear"></div>
		<footer class="page-footer">
			<p class="small-text">Support: <a href="mailto:info@emmet.io">info@emmet.io</a><br>Created with <a href="https://github.com/bevry/docpad">DocPad</a> and <a href="http://gulpjs.com/">Gulp.js</a><br>Minimal theme by <a href="https://github.com/orderedlist/minimal">orderedlist</a></p>
			<p class="small-text"><a href="https://github.com/emmetio/emmet-docs/tree/master/src/documents/cheat-sheet/index.html.md">View page source on GitHub</a></p>
		</footer>
	</div>

<script src="./Cheat Sheet_files/main.js"></script><script src="./Cheat Sheet_files/cheatsheet.js"></script>
<script>
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-4523560-5']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

	if (document.getElementById('disqus_thread')) {
	  	var disqus_shortname = 'emmetdocs';
		(function() {
			var dsq = document.createElement('script');
			dsq.type = 'text/javascript';
			dsq.async = true;
		    dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
			document.getElementsByTagName('head')[0].appendChild(dsq);
		})();
	}
</script>

</body></html>
