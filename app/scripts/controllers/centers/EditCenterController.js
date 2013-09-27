(function(module) {
    mifosX.controllers = _.extend(module, {
        EditCenterController: function(scope, resourceFactory,location, routeParams ) {
            scope.managecode = routeParams.managecode;

            resourceFactory.centerResource.get({centerId: routeParams.id,template: 'true'} , function(data) {
                scope.edit = data;
                scope.staffs = data.staffOptions;
                scope.formData = {
                    name:data.name,
                    externalId:data.externalId,
                    staffId:data.staffId
                };
            });
            scope.updateGroup = function(){
                this.formData.locale = "en";
                this.formData.dateFormat = 'dd MMMM yyyy';
                resourceFactory.centerResource.update({centerId:routeParams.id},this.formData , function(data) {
                    location.path('/viewcenter/'+routeParams.id);
                });
            };
            scope.activate = function(){
                var newActivation = new Object();
                newActivation.locale = 'en' ;
                newActivation.dateFormat = 'dd MMMM yyyy';
                newActivation.activationDate = this.formData.activationDate;
                resourceFactory.centerResource.save({centerId : routeParams.id,command:'activate'},newActivation, function(data){
                    location.path('/viewcenter/'+routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditCenterController', ['$scope','ResourceFactory','$location','$routeParams', mifosX.controllers.EditCenterController]).run(function($log) {
        $log.info("EditCenterController initialized");
    });
}(mifosX.controllers || {}));

