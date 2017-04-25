(function (module) {
    mifosX.controllers = _.extend(module, {
        SchedulerJobsController: function (scope, resourceFactory, route, location, $uibModal) {
            var jobIdArray = [];
            scope.activeall = false;
            resourceFactory.jobsResource.get(function (data) {
                scope.jobs = data;
            });

            resourceFactory.schedulerResource.get(function (data) {
                scope.schedulerstatus = data.active === true ? 'Active' : 'Standby';
            });

            scope.selectAll = function (selectAll) {
                if(selectAll === true) {
                    for (var i = 0; i < scope.jobs.length; i++) {
                        jobIdArray.push(scope.jobs[i].jobId);
                        scope.jobs[i].checkbox = true;
                    }
                } else {
                    for (var i = 0; i < scope.jobs.length; i++) {
                        jobIdArray = _.without(jobIdArray,scope.jobs[i].jobId);
                        scope.jobs[i].checkbox = false;
                    }
                }

                jobIdArray =  _.uniq(jobIdArray);
            };

            scope.errorLog = function (id){
                scope.id = id;
                $uibModal.open({
                    templateUrl: 'errorlog.html',
                    controller: ErrorLogCtrl,
                    resolve: {
                        ids: function () {
                            return id;
                        }
                    }
                });
            };

            var ErrorLogCtrl = function ($scope, $uibModalInstance,ids) {
                for (var i in scope.jobs) {
                    if (scope.jobs[i].jobId === ids) {
                        var index = i;
                    }
                }

                $scope.error = scope.jobs[index].lastRunHistory.jobRunErrorLog;
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('close');
                };
            };

            scope.routeTo = function (id){
                location.path('/viewschedulerjob/'+id);
            };

            scope.runJobSelected = function (jobId, checkbox) {
                for (var i = 0; i < scope.jobs.length; i++) {
                    if (scope.jobs[i].jobId === jobId) {
                        if (checkbox === true) {
                            scope.jobs[i].checkbox = true;
                            jobIdArray.push(jobId);
                            break;
                        } else {
                            scope.jobs[i].checkbox = false;
                            jobIdArray = _.without(jobIdArray,scope.jobs[i].jobId);
                            break;
                        }
                    }
                }

                if (jobIdArray.length === 0) {
                    scope.activeall = false;
                }

                jobIdArray =  _.uniq(jobIdArray);
            };

            scope.runSelectedJobs = function () {
                scope.sentForExecution = [];
                for (var i in jobIdArray) {
                    for (var j in scope.jobs) {
                        if (scope.jobs[j].jobId === jobIdArray[i]) {
                            scope.sentForExecution.push(scope.jobs[j].displayName);
                        }
                    }
                }

                for (var i in jobIdArray) {
                    resourceFactory.jobsResource.save({jobId: jobIdArray[i], command : 'executeJob'}, {}, function(data){
                    });
                }
            };

            scope.suspendJobs = function () {
                resourceFactory.schedulerResource.save({command : 'stop'}, {}, function(data) {
                    route.reload();
                });
            };

            scope.activeJobs = function () {
                resourceFactory.schedulerResource.save({command : 'start'}, {}, function(data) {
                    route.reload();
                });
            };

            scope.refresh = function () {
                route.reload();
            };
        }
    });
    mifosX.ng.application.controller('SchedulerJobsController', ['$scope', 'ResourceFactory', '$route','$location','$uibModal', mifosX.controllers.SchedulerJobsController]).run(function($log) {
      $log.info("SchedulerJobsController initialized");
    });
}(mifosX.controllers || {}));
