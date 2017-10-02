(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSchedulerController: function (scope, routeParams, resourceFactory, location, $uibModal) {
            resourceFactory.ScheduleReportResource.get({id: routeParams.id}, function (data) {
                scope.updateScheduler = data;
                scope.updateScheduler.locale =  scope.optlang.code;
                scope.updateScheduler.dateFormat = scope.df;
            });


            scope.deleteScheduler = function () {
                resourceFactory.ScheduleReportResource.delete({id: routeParams.id}, {}, function (data) {
                    
                    location.path('/reports');
                });
            };
           




        }
        });
        mifosX.ng.application.controller('ViewReportController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', mifosX.controllers.ViewReportController]).run(function ($log) {
            $log.info("ViewSchedulerController initialized");
        });
    }(mifosX.controllers || {}));
    