var express = require('express');

var app = express.createServer();
var bundle = require('../').use(app);


app.set("view options", {
  layout: false 
});
app.set("view engine", "jade");
app.set("views", "" + __dirname + "/views");

bundle.register('app1');


app.listen(3000);
