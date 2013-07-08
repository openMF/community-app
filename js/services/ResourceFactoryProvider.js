(function(module) {
  mifosX.services = _.extend(module, {
    ResourceFactoryProvider: function() {
      var baseUrl = "";
      this.setBaseUrl = function(url) {baseUrl = url;};

      this.$get = ['$resource', function(resource) {
        return {
          userResource: resource(baseUrl + "/users/:userId")
          allRolesResource = resource(baseUrl + "/roles");
        };
      }];
    }
  });
  mifosX.ng.services.config(function($provide) {
    $provide.provider('ResourceFactory', mifosX.services.ResourceFactoryProvider);
  }).run(function($log) { $log.info("ResourceFactory initialized"); });
}(mifosX.services || {}));
