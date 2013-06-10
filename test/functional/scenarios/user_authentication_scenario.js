define([], function() {
  var users = {
    mifos: {userId: 1, roles: [{id: 1, name: "Super User"}]},
    joe: {userId: 2, roles: [{id: 2, name: "Branch Manager"}]},
    jack: {userId: 3, roles: [{id: 3, name: "Funder"}]}
  };

  var authenticationSuccess = function(username, userDetails) {
    return {
      username: username,
      userId: userDetails.userId,
      base64EncodedAuthenticationKey: "bWlmb3M6cGFzc3dvcmQ=",
      authenticated: true,
      staffId: 1, 
      staffDisplayName: "Director, Program", 
      organisationalRole: { 
         id: 100, 
         code: "staffOrganisationalRoleType.programDirector", 
         value: "Program Director" 
      },
      roles: userDetails.roles,
      permissions: [
        "ALL_FUNCTIONS"
      ]
    };
  };

  var authenticationFailure = function() {
    return { 
      developerMessage: "Invalid authentication details were passed in api request.",
      developerDocLink: "https://github.com/openMF/mifosx/wiki/HTTP-API-Error-codes",
      httpStatusCode: "401",
      defaultUserMessage: "Unauthenticated. Please login.",
      userMessageGlobalisationCode: "error.msg.not.authenticated",
      errors: [] 
    };
  };
  
  return {
    stubServer: function(httpBackend) {
      var URL_REGEX = /\/authentication\?username=(\w+)&password=(.+)/;
      httpBackend.whenPOST(URL_REGEX).respond(function(method, url, data) {
        var match = url.match(URL_REGEX);
        var username = match[1];
        var password = match[2];
        if (users[username] && password === 'password') {
          return [200, authenticationSuccess(username, users[username]), {}];
        }
        return [401, authenticationFailure(), {}];
      });
    }
  };
});
