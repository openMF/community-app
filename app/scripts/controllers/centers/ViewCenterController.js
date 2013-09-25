(function(module) {
    mifosX.controllers = _.extend(module, {
        ViewCenterController: function(scope, routeParams , route, location, resourceFactory) {
            scope.center = [];

            resourceFactory.centerResource.get({centerId: routeParams.id,associations:'groupMembers,collectionMeetingCalendar'} , function(data) {
                scope.center = data;
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

            scope.resetNote = function() {
                this.formData = '';
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

