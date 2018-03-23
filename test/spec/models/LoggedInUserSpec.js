describe("LoggedInUser", function () {
    it("should return the username", function () {
        var user = new mifosX.models.LoggedInUser({username: 'test_user'});

        expect(user.name).toEqual('test_user');
    });

    it("should return the mapped role page name", function () {
        var data = {
            username: 'test_user',
            roles: [
                {id: 1, name: "Test super user role"},
                {id: 2, name: "Test branch manager role"}
            ]
        };

        var user = new mifosX.models.LoggedInUser(data);

        expect(user.name).toEqual('test_user');
        expect(user.getHomePageIdentifier()).toEqual('superuser');
    });
});