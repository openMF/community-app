describe("UserController", function() {
  var resourceCallback;
  beforeEach(function() {
    this.scope = {};
    this.resourceFactory = {userResource: {
      getAllUsers: jasmine.createSpy('userResource.getAllUsers()').andCallFake(function(params, callback) {
        resourceCallback = callback;
      })
    }};
    userConstructor = spyOn(mifosX.models, 'User').andCallFake(function(data) {
      return {id: data};
    });

    this.controller = new mifosX.controllers.UserController(this.scope, this.resourceFactory);
  });

  it("should populate the scope with the retrieved users", function() {
    resourceCallback(["test_user1", "test_user2"]);
    
    expect(this.scope.users).toEqual([{id: "test_user1"}, {id: "test_user2"}])
  });
});