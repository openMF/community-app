(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateCollateralController: function (scope, resourceFactory, routeParams, location) {

            scope.currencyOptions = [];
            scope.formData = {};
            scope.collateralId = routeParams.id;
            resourceFactory.collateralTemplateResource.getAllCurrency(function (data) {
                scope.currencyOptions = data;
            });

            scope.cancel = function () {
                location.path('/collaterals/');
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                resourceFactory.collateralResource.save(this.formData, function (data) {
                    location.path('/viewcollateral/' + data.resourceId);
                });
            };

        }
    });
    mifosX.ng.application.controller('CreateCollateralController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.CreateCollateralController]).run(function ($log) {
        $log.info("CreateCollateralController initialized");
    });
}(mifosX.controllers || {}));
