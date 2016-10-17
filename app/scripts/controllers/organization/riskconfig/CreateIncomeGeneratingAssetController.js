(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateIncomeGeneratingAssetController: function (scope, routeParams, resourceFactory, location, $modal, route) {
            scope.formData = {};
            scope.formData.isActive = true;
            scope.categoryEnumOptions = [];
            scope.typeEnumOptions = [];

            resourceFactory.cashFloawCategoryTemplate.get(function (response) {
                scope.categoryEnumOptions = response.cashFlowCategoryTypeOptions;
                scope.typeEnumOptions = response.cashFlowTypeOptions;
                for(var i in scope.categoryEnumOptions){
                    if(scope.categoryEnumOptions[i].value === "Asset"){
                        scope.asset = scope.categoryEnumOptions[i].value;
                        scope.formData.categoryEnumId = scope.categoryEnumOptions[i].id;
                        break;
                    }
                }
            });

            scope.submit = function () {
                this.formData.locale = "en";
                resourceFactory.cashFlowCategoryResource.save(this.formData, function (response) {
                    location.path('/incomegeneratingasset')
                });
            }
        }
    });
    mifosX.ng.application.controller('CreateIncomeGeneratingAssetController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.CreateIncomeGeneratingAssetController]).run(function ($log) {
        $log.info("CreateIncomeGeneratingAssetController initialized");
    });

}(mifosX.controllers || {}));