(function(module) {
  mifosX.controllers = _.extend(module, {
    CreateClientController: function(scope, resourceFactory, location, http, dateFilter, API_VERSION,$upload,$rootScope) {
        scope.offices = [];
        scope.staffs = [];
        scope.first = {};
        scope.first.date = new Date();
        scope.formData = {};
        scope.restrictDate = new Date();
        resourceFactory.clientTemplateResource.get(function(data) {
            scope.offices = data.officeOptions;
            scope.staffs = data.staffOptions;
            scope.formData.officeId = scope.offices[0].id;
        });
        scope.changeOffice =function(officeId) {
          resourceFactory.clientTemplateResource.get({staffInSelectedOfficeOnly : false, officeId : officeId
              }, function(data) {
            scope.staffs = data.staffOptions;
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

            this.formData.locale = scope.optlang.code;
            this.formData.active = this.formData.active || false;
            this.formData.dateFormat = scope.df;
            this.formData.activationDate = reqDate;

            if (scope.first.submitondate) {
                reqDate = dateFilter(scope.first.submitondate,scope.df);
                this.formData.submittedOnDate = reqDate;
            }
            
            resourceFactory.clientResource.save(this.formData,function(data){
              location.path('/viewclient/' + data.clientId);
            });
          };
    }
  });
  mifosX.ng.application.controller('CreateClientController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION','$upload','$rootScope', mifosX.controllers.CreateClientController]).run(function($log) {
    $log.info("CreateClientController initialized");
  });
}(mifosX.controllers || {}));
