---
title: "API 文档 - HTML 接口"
---

## HTML 接口<a name="html-api"></a>

使用 Action 类库绑定了预定义的动作后，即可使用以下 HTML 接口。

具备特定属性的 HTML 元素可以直接触发 view 的切换动作，无需额外处理。

### `[data-action="subview-switch-to"]`<a name="html-api-subview-switch-to"></a>

切至指定的 view。

#### 示例

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

#### 注意事项

* `data-target` 属性指定了目标元素的 ID（如 sample 1）。
* 链接元素的 `href` 属性指定了目标元素显示时需要向历史记录中插入的 URL（如 sample 1）。若无此需求，则可以省去 `data-target` 属性，直接将目标元素的 ID 直接写入 `href` 属性（如 sample 2）。
* 链接元素的 `title` 属性可用于指定目标元素显示时的页面标题（如 sample 1）。如果链接的此属性已有其它作用，可以使用 `data-title` 属性来指定（如 sample 2）。

***

### `[data-action="subview-switch-back"]`<a name="html-api-subview-switch-back"></a>

切回上一个 view。

#### 示例

```jade
a
	@href="#"
	@data-action="subview-switch-back"
	'切回上一个 view'
```

#### 注意事项

链接元素的 `href` 属性无需指定目标元素（即使指定也会被忽略），组件将从栈中取出上一个 view。如果一定要指定目标元素，请使用 `ui-subview-switch-to` 这个 action。
