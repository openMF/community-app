(function(module) {
  mifosX.controllers = _.extend(module, {
    EditClientController: function(scope, routeParams, resourceFactory, location) {
        scope.offices = [];

        resourceFactory.clientResource.get({clientId: routeParams.id, template: 'true'} , function(data) {
            scope.offices = data.officeOptions;
            scope.staffs = data.staffOptions;
            scope.formData = {
              firstname : data.firstname,
              lastname : data.lastname,
              active: data.active,
              accountNo: data.accountNo
            };

            for(var i=0; i< data.officeOptions.length; i++){
              if(data.officeOptions[i].id == data.officeId){
                scope.formData.officeName = data.officeOptions[i];
                break;
              }
            }

            for(var i=0; i< data.staffOptions.length; i++){
              if(data.staffOptions[i].id == data.staffId){
                scope.formData.officeName = data.staffOptions[i];
                break;
              }
            }
        });
        
        scope.submit = function() {
             delete this.formData.officeName;
             this.formData.locale = 'en';
             this.formData.activationDate = '05 August 2013';
             this.formData.dateFormat = 'dd MMMM yyyy';
             resourceFactory.clientResource.update({'clientId': routeParams.id},this.formData,function(data){
             location.path('/viewclient/' + data.resourceId);
          });
        };
    }
  });
  mifosX.ng.application.controller('EditClientController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.EditClientController]).run(function($log) {
    $log.info("EditClientController initialized");
  });
}(mifosX.controllers || {}));
