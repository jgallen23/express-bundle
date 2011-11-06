module.exports = function(app, urlPrefix) {
  app.get(urlPrefix, function(req, res) {
    res.render('app1', {

    });
  });
};
