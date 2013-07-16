describe("AuthenticationService", function() {
  var scope, httpService, callbacks;
  beforeEach(function() {
    callbacks = {};
    scope = jasmine.createSpyObj("$rootScope", ['$broadcast']);
    
    httpService = jasmine.createSpyObj("httpService", ['post', 'success', 'error']);
    httpService.post.andReturn(httpService);
    _.each(['success', 'error'], function(method) {
      httpService[method].andCallFake(function(callback) {
        callbacks[method] = callback;
        return this;
      });
    });

    new mifosX.services.AuthenticationService(scope, httpService).authenticateWithUsernamePassword({
      username: "test_username",
      password: "test_password",
    });
  });

  it("should pass the correct parameters to the post method", function() {
    expect(httpService.post).toHaveBeenCalledWith("/authentication?username=test_username&password=test_password");
  });

  it("should broadcast 'UserAuthenticationStartEvent'", function() {
    expect(scope.$broadcast).toHaveBeenCalledWith("UserAuthenticationStartEvent");
  });

  describe("On successful authentication", function() {
    it("should broadcast a 'UserAuthenticationSuccessEvent' on successful authentication", function() {
      callbacks['success']("test_data");

      expect(scope.$broadcast).toHaveBeenCalledWith("UserAuthenticationSuccessEvent", "test_data");
    });
  });

  describe("On failed authentication", function() {
    it("should broadcast a 'UserAuthenticationFailureEvent' on failed authentication", function() {
      callbacks['error']("test_data");

      expect(scope.$broadcast).toHaveBeenCalledWith("UserAuthenticationFailureEvent", "test_data");
    });
  });
});