(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewBankController: function (scope, resourceFactory, location, dateFilter, http, routeParams, API_VERSION, $upload, $rootScope) {
            scope.banks  = [];
            scope.getAllBanks = function(){
                resourceFactory.bankResource.getAll({}, function (data) {
                    scope.banks = data;
                });
            };
            scope.getAllBanks();
            scope.deleteBank = function(bankId){
                resourceFactory.bankResource.delete({bankId : bankId}, function (data) {
                    scope.getAllBanks();
                });
            };
        }
    });
    mifosX.ng.application.controller('ViewBankController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.ViewBankController]).run(function ($log) {
        $log.info("ViewBankController initialized");
    });
}(mifosX.controllers || {}));