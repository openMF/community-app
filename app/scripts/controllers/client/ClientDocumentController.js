(function(module) {
  mifosX.controllers = _.extend(module, {
    ClientDocumentController: function(scope, location, http, routeParams, HOST) {
      scope.clientId = routeParams.clientId;
      scope.onFileSelect = function($files) {
        console.log(location, location.url(), HOST);
        scope.file = $files[0];
      };

      scope.submit = function () {
        http.uploadFile({
          url: HOST + '/mifosng-provider/api/v1/clients/'+scope.clientId+'/documents', 
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
  mifosX.ng.application.controller('ClientDocumentController', ['$scope', '$location', '$http', '$routeParams', 'HOST', mifosX.controllers.ClientDocumentController]).run(function($log) {
    $log.info("ClientDocumentController initialized"); 
  });
}(mifosX.controllers || {}));