(function(mifosX) {
  var defineHeaders = function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = 'default';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
  };
  mifosX.ng.application.config(defineHeaders).run(function($log) {
    $log.info("http deaders are set");
  });
}(mifosX || {}));
