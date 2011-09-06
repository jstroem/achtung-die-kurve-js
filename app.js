
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.favicon());
  app.use(express.static(__dirname + '/public'));
//  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.use(function(req, res, next){
  res.render('404', { layout: false, status: 404, url: req.url });
});
app.use(function(err, req, res, next){
    res.render('404', { layout: false, status: 404, url: req.url });
});

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.get('/404', function(req, res, next){
  next();
});

app.listen(8991);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
