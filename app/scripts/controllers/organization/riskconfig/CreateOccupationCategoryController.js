(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateOccupationCategoryController: function (scope, routeParams, resourceFactory, location, $modal, route) {
            scope.formData = {};
            scope.formData.isActive = true;
            scope.categoryEnumOptions = [];
            scope.typeEnumOptions = [];

            resourceFactory.cashFloawCategoryTemplate.get(function (response) {
                scope.categoryEnumOptions = response.cashFlowCategoryTypeOptions;
                scope.typeEnumOptions = response.cashFlowTypeOptions;
                for(var i in scope.categoryEnumOptions){
                    if(scope.categoryEnumOptions[i].value === "Occupation"){
                        scope.occupation = scope.categoryEnumOptions[i].value;
                        scope.formData.categoryEnumId = scope.categoryEnumOptions[i].id;
                        break;
                    }
                }
            });


            scope.submit = function () {
                this.formData.locale = "en";
                resourceFactory.cashFlowCategoryResource.save(this.formData, function (response) {
                    location.path('/occupationcatagory/')
                });
            }
        }
    });
    mifosX.ng.application.controller('CreateOccupationCategoryController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.CreateOccupationCategoryController]).run(function ($log) {
        $log.info("CreateOccupationCategoryController initialized");
    });

}(mifosX.controllers || {}));