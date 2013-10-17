(function(module) {
    mifosX.controllers = _.extend(module, {
        AddGroupController: function(scope, resourceFactory, location, routeParams,dateFilter) {
            scope.first = {};
            scope.first.date = new Date();
            resourceFactory.groupTemplateResource.get({centerId: routeParams.centerId} , function(data) {
                scope.groupTemplate = data;
            });
            scope.setChoice = function(){
                if(this.formData.active){
                    scope.choice = 1;
                }
                else if(!this.formData.active){
                    scope.choice = 0;
                }
            };
            scope.addGroup = function(){
                var reqDate = dateFilter(scope.first.date,'dd MMMM yyyy');
                this.formData.activationDate = reqDate;
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
    mifosX.ng.application.controller('AddGroupController', ['$scope', 'ResourceFactory', '$location','$routeParams','dateFilter', mifosX.controllers.AddGroupController]).run(function($log) {
        $log.info("AddGroupController initialized");
    });
}(mifosX.controllers || {}));
