 (function(module) {
  mifosX.controllers = _.extend(module, {
    InterestRateChartController: function(scope, routeParams, resourceFactory, location) {
        scope.edit = function(id){
            location.path('/editinterestratechart/' + id);
        };
        scope.productName = routeParams.productName;
        scope.productId = routeParams.productId;
        scope.productsLink = '';
        scope.viewProductLink = '';
        scope.productType = routeParams.productType;
        if ( routeParams.productType === 'fixeddepositproduct'){
          scope.productsLink = 'fixeddepositproducts';
          scope.viewProductLink = 'viewfixeddepositproduct';
        }else if ( routeParams.productType === 'recurringdepositproduct'){
          scope.productsLink = 'recurringdepositproducts';
          scope.viewProductLink = 'viewrecurringdepositproduct';
        }

        resourceFactory.interestRateChartResource.getAllInterestRateCharts({productId: routeParams.productId}, function(data) {
            scope.charts = data;
        });

    }
  });
  mifosX.ng.application.controller('InterestRateChartController', ['$scope', '$routeParams', 'ResourceFactory','$location', mifosX.controllers.InterestRateChartController]).run(function($log) {
    $log.info("InterestRateChartController initialized");
  });
}(mifosX.controllers || {}));
