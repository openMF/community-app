(function(module) {
    mifosX.controllers = _.extend(module, {
        EditGroupController: function(scope, resourceFactory,location, routeParams,dateFilter ) {
            scope.first = {};
            scope.managecode = routeParams.managecode;
            resourceFactory.groupResource.get({groupId: routeParams.id,associations:'clientMembers',template:'true'} , function(data) {
                scope.editGroup = data;
                scope.formData = {
                                    name:data.name,
                                    externalId:data.externalId,
                                    staffId:data.staffId
                                 };
                if(data.activationDate){
                    var actDate = dateFilter(data.activationDate,'dd MMMM yyyy');
                    scope.first.date = new Date(actDate);

                }
            });
            scope.updateGroup = function(){
                var reqDate = dateFilter(scope.first.date,'dd MMMM yyyy');
                this.formData.activationDate = reqDate;
                this.formData.locale = "en";
                this.formData.dateFormat = 'dd MMMM yyyy';
                resourceFactory.groupResource.update({groupId:routeParams.id},this.formData , function(data) {
                    location.path('/viewgroup/'+routeParams.id);
                });
            };
            scope.activate = function(){
                var reqDate = dateFilter(scope.first.date,'dd MMMM yyyy');
                var newActivation = new Object();
                newActivation.activationDate = reqDate;
                newActivation.locale = 'en' ;
                newActivation.dateFormat = 'dd MMMM yyyy';
                resourceFactory.groupResource.save({groupId : routeParams.id,command:'activate'},newActivation, function(data){
                    location.path('/viewgroup/'+routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditGroupController', ['$scope','ResourceFactory','$location','$routeParams','dateFilter', mifosX.controllers.EditGroupController]).run(function($log) {
        $log.info("EditGroupController initialized");
    });
}(mifosX.controllers || {}));

