(function() {
  var $;
  $ = this.jQuery;
  this.magicmockup = (function() {
    var $doc, defaultLayer, filter, init, layers, _dispatch, _findFilters, _getDescription, _getHash, _getInk, _handleClick, _handleHover, _hideLayers, _initLayers, _setInitialPage, _showLayer, _stripInlineJS;
    $doc = $(this.document);
    layers = {};
    filter = {};
    defaultLayer = '';
    _getInk = function(el, attr) {
      var inkNS;
      inkNS = 'http://www.inkscape.org/namespaces/inkscape';
      return el.getAttributeNS(inkNS, attr);
    };
    _initLayers = function($layers) {
      if ($layers == null) {
        $layers = $('g');
      }
      $layers.each(function() {
        var group, label;
        group = _getInk(this, 'groupmode');
        label = _getInk(this, 'label');
        if (group === 'layer') {
          layers[label] = this;
          if ($(this).is(':visible')) {
            return defaultLayer = label;
          }
        }
      });
    };
    _findFilters = function() {
      return $doc.find('filter').each(function() {
        var label;
        label = _getInk(this, 'label');
        return filter[label] = this.id;
      });
    };
    _dispatch = function(context, _arg) {
      var act, command, val;
      command = _arg[0], val = _arg[1];
      act = {
        load: function(url) {
          return window.location = url || val;
        },
        next: function(location) {
          var _base;
          if (location.match(/#/)) {
            return act.load(location);
          } else {
            $(context).parents('g').not('[style=display:none]').last().hide();
            if (typeof (_base = $(layers[location])).show === "function") {
              _base.show();
            }
            if (location === defaultLayer) {
              location = '';
            }
            return window.location.hash = location;
          }
        },
        show: function(layer) {
          return $(layers[layer]).show();
        },
        hide: function(layer) {
          return $(layers[layer]).hide();
        },
        toggle: function(layer) {
          return $(layers[layer]).toggle();
        }
      };
      return typeof act[command] === "function" ? act[command](val) : void 0;
    };
    _getDescription = function(el) {
      return $(el).children('desc').text();
    };
    _stripInlineJS = function() {
      var $onclick;
      $onclick = $('[onclick]');
      if (!$onclick.length) {
        return;
      }
      if (console && console.warn) {
        if (typeof console.group === "function") {
          console.group('Warning: inline JavaScript found (and deactivated)');
        }
        $onclick.each(function() {
          return console.warn(this.id, ':', this.onclick);
        });
        if (typeof console.groupEnd === "function") {
          console.groupEnd();
        }
      }
      $onclick.each(function() {
        return this.onclick = void 0;
      });
    };
    _getHash = function() {
      return window.location.hash.substr(1);
    };
    _hideLayers = function() {
      var layer, name, _results;
      _results = [];
      for (name in layers) {
        layer = layers[name];
        _results.push($(layer).hide());
      }
      return _results;
    };
    _showLayer = function(layer) {
      if (typeof layer !== 'string') {
        layer = _getHash();
      }
      if (!(layers[layer] || layer === '')) {
        return;
      }
      _hideLayers();
      return _dispatch(this, ['next', layer || defaultLayer]);
    };
    _setInitialPage = function() {
      var layer;
      layer = _getHash();
      if (layer) {
        return _showLayer(layer);
      }
    };
    _handleClick = function(e) {
      var action, actions, _i, _len, _ref;
      actions = _getDescription(e.currentTarget);
      if (!actions) {
        return;
      }
      _ref = actions.split(/([\s\n]+)/);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        _dispatch(this, action.split(/\=/));
      }
    };
    _handleHover = function(e) {
      var $this, hover, isHovered;
      $this = $(this);
      isHovered = e.type === "mouseenter";
      if (!_getDescription(e.currentTarget)) {
        return;
      }
      if (filter.hover) {
        hover = isHovered ? "url(#" + filter.hover + ")" : "none";
        $this.css({
          filter: hover
        });
      }
      if ($this.data('hoverable')) {
        return;
      }
      $this.data('hoverable', true).css({
        cursor: 'pointer'
      });
    };
    init = function(loadEvent) {
      _initLayers();
      _setInitialPage();
      _findFilters();
      _stripInlineJS();
      $(window).bind('hashchange', _showLayer);
      return $doc.delegate('g', {
        click: _handleClick,
        hover: _handleHover
      });
    };
    return {
      init: init
    };
  })();
  $('svg').attr({
    onload: 'magicmockup.init()'
  });
}).call(this);
