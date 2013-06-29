(function(module) {
  mifosX.services = _.extend(module, {
    ResourceFactory: function(resource) {
      this.userResource = resource("/api/v1/users/:userId");
    }
  });
  mifosX.ng.services.service('ResourceFactory', ['$resource', mifosX.services.ResourceFactory]).run(function($log) {
    $log.info("ResourceFactory initialized");
  });
}(mifosX.services || {}));
