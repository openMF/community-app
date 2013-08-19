var mifosX = (function(module) {
  module.ng = {
    services: angular.module('MifosX_Services', ['ngResource']),
    application: angular.module('MifosX_Application', ['MifosX_Services', 'webStorageModule', 'ui.bootstrap' , 'pascalprecht.translate'])
  };
  return module;
}(mifosX || {}));

