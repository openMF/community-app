(function (module) {
    mifosX.controllers = _.extend(module, {
        AccEditGLAccountController: function (scope, routeParams, resourceFactory, location) {
            scope.coadata = [];
            scope.accountTypes = [];
            scope.usageTypes = [];
            scope.headerTypes = [];
            scope.accountOptions = [];

            resourceFactory.accountCoaResource.get({glAccountId: routeParams.id, template: 'true'}, function (data) {
                scope.coadata = data;
                scope.glAccountId = data.id;
                scope.accountTypes = data.accountTypeOptions;
                scope.usageTypes = data.usageOptions;
                scope.formData = {
                    name: data.name,
                    glCode: data.glCode,
                    manualEntriesAllowed: data.manualEntriesAllowed,
                    description: data.description,
                    type: data.type.id,
                    tagId: data.tagId.id,
                    usage: data.usage.id,
                    parentId: data.parentId
                };

                //to display tag name on i/p field
                if (data.type.value == "ASSET") {
                    scope.tags = data.allowedAssetsTagOptions;
                    scope.headerTypes = data.assetHeaderAccountOptions;
                } else if (data.type.value == "LIABILITY") {
                    scope.tags = data.allowedLiabilitiesTagOptions;
                    scope.headerTypes = data.liabilityHeaderAccountOptions;
                } else if (data.type.value == "EQUITY") {
                    scope.tags = data.allowedEquityTagOptions;
                    scope.headerTypes = data.equityHeaderAccountOptions;
                } else if (data.type.value == "INCOME") {
                    scope.tags = data.allowedIncomeTagOptions;
                    scope.headerTypes = data.incomeHeaderAccountOptions;
                } else if (data.type.value == "EXPENSE") {
                    scope.tags = data.allowedExpensesTagOptions;
                    scope.headerTypes = data.expenseHeaderAccountOptions;
                }

                //this function calls when change account types
                scope.changeType = function (value) {
                    if (value == 1) {
                        scope.tags = data.allowedAssetsTagOptions;
                        scope.headerTypes = data.assetHeaderAccountOptions;
                    } else if (value == 2) {
                        scope.tags = data.allowedLiabilitiesTagOptions;
                        scope.headerTypes = data.liabilityHeaderAccountOptions;
                    } else if (value == 3) {
                        scope.tags = data.allowedEquityTagOptions;
                        scope.headerTypes = data.equityHeaderAccountOptions;
                    } else if (value == 4) {
                        scope.tags = data.allowedIncomeTagOptions;
                        scope.headerTypes = data.incomeHeaderAccountOptions;
                    } else if (value == 5) {
                        scope.tags = data.allowedExpensesTagOptions;
                        scope.headerTypes = data.expenseHeaderAccountOptions;
                    }

                }

            });

            scope.submit = function () {
                resourceFactory.accountCoaResource.update({'glAccountId': routeParams.id}, this.formData, function (data) {
                    location.path('/viewglaccount/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('AccEditGLAccountController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.AccEditGLAccountController]).run(function ($log) {
        $log.info("AccEditGLAccountController initialized");
    });
}(mifosX.controllers || {}));
