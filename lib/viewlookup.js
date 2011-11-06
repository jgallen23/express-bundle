var express = require('express');
var enableMultipleViewRoots = function(express) {
  var old = express.view.lookup;

  var lookup = function(view, options) {
    // If root is an array of paths, let's try each path until we find the view
    if (options.root instanceof Array) {
      var opts = {};
      for (var key in options) opts[key] = options[key];
      var root = opts.root, foundView = null;
      for (var i=0; i<root.length; i++) {
        opts.root = root[i];
        foundView = lookup.call(this, view, opts);
        if (foundView.exists) break;
      }
      return foundView;
    }

    // Fallback to standard behavior, when root is a single directory
    return old.call(this, view, options);
  };

  express.view.lookup = lookup;
};
enableMultipleViewRoots(express);
