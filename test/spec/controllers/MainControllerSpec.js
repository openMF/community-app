describe("MainController", function() {
  var eventListener, resourceCallback, userConstructor;
  beforeEach(function() {
    this.scope = jasmine.createSpyObj("$scope", ['$on']);
    this.scope.$on.andCallFake(function(event, listener) {
      eventListener = listener;
    });
    this.location = jasmine.createSpyObj("$location", ['path', 'replace']);
    this.location.path.andReturn(this.location);
    this.webStorage = jasmine.createSpyObj("webStorage", ['add', 'get']);
    this.http = jasmine.createSpyObj("HttpService", ['setAuthorization']);
    this.resourceFactory = {userResource: {
      get: jasmine.createSpy('userResource.get()').andCallFake(function(params, callback) {
        resourceCallback = callback;
        return "test_data";
      })
    }};
    userConstructor = spyOn(mifosX.models, 'User').andReturn({id: "test_user"});
  });

  describe("on initialisation", function() {
    it("should listen to 'UserAuthenticationSuccessEvent'", function() {
      this.controller = new mifosX.controllers.MainController(this.scope, this.location, this.webStorage, this.http, this.resourceFactory);

      expect(this.scope.$on).toHaveBeenCalledWith("UserAuthenticationSuccessEvent", jasmine.any(Function));
    });

    describe("when a userId and an authorisation key exist in the storage", function() {
      beforeEach(function() {
      this.webStorage.get.andCallFake(function(key) {
          if (key === 'userId') return "test_user";
          if (key === 'authenticationKey') return "test_key";
        });
        this.controller = new mifosX.controllers.MainController(this.scope, this.location, this.webStorage, this.http, this.resourceFactory);
      });
  
      it("should set the authorization", function() {
        expect(this.http.setAuthorization).toHaveBeenCalledWith("test_key");
      });
      it("should retrieve the current user", function() {
        expect(this.resourceFactory.userResource.get).toHaveBeenCalledWith({userId: "test_user"}, jasmine.any(Function))
      });
      it("should update the current user in the scope", function() {
        resourceCallback();
        expect(userConstructor).toHaveBeenCalledWith("test_data");
        expect(this.scope.currentUser).toEqual({id: "test_user"});
      });
    });
  });

  describe("on receving 'UserAuthenticationSuccessEvent'", function() {
    beforeEach(function() {
      this.controller = new mifosX.controllers.MainController(this.scope, this.location, this.webStorage, this.http, this.resourceFactory);
      eventListener({}, "test_data");
    });

    it("should store a new User in the scope", function() {
      expect(userConstructor).toHaveBeenCalledWith("test_data");
      expect(this.scope.currentUser).toEqual({id: "test_user"});
    });
    it("should redirect to the home page", function() {
      expect(this.location.path).toHaveBeenCalledWith('/home');
    });
    it("should store the user id", function() {
      eventListener({}, {userId: "test_user"});

      expect(this.webStorage.add).toHaveBeenCalledWith("userId", "test_user");
    });
    it("should store the authentication key", function() {
      eventListener({}, {base64EncodedAuthenticationKey: "test_key"});

      expect(this.webStorage.add).toHaveBeenCalledWith("authenticationKey", "test_key");
    });
    it("should set the authorization", function() {
      eventListener({}, {base64EncodedAuthenticationKey: "test_key"});

      expect(this.http.setAuthorization).toHaveBeenCalledWith("test_key");
    });
  });
});