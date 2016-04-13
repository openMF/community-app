(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateShareAccountController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.products = [];
            scope.fieldOfficers = [];
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.clientId = routeParams.clientId;
            scope.date = {};
            scope.date.submittedOnDate = new Date();
            scope.charges = [];
            scope.inparams = {};
            if (scope.clientId) {
                scope.inparams.clientId = scope.clientId
            }
            resourceFactory.shareAccountTemplateResource.get(scope.inparams, function (data) {
                scope.products = data.productOptions;
                scope.chargeOptions = data.chargeOptions;
                scope.clientName = data.clientName;
            });

            scope.changeProduct = function () {
                scope.inparams.productId = scope.formData.productId;
                resourceFactory.shareAccountTemplateResource.get(scope.inparams, function (data) {
                    scope.data = data;
                    scope.formData.unitPrice = data.currentMarketPrice ;
                    scope.formData.requestedShares = data.defaultShares ;
                    scope.charges = data.charges;
                });
            };

            scope.addCharge = function (chargeId) {
                scope.errorchargeevent = false;
                if (chargeId) {
                    resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, function (data) {
                        data.chargeId = data.id;
                        scope.charges.push(data);
                        scope.chargeId = undefined;
                    });
                } else {
                    scope.errorchargeevent = true;
                    scope.labelchargeerror = "selectcharge";
                }
            }

            scope.deleteCharge = function (index) {
                scope.charges.splice(index, 1);
            }

            scope.submit = function () {
                this.formData.submittedDate = dateFilter(this.formData.submittedDate, scope.df);
                this.formData.applicationDate = dateFilter(this.formData.applicationDate, scope.df);
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.charges = [];

                if (scope.clientId) this.formData.clientId = scope.clientId;
                if (scope.charges.length > 0) {
                    for (var i in scope.charges) {
                        this.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount});
                    }
                }
                resourceFactory.sharesAccount.save(this.formData, function (data) {
                    location.path('/viewshareaccount/' + data.resourceId);
                });
            };

            scope.cancel = function () {
                location.path('/viewclient/' + scope.clientId);
            }
        }
    });
    mifosX.ng.application.controller('CreateShareAccountController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.CreateShareAccountController]).run(function ($log) {
        $log.info("CreateShareAccountController initialized");
    });
}(mifosX.controllers || {}));
