describe("ResourceFactoryProvider", function() {
  var factory, ngResource;
  beforeEach(function() {
    this.provider = new mifosX.services.ResourceFactoryProvider();
    ngResource = jasmine.createSpy("$resource").andReturn("test_resource");

    factory = this.provider.$get[1](ngResource);
  });

  it("should define the User resource", function() {
    expect(ngResource).toHaveBeenCalledWith("/users/:userId");
    expect(factory.userResource).toEqual("test_resource");
  });
});