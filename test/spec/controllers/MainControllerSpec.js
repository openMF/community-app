describe("MainController", function() {
  var eventListener;
  beforeEach(function() {
    this.scope = jasmine.createSpyObj("$scope", ['$on']);
    this.scope.$on.andCallFake(function(event, listener) {
      eventListener = listener;
    });
    this.location = jasmine.createSpyObj("$location", ['path', 'replace']);
    this.location.path.andReturn(this.location);

    this.controller = new mifosX.controllers.MainController(this.scope, this.location);
  });

  it("should listen to 'UserAuthenticationSuccessEvent'", function() {
    expect(this.scope.$on).toHaveBeenCalledWith("UserAuthenticationSuccessEvent", jasmine.any(Function));
  });

  describe("on receving 'UserAuthenticationSuccessEvent'", function() {
    beforeEach(function() {
      this.userConstructor = spyOn(mifosX.models, 'User').andReturn({id: "test_user"});
      eventListener({}, "test_data");
    });

    it("should store a new User in the scope", function() {
      expect(this.userConstructor).toHaveBeenCalledWith("test_data");
      expect(this.scope.currentUser).toEqual({id: "test_user"});
    });
    it("should redirect to the home page", function() {
      expect(this.location.path).toHaveBeenCalledWith('/home');
    });
  });
});