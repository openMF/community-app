define(['mifosX', 'services/HttpServiceProvider', 'services/ResourceFactoryProvider'], function() {
  var regexp = /\?test_demo/;
  var match = regexp.exec(window.location.search);
  var demoBaseUrl = "https://demo.openmf.org/mifosng-provider/api/v1";
  if (match) {
    mifosX.ng.services.config(['HttpServiceProvider', 'ResourceFactoryProvider', '$httpProvider', function(httpServiceProvider, resourceFactoryProvider, httpProvider) {
      resourceFactoryProvider.setBaseUrl(demoBaseUrl);
      httpServiceProvider.addRequestInterceptor('demoUrl', function(config) {
        return _.extend(config, {url: demoBaseUrl + config.url});
      });

      httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = 'default';
    }]).run(function($log) {
      $log.warn("Using live demo server -> " + demoBaseUrl);
    });
  }
});
