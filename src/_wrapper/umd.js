!function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory)
	} else if (typeof exports === 'object') {
		// CommonJS
		module.exports = factory(require('jquery'))
	} else {
		// Browser globals
		root['/*{sample}*/'] = factory(root.jQuery || root.Zepto || root.$)
	}
}(this, function ($) {

////////////////////  START: source code  ////////////////////
/* <%= contents %> */
////////////////////  END: source code  ////////////////////

	return /*{sample}*/
})
