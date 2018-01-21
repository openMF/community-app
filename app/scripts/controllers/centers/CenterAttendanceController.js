(function (module) {
    mifosX.controllers = _.extend(module, {
        CenterAttendanceController: function (scope, resourceFactory, routeParams, location, dateFilter) {
            scope.center = [];
            scope.tempData = {};
            scope.formData = {};
            scope.first = {};
            scope.first.date = new Date();
            scope.centerId = routeParams.centerId;
            resourceFactory.centerResource.get({centerId: routeParams.centerId, associations: 'groupMembers,collectionMeetingCalendar'}, function (data) {
                scope.center = data;
                scope.meeting = data.collectionMeetingCalendar;
            });
            resourceFactory.centerMeetingResource.getMeetingInfo({centerId: routeParams.centerId, templateSource: 'template', calenderId: routeParams.calendarId}, function (data) {
                scope.clients = data.clients;
                scope.attendanceOptions = data.attendanceTypeOptions;
                for (var i = 0; i < scope.clients.length; i++) {
                    scope.tempData[scope.clients[i].id] = data.attendanceTypeOptions[0].id;

                }
            });

            scope.attendanceUpdate = function (id) {
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.meetingDate = reqDate;
                this.formData.clientsAttendance = [];
                for (var i = 0; i < scope.clients.length; i++) {
                    this.formData.clientsAttendance[i] = {clientId: scope.clients[i].id, attendanceType: this.tempData[scope.clients[i].id]};

                }
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.calendarId = id;
                resourceFactory.centerMeetingResource.save({centerId: routeParams.centerId, calendarId: routeParams.calendarId}, this.formData, function (data) {
                    location.path('/viewcenter/' + routeParams.centerId);
                }, function(response){
                    if(!response.status) {
                        scope.errorStatus = "Attendance already exist";
                    } else {
                        scope.errorStatus = "";
                    }
                });
            }

        }
    });
    mifosX.ng.application.controller('CenterAttendanceController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.CenterAttendanceController]).run(function ($log) {
        $log.info("CenterAttendanceController initialized");
    });
}(mifosX.controllers || {}));


