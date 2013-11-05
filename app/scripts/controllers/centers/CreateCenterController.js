(function(module) {
    mifosX.controllers = _.extend(module, {
        CreateCenterController: function(scope, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.staffs = [];
            scope.data = {};
            scope.first = {};
            scope.formData = {};
            scope.first.date = new Date();
            resourceFactory.centerTemplateResource.get(function(data) {
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.groups = data.groupMembersOptions;
                scope.formData.officeId = data.officeOptions[0].id;
            });

            scope.changeOffice =function(officeId) {
                resourceFactory.centerTemplateResource.get({staffInSelectedOfficeOnly : false, officeId : officeId
                }, function(data) {
                    scope.staffs = data.staffOptions;
                });
                resourceFactory.centerTemplateResource.get({officeId : officeId }, function(data) {
                    scope.groups = data.groupMembersOptions;
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
                resourceFactory.centerResource.save(this.formData,function(data){
                    location.path('/viewcenter/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateCenterController', ['$scope', 'ResourceFactory', '$location','dateFilter', mifosX.controllers.CreateCenterController]).run(function($log) {
        $log.info("CreateCenterController initialized");
    });
}(mifosX.controllers || {}));
