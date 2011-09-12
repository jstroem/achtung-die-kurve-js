var reporter = require('nodeunit').reporters.default;
var fs = require('fs');

var folder = __dirname.substr(fs.realpathSync('.').length,__dirname.length-1);

reporter.run([folder]);

var express = require('express');
var app = express.createServer();
// Routes

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

app.listen(8991);
