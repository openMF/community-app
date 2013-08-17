(function(module) {
  mifosX.services = _.extend(module, {
    ResourceFactoryProvider: function() {
      var baseUrl = "" , apiVer = "/mifosng-provider/api/v1";
      this.setBaseUrl = function(url) {baseUrl = url;};
      this.$get = ['$resource', function(resource) {
        var defineResource = function(url, paramDefaults, actions) {
          return resource(baseUrl + url, paramDefaults, actions);
        };
        return {
          userResource: defineResource(apiVer + "/users/:userId", {}, {
            getAllUsers: {method: 'GET', params: {fields: "id,firstname,lastname,username,officeName"}, isArray: true}
          }),
          roleResource: defineResource(apiVer + "/roles/:roleId", {}, {
            getAllRoles: {method: 'GET', params: {}, isArray: true}
          }),
          officeResource: defineResource(apiVer + "/offices/:officeId", {}, {
            getAllOffices: {method: 'GET', params: {}, isArray: true}
          }),
          clientResource: defineResource(apiVer + "/clients/:clientId", {clientId:'@clientId'}, {
            getAllClients: {method: 'GET', params: {}}
          }),
          clientAccountResource: defineResource(apiVer + "/clients/:clientId/accounts", {clientId:'@clientId'}, {
            getAllClients: {method: 'GET', params: {}}
          }),
          clientNotesResource: defineResource(apiVer + "/clients/:clientId/notes", {clientId:'@clientId'}, {
            getAllNotes: {method: 'GET', params: {}, isArray:true}
          }),
          clientTemplateResource: defineResource(apiVer + "/clients/template", {}, {
            get: {method: 'GET', params: {}}
          }),
          loanProductResource: defineResource(apiVer + "/loanproducts/:loanProductId", {loanProductId:'@loanProductId'}, {
            getAllLoanProducts: {method: 'GET', params: {}, isArray:true}
          }),
          chargeResource: defineResource(apiVer + "/charges/:chargeId", {chargeId:'@chargeId'}, {
            getAllCharges: {method: 'GET', params: {}, isArray:true}
          }),
          savingProductResource: defineResource(apiVer + "/savingsproducts/:savingproductId", {}, {
            getAllSavingProducts: {method: 'GET', params: {}, isArray:true}
          }),
          loanResource: defineResource(apiVer + "/loans/:loanId", {}, {
            getAllLoans: {method: 'GET', params: {}}
          }),
          currencyConfigResource: defineResource(apiVer + "/currencies", {}, {
            update: { method: 'PUT'}
          }),
          globalSearch: defineResource(apiVer + "/search", {query:'@query'}, {
            search: { method: 'GET',
                      params: { query: '@query'} ,
                      isArray:true
                    }
          })
        };
      }];
    }
  });
  mifosX.ng.services.config(function($provide) {
    $provide.provider('ResourceFactory', mifosX.services.ResourceFactoryProvider);
  }).run(function($log) { $log.info("ResourceFactory initialized"); });
}(mifosX.services || {}));
