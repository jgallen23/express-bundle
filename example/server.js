var express = require('express');

var config = {
  apiKey: '1234',
  name: 'Bob'
};

var app = express.createServer();
var io = require('socket.io').listen(app);
var bundle = require('../')
  .use(app, { })
  .socket(io)
  .args(config);


app.set("view options", {
  layout: false 
});
app.set("view engine", "jade");
app.set("views", "" + __dirname + "/views");

bundle.register('app1');
bundle.register('app2');

app.listen(3000);
