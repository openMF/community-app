(function(module) {
    mifosX.controllers = _.extend(module, {
        CloseGroupController: function(scope, routeParams, route, location, resourceFactory) {
            scope.group = [];
            scope.template = [];

            resourceFactory.groupResource.get({groupId: routeParams.id,associations:'all'} , function(data) {
                scope.group = data;
            });
            resourceFactory.groupTemplateResource.get({command:'close'}, function(data){
                scope.template = data;
            });

            scope.closeGroup = function(){
                this.formData.locale = 'en';
                this.formData.dateFormat = 'dd MMMM yyyy';
                resourceFactory.groupResource.save({groupId: routeParams.id ,command:'close'},this.formData, function(data){
                    location.path('/viewgroup/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CloseGroupController', ['$scope', '$routeParams','$route', '$location', 'ResourceFactory', mifosX.controllers.CloseGroupController]).run(function($log) {
        $log.info("CloseGroupController initialized");
    });
}(mifosX.controllers || {}));

