(function(module) {
  mifosX.controllers = _.extend(module, {
    AssignLoanOfficerController: function(scope, resourceFactory, routeParams, location) {

        scope.loanOfficers = [];
        scope.formData = {};
        scope.loanId =routeParams.id;
        var fields = "id,loanOfficerId,loanOfficerOptions";

        resourceFactory.loanResource.get({loanId:scope.loanId, template:true, fields:fields}, function(data) {
          scope.loanOfficers = data.loanOfficerOptions;
          scope.data = data;
        });

        scope.submit = function() {
          this.formData.locale = 'en';
          this.formData.dateFormat = 'dd MMMM yyyy';
          this.formData.fromLoanOfficerId = scope.data.loanOfficerId || "";
          resourceFactory.loanResource.save({command:'assignloanofficer', loanId:scope.loanId}, this.formData, function(data){
            location.path('/viewloanaccount/' + data.loanId);
          });
        };

    }
  });
  mifosX.ng.application.controller('AssignLoanOfficerController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.AssignLoanOfficerController]).run(function($log) {
    $log.info("AssignLoanOfficerController initialized");
  });
}(mifosX.controllers || {}));
