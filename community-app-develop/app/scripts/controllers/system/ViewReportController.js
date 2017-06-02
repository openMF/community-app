(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewReportController: function (scope, routeParams, resourceFactory, location, $modal) {
            resourceFactory.reportsResource.getReportDetails({id: routeParams.id}, function (data) {
                scope.report = data;
                scope.noncoreReport = data.coreReport == true ? false : true;
            });
            scope.deletereport = function () {
                $modal.open({
                    templateUrl: 'deletenoncorereport.html',
                    controller: NoncoreReportDeleteCtrl
                });
            };
            var NoncoreReportDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.reportsResource.delete({id: routeParams.id}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/reports');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ViewReportController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', mifosX.controllers.ViewReportController]).run(function ($log) {
        $log.info("ViewReportController initialized");
    });
}(mifosX.controllers || {}));
