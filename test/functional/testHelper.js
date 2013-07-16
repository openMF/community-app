define(['underscore'], {
  FakeServer: function(httpBackend) {
    var getResponseOptions = function(urlMatch, requestData, requestHeaders, response) {
      var options = response;
      if (_.isFunction(response)) {
        options = response.call(null, urlMatch, requestData, requestHeaders);
      }
      return _.defaults(options, {
        returnCode: 200,
        content: {},
        headers: {},
        delay: 0
      });
    };

    _.each(['get', 'post'], function(method) {
      this[method] = function(urlRegex, response) {
        httpBackend["when" + method.toUpperCase()](urlRegex).respond(function(method, url, data, headers) {
          var responseOptions = getResponseOptions(url.match(urlRegex), data, headers, response);
          if (_.isNumber(responseOptions.delay) && responseOptions.delay > 0) {
            // a bit of a hack, but this is the only way I figured out to pass delay information
            // to the $httpBackend decorator (see scenarioTest.js) 
            responseOptions.headers['MifosX-Scenario-Delay'] = responseOptions.delay * 1000;
          }
          return [responseOptions.returnCode, responseOptions.content, responseOptions.headers];
        });
      }
    }, this);
  }
});