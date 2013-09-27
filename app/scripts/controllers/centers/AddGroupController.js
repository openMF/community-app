(function(module) {
    mifosX.controllers = _.extend(module, {
        AddGroupController: function(scope, resourceFactory, location, routeParams) {
            resourceFactory.groupTemplateResource.get({centerId: routeParams.centerId} , function(data) {
                scope.groupTemplate = data;
            });

            scope.addGroup = function(){
                this.formData.active = this.formData.active || false;
                this.formData.locale = 'en';
                this.formData.dateFormat = 'dd MMMM yyyy';
                this.formData.centerId = routeParams.centerId ;
                this.formData.officeId = routeParams.officeId;
                resourceFactory.groupResource.save(this.formData,function(data) {
                    location.path('/viewcenter/'+routeParams.centerId);
                });
            };

        }
    });
    mifosX.ng.application.controller('AddGroupController', ['$scope', 'ResourceFactory', '$location','$routeParams', mifosX.controllers.AddGroupController]).run(function($log) {
        $log.info("AddGroupController initialized");
    });
}(mifosX.controllers || {}));
