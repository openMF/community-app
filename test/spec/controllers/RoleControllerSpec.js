describe("RoleController", function () {
    var resourceCallback;

    beforeEach(function () {
        this.scope = {};
        this.resourceFactory = { roleResource: {
            getAllRoles: jasmine.createSpy('roleResource.getAllRoles()').andCallFake(function (params, callback) {
                resourceCallback = callback;
            })
        }};

        this.controller = new mifosX.controllers.RoleController(this.scope, this.resourceFactory);
    });

    it("should get all roles", function () {
        resourceCallback(['role1', 'role2']);
        expect(this.scope.roles).toEqual(['role1', 'role2']);
    });

});
