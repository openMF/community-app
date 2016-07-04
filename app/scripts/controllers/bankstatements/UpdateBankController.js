(function (module) {
    mifosX.controllers = _.extend(module, {
        UpdateBankController: function (scope, resourceFactory, location, dateFilter, http, routeParams, API_VERSION, $upload, $rootScope) {
            scope.formData = {};
            scope.updatedData = {};

            resourceFactory.bankResource.get({'bankId': routeParams.bankId},{}, function (data) {
                resourceFactory.accountCoaResource.getAllAccountCoas(function (glAccounts) {
                    scope.glAccounts = glAccounts;
                    scope.formData = data;

                });
            });

            scope.submit = function () {
                this.formData.glCode = undefined;
                resourceFactory.bankResource.update({'bankId': routeParams.bankId}, this.formData, function (data) {
                    location.path('/viewbank');
                });
            };

        }
    });
    mifosX.ng.application.controller('UpdateBankController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.UpdateBankController]).run(function ($log) {
        $log.info("UpdateBankController initialized");
    });
}(mifosX.controllers || {}));