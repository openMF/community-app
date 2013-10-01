(function(module) {
    mifosX.controllers = _.extend(module, {
        ViewCenterController: function(scope, routeParams , route, location, resourceFactory) {
            scope.center = [];

            resourceFactory.centerResource.get({centerId: routeParams.id,associations:'groupMembers,collectionMeetingCalendar'} , function(data) {
                scope.center = data;
                scope.meeting = data.collectionMeetingCalendar;
            });
            resourceFactory.runReportsResource.get({reportSource: 'GroupSummaryCounts',genericResultSet: 'false',R_groupId: routeParams.id} , function(data) {
                scope.summary = data[0];
            });
            resourceFactory.centerAccountResource.get({centerId: routeParams.id} , function(data) {
                scope.accounts = data;
            });
            resourceFactory.groupNotesResource.getAllNotes({groupId: routeParams.id} , function(data) {
                scope.notes = data;
            });
            scope.deletecenterpop = function(){
                scope.choice = 3;
            } ;
            scope.delete = function(id){
                resourceFactory.centerResource.delete({centerId: id}, {}, function(data) {
                    location.path('/centers');
                });
            };
            scope.resetNote = function() {
                this.formData = '';
            };
            scope.unassignStaffpop = function()
            {
                scope.choice = 4;
            };
            scope.unassignStaff = function(id){
                var staffData = new Object();
                staffData.staffId = id;
                resourceFactory.centerResource.save({centerId: routeParams.id,command: 'unassignStaff'}, staffData, function(data) {
                    resourceFactory.centerResource.get({centerId: routeParams.id}, function(data){
                        route.reload();
                    });
                });
            };
            scope.cancelDelete = function(){
                scope.choice = 0;
            };
            scope.saveNote = function() {
                resourceFactory.groupNotesResource.save({groupId: routeParams.id}, this.formData,function(data){
                    route.reload();
                });
            }
        }
    });
    mifosX.ng.application.controller('ViewCenterController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewCenterController]).run(function($log) {
        $log.info("ViewCenterController initialized");
    });
}(mifosX.controllers || {}));

