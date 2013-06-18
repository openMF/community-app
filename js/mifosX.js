var mifosX = (function(module) {
  module.ng = {
    services: angular.module('MifosX_Services', ['webStorageModule']),
    application: angular.module('MifosX_Application', ['MifosX_Services', 'webStorageModule'])
  };
  return module;
}(mifosX || {}));

