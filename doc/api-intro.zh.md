---
title: "API 文档 - 导言"
---

## 导言<a name="intro"></a>

#### 概述

每个独立的子页面被称作一个 view。使用 Subview 组件的网页至少应该包含一个 root view 和一个 sub view。

所有 view 进入视口的顺序会保存到入一个栈中，栈的最后一个元素就是视口中的 view（即当前 view）。所有的 view 要么处在栈中（下图中的 `_stack`），要么处在候选区（下图中的 `.ready`）。

![subview](https://f.cloud.github.com/assets/5830104/2406297/657e4588-aa69-11e3-85b1-1dd43ab930a9.jpg)

栈的机制是这样的：

* 栈中的第一个元素总是 root view 元素。
* 当从候选区中的某个 view 切入视口时，它将被压入栈。
* 当当前 view 返回到上一个 view 时，当前 view 会从栈中抛出（移回候选区）。

#### 结构层约定

```jade
body
	article.subview.subview-root
		//e.g. main page

	article.subview#login
		header.nav-bar
			a @href='#' '<< 返回'
			h1 'Login'
		main
			//e.g. login form

	article.subview#prd-detail
		header.nav-bar
			a @href='#' '<< 返回'
			h1 'Product'
		main
			//e.g. product detail
```
