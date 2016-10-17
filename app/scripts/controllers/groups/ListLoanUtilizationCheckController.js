(function (module) {
    mifosX.controllers = _.extend(module, {
        ListLoanUtilizationCheckController: function (scope, routeParams, resourceFactory, location, $modal, route, dateFilter) {

            scope.entityType = routeParams.entityType;
            scope.entityId = routeParams.entityId;
            scope.loanId = routeParams.loanId;

            resourceFactory.groupLoanUtilizationCheck.getAll({groupId: scope.entityId}, function (data) {
                scope.loanUtilizationChecks = data;
                for (var i in scope.loanUtilizationChecks) {
                    for (var j in scope.loanUtilizationChecks[i].loanUtilizationCheckDetailData) {
                        scope.loanId = scope.loanUtilizationChecks[i].loanUtilizationCheckDetailData[j].loanId;
                    }
                }
            });

            scope.showEdit = function (id) {
                location.path('/group/' + scope.entityId + '/loans/' + scope.loanId + '/editloanutilization/' + id);
            }


        }
    });
    mifosX.ng.application.controller('ListLoanUtilizationCheckController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', 'dateFilter', mifosX.controllers.ListLoanUtilizationCheckController]).run(function ($log) {
        $log.info("ListLoanUtilizationCheckController initialized");
    });

}(mifosX.controllers || {}));