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
            scope.addrolepop = function(id){
                resourceFactory.groupResource.get({groupId:id,associations:'all',template:'true'} , function(data) {
                    scope.clients = data.clientMembers;
                    scope.roles = data.availableRoles;
                });
             scope.choice = 0;
            };
            scope.addrole = function(id){
              var newRole = new Object();
              newRole.clientId = this.formData.clientId;
              newRole.role = this.formData.role;
              resourceFactory.groupResource.save({groupId:id,command: 'assignRole'},newRole, function(data) {
                  resourceFactory.groupResource.get({groupId: id}, function(data){
                      route.reload();
                  });
              });
            };
            scope.associateMemberpop = function(id){
                resourceFactory.groupResource.get({groupId:id,associations:'clientMembers',template:'true'} , function(data) {
                    scope.allClients = data.clientOptions;
                });
                scope.choice = 5;
            };
            scope.associateMember = function(id){
                resourceFactory.groupResource.save({groupId:id,command:'associateClients'} ,this.formData, function(data) {
                    resourceFactory.groupResource.get({groupId: id}, function(data){
                        route.reload();
                    });
                });
            };
            scope.disassociateMemberpop = function(id){
                resourceFactory.groupResource.get({groupId:id,associations:'clientMembers',template:'true'} , function(data) {
                    scope.allMembers = data.clientMembers;
                });
                scope.choice=6;
            };
            scope.disassociate = function(id) {
                var disassociateMembers = new Object();
                disassociateMembers.clientMembers = this.formData.clientMembers;
                resourceFactory.groupResource.save({groupId:id,command:'disassociateClients'},disassociateMembers, function(data) {
                    resourceFactory.groupResource.get({groupId: id}, function(data){
                        route.reload();
                    });
                });
            };
            scope.setAttendance = function(){
             choice = 'attendance';
            };

            scope.activateGrouppop = function() {
                scope.choice = 2;
            };
            scope.activate = function(id){
                var newActivation = new Object();
                newActivation.locale = 'en' ;
                newActivation.dateFormat = 'dd MMMM yyyy';
                newActivation.activationDate = this.formData.activationDate;
                resourceFactory.groupResource.save({groupId : id,command:'activate'},newActivation, function(data){
                    resourceFactory.groupResource.get({groupId: id}, function(data){
                        route.reload();
                    });
                });
            };

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
