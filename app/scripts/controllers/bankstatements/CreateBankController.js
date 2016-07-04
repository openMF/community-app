(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateBankController: function (scope, resourceFactory, location, dateFilter, http, routeParams, API_VERSION, $upload, $rootScope) {
            scope.formData = {};
            scope.glAccounts = [];
            resourceFactory.accountCoaResource.getAllAccountCoas(function (data) {
                scope.glAccounts = data;
            });
            scope.submit = function () {
                resourceFactory.bankResource.save(this.formData, function (data) {
                    location.path('/viewbank');
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateBankController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.CreateBankController]).run(function ($log) {
        $log.info("CreateBankController initialized");
    });
}(mifosX.controllers || {}));