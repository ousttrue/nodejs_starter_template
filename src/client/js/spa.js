/*global $, spa:true */

var spa = (function () {

	var initModule = function ($container) {
		spa.shell.initModule($container);
	};

	return { initModule: initModule };

} ());