(function (module) {
    mifosX.controllers = _.extend(module, {
        StandingInstructionsHistoryController: function (scope, resourceFactory, paginatorService, dateFilter, $modal) {

            scope.date = {};
            scope.formData = {};
            scope.transactions = {};
            scope.isCollapsed = true;
            scope.displayResults = false;

            resourceFactory.standingInstructionTemplateResource.get({}, function (data) {
                scope.template = data;
            });

            var fetchFunction = function (offset, limit, callback) {
                var reqFirstDate = dateFilter(scope.date.first, scope.df);
                var reqSecondDate = dateFilter(scope.date.second, scope.df);
                var params = {};
                params.offset = offset;
                params.limit = limit;
                params.locale = "en";
                params.dateFormat = scope.df;

                /*if(scope.formData.sqlSearch){
                    params.sqlSearch = scope.formData.sqlSearch;
                }*/
                if(scope.formData.clientName){
                    params.clientName = scope.formData.clientName;
                }
                if(scope.formData.clientId){
                    params.clientId = scope.formData.clientId;
                }
                if(scope.formData.transferType){
                    params.transferType = scope.formData.transferType;
                }
                if(scope.formData.fromAccountType){
                    params.fromAccountType = scope.formData.fromAccountType;
                }
                if(scope.formData.fromAccountId){
                    params.fromAccountId = scope.formData.fromAccountId;
                }
                if (scope.date.first) {
                    params.fromDate = reqFirstDate;
                }
                if (scope.date.second) {
                    params.toDate = reqSecondDate;
                }
                resourceFactory.standingInstructionHistoryResource.get(params, callback);
            };
            scope.getTransactions = function(){
                scope.transactions = paginatorService.paginate(fetchFunction, 14);
                scope.displayResults = true;
                scope.isCollapsed = false;
            }

            scope.isFailed = function(transaction){
                return transaction.status == 'failed' && transaction.errorLog.length > 0;
            };

            scope.errorLog = function (transaction){
                $modal.open({
                    templateUrl: 'errorlog.html',
                    controller: ErrorLogCtrl,
                    resolve: {
                        transaction: function () {
                            return transaction;
                        }
                    }
                });
            };

            var ErrorLogCtrl = function ($scope, $modalInstance,transaction) {

                $scope.error = transaction.errorLog;
                $scope.cancel = function () {
                    $modalInstance.dismiss('close');
                };
            };
        }
    });
    mifosX.ng.application.controller('StandingInstructionsHistoryController', ['$scope', 'ResourceFactory', 'PaginatorService', 'dateFilter', '$modal', mifosX.controllers.StandingInstructionsHistoryController]).run(function ($log) {
        $log.info("StandingInstructionsHistoryController initialized");
    });
}(mifosX.controllers || {}));
