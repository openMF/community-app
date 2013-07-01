define([], function() {
  var users = {
    mifos: {userId: 1, roles: [{id: 1, name: "Super User"}]},
  };

  var all_roles = [ 
    {id: 1, name: "Super User", description: "This guy is the suuuper user"},
    {id: 2, name: "Branch Manager", description: "This guy is the branch manager"},
    {id: 3, name: "Simple User", description: "This guy is just a random joe"},
  ];

  return {
    stubServer: function(httpBackend) {
      var URL_REGEX = /\/api\/v1\/roles\/(\w+)/;
      httpBackend.whenGET(URL_REGEX).respond(function(method, url, data, headers) {
        return [200, all_roles, {}];
      });
    }
  };
});
