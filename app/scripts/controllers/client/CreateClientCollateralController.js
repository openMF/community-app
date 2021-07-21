(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateClientCollateralController: function (scope, resourceFactory, routeParams, location) {

            scope.formData = {};
            scope.clientId = routeParams.id;
            scope.collateralData = {};
            scope.disable = true;
            scope.collateralDataRequestBody = {};
            scope.collateralId;
            console.log(routeParams);

            scope.updateValues = function () {
                scope.formData.quantity = scope.formData.quantity * 1.0;
                scope.formData.total = scope.formData.quantity * scope.formData.basePrice;
                scope.formData.totalCollateral = scope.formData.total * scope.formData.pctToBase/100.00;
            }

            scope.collateralProductChange = function (collateralId) {
                resourceFactory.collateralResource.get({collateralId: collateralId}, function (data) {
                    scope.collateralData = data;
                    scope.collateralId = collateralId;
                    scope.formData.name = scope.collateralData.name;
                    scope.formData.type = scope.collateralData.quality;
                    scope.formData.basePrice = scope.collateralData.basePrice;
                    scope.formData.pctToBase = scope.collateralData.pctToBase;
                    scope.formData.unitType = scope.collateralData.unitType;
                    scope.formData.collateralId = collateralId;
                    scope.formData.quantity = 0.0;
                    scope.formData.total = 0.0;
                    scope.formData.totalCollateral = 0.0
                    scope.disabled = false;
                    console.log(scope.formData)
                });

                // resourceFactory.loanResource.get({resourceType: 'template', templateType: 'collateral', productId: loanProductId, fields: 'id,loanCollateralOptions'}, function (data) {
                //     scope.collateralOptions = data.loanCollateralOptions || [];
                // });

            }

            resourceFactory.collateralResource.getAllCollaterals(function (data) {
                scope.collaterals = data;
            });

            // resourceFactory.loanCollateralTemplateResource.get({loanId: scope.loanId}, function (data) {
            //     scope.collateralTypes = data.allowedCollateralTypes;
            //     scope.formData.collateralTypeId = data.allowedCollateralTypes[0].id;
            // });

            scope.cancel = function () {
                location.path('/viewclient/' + scope.clientId);
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                console.log(this.formData);

                delete this.formData.name;
                delete this.formData.pctToBase;
                delete this.formData.basePrice;
                delete this.formData.type;
                delete this.formData.unitType;
                delete this.formData.total;
                delete this.formData.totalCollateral;

                resourceFactory.clientcollateralResource.save({clientId: scope.clientId}, this.formData, function (data) {
                    location.path('/viewclient/' + scope.clientId + '/viewclientcollateral/' + data.resourceId);
                });
            };

        }
    });
    mifosX.ng.application.controller('CreateClientCollateralController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.CreateClientCollateralController]).run(function ($log) {
        $log.info("CreateClientCollateralController initialized");
    });
}(mifosX.controllers || {}));
