(function (module) {
    mifosX.controllers = _.extend(module, {
        EditShareProductController: function (scope, resourceFactory, dateFilter, location, routeParams) {
            scope.formData = {};
            scope.charges = [];
            scope.formData.marketPricePeriods = [] ;
            scope.showOrHideValue = "show";
            resourceFactory.shareProduct.get({shareProductId: routeParams.id, template: 'true'}, function (data) {
                scope.product = data;
                scope.charges = data.charges;
                scope.formData.marketPricePeriods = data.marketPrice ;
                for(var j in scope.formData.marketPricePeriods) {
                    scope.formData.marketPricePeriods[j].fromDate = new Date(scope.formData.marketPricePeriods[j].fromDate);
                }

                scope.assetAccountOptions = scope.product.accountingMappingOptions.assetAccountOptions || [] ;
                scope.equityAccountOptions = scope.product.accountingMappingOptions.equityAccountOptions || [] ;
                scope.liabilityAccountOptions = scope.product.accountingMappingOptions.liabilityAccountOptions || [];
                scope.incomeAccountOptions = scope.product.accountingMappingOptions.incomeAccountOptions || [];

                scope.formData.name = data.name ;
                scope.formData.shortName = data.shortName ;
                scope.formData.description = data.description ;
                scope.formData.currencyCode = data.currency.code ;
                scope.formData.digitsAfterDecimal = data.currency.decimalPlaces ;
                scope.formData.inMultiplesOf = data.currency.inMultiplesOf ;
                scope.formData.totalShares = data.totalShares ;
                scope.formData.sharesIssued = data.totalSharesIssued ;
                scope.formData.unitPrice = data.unitPrice ;
                scope.formData.shareCapital = data.shareCapital ;
                scope.formData.minimumShares = data.minimumShares ;
                scope.formData.nominalShares = data.nominalShares ;
                scope.formData.maximumShares = data.maximumShares ;
                scope.formData.allowDividendCalculationForInactiveClients = data.allowDividendCalculationForInactiveClients ;
                scope.formData.lockinPeriodFrequency = data.lockinPeriod ;
                scope.formData.lockinPeriodFrequencyType = data.lockPeriodTypeEnum.id ;
                scope.formData.minimumActivePeriodForDividends = data.minimumActivePeriod ;
                scope.formData.minimumactiveperiodFrequencyType = data.minimumActivePeriodForDividendsTypeEnum.id ;
                scope.product.chargeOptions = scope.product.chargeOptions || [];
                scope.formData.digitsAfterDecimal = data.currencyOptions[0].decimalPlaces;

                scope.formData.accountingRule = data.accountingRule.id ;
                scope.formData.shareReferenceId = data.accountingMappings.shareReferenceId.id ;
                scope.formData.incomeFromFeeAccountId = data.accountingMappings.incomeFromFeeAccountId.id ;
                scope.formData.shareEquityId = data.accountingMappings.shareEquityId.id ;
                scope.formData.shareSuspenseId = data.accountingMappings.shareSuspenseId.id

            });

            scope.addMarketPricePeriod = function () {
                var marketPrice = {} ;
                marketPrice.locale=scope.optlang.code;
                marketPrice.dateFormat = scope.df;
                scope.formData.marketPricePeriods.push(marketPrice);
            };

            scope.deleteMarketPricePeriod = function (index) {
                scope.formData.marketPricePeriods.splice(index, 1);
            } ;

            scope.chargeSelected = function (chargeId) {
                if (chargeId) {
                    resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, this.formData, function (data) {
                        data.chargeId = data.id;
                        scope.charges.push(data);
                        //to charge select box empty
                        scope.chargeId = '';
                    });
                }
            }

            scope.deleteCharge = function (index) {
                scope.charges.splice(index, 1);
            }

            scope.cancel = function () {
                location.path('/shareproducts');
            };

            scope.submit = function () {
                scope.chargesSelected = [];
                for (var i in scope.charges) {
                    temp = {
                        id: scope.charges[i].id
                    }
                    scope.chargesSelected.push(temp);
                }
                for(var j in scope.formData.marketPricePeriods) {
                    scope.formData.marketPricePeriods[j].fromDate = dateFilter(scope.formData.marketPricePeriods[j].fromDate, scope.df);
                    scope.formData.marketPricePeriods[j].locale=scope.optlang.code;
                    scope.formData.marketPricePeriods[j].dateFormat = scope.df;
                }
                this.formData.chargesSelected = scope.chargesSelected;
                this.formData.locale = scope.optlang.code;

                resourceFactory.shareProduct.put({shareProductId: scope.product.id}, this.formData, function (data) {
                    location.path('/viewshareproduct/' + data.resourceId);
                });
            }
        }
    });
    mifosX.ng.application.controller('EditShareProductController', ['$scope', 'ResourceFactory', 'dateFilter', '$location', '$routeParams', mifosX.controllers.EditShareProductController]).run(function ($log) {
        $log.info("EditShareProductController initialized");
    });
}(mifosX.controllers || {}));
