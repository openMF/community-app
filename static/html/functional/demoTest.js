define(['mifosX', 'services/HttpServiceProvider', 'services/ResourceFactoryProvider'], {
    configure: function (url) {

        var baseUrl = url || "https://demo.openmf.com";
        mifosX.ng.services.config(['HttpServiceProvider', 'ResourceFactoryProvider', '$httpProvider', function (httpServiceProvider, resourceFactoryProvider, httpProvider) {

                // Below initialization has been moved to   InitialTask.js
                /*resourceFactoryProvider.setBaseUrl(baseUrl);
                 httpServiceProvider.addRequestInterceptor('demoUrl', function(config) {
                 return _.extend(config, {url: baseUrl + config.url});
                 });*/

                httpProvider.defaults.headers.common['Fineract-Platform-TenantId'] = 'default';
            }]).run(function ($log) {
                $log.warn("Using live demo server api -> " + baseUrl);
            });
    }
});
