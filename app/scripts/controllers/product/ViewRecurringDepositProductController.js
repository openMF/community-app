(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewRecurringDepositProductController: function(scope, routeParams , location , anchorScroll , resourceFactory ) {
        resourceFactory.recurringDepositProductResource.get({productId: routeParams.productId , template: 'true'} , function(data) {
            scope.depositproduct = data;
            scope.hasAccounting = data.accountingRule.id == 2 ? true : false;
        });

        scope.scrollto = function (link){
                location.hash(link);
                anchorScroll();

        };
    }
  });
  mifosX.ng.application.controller('ViewRecurringDepositProductController', ['$scope', '$routeParams', '$location', '$anchorScroll' , 'ResourceFactory', mifosX.controllers.ViewRecurringDepositProductController]).run(function($log) {
    $log.info("ViewRecurringDepositProductController initialized");
  });
}(mifosX.controllers || {}));
