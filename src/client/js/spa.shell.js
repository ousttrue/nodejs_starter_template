/*global $, spa */
spa.shell = (function () {

	var configMap = {
		anchor_schema_map: {
			chat: { opened: true, closed: true }
		},
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
		+ '    <div class="spa-shell-modal"></div>'
		+ '</div>',

		chat_extend_time: 1000,
		chat_retract_time: 300,
		chat_extend_height: 450,
		chat_retract_height: 15,
		chat_extended_title: 'Click to retract',
		chat_retracted_title: 'Click to extend',

		resize_interval: 200
	},
		stateMap = {
			$container: null,
			anchor_map: {},
			is_chat_retracted: true,
			resize_idto: undefined
		},
		jqueryMap = {},

		copyAnchorMap, setJqueryMap,
		changeAnchorPart, onHashchange, onResize,
		setChatAnchor, initModule;
		
	//
	// Utility
	//
	copyAnchorMap = function () {
		return $.extend(true, {}, stateMap.anchor_map);
	};
	
	//
	// DOM
	//
	changeAnchorPart = function (arg_map) {
		var
			anchor_map_revise = copyAnchorMap(),
			bool_return = true,
			key_name, key_name_dep;

		//KEYVAL:
		for (key_name in arg_map) {
			if (arg_map.hasOwnProperty(key_name)) {
				if (key_name.indexOf('_') === 0) { continue; }
				
				// update key_name
				anchor_map_revise[key_name] = arg_map[key_name];

				// update key_name_dep				
				key_name_dep = '_' + key_name;
				if (arg_map[key_name_dep]) {
					anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
				}
				else {
					delete anchor_map_revise[key_name_dep];
					delete anchor_map_revise['_s' + key_name_dep];
				}
			}
		}

		try {
			$.uriAnchor.setAnchor(anchor_map_revise);
		}
		catch (error) {
			$.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
			bool_return = false;
		}

		return bool_return;
	};

	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = {
			$container: $container,
			$chat: $container.find('.spa-shell-chat')
		};
	};

	//
	// event
	//
	onHashchange = function (/*event*/) {
		var
			is_ok = true,
			anchor_map_previous = copyAnchorMap(),
			anchor_map_proposed,
			_s_chat_previous, _s_chat_proposed,
			s_chat_proposed;

		// update stateMap.anchor_map
		try { anchor_map_proposed = $.uriAnchor.makeAnchorMap(); }
		catch (error) {
			$.uriAnchor.setAnchor(anchor_map_previous, null, true);
			return false;
		}
		console.log(anchor_map_proposed);
		stateMap.anchor_map = anchor_map_proposed;

		_s_chat_previous = anchor_map_previous._s_chat;
		console.log('_s_chat_previous: ' + _s_chat_previous);
		_s_chat_proposed = anchor_map_proposed._s_chat;
		console.log('_s_chat_proposed: ' + _s_chat_proposed);

		if (!anchor_map_previous // first time
			|| _s_chat_previous !== _s_chat_proposed // or changed
			) {
			s_chat_proposed = anchor_map_proposed.chat;
			console.log('s_chat_proposed: ' + s_chat_proposed);
			switch (s_chat_proposed) {
				case 'opened':
					is_ok = spa.chat.setSliderPosition('opened');
					break;

				case 'closed':
					is_ok = spa.chat.setSliderPosition('closed');
					break;

				default:
					spa.chat.setSliderPosition('closed');
					delete anchor_map_proposed.chat;
					$.uriAnchor.setAnchor(anchor_map_proposed, null, true);
			}
		}

		if (!is_ok) {
			if (anchor_map_previous) {
				// restore
				$.uriAnchor.setAnchor(anchor_map_previous, null, true);
				stateMap.annchor_map = anchor_map_previous;
			}
			else {
				// default
				delete anchor_map_proposed.chat;
				$.uriAnchor.setAnchor(anchor_map_previous, null, true);
			}
		}

		return false;
	};

	onResize = function (event) {
		if (stateMap.resize_idto) { return true; }

		console.log("onResize");
		console.log(event);
		
		spa.chat.handleResize();
		stateMap.resize_idto = setTimeout(
			function () { stateMap.resize_idto = undefined; },
			configMap.resize_interval
			);

		return true;
	};

	//
	// callback
	//
	setChatAnchor = function (position_type) {
		return changeAnchorPart({ chat: position_type });
	};
	
	//
	// public
	//
	initModule = function ($container) {
		stateMap.$container = $container;
		$container.html(configMap.main_html);
		setJqueryMap();

		$.uriAnchor.configModule({
			schema_map: configMap.anchor_schema_map
		});

		spa.chat.configModule({
			set_chat_anchor: setChatAnchor,
			chat_model: spa.model.chat,
			people_model: spa.model.people
		});
		spa.chat.initModule(jqueryMap.$container);

		$(window)
			.bind('resize', onResize)
			.bind('hashchange', onHashchange)
			.trigger('hashchange');
	};

	return { initModule: initModule };

} ());