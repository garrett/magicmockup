(function() {
  var $;
  $ = this.jQuery;
  this.magicmockup = (function() {
    var $doc, init, inkNS, views, _dispatch;
    inkNS = 'http://www.inkscape.org/namespaces/inkscape';
    $doc = $(this.document);
    views = {};
    _dispatch = function(command, id) {
      var act;
      act = {
        next: function() {
          var _base;
          $('g').hide();
          return typeof (_base = $(views[id])).show === "function" ? _base.show() : void 0;
        }
      };
      console.log([command, id], views, views[id]);
      return typeof act[command] === "function" ? act[command]() : void 0;
    };
    init = function() {
      $('g').each(function() {
        var label;
        label = this.getAttributeNS(inkNS, 'label');
        if (label) {
          return views[label] = this;
        }
      });
      return $doc.delegate('g', 'click', function(e) {
        var action, actions, command, id, _i, _len, _ref, _ref2, _results;
        actions = $(e.currentTarget).children('desc').text();
        if (!actions) {
          return;
        }
        _ref = actions.split(/([\s\n]+)/);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          action = _ref[_i];
          _ref2 = action.split(/\=/), command = _ref2[0], id = _ref2[1];
          _results.push(_dispatch(command, id));
        }
        return _results;
      });
    };
    return {
      init: init
    };
  })();
  this.nextScreen = function(e) {};
  this.init = function() {
    return magicmockup.init();
  };
}).call(this);
