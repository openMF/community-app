(function(module) {
    mifosX.controllers = _.extend(module, {
        CloseCenterController: function(scope, routeParams, route, location, resourceFactory) {
            scope.template = [];
            scope.center = [];
            resourceFactory.centerResource.get({centerId: routeParams.id,associations:'groupMembers,collectionMeetingCalendar'} , function(data) {
                scope.center = data;
            });
            resourceFactory.centerTemplateResource.get({command:'close'}, function(data){
                scope.template = data;
            });

            scope.closeGroup = function(){
                this.formData.locale = 'en';
                this.formData.dateFormat = 'dd MMMM yyyy';
                resourceFactory.centerResource.save({centerId: routeParams.id ,command:'close'},this.formData, function(data){
                    location.path('/viewcenter/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CloseCenterController', ['$scope', '$routeParams','$route', '$location', 'ResourceFactory', mifosX.controllers.CloseCenterController]).run(function($log) {
        $log.info("CloseCenterController initialized");
    });
}(mifosX.controllers || {}));

