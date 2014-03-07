(function (module) {
  mifosX.controllers = _.extend(module, {
    EditInterestRateChartController: function (scope, resourceFactory, location, routeParams, dateFilter) {
      scope.formData = {};//used for update/save form data
      scope.restrictDate = new Date();
      scope.fromDate = {}; //required for date formatting
      scope.endDate = {};//required for date formatting

      //Fixed deposit product details
      scope.productName = routeParams.productName;
      scope.productId = routeParams.productId;

      scope.productsLink = '';
      scope.viewProductLink = '';
      scope.productType = routeParams.productType;
      //alert(scope.productType);
      if ( routeParams.productType === 'fixeddepositproduct'){
        scope.productsLink = 'fixeddepositproducts';
        scope.viewProductLink = 'viewfixeddepositproduct';
      }else if ( routeParams.productType === 'recurringdepositproduct'){
        scope.productsLink = 'recurringdepositproducts';
        scope.viewProductLink = 'viewrecurringdepositproduct';
      }

      //get a interestrate chart
      resourceFactory.interestRateChartResource.get({chartId: routeParams.chartId, productId: routeParams.productId, template: true}, function (data) {
        scope.chart = data;
        scope.chart.chartSlabs = _.sortBy(scope.chart.chartSlabs, function(obj){ return obj.fromPeriod });
        //format date values
        if (scope.chart.fromDate) {
          var fromDate = dateFilter(scope.chart.fromDate, scope.df);
          scope.fromDate.date = new Date(fromDate);
        }
        if (scope.chart.endDate) {
          var endDate = dateFilter(scope.chart.endDate, scope.df);
          scope.endDate.date = new Date(endDate);
        }
      });

      /**
       * Add a new row with default values for entering chart details
       */
      scope.addNewRow = function () {
        var lastChartSlab = {};
        if(scope.chart.chartSlabs.length > 0){
          lastChartSlab = angular.copy(scope.chart.chartSlabs[scope.chart.chartSlabs.length - 1]);
        }
        var fromPeriod = parseInt(lastChartSlab.toPeriod) + 1;
        var amountRangeFrom = parseFloat(lastChartSlab.amountRangeTo) + 1;
        var chartSlab = {
          "periodType": angular.copy(lastChartSlab.periodType),
          "fromPeriod": fromPeriod,
          "amountRangeFrom":amountRangeFrom
        };
        scope.chart.chartSlabs.push(chartSlab);
      }

      /**
       * Remove chart details row
       */
      scope.removeRow = function(index){
        scope.chart.chartSlabs.splice(index,1);
      }

      //back to deposit product view
      scope.cancel = function () {
        location.path('/interestratecharts/' + routeParams.productId + '/' + routeParams.productName + '/' + routeParams.productType);
      };

      /**
       * Update Interest rate chart details
       */
      scope.submitInterestRateChartForm = function () {
        var chartData = copyChartData(scope.chart);
        scope.formData.charts = [];//declare charts array
        scope.formData.charts.push(chartData);//add chart details

        if ( routeParams.productType === 'fixeddepositproduct'){
          resourceFactory.fixedDepositProductResource.update({productId: routeParams.productId}, scope.formData, function (data) {
            location.path('/interestratecharts/' + routeParams.productId + '/' + routeParams.productName + '/' + scope.productType);
          });
        }else if ( routeParams.productType === 'recurringdepositproduct'){
          resourceFactory.recurringDepositProductResource.update({productId: routeParams.productId}, scope.formData, function (data) {
            location.path('/interestratecharts/' + routeParams.productId + '/' + routeParams.productName + '/' + scope.productType);
          });
        }

        //resourceFactory.interestRateChartResource.update({chartId: routeParams.chartId}, chartData, function (data) {
        //  location.path('/interestratecharts/' + routeParams.productId + '/' + routeParams.productName);
        //});

      }

      /**
       *  create new chart data object
       */

      copyChartData = function() {
        var chartData = {
          name: scope.chart.name,
          id: scope.chart.id,
          description: scope.chart.description,
          fromDate: dateFilter(scope.fromDate.date, scope.df),
          endDate: dateFilter(scope.endDate.date, scope.df),
          //savingsProductId: scope.chart.savingsProductId,
          dateFormat: scope.df,
          locale: scope.optlang.code,
          chartSlabs: angular.copy(copyChartSlabs(scope.chart.chartSlabs))
        }

        return chartData;
      }

      /**
       *  copy all chart details to a new Array
       * @param chartSlabs
       * @returns {Array}
       */
      copyChartSlabs = function (chartSlabs) {
        var detailsArray = [];
        _.each(chartSlabs, function (chartSlab) {
          var chartSlabData = copyChartSlab(chartSlab);
          detailsArray.push(chartSlabData);
        });
        return detailsArray;
      }

      /**
       * create new chart detail object data from chartSlab
       * @param chartSlab
       *
       */

      copyChartSlab = function (chartSlab) {
        var newChartSlabData = {
          id: chartSlab.id,
          description: chartSlab.description,
          periodType: chartSlab.periodType.id,
          fromPeriod: chartSlab.fromPeriod,
          toPeriod: chartSlab.toPeriod,
          amountRangeFrom: chartSlab.amountRangeFrom,
          amountRangeTo: chartSlab.amountRangeTo,
          annualInterestRate: chartSlab.annualInterestRate,
          locale: scope.optlang.code
        }

        //remove empty values
        _.each(newChartSlabData, function(v, k){
          if(!v)
            delete newChartSlabData[k];
        });

        return newChartSlabData;
      }
    }

  });
  mifosX.ng.application.controller('EditInterestRateChartController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditInterestRateChartController]).run(function ($log) {
    $log.info("EditInterestRateChartController initialized");
  });
}(mifosX.controllers || {}));
