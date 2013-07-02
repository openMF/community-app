(function(module) {
  mifosX.models = _.extend(module, {
    User: function(data) {
      this.getHomePageIdentifier = function() {
        var role = _.first(data.selectedRoles || data.roles);
        return mifosX.models.roleMap[role.id];
      };
    }
  });
}(mifosX.models || {}));
