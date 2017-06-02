(function (module) {
    mifosX.controllers = _.extend(module, {
        EditShareAccountController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.products = [];
            scope.fieldOfficers = [];
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.clientId = routeParams.clientId;
            scope.date = {};
            scope.date.submittedOnDate = new Date();
            scope.charges = [];
            scope.inparams = {};
            resourceFactory.sharesAccount.get({shareAccountId: routeParams.accountId, template: 'true'}, function (data) {
                scope.data = data;
                scope.formData.submittedDate = new Date(data.timeline.submittedOnDate) ;
                scope.products = data.productOptions;
                scope.chargeOptions = data.chargeOptions;
                scope.charges = data.charges ;
                scope.formData.productId = data.productId ;
                scope.formData.savingsAccountId = data.savingsAccountId ;
                scope.formData.applicationDate = new Date(data.purchasedShares[0].purchasedDate) ;
                scope.formData.requestedShares = data.purchasedShares[0].numberOfShares ;
                scope.formData.unitPrice = data.purchasedShares[0].purchasedPrice ;
                scope.formData.externalId = data.externalId ;
                scope.formData.minimumActivePeriod = data.minimumActivePeriod ;
                scope.formData.minimumActivePeriodFrequencyType = data.minimumActivePeriodTypeEnum.id ;
                scope.formData.lockinPeriodFrequency = data.lockinPeriod ;
                scope.formData.lockinPeriodFrequencyType = data.lockPeriodTypeEnum.id ;
                scope.formData.allowDividendCalculationForInactiveClients = data.allowDividendCalculationForInactiveClients ;
                scope.clientName = data.clientName;
                scope.clientId = data.clientId ;

                if (data.clientId) {
                    scope.inparams.clientId = data.clientId ;
                }
            });

            scope.changeProduct = function () {
                scope.inparams.productId = scope.formData.productId;
                resourceFactory.shareAccountTemplateResource.get(scope.inparams, function (data) {
                    scope.data = data;
                });
            };

            scope.addCharge = function (chargeId) {
                scope.errorchargeevent = false;
                if (chargeId) {
                    resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, function (data) {
                        data.chargeId = data.id;
                        delete data.id ;
                        scope.charges.push(data);
                        scope.chargeId = undefined;
                    });
                } else {
                    scope.errorchargeevent = true;
                    scope.labelchargeerror = "selectcharge";
                }
            }

            scope.deleteCharge = function (index) {
                scope.charges.splice(index, 1);
            }

            scope.submit = function () {
                this.formData.submittedDate = dateFilter(this.formData.submittedDate, scope.df);
                this.formData.applicationDate = dateFilter(this.formData.applicationDate, scope.df);
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.charges = [];

                if (scope.clientId) this.formData.clientId = scope.clientId;
                if (scope.charges.length > 0) {
                    for (var i in scope.charges) {
                        this.formData.charges.push({ id: scope.charges[i].id, chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amountOrPercentage});
                    }
                }
                resourceFactory.sharesAccount.put({shareAccountId: routeParams.accountId}, this.formData, function (data) {
                    location.path('/viewshareaccount/' + data.resourceId);
                });
            };

            scope.cancel = function () {
                location.path('/viewshareaccount/' + routeParams.accountId);
            }
        }
    });
    mifosX.ng.application.controller('EditShareAccountController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditShareAccountController]).run(function ($log) {
        $log.info("EditShareAccountController initialized");
    });
}(mifosX.controllers || {}));
