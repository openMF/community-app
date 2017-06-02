(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSchedulerJobHistoryController: function (scope, resourceFactory, paginatorService, routeParams, $modal) {
            scope.jobhistory = [];
            var fetchFunction = function (offset, limit, callback) {
                resourceFactory.jobsResource.getJobHistory({jobId: routeParams.id, resourceType: 'runhistory', offset: offset, limit: limit}, callback);
            };
            scope.jobhistory = paginatorService.paginate(fetchFunction, 14);

            scope.errorLog = function (history){
                $modal.open({
                    templateUrl: 'errorlog.html',
                    controller: ErrorLogCtrl,
                    resolve: {
                        history: function () {
                            return history;
                        }
                    }
                });
            };

            var ErrorLogCtrl = function ($scope, $modalInstance,history) {
                $scope.error = history.jobRunErrorLog;
                $scope.cancel = function () {
                    $modalInstance.dismiss('close');
                };
            };
        }
    });
    mifosX.ng.application.controller('ViewSchedulerJobHistoryController', ['$scope', 'ResourceFactory', 'PaginatorService', '$routeParams', '$modal', mifosX.controllers.ViewSchedulerJobHistoryController]).run(function ($log) {
        $log.info("ViewSchedulerJobHistoryController initialized");
    });
}(mifosX.controllers || {}));
