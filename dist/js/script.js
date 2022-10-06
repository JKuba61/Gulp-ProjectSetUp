'use strict'
var test = function (t) {
	console.log(t.target)
}
window.addEventListener('click', test)
