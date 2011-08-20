(function() {
  var $;
  $ = this.jQuery;
  this.magicmockup = (function() {
    var $doc, init, inkNS, views, _addViews, _dispatch, _getDescription, _handleClick, _handleHover;
    inkNS = 'http://www.inkscape.org/namespaces/inkscape';
    $doc = $(this.document);
    views = {};
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
      var $this;
      $this = $(this);
      if ($this.data('hoverable')) {
        return;
      }
      $this.data('hoverable', true);
      if (!_getDescription(e.currentTarget)) {
        return;
      }
      $this.css({
        cursor: 'pointer'
      });
    };
    _getDescription = function(el) {
      return $(el).children('desc').text();
    };
    init = function(loadEvent) {
      _addViews($('g'));
      return $doc.delegate('g', {
        click: _handleClick,
        mouseover: _handleHover
      });
    };
    return {
      init: init
    };
  })();
  this.nextScreen = function(e) {};
  $('svg').attr({
    onload: 'magicmockup.init()'
  });
}).call(this);
