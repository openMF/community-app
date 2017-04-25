describe("HttpServiceProvider", function () {
    var http, httpService;
    beforeEach(function () {
        this.provider = new mifosX.services.HttpServiceProvider();
    });

    describe("Http service", function () {
        describe("HTTP methods", function () {
            beforeEach(function () {
                http = jasmine.createSpy("$http").andReturn('httpPromise');
                httpService = this.provider.$get[1](http);
            });

            _.each(['get', 'head', 'delete'], function (method) {
                it("should delegate to the correspoding http " + method, function () {
                    var promise = httpService[method]("test_url");

                    expect(http).toHaveBeenCalledWith({ method: method.toUpperCase(), url: "test_url"});
                    expect(promise).toEqual('httpPromise');
                });
            });

            _.each(['post', 'put'], function (method) {
                it("should delegate to the correspoding http " + method, function () {
                    var promise = httpService[method]("test_url", {test: 'some_data'});

                    expect(http).toHaveBeenCalledWith({ method: method.toUpperCase(), url: "test_url", data: {test: 'some_data'} });
                    expect(promise).toEqual('httpPromise');
                });
            });
        });

        describe("Authorization", function () {
            beforeEach(function () {
                http = { defaults: { headers: { common: {} } } };
                httpService = this.provider.$get[1](http);
            });
            it("should set the Authorization header", function () {
                httpService.setAuthorization("test_key");

                expect(http.defaults.headers.common.Authorization).toEqual("Basic test_key");
            });

            it("should remove the Authorization header", function () {
                http.defaults.headers.common.Authorization = "test";
                httpService.cancelAuthorization();

                expect(http.defaults.headers.common.Authorization).toBeUndefined();
            });
        });
    });

    describe("Request interceptors", function () {
        beforeEach(function () {
            http = jasmine.createSpy("$http").andReturn('httpPromise');
            httpService = this.provider.$get[1](http);
        });

        it("should add a new interceptor", function () {
            this.provider.addRequestInterceptor("test_interceptor", function (config) {
                return _.extend(config, {url: "test_another_url"});
            });

            httpService.get("test_url");

            expect(http).toHaveBeenCalledWith({ method: 'GET', url: "test_another_url" });
        });

        it("should add a chain of interceptors", function () {
            this.provider.addRequestInterceptor("test_interceptor1", function (config) {
                return _.extend(config, {url: "test_another_url"});
            });
            this.provider.addRequestInterceptor("test_interceptor2", function (config) {
                return _.extend(config, {headers: {AnotherHeader: "test_header"}})
            });

            httpService.get("test_url");

            expect(http).toHaveBeenCalledWith({ method: 'GET', url: "test_another_url", headers: {AnotherHeader: "test_header"} });
        });

        it("should remove an interceptor", function () {
            this.provider.addRequestInterceptor("test_interceptor1", function (config) {
                return _.extend(config, {url: "test_another_url"});
            });
            this.provider.addRequestInterceptor("test_interceptor2", function (config) {
                return _.extend(config, {headers: {AnotherHeader: "test_header"}})
            });
            this.provider.removeRequestInterceptor("test_interceptor1");

            httpService.get("test_url");

            expect(http).toHaveBeenCalledWith({ method: 'GET', url: "test_url", headers: {AnotherHeader: "test_header"} });
        });
    });
});