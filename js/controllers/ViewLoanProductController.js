(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewLoanProductController: function(scope, routeParams , location , anchorScroll , resourceFactory ) {
        scope.loanproduct = [];
        scope.hasAccounting = undefined;
        resourceFactory.loanProductResource.get({loanProductId: routeParams.id , template: 'true'} , function(data) {
            scope.loanproduct = data;
           scope.hasAccounting = data.accountingRule.id == 2 ? true : false;
        });

        scope.scrollto = function (link){
                location.hash(link);
                anchorScroll();

        };
    }
  });
  mifosX.ng.application.controller('ViewLoanProductController', ['$scope', '$routeParams', '$location', '$anchorScroll' , 'ResourceFactory', mifosX.controllers.ViewLoanProductController]).run(function($log) {
    $log.info("ViewLoanProductController initialized");
  });
}(mifosX.controllers || {}));
