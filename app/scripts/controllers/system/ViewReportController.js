(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewReportController: function (scope, routeParams, resourceFactory, location, $uibModal) {
            resourceFactory.reportsResource.getReportDetails({id: routeParams.id}, function (data) {
                scope.report = data;
                scope.noncoreReport = data.coreReport == true ? false : true;
            });
            scope.deletereport = function () {
                $uibModal.open({
                    templateUrl: 'deletenoncorereport.html',
                    controller: NoncoreReportDeleteCtrl
                });
            };
            var NoncoreReportDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.reportsResource.delete({id: routeParams.id}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/reports');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ViewReportController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', mifosX.controllers.ViewReportController]).run(function ($log) {
        $log.info("ViewReportController initialized");
    });
}(mifosX.controllers || {}));
