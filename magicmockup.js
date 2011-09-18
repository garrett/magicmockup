(function() {
  var $;
  $ = this.jQuery;
  this.magicmockup = (function() {
    var $doc, filter, init, inkNS, views, _addViews, _dispatch, _findFilters, _getDescription, _handleClick, _handleHover, _stripInlineJS;
    inkNS = 'http://www.inkscape.org/namespaces/inkscape';
    $doc = $(this.document);
    views = {};
    filter = {};
    _findFilters = function() {
      return $doc.find('filter').each(function() {
        var label;
        label = this.getAttributeNS(inkNS, 'label');
        return filter[label] = this.id;
      });
    };
    _dispatch = function(context, _arg) {
      var act, command, id;
      command = _arg[0], id = _arg[1];
      act = {
        next: function() {
          var _base;
          $(context).parents('g').not('[style=display:none]').last().hide();
          return typeof (_base = $(views[id])).show === "function" ? _base.show() : void 0;
        }
      };
      return typeof act[command] === "function" ? act[command]() : void 0;
    };
    _addViews = function($views) {
      $views.each(function() {
        var label;
        label = this.getAttributeNS(inkNS, 'label');
        if (label) {
          return views[label] = this;
        }
      });
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
    init = function(loadEvent) {
      _findFilters();
      _addViews($('g'));
      _stripInlineJS();
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
