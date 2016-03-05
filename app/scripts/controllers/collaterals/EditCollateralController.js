(function (module) {
    mifosX.controllers = _.extend(module, {
        EditCollateralController: function (scope, routeParams, resourceFactory, location) {
            scope.formData = {};
            resourceFactory.collateralsResource.get({'collateralId' : routeParams.collateralId}, function(data){
                scope.formData = data;
            });

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                delete this.formData.id ;
                resourceFactory.collateralsResource.update({'collateralId': routeParams.collateralId}, this.formData, function (data) {
                    location.path('/collaterals/');
                });
            };
        }
    });
    mifosX.ng.application.controller('EditCollateralController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.EditCollateralController]).run(function ($log) {
        $log.info("EditCollateralController initialized");
    });
}(mifosX.controllers || {}));
