---
title: "API 文档 - 事件接口"
---

## 事件接口<a name="event-api"></a>

事件接口是较为底层的接口，当每个 view 每次切入或移出视口时，均会触发以下事件。

* `subviewBeforeShow` - 当元素即将切至视口时触发
* `subviewAfterShow` - 当元素完成切至视口动作时触发
* `subviewBeforeHide` - 当元素即将移出视口时触发
* `subviewAfterHide` - 当元素完成移出视口动作时触发

可以通过事件绑定来实现各阶段回调， **每次事件发生时** 均会执行回调函数。
