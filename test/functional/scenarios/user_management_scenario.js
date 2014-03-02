define(["test/scenarios/user_authentication_scenario"], function (authenticationScenario) {
    var createUsers = function (number) {
        var users = [];
        for (var i = 1; i <= number; i++) {
            users.push({
                id: i,
                username: "username_" + i,
                officeId: 1000 + i,
                officeName: "officename_" + i,
                firstname: "firstname_" + i,
                lastname: "lastname_" + i,
                email: "testuser_" + i + "@mifos.org"
            });
        }
        ;
        return users;
    };
    var roles = [
        {id: 1, name: "Super User"},
        {id: 2, name: "Branch Manager"},
        {id: 3, name: "Simple User"}
    ];
    var offices = [
        {id: 1, name: "Office 1"},
        {id: 2, name: "Office 2"},
        {id: 3, name: "Office 3"}
    ];

    return {
        stubServer: function (fakeServer) {
            authenticationScenario.stubServer(fakeServer);
            fakeServer.get(/\/users?.*/, { content: createUsers(25), delay: 3 });
            fakeServer.get(/\/roles/, { content: roles, delay: 1 });
            fakeServer.get(/\/offices/, { content: offices, delay: 1 });
            fakeServer.post(/\/users/, {returnCode: 201, delay: 2});
        }
    };
});
