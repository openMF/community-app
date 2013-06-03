describe("User", function() {
  it("should return the mapped role page name", function() {
    var data = {
      roles: [
        {id: 1, name: "Test super user role"},
        {id: 2, name: "Test branch manager role"}
      ]
    };

    var user = new mifosX.models.User(data);

    expect(user.getHomePageIdentifier()).toEqual('superuser');
  });
});