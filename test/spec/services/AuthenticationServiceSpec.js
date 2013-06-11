describe("AuthenticationService", function() {
  var scope, http, callbacks;
  beforeEach(function() {
    callbacks = {};
    scope = jasmine.createSpyObj("$rootScope", ['$broadcast']);
    
    http = jasmine.createSpyObj("$http", ['post', 'success', 'error']);
    http.post.andReturn(http);
    _.each(['success', 'error'], function(method) {
      http[method].andCallFake(function(callback) {
        callbacks[method] = callback;
        return this;
      });
    });

    new mifosX.services.AuthenticationService(scope, http).authenticateWithUsernamePassword({
      username: "test_username",
      password: "test_password",
    });
  });

  it("should pass the correct parameters to the post method", function() {
    expect(http.post).toHaveBeenCalledWith("/authentication?username=test_username&password=test_password");
  });

  it("should broadcast a 'UserAuthenticationSuccessEvent' on successful authentication", function() {
    callbacks['success']("test_data");

    expect(scope.$broadcast).toHaveBeenCalledWith("UserAuthenticationSuccessEvent", "test_data");
  });
  it("should broadcast a 'UserAuthenticationFailureEvent' on failed authentication", function() {
    callbacks['error']("test_data");

    expect(scope.$broadcast).toHaveBeenCalledWith("UserAuthenticationFailureEvent", "test_data");
  });
});