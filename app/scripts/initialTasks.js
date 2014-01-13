(function(mifosX) {
  var defineHeaders = function($httpProvider , $translateProvider, ResourceFactoryProvider ,HttpServiceProvider) {
         var mainLink = getLocation(window.location.href);
    if (mainLink.hostname == "localhost" || mainLink.hostname == "" || mainLink.hostname == null || QueryParameters["baseApiUrl"]) {
                var baseApiUrl = "";
                if(QueryParameters["baseApiUrl"]) {
                 baseApiUrl = QueryParameters["baseApiUrl"];
                }
                else{
                 baseApiUrl = 'https://demo.openmf.org';
                }
                var queryLink = getLocation(baseApiUrl);
                host = "https://" + queryLink.hostname;
                if(host.toLowerCase().indexOf("localhost") >= 0)
                 host = host.concat(':8443\:8443');
        ResourceFactoryProvider.setBaseUrl(host);
        HttpServiceProvider.addRequestInterceptor('demoUrl', function(config) {
                        host = host.replace(":8443","");
            return _.extend(config, {url: host + config.url });
        });

        $httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = 'default';

     }
     else{


          var hostname = window.location.hostname;
          console.log('hostname---'+hostname);
          domains = hostname.split('.');
          console.log('domains---'+domains);
       
        if(domains.length = 3 && domains[1] == 'openmf'){
          // For multi tenant hosting
          if(domains[0] == "demo"){
                  $httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = 'default';
                  console.log("demo server",domains[0]);
          }
          else{
                  $httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = domains[0];
                  console.log("other than demo server", domains[0]);

          }
        }
        else{
                  $httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = 'default';
                  console.log("demo server",domains[0]);
          
        }
        
     }

        // Enable CORS! (see e.g. http://enable-cors.org/)
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

          //Set headers
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';

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

getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

QueryParameters = (function()
{
    var result = {};
    if (window.location.search)
    {
        // split up the query string and store in an associative array
        var params = window.location.search.slice(1).split("&");
        for (var i = 0; i < params.length; i++)
        {
            var tmp = params[i].split("=");
            result[tmp[0]] = unescape(tmp[1]);
        }
    }
    return result;
}());
