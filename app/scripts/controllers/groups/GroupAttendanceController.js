(function(module) {
    mifosX.controllers = _.extend(module, {
        GroupAttendanceController: function(scope, resourceFactory , routeParams, location) {
            scope.group = [];
            scope.tempData = {};

            resourceFactory.groupResource.get({groupId: routeParams.groupId,associations:'all'} , function(data) {
                scope.group = data;
                scope.meeting = data.collectionMeetingCalendar;
            });
            resourceFactory.groupMeetingResource.getMeetingInfo({groupId: routeParams.groupId,templateSource: 'template',calenderId: routeParams.calendarId}, function(data) {
                scope.clients = data.clients;
                scope.attendanceOptions = data.attendanceTypeOptions;
            });

            scope.attendanceUpdate = function(id){
                this.formData.clientsAttendance=[];
                for(var i=0; i<scope.clients.length;i++)
                {
                    this.formData.clientsAttendance[i] ={clientId:scope.clients[i].id,attendanceType:this.tempData[scope.clients[i].id]};

                }
                this.formData.locale = 'en' ;
                this.formData.dateFormat = 'dd MMMM yyyy';
                this.formData.calendarId = id;
                resourceFactory.groupMeetingResource.save({groupId: routeParams.groupId,calenderId: routeParams.calendarId},this.formData, function(data) {
                    location.path('/viewgroup/' + routeParams.groupId);
                });
            }

        }
    });
    mifosX.ng.application.controller('GroupAttendanceController', ['$scope', 'ResourceFactory', '$routeParams','$location', mifosX.controllers.GroupAttendanceController]).run(function($log) {
        $log.info("GroupAttendanceController initialized");
    });
}(mifosX.controllers || {}));


