(function(module) {
  mifosX.controllers = _.extend(module, {
    LoanDocumentController: function(scope, location, http, routeParams) {
      scope.loanId = routeParams.loanId;
      scope.onFileSelect = function($files) {
        scope.file = $files[0];
      };

      scope.submit = function () {
        http.uploadFile({
          url: 'https://demo.openmf.org/mifosng-provider/api/v1/loans/'+scope.loanId+'/documents', 
          data: scope.formData,
          file: scope.file
        }).then(function(data) {
          // to fix IE not refreshing the model
          if (!scope.$$phase) {
            scope.$apply();
          }
          location.path('/viewloanaccount/'+scope.loanId);
        });
      };
    }
  });
  mifosX.ng.application.controller('LoanDocumentController', ['$scope', '$location', '$http', '$routeParams', mifosX.controllers.LoanDocumentController]).run(function($log) {
    $log.info("LoanDocumentController initialized"); 
  });
}(mifosX.controllers || {}));