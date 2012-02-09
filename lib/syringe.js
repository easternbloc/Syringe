var modules = {};

function Syringe(moduleName) {
  var moduleCache = {},
      module = require(moduleName);

  this.inject = function(methodName, method) {
    if(module[methodName] && !moduleCache[methodName]) {
      moduleCache[methodName] = module[methodName];
      this.forceInject(methodName, method);
      return this;
    } else if (moduleCache[methodName]) {
      throw new Error(methodName + ' has already been injected from this module. Please retore it first.');
    } else {
      throw new Error(methodName + ' does not exist in the module.');
    }
  };

  this.forceInject = function(methodName, method) {
    module[methodName] = method;
    return this;
  };

  this.restore = function(methodName) {
    if(moduleCache[methodName]) {
      module[methodName] = moduleCache[methodName];
      delete moduleCache[methodName];
      return this;
    } else {
      throw new Error(methodName + ' does not exist in the module so cannot be restored.');
    }
  };

  this.wrap = function(methodName, before) {
    if (module[methodName] && typeof before === 'function') {
      moduleCache[methodName] = module[methodName];

      module[methodName] = function() {
        before();
        return moduleCache[methodName].apply(null, arguments);
      }
    } else {
      throw new Error(methodName + ' does not exist in the module so cannot be wrapped.');
    }
  };

  this.unWrap = function(methodName) {
    this.restore(methodName);
  };

  this.replaceAll = function(replaceModule) {
    if (typeof replaceModule === 'object') {
      for(var methodName in replaceModule) {
        this.inject(methodName, replaceModule[methodName]);
      }
    } else {
      throw new Error(methodName + ' does not exist in the module so cannot be wrapped.');
    }
  };

  this.restoreAll = function(restoreModule) {
    for(var method in moduleCache) {
      this.restore(method);
    };
  };
}

module.exports = function(moduleName) {
  if (!modules[moduleName]) {
    modules[moduleName] = new Syringe(moduleName);
  }

  return modules[moduleName];
};