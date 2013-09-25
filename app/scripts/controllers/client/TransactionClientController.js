(function(module) {
  mifosX.controllers = _.extend(module, {
    TransactionClientController: function(scope, resourceFactory, routeParams, location) {

        scope.formData = {};
        resourceFactory.officeResource.getAllOffices(function(data){
          scope.offices = data;
          scope.formData.destinationOfficeId = scope.offices[0].id;  
        });

        scope.submit = function() {
          this.formData.locale = "en";
          this.formData.dateFormat = "dd MMMM yyyy";
          resourceFactory.clientResource.save({clientId : routeParams.id, command :  'proposeTransfer'}, this.formData, function(data){
            location.path('/viewclient/'+routeParams.id);
          });
        };

    }
  });
  mifosX.ng.application.controller('TransactionClientController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.TransactionClientController]).run(function($log) {
    $log.info("TransactionClientController initialized");
  });
}(mifosX.controllers || {}));
