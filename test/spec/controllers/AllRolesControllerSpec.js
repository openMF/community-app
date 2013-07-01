describe("RolesController", function() {
  var eventListener;

  beforeEach(function() {
    this.resourceFactory = { allRolesResource: {
      get: jasmine.createSpy('allRolesResource.get()').andCallFake(function(params, callback) {
        resourceCallback = callback;
        return ['role1', 'role2'];
      })
    }};
    this.controller = new mifosX.controllers.AllRolesController(this.scope, this.resourceFactory);
  });

  it("should get all roles", function() {
    expect(this.scope.allRoles).toEqual(['role1','role2']);
  });
  
});
