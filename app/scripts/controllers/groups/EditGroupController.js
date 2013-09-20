(function(module) {
    mifosX.controllers = _.extend(module, {
        EditGroupController: function(scope, resourceFactory,location, routeParams ) {

            resourceFactory.groupResource.get({groupId: routeParams.id,associations:'clientMembers',template:'true'} , function(data) {
                scope.editGroup = data;
                scope.formData = {
                                    name:data.name,
                                    externalId:data.externalId,
                                    staffId:data.staffId
                                 };
            });
            scope.updateGroup = function(id){
                this.formData.locale = "en";
                this.formData.dateFormat = 'dd MMMM yyyy';
                resourceFactory.groupResource.update({groupId:id},this.formData , function(data) {
                    location.path('/viewgroup/'+routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditGroupController', ['$scope','ResourceFactory','$location','$routeParams', mifosX.controllers.EditGroupController]).run(function($log) {
        $log.info("EditGroupController initialized");
    });
}(mifosX.controllers || {}));

