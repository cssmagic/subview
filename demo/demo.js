void function () {
	'use strict'

	var demo = {
		init: function () {
			this._getElem()
			this._bind()
		},
		_getElem: function () {
//			this.$views = $('.' + subview.CLS)
//			this.$Wrapper = $('')
			this.$btns = $('#root button')
		},
		_bind: function () {
			var events = [
				subview.EV_BFR_SHOW,
				subview.EV_AFT_SHOW,
				subview.EV_BFR_HIDE,
				subview.EV_AFT_HIDE
			]
			$(document.body).on(events.join(' '), function (ev) {
				console.log('`body` get event: ', ev.type, ', from elem: ', ev.target)
			})

			this.$btns.on('click', function (ev) {
				ev.preventDefault()
				subview.switchTo(this.innerHTML, {
					beforeShow: function (ev) {
						console.log('view: ', this, ', trigger: ', ev.type)
					},
					afterShow: function (ev) {
						console.log('view: ', this, ', trigger: ', ev.type)
					}
				})
			})

			$(document.body).on('click', 'a.updateState', function (ev) {
				ev.preventDefault()
				var config = {}
				var $this = $(this)
				var url = $this.data('url')
				var title = $this.data('title')
				if (url) config.url = url
				if (title) config.title = title
				console.log(config)
				subview.updateState(config)
			})
		}
	}

	// init
	action.add(subview.exportActions())
	subview.init()
	demo.init()

}()
