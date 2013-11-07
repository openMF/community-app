(function(mifosX) {
  var defineHeaders = function($httpProvider , $translateProvider, ResourceFactoryProvider ,HttpServiceProvider,TENANT ,CONTENT_TYPE , HOST ) {

    // Set Host name, if accessed from file system

    var protocol = window.location.protocol;
    if (protocol === 'file:') {
        ResourceFactoryProvider.setBaseUrl(HOST);
        HttpServiceProvider.addRequestInterceptor('demoUrl', function(config) {
            return _.extend(config, {url: HOST + config.url});
        });
     }   


  	//Set headers
    $httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = TENANT;
    $httpProvider.defaults.headers.common['Content-Type'] = CONTENT_TYPE;


    // Configure i18n and preffer language
 	  //$translateProvider.translations('en', translationsEN);
  	//$translateProvider.translations('de', translationsDE);

    $translateProvider.useStaticFilesLoader({
          prefix: 'global-translations/locale-',
          suffix: '.json'
    });

  	$translateProvider.preferredLanguage('en');
  	$translateProvider.fallbackLanguage('en');

  };
  mifosX.ng.application.config(defineHeaders).run(function($log) {
    $log.info("Initial tasks are done!");
  });
}(mifosX || {}));
