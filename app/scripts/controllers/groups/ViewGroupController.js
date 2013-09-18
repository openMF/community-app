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

            scope.closure = function(){
              resourceFactory.groupTemplateResource.get({command:'close'}, function(data){
                  scope.template = data;
                  scope.choice = 1;
              });
            };
            scope.activateGroup = function() {
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
            scope.closeGroup = function(id){
                var newClosure = new Object();
                newClosure.locale = 'en';
                newClosure.dateFormat = 'dd MMMM yyyy';
                newClosure.closureDate = this.formData.closureDate;
                newClosure.closureReasonId = this.formData.closureReasonId
                resourceFactory.groupResource.save({groupId: id ,command:'close'},newClosure, function(data){
                    resourceFactory.groupResource.get({groupId: id}, function(data){
                        route.reload();
                    });
                });
            };
            scope.deleteGroup = function(){
                scope.choice = 3;
            } ;
            scope.delete = function(id){
                resourceFactory.groupResource.delete({groupId: routeParams.id}, {}, function(data) {
                    location.path('/groups');
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
