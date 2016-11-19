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
                scope.changeType() ;
            });

            scope.changeType = function () {
                if (scope.formData.type == 1) {
                    scope.types = scope.coadata.allowedAssetsTagOptions;
                    scope.headerTypes = scope.coadata.assetHeaderAccountOptions
                } else if (scope.formData.type == 2) {
                    scope.types = scope.coadata.allowedLiabilitiesTagOptions;
                    scope.headerTypes = scope.coadata.liabilityHeaderAccountOptions;
                } else if (scope.formData.type == 3) {
                    scope.types = scope.coadata.allowedEquityTagOptions;
                    scope.headerTypes = scope.coadata.equityHeaderAccountOptions;
                } else if (scope.formData.type == 4) {
                    scope.types = scope.coadata.allowedIncomeTagOptions;
                    scope.headerTypes = scope.coadata.incomeHeaderAccountOptions;
                } else if (scope.formData.type == 5) {
                    scope.types = scope.coadata.allowedExpensesTagOptions;
                    scope.headerTypes = scope.coadata.expenseHeaderAccountOptions;
                }
            } ;

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
