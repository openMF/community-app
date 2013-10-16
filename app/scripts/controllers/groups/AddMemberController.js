(function(module) {
    mifosX.controllers = _.extend(module, {
        AddMemberController: function(scope, resourceFactory, location, routeParams,dateFilter) {
            scope.first = {};
            scope.first.date = new Date();
            resourceFactory.clientTemplateResource.get({officeId: routeParams.officeId} , function(data) {
                scope.clientTemplate = data;
            });
            scope.setChoice = function(){
                if(this.formData.active){
                    scope.choice = 1;
                }
                else if(!this.formData.active){
                    scope.choice = 0;
                }
            };
            scope.addMember = function(){
                var reqDate = dateFilter(scope.first.date,'dd MMMM yyyy');
                this.formData.activationDate = reqDate;
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
    mifosX.ng.application.controller('AddMemberController', ['$scope', 'ResourceFactory', '$location','$routeParams','dateFilter', mifosX.controllers.AddMemberController]).run(function($log) {
        $log.info("AddMemberController initialized");
    });
}(mifosX.controllers || {}));
