define(['angular', 'webstorage'], function(angular) {
  angular.module('webStorageModule')
  .constant('prefix', 'mifosX')
  .run(function($log, webStorage) {
    if (webStorage.isSupported) {
      if (webStorage.local.isSupported) $log.info("Using local storage")
      else if (webStorage.session.isSupported) $log.info("Using session storage")
      else $log.warn("Using memory storage: a page reload will clear all stored data");
    }
  });
});