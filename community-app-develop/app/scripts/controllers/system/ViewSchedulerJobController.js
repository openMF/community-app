(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSchedulerJobController: function (scope, routeParams, resourceFactory) {
            resourceFactory.jobsResource.getJobDetails({jobId: routeParams.id}, function (data) {
                scope.job = data;
            });
        }
    });
    mifosX.ng.application.controller('ViewSchedulerJobController', ['$scope', '$routeParams', 'ResourceFactory', mifosX.controllers.ViewSchedulerJobController]).run(function ($log) {
        $log.info("ViewSchedulerJobController initialized");
    });
}(mifosX.controllers || {}));
