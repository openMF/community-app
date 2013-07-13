define(["test/scenarios/user_authentication_scenario"], function(authenticationScenario) {
  var all_roles = [ 
    {id: 1, name: "Super User", description: "This guy is the suuuper user"},
    {id: 2, name: "Branch Manager", description: "This guy is the branch manager"},
    {id: 3, name: "Simple User", description: "This guy is just a random joe"},
  ];

  var createUsers = function(number) {
    var users = [];
    for (var i = 1 ; i <= number; i++) {
      users.push({ 
        id: i,
        username: "username_" + i,
        officeId: 1000 + i,
        officeName: "officename_" + i,
        firstname: "firstname_" + i,
        lastname: "lastname_" + i,
        email: "testuser_" + i + "@mifos.org" 
      });
    };
    return users;
  };

  return {
    stubServer: function(fakeServer) {
      authenticationScenario.stubServer(fakeServer);
      fakeServer.get(/\/roles\/(\w+)/, { content: all_roles });

      fakeServer.get(/\/users?.*/, { content: createUsers(25) });
    }
  };
});
