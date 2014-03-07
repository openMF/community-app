(function (module) {
  mifosX.controllers = _.extend(module, {
    CreateInterestRateChartController: function (scope, resourceFactory, location, routeParams, dateFilter) {
      scope.formData = {};//used for update/save form data
      scope.restrictDate = new Date();
      scope.fromDate = {}; //required for date formatting
      scope.endDate = {};//required for date formatting

      //deposit product details
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
      resourceFactory.interestRateChartResource.get({resourceType: "template"}, function (data) {
        scope.chart = data;
        scope.chart.chartSlabs = [];
        //format date values
        //if (scope.chart.fromDate) {
        //  var fromDate = dateFilter(scope.chart.fromDate, scope.df);
        scope.fromDate.date = new Date();
        //}
        //if (scope.chart.endDate) {
        //  var endDate = dateFilter(scope.chart.endDate, scope.df);
        //  scope.endDate.date = new Date(endDate);
        //}
      });

      /**
       * Add a new row with default values for entering chart details
       */
      scope.addNewRow = function () {
        var fromPeriod = '';
        var amountRangeFrom = '';
        var periodType = '';
        if (_.isNull(scope.chart.chartSlabs) || _.isUndefined(scope.chart.chartSlabs)) {
          scope.chart.chartSlabs = [];
        } else {
          var lastChartSlab = {};
          if(scope.chart.chartSlabs.length > 0){
            lastChartSlab = angular.copy(scope.chart.chartSlabs[scope.chart.chartSlabs.length - 1]);
          }
          if(!(_.isNull(lastChartSlab) || _.isUndefined(lastChartSlab))){
            fromPeriod = _.isNull(lastChartSlab) ? '' : parseInt(lastChartSlab.toPeriod) + 1;
            amountRangeFrom = _.isNull(lastChartSlab) ? '' : parseFloat(lastChartSlab.amountRangeTo) + 1;
            periodType = angular.copy(lastChartSlab.periodType);
          }
        }

        var chartSlab = {
          "periodType": periodType,
          "fromPeriod": fromPeriod,
          "amountRangeFrom": amountRangeFrom
        };

        scope.chart.chartSlabs.push(chartSlab);
      }

      /**
       * Remove chart details row
       */
      scope.removeRow = function (index) {
        scope.chart.chartSlabs.splice(index, 1);
      }

      //back to deposit product view
      scope.cancel = function () {
        location.path('/interestratecharts/' + routeParams.productId + '/' + routeParams.productName + '/' + routeParams.productType);
      };

      /**
       * Update Interest rate chart details
       */
      scope.submitInterestRateChartForm = function () {
        //scope.chartData = {};
        //scope.chartData = copyChartData(scope.chart);
        var chartData = copyChartData(scope.chart);

        scope.formData.charts = [];//declare charts array
        scope.formData.charts.push(chartData);//add chart details
        //update deposit product with new chart
        if ( routeParams.productType === 'fixeddepositproduct'){
          resourceFactory.fixedDepositProductResource.update({productId: routeParams.productId}, scope.formData, function (data) {
            location.path('/interestratecharts/' + routeParams.productId + '/' + routeParams.productName + '/' + scope.productType);
          });
        }else if ( routeParams.productType === 'recurringdepositproduct'){
          resourceFactory.recurringDepositProductResource.update({productId: routeParams.productId}, scope.formData, function (data) {
            location.path('/interestratecharts/' + routeParams.productId + '/' + routeParams.productName + '/' + scope.productType);
          });
        }

        //resourceFactory.interestRateChartResource.save(chartData, function (data) {
        //  location.path('/interestratecharts/' + routeParams.productId + '/' + routeParams.productName);
        //});
      }

      /**
       *  create new chart data object
       */

      copyChartData = function () {
        var newChartData = {
          name: scope.chart.name,
          description: scope.chart.description,
          fromDate: dateFilter(scope.fromDate.date, scope.df),
          endDate: dateFilter(scope.endDate.date, scope.df),
          savingsProductId: scope.productId,
          dateFormat: scope.df,
          locale: scope.optlang.code,
          chartSlabs: angular.copy(copyChartSlabs(scope.chart.chartSlabs))
        }

        //remove empty values
        _.each(newChartData, function (v, k) {
          if (!v)
            delete newChartData[k];
        });

        return newChartData;
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
        _.each(newChartSlabData, function (v, k) {
          if (!v)
            delete newChartSlabData[k];
        });

        return newChartSlabData;
      }
    }

  });
  mifosX.ng.application.controller('CreateInterestRateChartController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.CreateInterestRateChartController]).run(function ($log) {
    $log.info("CreateInterestRateChartController initialized");
  });
}(mifosX.controllers || {}));
