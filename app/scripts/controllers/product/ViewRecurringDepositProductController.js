(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewRecurringDepositProductController: function(scope, routeParams , location , anchorScroll , resourceFactory,$uibModal ) {
        resourceFactory.recurringDepositProductResource.get({productId: routeParams.productId , template: 'true'} , function(data) {
            scope.depositproduct = data;
            scope.chartSlabs = scope.depositproduct.activeChart.chartSlabs;
            scope.hasAccounting = data.accountingRule.id == 2 ? true : false;
        });

        scope.scrollto = function (link){
                location.hash(link);
                anchorScroll();

        };

        scope.incentives = function(index){
            $uibModal.open({
                templateUrl: 'incentive.html',
                controller: IncentiveCtrl,
                resolve: {
                    chartSlab: function () {
                        return scope.depositproduct.activeChart.chartSlabs[index];
                    }
                }
            });
        };

        var IncentiveCtrl = function ($scope, $uibModalInstance, chartSlab) {
            $scope.chartSlab = chartSlab;
            _.each($scope.chartSlab.incentives, function (incentive) {
                if(!incentive.attributeValueDesc){
                    incentive.attributeValueDesc = incentive.attributeValue;
                }
            });
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        };
    }
  });
  mifosX.ng.application.controller('ViewRecurringDepositProductController', ['$scope', '$routeParams', '$location', '$anchorScroll' , 'ResourceFactory','$uibModal', mifosX.controllers.ViewRecurringDepositProductController]).run(function($log) {
    $log.info("ViewRecurringDepositProductController initialized");
  });
}(mifosX.controllers || {}));
