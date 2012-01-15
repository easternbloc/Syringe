var dns = require('./dns');
var syringe = require('../lib/syringe');
var dnsMod = syringe('dns');
var urlMod = syringe('url');

dnsMod.inject('resolve4', function (url, callback) {
	callback(null, ['127.0.0.1']);
});

urlMod.inject('parse', function() {
  return {hostname: 'www.google.com'};
});

urlMod.wrap('parse', function() {
  console.log('yep, that function was called from within the require!');
});

dns.resolveAddress('http://www.google.com/', function(err, result) {
	if (err) {
		throw new Error(err);
	}
	console.log('Resolved dns list:', result);
});