(function (module) {
    mifosX.controllers = _.extend(module, {
        EditInterestRateChartController: function (scope, resourceFactory, location, routeParams, dateFilter,$uibModal) {
            scope.formData = {};//used for update/save form data
            scope.restrictDate = new Date();
            scope.fromDate = {}; //required for date formatting
            scope.endDate = {};//required for date formatting
            scope.deletedincentives = [];
            scope.isPrimaryGroupingByAmount = false;

            //Fixed deposit product details
            scope.productName = routeParams.productName;
            scope.productId = routeParams.productId;

            scope.productsLink = '';
            scope.viewProductLink = '';
            scope.productType = routeParams.productType;
            //alert(scope.productType);
            if (routeParams.productType === 'fixeddepositproduct') {
                scope.productsLink = 'fixeddepositproducts';
                scope.viewProductLink = 'viewfixeddepositproduct';
            } else if (routeParams.productType === 'recurringdepositproduct') {
                scope.productsLink = 'recurringdepositproducts';
                scope.viewProductLink = 'viewrecurringdepositproduct';
            }

            //get a interestrate chart
            resourceFactory.interestRateChartResource.get({chartId: routeParams.chartId, productId: routeParams.productId, template: true, associations: 'chartSlabs'}, function (data) {
                scope.chart = data;
                _.each(scope.chart.chartSlabs, function (chartSlab) {
                    _.each(chartSlab.incentives, function (incentive){
                        incentive.attributeValue = parseInt(incentive.attributeValue);
                    })
                })

                //format date values
                if (scope.chart.fromDate) {
                    var fromDate = dateFilter(scope.chart.fromDate, scope.df);
                    scope.fromDate.date = new Date(fromDate);
                }
                if (scope.chart.endDate) {
                    var endDate = dateFilter(scope.chart.endDate, scope.df);
                    scope.endDate.date = new Date(endDate);
                }
                scope.isPrimaryGroupingByAmount = scope.chart.isPrimaryGroupingByAmount;
            });

            /**
             * Add a new row with default values for entering chart details
             */
            scope.addNewRow = function () {
                var fromPeriod = '';
                var amountRangeFrom = '';
                var periodType = '';
                var toPeriod = '';
                var amountRangeTo = '';
                if (_.isNull(scope.chart.chartSlabs) || _.isUndefined(scope.chart.chartSlabs)) {
                    scope.chart.chartSlabs = [];
                } else {
                    var lastChartSlab = {};
                    if (scope.chart.chartSlabs.length > 0) {
                        lastChartSlab = angular.copy(scope.chart.chartSlabs[scope.chart.chartSlabs.length - 1]);
                    }else{
                        lastChartSlab = null;
                    }
                    if (!(_.isNull(lastChartSlab) || _.isUndefined(lastChartSlab))) {
                        if(scope.isPrimaryGroupingByAmount){
                            if((_.isNull(lastChartSlab.toPeriod) || _.isUndefined(lastChartSlab.toPeriod) || lastChartSlab.toPeriod.length == 0)){
                                amountRangeFrom = _.isNull(lastChartSlab) ? '' : parseFloat(lastChartSlab.amountRangeTo) + 1;
                                fromPeriod = (_.isNull(lastChartSlab.fromPeriod) || _.isUndefined(lastChartSlab.fromPeriod) || lastChartSlab.fromPeriod.length == 0)? '' : 1;
                            }else{
                                amountRangeFrom = lastChartSlab.amountRangeFrom;
                                amountRangeTo = lastChartSlab.amountRangeTo;
                                fromPeriod = _.isNull(lastChartSlab) ? '' : parseInt(lastChartSlab.toPeriod) + 1;
                            }
                        }else{
                            if((_.isNull(lastChartSlab.amountRangeTo) || _.isUndefined(lastChartSlab.amountRangeTo) || lastChartSlab.amountRangeTo.length == 0)){
                                amountRangeFrom = (_.isNull(lastChartSlab.amountRangeFrom) || _.isUndefined(lastChartSlab.amountRangeFrom) || lastChartSlab.amountRangeFrom.length == 0) ? '' : 1;
                                fromPeriod = _.isNull(lastChartSlab) ? '' : parseFloat(lastChartSlab.toPeriod) + 1;
                            }else{
                                fromPeriod = lastChartSlab.fromPeriod;
                                toPeriod = lastChartSlab.toPeriod;
                                amountRangeFrom = _.isNull(lastChartSlab) ? '' : parseInt(lastChartSlab.amountRangeTo) + 1;
                            }
                        }
                        periodType = angular.copy(lastChartSlab.periodType);
                    }
                }


                var chartSlab = {
                    "periodType": periodType,
                    "fromPeriod": fromPeriod,
                    "amountRangeFrom": amountRangeFrom,
                    "incentives":[]
                };
                if(!_.isUndefined(toPeriod) && toPeriod.length > 0){
                    chartSlab.toPeriod = toPeriod;
                }
                if(!_.isUndefined(amountRangeTo) && amountRangeTo.length > 0){
                    chartSlab.amountRangeTo = amountRangeTo;
                }
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
                var chartData = copyChartData(scope.chart);
                scope.formData.charts = [];//declare charts array
                scope.formData.charts.push(chartData);//add chart details

                if (routeParams.productType === 'fixeddepositproduct') {
                    resourceFactory.fixedDepositProductResource.update({productId: routeParams.productId}, scope.formData, function (data) {
                        location.path('/interestratecharts/' + routeParams.productId + '/' + routeParams.productName + '/' + scope.productType);
                    });
                } else if (routeParams.productType === 'recurringdepositproduct') {
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

            copyChartData = function () {
                var chartData = {
                    name: scope.chart.name,
                    id: scope.chart.id,
                    description: scope.chart.description,
                    fromDate: dateFilter(scope.fromDate.date, scope.df),
                    endDate: dateFilter(scope.endDate.date, scope.df),
                    isPrimaryGroupingByAmount:scope.isPrimaryGroupingByAmount,
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
                    fromPeriod: chartSlab.fromPeriod,
                    toPeriod: chartSlab.toPeriod,
                    amountRangeFrom: chartSlab.amountRangeFrom,
                    amountRangeTo: chartSlab.amountRangeTo,
                    annualInterestRate: chartSlab.annualInterestRate,
                    locale: scope.optlang.code,
                    incentives:angular.copy(copyIncentives(chartSlab.incentives,chartSlab.id))
                }
                if(chartSlab.periodType != undefined) {
                    newChartSlabData.periodType = chartSlab.periodType.id;
                }

                //remove empty values
                _.each(newChartSlabData, function (v, k) {
                    if (!v && v != 0)
                        delete newChartSlabData[k];
                });

                return newChartSlabData;
            }

            scope.incentives = function(index){
                $uibModal.open({
                    templateUrl: 'incentive.html',
                    controller: IncentiveCtrl,
                    resolve: {
                        data: function () {
                            return scope.chart;
                        },
                        chartSlab: function () {
                            return scope.chart.chartSlabs[index];
                        }
                    }
                });
            }

            /**
             *  copy all chart details to a new Array
             * @param incentiveDatas
             * @returns {Array}
             */
            copyIncentives = function (incentives,slabId) {
                var detailsArray = [];
                _.each(incentives, function (incentive) {
                    var incentiveData = copyIncentive(incentive);
                    detailsArray.push(incentiveData);
                });
                _.each(scope.deletedincentives,function(del){
                    if(del.id == slabId){
                        detailsArray.push(del.data);
                    }
                });

                return detailsArray;
            }

            /**
             * create new chart detail object data from chartSlab
             * @param incentiveData
             *
             */

            copyIncentive = function (incentiveData) {
                var newIncentiveDataData = {
                    id: incentiveData.id,
                    "entityType":incentiveData.entityType,
                    "attributeName":incentiveData.attributeName.id,
                    "conditionType":incentiveData.conditionType.id,
                    "attributeValue":incentiveData.attributeValue,
                    "incentiveType":incentiveData.incentiveType.id,
                    "amount":incentiveData.amount,
                    locale: scope.optlang.code

                }
                if(incentiveData.id){
                    newIncentiveDataData.entityType = incentiveData.entityType.id;
                }
                return newIncentiveDataData;
            }

            var IncentiveCtrl = function ($scope, $uibModalInstance, data,chartSlab) {
                $scope.data = data;
                $scope.chartSlab = chartSlab;
                if(!$scope.chartSlab.incentives) {
                    $scope.chartSlab.incentives = [];
                }
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.addNewRow = function () {
                    var incentive = {
                        "entityType":"2",
                        "attributeName":"",
                        "conditionType":"",
                        "attributeValue":"",
                        "incentiveType":"",
                        "amount":""
                    };

                    $scope.chartSlab.incentives.push(incentive);
                }

                /**
                 * Remove chart details row
                 */
                $scope.removeRow = function (index) {
                    var incentive = {
                        id:$scope.chartSlab.incentives[index].id,
                        delete:'true'
                    }
                    var deldata = {
                        id:chartSlab.id,
                        data:incentive
                    }
                    scope.deletedincentives.push(deldata);
                    $scope.chartSlab.incentives.splice(index, 1);
                }
            };

        }

    });
    mifosX.ng.application.controller('EditInterestRateChartController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter','$uibModal', mifosX.controllers.EditInterestRateChartController]).run(function ($log) {
        $log.info("EditInterestRateChartController initialized");
    });
}(mifosX.controllers || {}));
