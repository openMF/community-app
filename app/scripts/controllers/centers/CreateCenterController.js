(function(module) {
    mifosX.controllers = _.extend(module, {
        CreateCenterController: function(scope, resourceFactory, location, timeout) {
            scope.offices = [];
            scope.staffs = [];
            scope.data = {};
            resourceFactory.centerTemplateResource.get(function(data) {
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.groups = data.groupMembersOptions;
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
            scope.submit = function() {
                this.formData.locale  = 'en';
                this.formData.dateFormat =  'dd MMMM yyyy';
                this.formData.active = this.formData.active || false;
                resourceFactory.centerResource.save(this.formData,function(data){
                    location.path('/viewcenter/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateCenterController', ['$scope', 'ResourceFactory', '$location','$timeout', mifosX.controllers.CreateCenterController]).run(function($log) {
        $log.info("CreateCenterController initialized");
    });
}(mifosX.controllers || {}));
