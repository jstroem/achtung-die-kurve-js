var reporter = require('nodeunit').reporters.default;
var fs = require('fs');

var folder = __dirname.substr(fs.realpathSync('.').length,__dirname.length-1);

reporter.run([folder]);