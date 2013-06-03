var mifosX = (function(module) {
  module.ng = {
    services: angular.module('MifosX_Services', []),
    application: angular.module('MifosX_Application', ['MifosX_Services'])
  };
  return module;
}(mifosX || {}));

