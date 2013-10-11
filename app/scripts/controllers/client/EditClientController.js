(function(module) {
  mifosX.controllers = _.extend(module, {
    EditClientController: function(scope, routeParams, resourceFactory, location, http) {
        scope.offices = [];

        resourceFactory.clientResource.get({clientId: routeParams.id, template: 'true'} , function(data) {
            scope.offices = data.officeOptions;
            scope.staffs = data.staffOptions; 
            scope.officeId = data.officeId;
            scope.formData = {
              firstname : data.firstname,
              lastname : data.lastname,
              middlename : data.middlename,
              active : data.active,
              accountNo : data.accountNo, 
              staffId : data.staffId
            };

        });

        scope.onFileSelect = function($files) {
          scope.file = $files[0];
        };
        
        scope.submit = function() {
             this.formData.locale = 'en';
             this.formData.activationDate = '05 August 2013';
             this.formData.dateFormat = 'dd MMMM yyyy';
             resourceFactory.clientResource.update({'clientId': routeParams.id},this.formData,function(data){
              if (scope.file) {
                http.uploadFile({
                  url: 'https://demo.openmf.org/mifosng-provider/api/v1/clients/'+data.clientId+'/images', 
                  data: {},
                  file: scope.file
                }).then(function(imageData) {
                  // to fix IE not refreshing the model
                  if (!scope.$$phase) {
                    scope.$apply();
                  }
                  location.path('/viewclient/'+data.resourceId);
                });
              } else{
                location.path('/viewclient/' + data.resourceId);
              }
          });
        };
    }
  });
  mifosX.ng.application.controller('EditClientController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$http', mifosX.controllers.EditClientController]).run(function($log) {
    $log.info("EditClientController initialized");
  });
}(mifosX.controllers || {}));
