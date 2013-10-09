(function(module) {
  mifosX.controllers = _.extend(module, {
    EditOfficeController: function(scope, routeParams, resourceFactory, location) {
        scope.formData = {};
        resourceFactory.officeResource.get({officeId: routeParams.id, template: 'true'} , function(data) {
          scope.formData =
          {
              name : data.name,
              externalId : data.externalId
          }
        });
        
        scope.submit = function() {
            this.formData.locale = 'en';
            this.formData.dateFormat = 'dd MMMM yyyy';
            this.formData.openingDate = '05 August 2013';
            resourceFactory.officeResource.update({'officeId': routeParams.id},this.formData,function(data){
             location.path('/viewoffice/' + data.resourceId);
            });
        };
    }
  });
  mifosX.ng.application.controller('EditOfficeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.EditOfficeController]).run(function($log) {
    $log.info("EditOfficeController initialized");
  });
}(mifosX.controllers || {}));
