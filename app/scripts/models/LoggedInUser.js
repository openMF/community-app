(function (module) {
    mifosX.models = _.extend(module, {
        LoggedInUser: function (data) {
            this.name = data.username;
            this.userId = data.userId;
            this.userPermissions = data.userPermissions || data.permissions || [];

            this.getHomePageIdentifier = function () {
                var role = _.first(data.selectedRoles || data.roles);
                if (role.id in mifosX.models.roleMap) {
                    return mifosX.models.roleMap[role.id];
                } else {
                    return 'default';
                }
            };
        }
    });
}(mifosX.models || {}));
