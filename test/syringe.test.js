var testCase = require('nodeunit').testCase;
var syringe = require('../index');

//Required module
var util = require('util');
var utilPrintCache = util.print;
var utilLogCache = util.log;

var utilStub = syringe('util');

//mocked method
var methodToInject = function() { return true; };

module.exports = testCase({
  'inject overwrites method with mocked one': function (test) {
    test.strictEqual(utilPrintCache, util.print, 'Method hasn\'t been overwritten');
    utilStub.inject('print', methodToInject);
    
    test.strictEqual(methodToInject, util.print, 'Method has been successfully injected into the module');
    
    utilStub.restore('print');
    test.done();
  },

  'inject method throws an error when method not found': function(test) {
    test.throws(function(){ utilStub.inject('methodNotFound', methodToInject); }, Error, 'Correctly thrown a not found error');
    test.done();
  },

  'trying to inject twice over a method will throw a already injected error': function(test) {
    utilStub.inject('print', methodToInject);
    test.throws(function(){ utilStub.inject('print', methodToInject); }, Error, 'Correctly thrown a already injected error');
    utilStub.restore('print');
    test.done();
  },

  'forceInject will forcefully inject if a method exists or not': function(test) {
    var testMethodTrigger = false;
    //Ensure the method doesn't exist to start with
    test.throws(function(){ utilStub.inject('methodNotFound', methodToInject); }, Error, 'Correctly thrown a not found error');

    utilStub.forceInject('methodNotFound', function() { testMethodTrigger = true; });
    util.methodNotFound();
    test.strictEqual(testMethodTrigger, true, 'Force inject correctly injected a method that didnt exist on the module.');
    
    test.done();
  },

  'restore returns mocked method to its initial state': function(test) {
    utilStub.inject('print', methodToInject);
    test.strictEqual(methodToInject, util.print, 'Method has been successfully injected into the module');

    utilStub.restore('print');
    test.strictEqual(utilPrintCache, util.print, 'Method has been successfully restored');

    test.done();
  },

  'wrap method will wrap given method': function (test) {
    var testWrapTriggered = false;
    utilStub.wrap('print', function(){ testWrapTriggered = true; });
    
    test.strictEqual(testWrapTriggered, false, 'wrapped method hasnt been called yet so testWrapTriggered should be false');
    
    util.print();
    test.strictEqual(testWrapTriggered, true, 'wrapped method has been called');
    
    utilStub.restore('print');
    test.done();
  },

  'unWrap will remove the wrapped method. ie restore it.': function(test) {
    var wrapTriggerCount = 0;
    utilStub.wrap('print', function(){ ++wrapTriggerCount; });
    
    util.print();
    test.strictEqual(wrapTriggerCount, 1, 'wrapped method was called');

    utilStub.unWrap('print');
    util.print();
    test.strictEqual(wrapTriggerCount, 1, 'wrapped method was removed and therefore the wrapped method was never called');

    test.done();
  },

  'replaceAll should replace all modules in the passed in object': function(test) {
    var methodCalled = false;
    var stubbedUtil = {
      print: function() {
        methodCalled = true;
      }
    };

    util.print();
    test.strictEqual(methodCalled, false, 'method hasnt been overwritten yet');

    utilStub.replaceAll(stubbedUtil);
    util.print(methodCalled);
    test.strictEqual(methodCalled, true, 'method hasnt been overwritten yet');

    utilStub.restore('print');
    
    test.done();
  },

  'restoreAll should restore all injected modules': function(test) {
    var emptyMethod = function() {};
    var stubbedUtil = {
      print: emptyMethod,
      log: emptyMethod,
    };

    utilStub.replaceAll(stubbedUtil);
    
    utilStub.restoreAll();
    test.strictEqual(util.print, utilPrintCache, 'restoreAll has restored print');
    test.strictEqual(util.log, utilLogCache, 'restoreAll has restored print');
    
    test.done();
  },
});