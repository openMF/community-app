(function(module) {
    mifosX.controllers = _.extend(module, {
        CreateGroupController: function(scope, resourceFactory, location,dateFilter) {
            scope.offices = [];
            scope.staffs = [];
            scope.data = {};
            scope.choice = 0;
            scope.first = {};
            resourceFactory.groupTemplateResource.get(function(data) {
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.clients = data.clientOptions;
            });
            scope.changeOffice =function(officeId) {
                resourceFactory.groupTemplateResource.get({staffInSelectedOfficeOnly : false, officeId : officeId
                }, function(data) {
                    scope.staffs = data.staffOptions;
                });
                resourceFactory.groupTemplateResource.get({officeId : officeId }, function(data) {
                    scope.clients = data.clientOptions;
                });
            };
            scope.setChoice = function(){
                if(this.formData.active){
                    scope.choice = 1;
                }
                else if(!this.formData.active){
                    scope.choice = 0;
                }
            };
            scope.submit = function() {
                var reqDate = dateFilter(scope.first.date,'dd MMMM yyyy');
                this.formData.activationDate = reqDate;
                this.formData.locale  = 'en';
                this.formData.dateFormat =  'dd MMMM yyyy';
                this.formData.active = this.formData.active || false;
                resourceFactory.groupResource.save(this.formData,function(data){
                    location.path('/viewgroup/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateGroupController', ['$scope', 'ResourceFactory', '$location','dateFilter', mifosX.controllers.CreateGroupController]).run(function($log) {
        $log.info("CreateGroupController initialized");
    });
}(mifosX.controllers || {}));
