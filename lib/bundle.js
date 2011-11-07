var express = require('express');
var path = require('path');
var aug = require('aug');
var stylus = require('stylus');
var cwd = process.cwd();

var Bundle = function(app, options) {
  var defaults = {
    bundlesDir: 'bundles',
    viewsDir: 'views',
    assetDir: 'public',
    enableStylus: false
  };
  this.options = aug({}, defaults, options);
  this.options.bundlesDir = path.join(cwd, this.options.bundlesDir);
  this.app = app;
};


Bundle.prototype.getBundlePath = function(bundleName) {
  return path.join(this.options.bundlesDir, bundleName);
};

Bundle.prototype.setupViews = function(bundlePath) {
  var views = this.app.set("views");
  if (typeof views === "string") {
    views = [views];
  }
  var viewsPath = path.join(bundlePath, this.options.viewsDir);
  console.log(viewsPath);
  views.push(viewsPath);
  console.log(views);
  this.app.set("views", views);
};

Bundle.prototype.setupController = function(bundlePath, urlPrefix) {
  if (!urlPrefix) urlPrefix = "/";
  require(bundlePath+"/controller.js")(this.app, urlPrefix);
};


Bundle.prototype.setupAssets = function(bundlePath) {
  var assetPath = path.join(bundlePath, this.options.assetDir);
  if (this.options.enableStylus) {

    var stylusCompile = function(str, path) {
      return stylus(str)
        .set('filename', path)
        .set('compress', true);
        //.use(nib());
    };
    this.app.use(stylus.middleware({
      src: assetPath,
      dest: assetPath,
      compile: stylusCompile
    }));
  }
  this.app.use(express.static(assetPath));
};

Bundle.prototype.register = function(bundleName, urlPrefix) {
  var bundlePath = this.getBundlePath(bundleName);
  this.setupViews(bundlePath);
  this.setupController(bundlePath, urlPrefix);
  this.setupAssets(bundlePath);
};

var use = function(app, options) {
  return new Bundle(app, options);
};


module.exports.use = use;
