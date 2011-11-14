module.exports = function(config) {
  //this === app
  this.get("/", function(req, res) {
    res.render('app1', {
      name: config.name
    });
  });
};
