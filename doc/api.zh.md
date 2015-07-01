# API 文档

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

## JavaScript 接口<a name="js-api"></a>

### `subview.init()`<a name="js-api-init"></a>

初始化方法。当 DOM ready 时需要执行此方法。此方法会对所有 view 元素做必要初始化。

#### 参数

（无）

#### 返回值

（无）

***

### `subview.switchTo(elem, [config])`<a name="js-api-switchTo"></a>

将指定的 view 元素（以下又称“目标元素”）切至视口（成为当前 view）。

* 如果目标元素不在栈中（处于候选区），则将其移入视口，并将其压入栈。
* 如果目标元素在栈中，则将其移回视口；栈中排在其后的所有 view 将被移出栈（进入候选区）。

#### 参数

可接受一个或两个参数。

* `elem` -- 目标元素。
* `config` -- 对象。可选。配置信息。

###### `elem` 参数

此参数用于指定需要切至视口的 view 元素。此参数的格式比较宽松，以下方式都是合法的：

* 选择符，比如 `'div.app > .view-1'`
* DOM 元素，比如 `document.getElementById('#my-view')`
* jQuery/Zepto 对象，比如 `$('#my-view')`（如果该对象内包含多个 DOM 元素，则只处理第一个）

注意：目标元素必须具有 `.subview` 类名。

###### `config` 参数

此参数允许传入更多更详细的选项，可包含以下 key：

* `beforeShow` -- 指定当目标元素即将切至视口时执行的回调函数
* `afterShow` -- 指定当目标元素完成切至视口动作时执行的回调函数
* `url` -- 切至目标元素时需要更新至浏览器地址栏的 URL
* `title` -- 切至目标元素时需要更新至浏览器标题的文本内容

注意：

* 以上回调函数 **只会调用一次**。
* 这两个回调函数不仅有先后顺序，而且还有一定的时间间隔，因为切换过程可能有过渡动画效果。
* 回调函数会在 view 元素上执行（回调函数内的 `this` 指向 view 元素）。

#### 返回值

（无）

***

### `subview.switchBack()`

切回上一个 view（即栈中的倒数第二个 view）。

#### 参数

（无）

#### 返回值

（无）

***

### `subview.updateState(config)`<a name="js-api-updateState"></a>

用于更新当前 view 的状态信息（URL 和页面标题）。

在某些时候，当前 view 自身的内容发生了变化（并非以切换的方式进入新的 view），需要有一个接口更新其状态信息。

#### 参数

* `config` -- 对象。配置信息。

`config` 参数必须是一个对象，至少需要包含一个 key。有效的 key 如下：

* `url` -- 需要更新至浏览器地址栏的 URL
* `title` -- 需要更新至浏览器标题的文本内容

#### 返回值

（无）

***

### `subview.exportActions()`<a name="js-api-exportActions"></a>

将预定义的动作导出，以便 [Action](https://github.com/cssmagic/action) 类库完成事件绑定。完成这一步之后，下面将要介绍的 HTML 接口即可正常使用了。

此操作可在任何时机执行，执行后 HTML 接口即生效。因此建议

#### 参数

（无）

#### 返回值

对象。动作集，可传递给 Action 类库完成事件绑定。其内容如下：

```js
{
	'subview-switch-to': function () {},
	'subview-switch-back': function () {},
}
```

#### 示例

```js
// 导出预定义的动作集
var actions = subview.exportActions()

// 传递给 Action，完成事件绑定
action.add(actions)
```


## 事件接口<a name="event-api"></a>

事件接口是较为底层的接口，当每个 view 每次切入或移出视口时，均会触发以下事件。

* `subviewBeforeShow` - 当元素即将切至视口时触发
* `subviewAfterShow` - 当元素完成切至视口动作时触发
* `subviewBeforeHide` - 当元素即将移出视口时触发
* `subviewAfterHide` - 当元素完成移出视口动作时触发

可以通过事件绑定来实现各阶段回调， **每次事件发生时** 均会执行回调函数。

## HTML 接口<a name="html-api"></a>

使用 Action 类库绑定了预定义的动作后，即可使用以下 HTML 接口。

具备特定属性的 HTML 元素可以直接触发 view 的切换动作，无需额外处理。

### 切至指定的 view<a name="html-api-subview-switch-to"></a>

```jade
//sample 1
a
	@href="http://xxx"
	@title="View 1"
	@data-action="subview-switch-to"
	@data-target="#view-1"
	'切换至 #view-1'

//sample 2
a
	@href="#view-2"
	@title="Click here to switch to View 2"
	@data-action="subview-switch-to"
	@data-title="View 2"
	'切换至 #view-2'
```

注意：

* `data-target` 属性指定了目标元素的 ID（如 sample 1）。
* 链接元素的 `href` 属性指定了目标元素显示时需要向历史记录中插入的 URL（如 sample 1）。若无此需求，则可以省去 `data-target` 属性，直接将目标元素的 ID 直接写入 `href` 属性（如 sample 2）。
* 链接元素的 `title` 属性可用于指定目标元素显示时的页面标题（如 sample 1）。如果链接的此属性已有其它作用，可以使用 `data-title` 属性来指定（如 sample 2）。

### 切回上一个 view<a name="html-api-subview-switch-back"></a>

```jade
a
	@href="#"
	@data-action="subview-switch-back"
	'切回上一个 view'
```

注意：链接元素的 `href` 属性无需指定目标元素（即使指定也会被忽略），组件将从栈中取出上一个 view。如果一定要指定目标元素，请使用 `ui-subview-switch-to` 这个 action。
