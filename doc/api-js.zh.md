---
title: "API 文档 - JavaScript 接口"
---

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

此操作可在任何时机执行，执行后 HTML 接口即生效。因此建议在执行完初始化方法之后立即完成此操作。

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
