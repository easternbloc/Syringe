var dns = require('dns');
var url = require('url');

module.exports.resolveAddress = function(urlToResolve, callback) {
  var urlParsed = url.parse(urlToResolve).hostname;

  dns.resolve4(urlParsed, callback);
}