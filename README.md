# Subview

> View switching with history support.

## 兼容性

#### 浏览器支持

* 支持以下移动平台的主流浏览器：
    * iOS 7+
    * Android 4+

* 同样支持以下桌面浏览器：
    * Firefox (Latest)
    * Chrome (Latest)
    * Safari (Latest)

#### 外部依赖

* jQuery（或 Zepto 等兼容类库）-- DOM 操作
* history.state -- `history.state` 属性的 polyfill
* Action -- 点击事件绑定

## 安装

0. 通过 Bower 安装：

	```sh
	$ bower install subview
	```

0. 在页面中加载 Subview 的脚本文件及必要的依赖：

	```html
	<script src="bower_components/jquery/dist/jquery.min.js"></script>
	<script src="bower_components/history.state/src/history.state.js"></script>
	<script src="bower_components/action/src/action.js"></script>
	<script src="bower_components/subview/src/subview.js"></script>
	```

## 使用步骤

#### Polyfill 与 Fallback

Subview 依赖 HTML5 History API，且依赖 `history.state` 属性。为了在那些支持前者但不支持后者的浏览器中正常运行，我们需要对后者进行 polyfill。我们采用 [history.state](https://github.com/cssmagic/history.state) 这个类库来完成 polyfill：

```js
historyState.polyfill()
```

但现实中还存在无法 polyfill 的情况（比如早期的浏览器连基本的 HTML5 History API 都不支持），因此建议你在使用 Subview 之前做好特性检测，并提供 fallback 方案：

```js
if (historyState.isSupported()) {
	// 使用 Subview 提供增强的 UI 效果
} else {
	// Fallback 到基本的 UI 效果
}
```

#### 初始化

需要在 DOM ready 时调用 Subview 的初始化方法。（[参见相关文档](https://github.com/cssmagic/subview/issues/2#user-content-js-api-init)）

#### 输出 HTML 接口

Subview 预定义了一些动作，可以借助 [Action](https://github.com/cssmagic/action) 类库自动完成事件绑定，不需要再手工绑定到 DOM 元素。（[参见相关文档](https://github.com/cssmagic/subview/issues/2#user-content-js-api-exportActions)）

## API 文档

所有文档入口在 [Wiki 页面](https://github.com/cssmagic/subview/wiki)，快去看吧！

## 谁在用？

以下开源项目采用 Subview 作为 UI 组件：

* [CMUI](https://github.com/CMUI/CMUI)

因此，本项目运行在以下网站：

* [百姓网 - 手机版](http://m.baixing.com/)

***

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

