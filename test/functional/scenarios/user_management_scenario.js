define(["test/scenarios/user_authentication_scenario"], function(authenticationScenario) {
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
      fakeServer.get(/\/users?.*/, { content: createUsers(25), delay: 3 });
    }
  };
});
