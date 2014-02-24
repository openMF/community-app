(function(mifosX) {
    var defineHeaders = function($httpProvider , $translateProvider, ResourceFactoryProvider ,HttpServiceProvider) {
        var mainLink = getLocation(window.location.href);
        var baseApiUrl = "https://demo.openmf.org";
        var host = "";
        var portNumber = "";
        //accessing from openmf server
        if (mainLink.hostname.indexOf('openmf.org') >= 0) {
            var hostname = window.location.hostname;
            console.log('hostname---'+hostname);
            domains = hostname.split('.');
            console.log('domains---'+domains);
            // For multi tenant hosting
            if (domains[0] == "demo") {
                $httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = 'default';
                ResourceFactoryProvider.setTenantIdenetifier('default');
                console.log("demo server",domains[0]);
            } else {
                $httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = domains[0];
                ResourceFactoryProvider.setTenantIdenetifier(domains[0]);
                console.log("other than demo server", domains[0]);

            }
            host = mainLink.hostname;
            console.log('hostname from mainLink = ',host);
        } 
        //accessing from a file system or other servers
        else {
            if (mainLink.hostname != "") {
                baseApiUrl = "https://"+mainLink.hostname+(mainLink.port ? ':'+mainLink.port : '');
            }
            
            if (QueryParameters["baseApiUrl"]) { 
                baseApiUrl = QueryParameters["baseApiUrl"];
            }
            var queryLink = getLocation(baseApiUrl);
            host = "https://"+queryLink.hostname+(queryLink.port ? ':'+queryLink.port : '');
            portNumber = queryLink.port;

            $httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = 'default';
            ResourceFactoryProvider.setTenantIdenetifier('default');
            if(QueryParameters["tenantIdentifier"]) {
                $httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = QueryParameters["tenantIdentifier"];
                ResourceFactoryProvider.setTenantIdenetifier(QueryParameters["tenantIdentifier"]);
            }
        }

        // Angularjs strips everything after colon(:) so we are appending port number again
        // follow this link for more info https://github.com/angular/angular.js/issues/1243 
        if (portNumber && portNumber != "") {              
            host = host.concat(':'+portNumber);
        };
        ResourceFactoryProvider.setBaseUrl(host);
        HttpServiceProvider.addRequestInterceptor('demoUrl', function(config) {
            if (portNumber && portNumber != ""){
                host = host.replace(':'+portNumber, "");
            }
          return _.extend(config, {url: host + config.url });
        });

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

QueryParameters = (function() {
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
