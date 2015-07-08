!function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory)
	} else if (typeof exports === 'object') {
		// CommonJS
		module.exports = factory()
	} else {
		// Browser globals
		root.subview = factory()
	}
}(this, function () {

////////////////////  start: source code  ////////////////////
/**
 * Subview - View switching with history support.
 * Released under the MIT license.
 * https://github.com/cssmagic/subview
 */
var subview = (function (window) {
	'use strict'

	// ns
	var subview

	// shortcut
	var history = window.history || {}

	/** data format - subview's history states
		var _state = {
			type: 'subview',	// subview.STATE_TYPE
			title: 'xxx',
			target: '#xxx'
		}
	*/

	subview = {
		CLS: 'subview',
		CLS_ROOT: 'subview-root',
		CLS_IN: 'subview-in',
		CLS_OUT: 'subview-out',
		CLS_READY: 'subview-ready',
		//event name
		EV_BFR_SHOW: 'subviewBeforeShow',
		EV_AFT_SHOW: 'subviewAfterShow',
		EV_BFR_HIDE: 'subviewBeforeHide',
		EV_AFT_HIDE: 'subviewAfterHide',
		//action name
		ACT_SWITCH_TO: 'subview-switch-to',
		ACT_SWITCH_BACK: 'subview-switch-back',
		//state info
		STATE_TYPE: 'subview',
		_stack: [],

		init: function () {
			this._setup()
			this._bind()
		},
		_setup: function () {
			this._update()
		},
		_update: function () {
			// need to query element every time, shouldn't cache them
			this.$views = $('.' + this.CLS)

			// if there's only root view, then no need to init
			if (this.$views.length > 1) {
				// find root view
				var $rootView = $('.' + this.CLS_ROOT)
				if (!$rootView.length) {
					$rootView = this.$views.first().addClass(this.CLS_ROOT)
				}
				this.$rootView = $rootView

				// init class of views
				$rootView.addClass(this.CLS_IN)
				this.$views.not($rootView).addClass(this.CLS_READY)

				// init stack
				if (this._stack.length < 1) {
					this._stack.push($rootView[0])
				}
			}
		},
		_initState: function () {
			var state = {
				type: this.STATE_TYPE,
				title: document.title
			}
			// add a timeout to ensure this executed after window.onload
			setTimeout(function () {
				// seem to be crud, we use `replaceState` directly.
				// but we suppose subview should be the first component to operate history at all.
				history.replaceState(state, null, null)

				/** DEBUG_INFO_START **/
				console.log('[Subview] [replaceState] time: ' + Date.now() + ', state: ' + JSON.stringify(history.state))
				/** DEBUG_INFO_END **/

			}.bind(this), 0)
		},
		_bind: function () {
			var $win = $(window)
			$win
				//WebKit bug (or feature?): it triggers `popstate` event on window load
				.on('load', function () {
					//console.log('load time: ' + Date.now())
					this._initState()
				}.bind(this))

				.on('popstate', function (ev) {
					//console.log('[popState] time: ' + Date.now() + ', state: ' + JSON.stringify(history.state))
					this._handleState()
				}.bind(this))
		},
		//util
		_getHashFromLink: function (elem) {
			var hash = elem.href.split('#')[1] || ''
			return hash ? '#' + hash : hash
		},
		_pushState: function (elem, config) {
			//assign id to elem if has no id
			if (!elem.id) elem.id = 'subview-id' + Date.now()
			var title = config.title || null
			var url = config.url || null
			var state = {
				type: this.STATE_TYPE,
				title: title,
				target: '#' + elem.id
			}
			//console.log('[pushState] state: ' + JSON.stringify(state))
			history.pushState(state, null, url)
			if (title) document.title = title
		},
		_slideIn: function (elem, config) {
			//console.log('_slideIn(): #' + elem.id + ', config: ' + JSON.stringify(config))
			var stack = this._stack
			var $viewTarget = $(elem)
			if (!$viewTarget.hasClass(this.CLS)) return false

			//store view's scroll position
			var viewCurrent = stack[stack.length - 1]
			var $viewCurrent = $(viewCurrent)
			viewCurrent._uiScrollPosition = window.pageYOffset

			//slide out
			$viewCurrent.trigger(this.EV_BFR_HIDE)
			$viewCurrent.removeClass(this.CLS_IN).addClass(this.CLS_OUT)
			$viewCurrent.trigger(this.EV_AFT_HIDE)
			window.scrollTo(0, 0)

			//slide in
			$viewTarget.trigger(this.EV_BFR_SHOW)
			$viewTarget.removeClass(this.CLS_READY).addClass(this.CLS_IN)
			$viewTarget.trigger(this.EV_AFT_SHOW)
			stack.push($viewTarget[0])

			//history
			if (config) this._pushState(elem, config)
		},
		_slideBack: function () {
			//console.log('_slideBack()')
			var stack = this._stack
			var len = stack.length
			if (len < 2) return false

			//slide to ready
			var $viewCurrent = $(stack.pop())
			$viewCurrent.trigger(this.EV_BFR_HIDE)
			$viewCurrent.removeClass(this.CLS_IN).addClass(this.CLS_READY)
			$viewCurrent.trigger(this.EV_AFT_HIDE)

			//slide back
			var viewPrev = stack[stack.length - 1]
			var $viewPrev = $(viewPrev)
			$viewPrev.trigger(this.EV_BFR_SHOW)
			$viewPrev.css('visibility', 'hidden').removeClass(this.CLS_OUT).addClass(this.CLS_IN)
			$viewPrev.trigger(this.EV_AFT_SHOW)

			//restore view's scroll position
			//Android 4.4 下无法立即滚动，需要缓一缓
			setTimeout(function () {
				window.scrollTo(0, viewPrev._uiScrollPosition)
				$viewPrev.css('visibility', 'visible')
				viewPrev._uiScrollPosition = null
			}, 0)
		},
		_adjustStack: function (index) {
			var stack = this._stack
			//index 表示要切至 stack 中的第几个

			//如果 stack 是符合期望的(要切至)，就不做任何事
			if (index + 2 === stack.length) return false

			//update stack
			var viewsToBeRemovedFromStack = stack.slice(index + 2)
			stack = stack.slice(0, index + 2)

			viewsToBeRemovedFromStack.forEach(function (view) {
				var j = $(view)
				//update class
				j.removeClass(this.CLS_OUT + ' ' + this.CLS_IN).addClass(this.CLS_READY)
				//reset scroll position
				//貌似清不清无所谓
//				view._uiScrollPosition = null
			}, this)

			//reset current view
			$(stack[stack.length - 1]).removeClass(this.CLS_OUT).addClass(this.CLS_IN)

			this._stack = stack
		},
		_handleState: function () {
			var state = history.state || {}
			if (state.type !== this.STATE_TYPE) return false

			var target = state.target
			var $elem = target ? $(target) : this.$rootView
			if (!$elem.length) return false

			this._switchTo($elem[0])
			if (state.title) document.title = state.title
		},
		_switchTo: function (elem, config) {
			//console.log('_switchTo(): #' + elem.id + ', config: ' + JSON.stringify(config))
			//do switch
			var stack = this._stack
			var stackIndex = stack.indexOf(elem)

			//out of stack (ready to slide in)
			if (stackIndex < 0) {
				this._slideIn(elem, config)
			}
			//target view is already current view
			else if (stackIndex + 1 === stack.length) {
//				$(elem).trigger(this.EV_BFR_SHOW).trigger(this.EV_AFT_SHOW)
				return false
			}
			//target view in out (need to slide back)
			else if (stackIndex + 1 < stack.length) {
				//队列中可能有某些 view 被跳过，那么就纠正一下 stack，让它符合本次动作的意图
				this._adjustStack(stackIndex)
				this._slideBack()
			}
		},

		//api
		refresh: function () {
			this._update()
		},
		switchTo: function (elem, config) {
			//format arguments
			var $elem = $(elem).first()
			if (!$elem.hasClass(this.CLS)) return false

			elem = $elem[0]
			//console.log('switchTo(): #' + elem.id + ', config: ' + JSON.stringify(config))

			//bind
			if (!config || !$.isPlainObject(config)) config = {}
			if ($.isFunction(config.beforeShow)) {
				$elem.one(this.EV_BFR_SHOW, config.beforeShow)
			}
			if ($.isFunction(config.afterShow)) {
				$elem.one(this.EV_AFT_SHOW, config.afterShow)
			}

			this._switchTo(elem, config)
		},
		switchBack: function () {
			//console.log('switchBack(): state: ' + JSON.stringify(history.state))

			var state = history.state || {}
			//当前历史状态在 subview 的队列中
			if (state.type === this.STATE_TYPE) {
				history.back()
			}
			//粗暴降级：直接硬切了
			else {
				this._slideBack()
			}
		},
		updateState: function (config) {
			//config = {url: 'xxx', title: 'xxx'}
			//这两个 key 至少要有一个是有效的
			if (!$.isPlainObject(config)) return false
			var title = config.title || null
			var url = config.url || null
			if (!url && !title) return false
			var currentState = history.state
			var state = {
				type: this.STATE_TYPE,
				title: title || currentState.title,
				target: currentState.target
			}
			history.replaceState(state, null, url)
			//console.log(state)
			if (title) document.title = title
		},
		exportActions: function () {
			var actions = {}
			var _this = this
			actions[this.ACT_SWITCH_TO] = function (ev) {
				var elem = this
				var $elem = $(elem)
				var target = $elem.data('target')
				var url = $.trim(elem.getAttribute('href')) || null
				if (!target) {
					target = _this._getHashFromLink(elem)
					url = null
				}
				var title = $elem.data('title') || elem.title || null
				var config = {
					url: url,
					title: title
				}
				// console.log('[action] ' + _this.ACT_SWITCH_TO + ': ' + target)
				_this.switchTo(target, config)
			}
			actions[this.ACT_SWITCH_BACK] = function () {
				_this.switchBack()
			}
			return actions
		},
		debug: function () {
			var $views = $('.' + this.CLS)
			console.log('===== start =====')
			var _ns = this
			$views.each(function () {
				var view = this
				console.log(view, ': scroll position=', view._uiScrollPosition, ', in stack =', _ns._stack.indexOf(view))
			})
			console.log('===== end =====')
		}
	}

	//exports
	return subview

}(window))

////////////////////  end: source code  ////////////////////

	return subview
})