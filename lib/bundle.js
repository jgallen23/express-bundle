var express = require('express');
var path = require('path');
var aug = require('aug');
var stylus = require('stylus');
var cwd = process.cwd();


var defaults = {
  indexFile: 'index',
  socketFile: 'socket',
  bundlesDir: 'bundles',
  viewsDir: 'views',
  assetDir: 'public',
  enableStylus: false
};

var Bundle = function(app, options) {
  this._args = [];
  this.app = app;
  this._options = defaults;
  this.setOptions(options);
  //if (this._options.io)
    //this.io = this._options.io;
};


Bundle.prototype.getBundlePath = function(bundleName) {
  return path.join(this._options.bundlesDir, bundleName);
};

Bundle.prototype.setupViews = function(bundlePath) {
  var views = this.app.set("views");
  if (typeof views === "string") {
    views = [views];
  }
  var viewsPath = path.join(bundlePath, this._options.viewsDir);
  views.push(viewsPath);
  this.app.set("views", views);
};

Bundle.prototype.setupController = function(bundlePath, namespace) {
  if (!namespace) namespace = "/";
  var controller = bundlePath+"/"+this._options.indexFile+".js";
  var r = null;
  if (path.existsSync(controller)) {
    r = require(controller).apply(this.app, this._args);
  }
  return r;
};

Bundle.prototype.setupSocket = function(bundlePath, namespace) {
  var socket = bundlePath+"/"+this._options.socketFile+".js";
  if (path.existsSync(socket)) {  
    var io = (namespace)?this.io.of(namespace):this.io.sockets;
    require(socket).apply(io, this._args);
  }
};

Bundle.prototype.setupAssets = function(bundlePath) {
  var assetPath = path.join(bundlePath, this._options.assetDir);
  if (this._options.enableStylus) {

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

Bundle.prototype.register = function(bundleName, namespace) {
  var bundlePath = this.getBundlePath(bundleName);
  this.setupViews(bundlePath);
  var r = this.setupController(bundlePath, namespace);
  this.setupAssets(bundlePath);
  if (this.io)
    this.setupSocket(bundlePath, namespace);
  return r;
};

Bundle.prototype.setOptions = function(options) {
  aug(this._options, options);
  this._options.bundlesDir = path.join(cwd, this._options.bundlesDir);
  return this;
};

Bundle.prototype.socket = function(io) {
  this.io = io;
  return this;
};

Bundle.prototype.args = function() {
  var args = Array.prototype.slice.call(arguments);
  this._args = args;
  return this;
};

var use = function(app, options) {
  return new Bundle(app, options);
};


module.exports.use = use;
