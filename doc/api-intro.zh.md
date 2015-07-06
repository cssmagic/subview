---
title: "API 文档 - 导言"
---

## 导言<a name="intro"></a>

#### 基本概念<a name="intro-concept"></a>

每个独立的子页面被称作一个 view。使用 Subview 组件的网页至少应该包含一个 root view 和一个 sub view。

所有 view 进入视口的顺序会保存到入一个栈中，栈的最后一个元素就是视口中的 view（即当前 view）。所有的 view 要么处在栈中（下图中的 `stack`），要么处在候选区（下图中的 `.ready`）。

![Concept of Subview](https://cloud.githubusercontent.com/assets/1231359/8517262/b695698a-23f1-11e5-98e5-7b3ececc5d62.png)

栈的机制是这样的：

* 栈中的第一个元素总是 root view 元素。
* 当从候选区中的某个 view 切入视口时，它将被压入栈。
* 当当前 view 返回到上一个 view 时，当前 view 会从栈中抛出（移回候选区）。

#### 结构层约定<a name="intro-structural-convention"></a>

```jade
body
	article.subview.subview-root
		//e.g. listing page

	article.subview#login
		header.nav-bar
			h1 'Login'
			a @href='#' '« 返回'
		main
			//e.g. login form

	article.subview#detail
		header.nav-bar
			h1 'Detail'
			a @href='#' '« 返回'
		main
			//e.g. detail page
```

注意事项：

* 每个 view 元素都需要有 `.subview` 类名，否则 Subview 组件无法识别。
* 建议为每个 sub view 元素指定 ID。
* 可通过如下方式指定 root view：
	* 为其添加 `.subview-root` 类名。
	* 如果页面中没有 `.subview-root` 元素，则页面中的第一个 view 元素会默认成为 root view。
