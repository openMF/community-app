(function(module) {
    mifosX.controllers = _.extend(module, {
        ViewGroupController: function(scope, routeParams , route, location, resourceFactory) {
            scope.group = [];
            scope.template = [];

            resourceFactory.groupResource.get({groupId: routeParams.id,associations:'all'} , function(data) {
                scope.group = data;
            });
            resourceFactory.runReportsResource.get({reportSource: 'GroupSummaryCounts',genericResultSet: 'false',R_groupId: routeParams.id} , function(data) {
                scope.summary = data[0];
            });
            resourceFactory.groupAccountResource.get({groupId: routeParams.id} , function(data) {
                scope.groupAccounts = data;
            });
            resourceFactory.groupNotesResource.getAllNotes({groupId: routeParams.id} , function(data) {
                scope.groupNotes = data;
            });
            scope.deleteGrouppop = function(){
                scope.choice = 3;
            } ;
            scope.delete = function(id){
                resourceFactory.groupResource.delete({groupId: routeParams.id}, {}, function(data) {
                    location.path('/groups');
                });
            };
            scope.delrole = function(id){
                resourceFactory.groupResource.save({groupId: routeParams.id,command: 'unassignRole',roleId:id}, {}, function(data) {
                    resourceFactory.groupResource.get({groupId: routeParams.id}, function(data){
                        route.reload();
                    });
                });
            }

            scope.resetNote = function() {
                this.formData = '';
            };
            scope.cancel = function(id){
                resourceFactory.groupResource.get({groupId: id}, function(data){
                    route.reload();
                });
            };

            scope.saveNote = function() {
                resourceFactory.groupResource.save({groupId: routeParams.id, anotherresource: 'notes'}, this.formData,function(data){
                    route.reload();
                });
            }
        }
    });
    mifosX.ng.application.controller('ViewGroupController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewGroupController]).run(function($log) {
        $log.info("ViewGroupController initialized");
    });
}(mifosX.controllers || {}));
