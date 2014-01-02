(function(module) {
    mifosX.controllers = _.extend(module, {
        CreateCenterController: function(scope, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.staffs = [];
            scope.data = {};
            scope.first = {};
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.first.date = new Date();
            resourceFactory.centerTemplateResource.get(function(data) {
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.groups = data.groupMembersOptions;
                scope.formData.officeId = data.officeOptions[0].id;
            });

            scope.changeOffice =function() {
                resourceFactory.centerTemplateResource.get({staffInSelectedOfficeOnly : false, officeId : scope.formData.officeId
                }, function(data) {
                    scope.staffs = data.staffOptions;
                });
                resourceFactory.centerTemplateResource.get({officeId : scope.formData.officeId }, function(data) {
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
                var reqDate = dateFilter(scope.first.date,scope.df);
                this.formData.activationDate = reqDate;
                
                if (scope.first.submitondate) {
                    reqDate = dateFilter(scope.first.submitondate,scope.df);
                    this.formData.submittedOnDate = reqDate;
                }

                this.formData.locale  = scope.optlang.code;
                this.formData.dateFormat =  scope.df;
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
