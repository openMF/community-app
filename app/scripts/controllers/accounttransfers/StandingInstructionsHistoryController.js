(function (module) {
    mifosX.controllers = _.extend(module, {
        StandingInstructionsHistoryController: function (scope, resourceFactory, paginatorService, dateFilter, $uibModal) {
            scope.date = {};
            scope.formData = {};
            scope.transactions = {};
            scope.isCollapsed = true;
            scope.displayResults = false;

            resourceFactory.standingInstructionTemplateResource.get({}, function (data) {
                scope.template = data;
            });

            if (!scope.searchCriteria.sih) {
                scope.searchCriteria.sih = [null, null, null, null, null, null, null];
                scope.saveSC();
            }
            scope.formData.clientName = scope.searchCriteria.sih[0];
            scope.formData.clientId = scope.searchCriteria.sih[1];
            scope.formData.transferType = scope.searchCriteria.sih[2];
            scope.formData.fromAccountType = scope.searchCriteria.sih[3];
            scope.formData.fromAccountId = scope.searchCriteria.sih[4];
            scope.date.first = scope.searchCriteria.sih[5];
            scope.date.second = scope.searchCriteria.sih[6];

            var fetchFunction = function (offset, limit, callback) {
                var reqFirstDate = dateFilter(scope.date.first, scope.df);
                var reqSecondDate = dateFilter(scope.date.second, scope.df);
                var params = {};
                params.offset = offset;
                params.limit = limit;
                params.locale = scope.optlang.code;
                params.dateFormat = scope.df;

                if (scope.formData.clientName) {
                    params.clientName = scope.formData.clientName;
                    scope.searchCriteria.sih[0] = params.clientName;
                } else
                    scope.searchCriteria.sih[0] = null;

                if (scope.formData.clientId) {
                    params.clientId = scope.formData.clientId;
                    scope.searchCriteria.sih[1] = params.clientId;
                } else
                    scope.searchCriteria.sih[1] = null;

                if (scope.formData.transferType) {
                    params.transferType = scope.formData.transferType;
                    scope.searchCriteria.sih[2] = params.transferType;
                } else
                    scope.searchCriteria.sih[2] = null;

                if (scope.formData.fromAccountType) {
                    params.fromAccountType = scope.formData.fromAccountType;
                    scope.searchCriteria.sih[3] = params.fromAccountType;
                } else
                    scope.searchCriteria.sih[3] = null;

                if (scope.formData.fromAccountId) {
                    params.fromAccountId = scope.formData.fromAccountId;
                    scope.searchCriteria.sih[4] = params.fromAccountId;
                } else
                    scope.searchCriteria.sih[4] = null;

                if (scope.date.first) {
                    params.fromDate = reqFirstDate;
                    scope.searchCriteria.sih[5] = params.fromDate;
                } else
                    scope.searchCriteria.sih[5] = null;

                if (scope.date.second) {
                    params.toDate = reqSecondDate;
                    scope.searchCriteria.sih[6] = params.toDate;
                } else
                    scope.searchCriteria.sih[6] = null;

                scope.saveSC();
                resourceFactory.standingInstructionHistoryResource.get(params, callback);
            };

            scope.getTransactions = function () {
                scope.transactions = paginatorService.paginate(fetchFunction, 14);
                scope.displayResults = true;
                scope.isCollapsed = false;
            }

            scope.isFailed = function (transaction) {
                return transaction.status == 'failed' && transaction.errorLog.length > 0;
            };

            scope.errorLog = function (transaction) {
                $uibModal.open({
                    templateUrl: 'errorlog.html',
                    controller: ErrorLogCtrl,
                    resolve: {
                        transaction: function () {
                            return transaction;
                        }
                    }
                });
            };

            var ErrorLogCtrl = function ($scope, $uibModalInstance, transaction) {
                $scope.error = transaction.errorLog;
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('close');
                };
            };
        }
    });
    mifosX.ng.application.controller('StandingInstructionsHistoryController', ['$scope', 'ResourceFactory', 'PaginatorService', 'dateFilter', '$uibModal', mifosX.controllers.StandingInstructionsHistoryController]).run(function ($log) {
        $log.info("StandingInstructionsHistoryController initialized");
    });
}(mifosX.controllers || {}));