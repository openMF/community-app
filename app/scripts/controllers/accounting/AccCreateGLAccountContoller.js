(function (module) {
    mifosX.controllers = _.extend(module, {
        AccCreateGLAccountController: function (scope, resourceFactory, location) {
            scope.coadata = [];
            scope.accountTypes = [];
            scope.usageTypes = [];
            scope.headerTypes = [];

            resourceFactory.accountCoaTemplateResource.get({type: '0'}, function (data) {
                scope.coadata = data;
                scope.accountTypes = data.accountTypeOptions;
                scope.usageTypes = data.usageOptions;

                scope.formData = {
                    manualEntriesAllowed: true,
                    type: scope.accountTypes[0].id,
                    usage: scope.usageTypes[0].id,
                };
                //by default display assetTagsOptions and assetHeaderAccountOptions
                scope.types = data.allowedAssetsTagOptions,
                    scope.headerTypes = data.assetHeaderAccountOptions

                scope.changeType = function (value) {
                    if (value == 1) {
                        scope.types = data.allowedAssetsTagOptions;
                        scope.headerTypes = data.assetHeaderAccountOptions
                    } else if (value == 2) {
                        scope.types = data.allowedLiabilitiesTagOptions;
                        scope.headerTypes = data.liabilityHeaderAccountOptions;
                    } else if (value == 3) {
                        scope.types = data.allowedEquityTagOptions;
                        scope.headerTypes = data.equityHeaderAccountOptions;
                    } else if (value == 4) {
                        scope.types = data.allowedIncomeTagOptions;
                        scope.headerTypes = data.incomeHeaderAccountOptions;
                    } else if (value == 5) {
                        scope.types = data.allowedExpensesTagOptions;
                        scope.headerTypes = data.expenseHeaderAccountOptions;
                    }

                }


            });


            scope.submit = function () {
                resourceFactory.accountCoaResource.save(this.formData, function (data) {
                    location.path('/viewglaccount/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('AccCreateGLAccountController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.AccCreateGLAccountController]).run(function ($log) {
        $log.info("AccCreateGLAccountController initialized");
    });
}(mifosX.controllers || {}));
