(function(mifosX) {
  var defineHeaders = function($httpProvider , $translateProvider, ResourceFactoryProvider ,HttpServiceProvider,TENANT ,CONTENT_TYPE , HOST, API_URL_OVERRIDE ) {

    // Fix API URL?
    if (API_URL_OVERRIDE  === 'true') {
        ResourceFactoryProvider.setBaseUrl(HOST);
        HttpServiceProvider.addRequestInterceptor('demoUrl', function(config) {
            return _.extend(config, {url: HOST + config.url });
        });

        $httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = TENANT;

     }
     else{
          // For multi tenant hosting
          var hostname = window.location.hostname;
          if (window.location.protocol === 'file:') {
            hostname = HOST;
            ResourceFactoryProvider.setBaseUrl(HOST);
            HttpServiceProvider.addRequestInterceptor('demoUrl', function(config) {
                return _.extend(config, {url: HOST + config.url });
            });
          };
          domains = hostname.split('.');
          domains[0] = domains[0].replace("https://","");
          if(domains[0] == "demo"){
                  $httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = TENANT;
          }
          else if(domains[0] == "localhost"){
                  $httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = TENANT;
          }
          else{
                  $httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = domains[0];
          }
     }   

	// Enable CORS! (see e.g. http://enable-cors.org/) 
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];

  	//Set headers
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
