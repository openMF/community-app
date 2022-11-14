(function (module) {
    mifosX.services = _.extend(module, {
        HttpServiceProvider: function () {
            var requestInterceptors = {};

            this.addRequestInterceptor = function (id, interceptorFn) {
                requestInterceptors[id] = interceptorFn;
            };

            this.removeRequestInterceptor = function (id) {
                delete requestInterceptors[id];
            };

            this.$get = ['$http', function (http) {
                var HttpService = function () {
                    var getConfig = function (config) {
                        return _.reduce(_.values(requestInterceptors), function (c, i) {
                            return i(c);
                        }, config);
                    };

                    var self = this;
                    _.each(['get', 'delete', 'head'], function (method) {
                        self[method] = function (url) {
                            var config = getConfig({
                                method: method.toUpperCase(),
                                url: url
                            });
                            return http(config);
                        };
                    });
                    _.each(['post', 'put'], function (method) {
                        self[method] = function (url, data) {
                            var config = getConfig({
                                method: method.toUpperCase(),
                                url: url,
                                data: data
                            });
                            return http(config);
                        };
                    });
                    this.setAuthorization = function (key, isOauth) {
                        if(isOauth){
                            http.defaults.headers.common.Authorization = "bearer " + key;
                        } else {
                            http.defaults.headers.common.Authorization = "Basic " + key;
                        }
                    };

                    this.cancelAuthorization = function () {
                        delete http.defaults.headers.common.Authorization;
                        delete http.defaults.headers.common['Fineract-Platform-TFA-Token'];
                    };

                    this.setTwoFactorAccessToken = function (token) {
                        http.defaults.headers.common['Fineract-Platform-TFA-Token'] = token;
                    }
                };
                return new HttpService();
            }];
        }
    });
    mifosX.ng.services.config(function ($provide) {
        $provide.provider('HttpService', mifosX.services.HttpServiceProvider);
    }).run(function ($log) {
        $log.info("HttpService initialized");
    });
}(mifosX.services || {}));
