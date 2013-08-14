(function(module) {
  mifosX.services = _.extend(module, {
    ResourceFactoryProvider: function() {
      var baseUrl = "";
      this.setBaseUrl = function(url) {baseUrl = url;};
      this.$get = ['$resource', function(resource) {
        var defineResource = function(url, paramDefaults, actions) {
          return resource(baseUrl + url, paramDefaults, actions);
        };
        return {
          userResource: defineResource("/users/:userId", {}, {
            getAllUsers: {method: 'GET', params: {fields: "id,firstname,lastname,username,officeName"}, isArray: true}
          }),
          roleResource: defineResource("/roles/:roleId", {}, {
            getAllRoles: {method: 'GET', params: {}, isArray: true}
          }),
          officeResource: defineResource("/offices/:officeId", {}, {
            getAllOffices: {method: 'GET', params: {}, isArray: true}
          }),
          clientResource: defineResource("/clients/:clientId", {}, {
            getAllClients: {method: 'GET', params: {}}
          }),
          loanProductResource: defineResource("/loanproducts/:loanproductId", {}, {
            getAllLoanProducts: {method: 'GET', params: {}, isArray:true}
          }),
          chargeResource: defineResource("/charges/:chargeId", {chargeId:'@chargeId'}, {
            getAllCharges: {method: 'GET', params: {}, isArray:true}
          }),
          savingProductResource: defineResource("/savingsproducts/:savingproductId", {}, {
            getAllSavingProducts: {method: 'GET', params: {}, isArray:true}
          })
        };
      }];
    }
  });
  mifosX.ng.services.config(function($provide) {
    $provide.provider('ResourceFactory', mifosX.services.ResourceFactoryProvider);
  }).run(function($log) { $log.info("ResourceFactory initialized"); });
}(mifosX.services || {}));
