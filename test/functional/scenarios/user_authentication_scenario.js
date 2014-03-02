define([], function () {
    var users = {
        mifos: {userId: 1, roles: [
            {id: 1, name: "Super User"}
        ]},
        joe: {userId: 2, roles: [
            {id: 2, name: "Branch Manager"}
        ]},
        jack: {userId: 3, roles: [
            {id: 3, name: "Funder"}
        ]}
    };

    var authenticationSuccess = function (username, userDetails) {
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

    var authenticationFailure = function () {
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
        stubServer: function (fakeServer) {
            fakeServer.post(/\/authentication\?username=(\w+)&password=(.+)/, function (match) {
                var username = match[1];
                var password = match[2];
                if (users[username] && password === 'password') {
                    return {content: authenticationSuccess(username, users[username]), delay: 2};
                }
                return {returnCode: 401, content: authenticationFailure(), delay: 3};
            });

            fakeServer.get(/\/users\/(\w+)/, function (match) {
                return {
                    content: {
                        id: match[1],
                        username: "mifos",
                        officeId: 1,
                        officeName: "Head Office",
                        firstname: "App",
                        lastname: "Administrator",
                        email: "demomfi@mifos.org",
                        availableRoles: [],
                        roles: [
                            {
                                id: 1,
                                name: "Super user",
                                description: "This role provides all application permissions."
                            }
                        ]
                    }
                };
            });
        }
    };
});
