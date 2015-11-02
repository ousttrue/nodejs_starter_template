/*global $, spa */
spa.shell = (function () {

	var configMap = {
		main_html: String()
		+ '<div id="spa">'
		+ '    <div class="spa-shell-head">'
		+ '        <div class="spa-shell-head-logo"></div>'
		+ '        <div class="spa-shell-head-acct"></div>'
		+ '        <div class="spa-shell-head-search"></div>'
		+ '    </div>'
		+ '    <div class="spa-shell-main">'
		+ '        <div class="spa-shell-main-nav"></div>'
		+ '        <div class="spa-shell-main-content"></div>'
		+ '    </div>'
		+ '    <div class="spa-shell-foot"></div>'
		+ '    <div class="spa-shell-chat"></div>'
		+ '    <div class="spa-shell-modal"></div>'
		+ '</div>'
	},
		stateMap = { $container: null },
		jqueryMap = {},

		setJqueryMap, initModule;
	
	//
	// DOM
	//
	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = { $container: $container };
	};
	
	//
	// public
	//
	initModule = function ($container) {
		stateMap.$container = $container;
		$container.html(configMap.main_html);
		setJqueryMap();
				
		console.log(jqueryMap);
	};

	return { initModule: initModule };

} ());