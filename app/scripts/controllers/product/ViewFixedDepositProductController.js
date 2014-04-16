(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewFixedDepositProductController: function(scope, routeParams , location , anchorScroll , resourceFactory ) {
        resourceFactory.fixedDepositProductResource.get({productId: routeParams.productId , template: 'true'} , function(data) {
            scope.depositproduct = data;
            scope.hasAccounting = data.accountingRule.id == 2 ? true : false;
        });

        scope.scrollto = function (link){
                location.hash(link);
                anchorScroll();

        };
    }
  });
  mifosX.ng.application.controller('ViewFixedDepositProductController', ['$scope', '$routeParams', '$location', '$anchorScroll' , 'ResourceFactory', mifosX.controllers.ViewFixedDepositProductController]).run(function($log) {
    $log.info("ViewFixedDepositProductController initialized");
  });
}(mifosX.controllers || {}));
