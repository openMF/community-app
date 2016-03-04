(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateCollateralController: function (scope, resourceFactory, location) {
            scope.formData = {};

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                resourceFactory.collateralsResource.save(this.formData, function (data) {
                    location.path('/collaterals/');
                });
            }
        }
    });


    mifosX.ng.application.controller('CreateCollateralController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CreateCollateralController]).run(function ($log) {
        $log.info("CreateCollateralController initialized");
    });
}(mifosX.controllers || {}));