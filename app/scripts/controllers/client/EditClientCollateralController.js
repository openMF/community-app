(function (module) {
    mifosX.controllers = _.extend(module, {
        EditClientCollateralController: function (scope, resourceFactory, routeParams, location) {

            scope.formData = {};
            scope.clientId = routeParams.id;
            scope.collateralId = routeParams.collateralId;
            scope.collateralDataRequestBody = {};

            resourceFactory.clientcollateralResource.get({clientId: scope.clientId, collateralParamId: scope.collateralId}, function (data) {
                scope.collaterals = data;
                scope.formData = {
                    name: data.name,
                    quantity: data.quantity,
                    total: data.total,
                    totalCollateral: data.totalCollateral
                }
            });

            scope.cancel = function () {
                location.path('/viewclient/' + scope.clientId);
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                scope.collateralDataRequestBody.collateralId = scope.collateralId;
                scope.collateralDataRequestBody.quantity = this.formData.quantity;
                scope.collateralDataRequestBody.locale = this.formData.locale;
                resourceFactory.clientcollateralResource.update({clientId: scope.clientId, collateralParamId: scope.collateralId}, scope.collateralDataRequestBody, function (data) {
                    location.path('/viewclient/' + scope.clientId + '/viewclientcollateral/' + data.resourceId);
                });
            };

        }
    });
    mifosX.ng.application.controller('EditClientCollateralController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.EditClientCollateralController]).run(function ($log) {
        $log.info("EditClientCollateralController initialized");
    });
}(mifosX.controllers || {}));
