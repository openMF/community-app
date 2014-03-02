define(["test/scenarios/user_authentication_scenario"], function (authenticationScenario) {
    var roles = [
        {id: 1, name: "Super User", description: "This guy is the suuuper user"},
        {id: 2, name: "Branch Manager", description: "This guy is the branch manager"},
        {id: 3, name: "Simple User", description: "This guy is just a random joe"},
    ];

    return {
        stubServer: function (fakeServer) {
            authenticationScenario.stubServer(fakeServer);
            fakeServer.get(/\/roles/, function () {
                return {content: roles}
            });
        }
    };
});
