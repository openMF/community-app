define(['underscore'], {
    FakeServer: function (httpBackend) {
        var getResponseOptions = function (urlMatch, requestData, requestHeaders, response) {
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

        _.each(['get', 'post'], function (method) {
            this[method] = function (urlRegex, response) {
                httpBackend["when" + method.toUpperCase()](urlRegex).respond(function (method, url, data, headers) {
                    var responseOptions = getResponseOptions(url.match(urlRegex), data, headers, response);
                    httpBackend.responseDelay = responseOptions.delay;
                    return [responseOptions.returnCode, responseOptions.content, responseOptions.headers];
                });
            }
        }, this);
    }
});