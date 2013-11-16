describe("ResourceFactoryProvider", function() {
  var ngResource,
      apiVersion = "/mifosng-provider/api/v1";
  beforeEach(function() {
    this.provider = new mifosX.services.ResourceFactoryProvider();
    ngResource = jasmine.createSpy("$resource").andReturn("test_resource");

    this.factory = this.provider.$get[1](ngResource);
  });

  describe("User resource", function() {
    it("should define the User resource", function() {
      expect(ngResource).toHaveBeenCalledWith(apiVersion + "/users/:userId", {}, {
        getAllUsers: {method: 'GET', params: {fields: "id,firstname,lastname,username,officeName"}, isArray: true}
      });
      expect(this.factory.userResource).toEqual("test_resource");
    });
  });

  describe("Role resource", function() {
    it("should define the Role resource", function() {
      expect(ngResource).toHaveBeenCalledWith(apiVersion + "/roles/:roleId", {}, {
        getAllRoles: {method: 'GET', params: {}, isArray: true}
      });
      expect(this.factory.roleResource).toEqual("test_resource");
    });
  });

  describe("Office resource", function() {
    it("should define the Office resource", function() {
      expect(ngResource).toHaveBeenCalledWith(apiVersion + "/offices/:officeId", {officeId:"@officeId"}, {
        getAllOffices: {method: 'GET', params: {}, isArray: true},
        update: {method: 'PUT'}
      });
      expect(this.factory.officeResource).toEqual("test_resource");
    });
  });
});
