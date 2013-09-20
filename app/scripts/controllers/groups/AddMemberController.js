(function(module) {
    mifosX.controllers = _.extend(module, {
        AddMemberController: function(scope, resourceFactory, location, routeParams) {
            resourceFactory.clientTemplateResource.get({officeId: routeParams.officeId} , function(data) {
                scope.clientTemplate = data;
            });

            scope.addMember = function(){
                this.formData.active = this.formData.active || false;
                this.formData.locale = 'en';
                this.formData.dateFormat = 'dd MMMM yyyy';
                this.formData.groupId = routeParams.groupId ;
                this.formData.officeId = routeParams.officeId;
                resourceFactory.clientResource.save(this.formData,function(data) {
                    location.path('/viewgroup/'+data.groupId);
                });
            };
            
        }
    });
    mifosX.ng.application.controller('AddMemberController', ['$scope', 'ResourceFactory', '$location','$routeParams', mifosX.controllers.AddMemberController]).run(function($log) {
        $log.info("AddMemberController initialized");
    });
}(mifosX.controllers || {}));
