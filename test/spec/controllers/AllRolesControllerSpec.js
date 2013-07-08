describe("RolesController", function() {
  var resourceCallback;

  beforeEach(function() {
    this.scope = {};
    this.resourceFactory = { allRolesResource: {
      get: jasmine.createSpy('allRolesResource.get()').andCallFake(function(params, callback) {
        resourceCallback = callback;
      })
    }};
    this.controller = new mifosX.controllers.AllRolesController(this.scope, this.resourceFactory);
  });

  it("should get all roles", function() {
    resourceCallback(['role1', 'role2']);

    expect(this.scope.allRoles).toEqual(['role1','role2']);
  });
  
});
