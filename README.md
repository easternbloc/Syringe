Syringe
=======

[![Build Status](https://secure.travis-ci.org/easternbloc/Syringe.png)](http://travis-ci.org/easternbloc/Syringe)

Using modules in node is easy however unit testing code that requires modules is a little more tricky.  Syringe aims to assist with this problem by providing a handy set of helpers for injection and watching of module methods.

## Turtles all the way down
To properly unit test your code you need mock all the modules and methods your module collaborates with.  Ideally you keep going till you hit turtles or at least until you've stubbed every method you use. Take the following example:

	var dns = require('dns');
	var url = require('url');

	module.exports.resolveAddress = function(urlToResolve, callback) {
	  var urlParsed = url.parse(urlToResolve).hostname;

	  dns.resolve4(urlParsed, callback);
	};

## Installation

	npm install syringe

In order to unit test this module properly, you need to mock functions in the dns and url modules.  Syringe lets you inject directly over the top of modules or selectively mock the methods in them you're using.

	var dns = require('./dns');
	var syringe = require('syringe');
	
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
