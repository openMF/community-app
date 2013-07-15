describe("RoleController", function() {
  var resourceCallback;

  beforeEach(function() {
    this.scope = {};
    this.scope = {}
    this.resourceFactory = { roleResource: {
      get: jasmine.createSpy('roleResource.get()').andCallFake(function(params, callback) {
        resourceCallback = callback;
      })
    }};

    this.controller = new mifosX.controllers.RolesController(this.scope, this.resourceFactory);
  });

  it("should get all roles", function() {
    resourceCallback(['role1', 'role2']);
    expect(this.scope.roles).toEqual(['role1','role2']);
  });
  
});
