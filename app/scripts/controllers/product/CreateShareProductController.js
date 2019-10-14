(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateShareProductController: function (scope, resourceFactory, dateFilter, location,WizardHandler) {
            scope.formData = {};
            scope.shareproduct = {};
            scope.charges = [];
            scope.formData.marketPricePeriods = [] ;
            scope.showOrHideValue = "show";
            scope.isClicked = false;

            resourceFactory.productsResource.template({productType:'share', resourceType:'template'}, function(data) {
                scope.product = data;
                scope.product.chargeOptions = scope.product.chargeOptions || [];
                scope.assetAccountOptions = scope.product.accountingMappingOptions.assetAccountOptions || [] ;
                scope.equityAccountOptions = scope.product.accountingMappingOptions.equityAccountOptions || [] ;
                scope.liabilityAccountOptions = scope.product.accountingMappingOptions.liabilityAccountOptions || [];
                scope.incomeAccountOptions = scope.product.accountingMappingOptions.incomeAccountOptions || [];
                scope.formData.currencyCode = data.currencyOptions[0].code;
                scope.formData.digitsAfterDecimal = data.currencyOptions[0].decimalPlaces;
                scope.formData.allowDividendCalculationForInactiveClients = false;
                scope.formData.accountingRule = '1';
                scope.shareproduct = angular.copy(scope.formData);
            });
            
            scope.shareCapitaValue = function () {
                 scope.formData.shareCapital =   scope.formData.unitPrice * scope.formData.sharesIssued;
            };

            scope.$watch('formData',function(newVal){
                scope.shareproduct = angular.extend(scope.shareproduct,newVal);
            },true);

            scope.goNext = function(form){
                WizardHandler.wizard().checkValid(form);
                scope.isClicked = true;
            }
            
            scope.formValue = function(array,model,findattr,retAttr){
                findattr = findattr ? findattr : 'id';
                retAttr = retAttr ? retAttr : 'value';
                console.log(findattr,retAttr,model);
                return _.find(array, function (obj) {
                    return obj[findattr] === model;
                })[retAttr];
            };

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
                }
                this.formData.chargesSelected = scope.chargesSelected;
                this.formData.locale = scope.optlang.code;

                resourceFactory.shareProduct.post(this.formData, function (data) {
                    location.path('/viewshareproduct/' + data.resourceId);
                });
            }
        }
    });
    mifosX.ng.application.controller('CreateShareProductController', ['$scope', 'ResourceFactory', 'dateFilter', '$location','WizardHandler', mifosX.controllers.CreateShareProductController]).run(function ($log) {
        $log.info("CreateShareProductController initialized");
    });
}(mifosX.controllers || {}));
