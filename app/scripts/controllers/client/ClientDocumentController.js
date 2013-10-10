(function(module) {
  mifosX.controllers = _.extend(module, {
    ClientDocumentController: function(scope, location, http, routeParams) {
      scope.clientId = routeParams.clientId;
      scope.onFileSelect = function($files) {
        scope.file = $files[0];
      };

      scope.submit = function () {
        http.uploadFile({
          url: 'https://demo.openmf.org/mifosng-provider/api/v1/clients/'+scope.clientId+'/documents', 
          data: scope.formData,
          file: scope.file
        }).then(function(data) {
          // to fix IE not refreshing the model
          if (!scope.$$phase) {
            scope.$apply();
          }
          location.path('/viewclient/'+scope.clientId);
        });
      };
    }
  });
  mifosX.ng.application.controller('ClientDocumentController', ['$scope', '$location', '$http', '$routeParams', mifosX.controllers.ClientDocumentController]).run(function($log) {
    $log.info("ClientDocumentController initialized"); 
  });
}(mifosX.controllers || {}));