describe("SessionManager", function () {
    var webStorage, httpService, resourceFactory, resourceCallback, userConstructor;
    beforeEach(function () {
        webStorage = jasmine.createSpyObj("webStorage", ['add', 'get', 'remove']);
        httpService = jasmine.createSpyObj("HttpService", ['setAuthorization', 'cancelAuthorization']);
        resourceFactory = {userResource: {
            get: jasmine.createSpy('userResource.get()').andCallFake(function (params, callback) {
                resourceCallback = callback;
            })
        }};
        userConstructor = spyOn(mifosX.models, 'LoggedInUser').andReturn({id: "test_user"});

        this.sessionManager = new mifosX.services.SessionManager(webStorage, httpService, 'basicauth', resourceFactory);
    });

    describe("Session restore", function () {
        describe("when sessionData exists in the storage", function () {
            beforeEach(function () {
                webStorage.get.andCallFake(function (key) {
                    if (key === 'sessionData') return {userId: "test_user", authenticationKey: "test_key"};
                });
                var self = this;
                this.sessionManager.restore(function (session) {
                    self.session = session;
                });
            });

            it("should set the http authorization", function () {
                expect(httpService.setAuthorization).toHaveBeenCalledWith("test_key", false);
            });
            it("should retrieve the current user", function () {
                expect(resourceFactory.userResource.get).toHaveBeenCalledWith({userId: "test_user"}, jasmine.any(Function))
            });
            it("should return a session with the user", function () {
                resourceCallback("test_user_data");
                expect(userConstructor).toHaveBeenCalledWith("test_user_data");
                expect(this.session).toEqual({user: {id: "test_user"}});
            });
        });

        describe("when sessionData does not exist in the storage", function () {
            beforeEach(function () {
                webStorage.get.andReturn(null);
                var self = this;
                this.sessionManager.restore(function (session) {
                    self.session = session;
                });
            });

            it("should return an empty session", function () {
                expect(this.session).toBeEmpty();
            });
        });
    });

    describe("Session start", function () {
        beforeEach(function () {
            this.session = this.sessionManager.get({userId: "test_user", base64EncodedAuthenticationKey: "test_key"});
        });

        it("should set the http authorization", function () {
            expect(httpService.setAuthorization).toHaveBeenCalledWith("test_key", false);
        });
        it("should store the session data", function () {
            expect(webStorage.add).toHaveBeenCalledWith("sessionData", {userId: "test_user", authenticationKey: "test_key"});
        });
        it("should return a session with the user", function () {
            expect(userConstructor).toHaveBeenCalledWith({userId: "test_user", base64EncodedAuthenticationKey: "test_key"});
            expect(this.session).toEqual({user: {id: "test_user"}});
        });
    });

    describe("Session clear", function () {
        beforeEach(function () {
            this.session = this.sessionManager.clear();
        });

        it("should cancel the http authorization", function () {
            expect(httpService.cancelAuthorization).toHaveBeenCalled();
        });
        it("should remove the session data from the storage", function () {
            expect(webStorage.remove).toHaveBeenCalledWith("sessionData");
        });
        it("should return an empty session", function () {
            expect(this.session).toBeEmpty();
        });
    });
});