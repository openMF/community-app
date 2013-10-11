(function(module) {
  mifosX.controllers = _.extend(module, {
    CreateClientController: function(scope, resourceFactory, location, http) {
        scope.offices = [];
        scope.staffs = [];
        scope.formData = {
          active :'true'
        }
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

        scope.onFileSelect = function($files) {
          scope.file = $files[0];
        };

        scope.submit = function() {  
            this.formData.locale = 'en';
            this.formData.dateFormat = 'dd MMMM yyyy';
            this.formData.activationDate = '05 August 2013';
            resourceFactory.clientResource.save(this.formData,function(data){
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
  mifosX.ng.application.controller('CreateClientController', ['$scope', 'ResourceFactory', '$location', '$http', mifosX.controllers.CreateClientController]).run(function($log) {
    $log.info("CreateClientController initialized");
  });
}(mifosX.controllers || {}));
