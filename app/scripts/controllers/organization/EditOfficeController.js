(function(module) {
  mifosX.controllers = _.extend(module, {
    EditOfficeController: function(scope, routeParams, resourceFactory, location,dateFilter) {
        scope.formData = {};
        scope.first = {};
        resourceFactory.officeResource.get({officeId: routeParams.id, template: 'true'} , function(data) {
            if(data.openingDate){
            var editDate = dateFilter(data.openingDate,'dd MMMM yyyy');
            scope.first.date = new Date(editDate); }
            scope.formData =
          {
              name : data.name,
              externalId : data.externalId
          }
        });
        
        scope.submit = function() {
            var reqDate = dateFilter(scope.first.date,'dd MMMM yyyy');
            this.formData.locale = 'en';
            this.formData.dateFormat = 'dd MMMM yyyy';
            this.formData.openingDate = reqDate;
            resourceFactory.officeResource.update({'officeId': routeParams.id},this.formData,function(data){
             location.path('/viewoffice/' + data.resourceId);
            });
        };
    }
  });
  mifosX.ng.application.controller('EditOfficeController', ['$scope', '$routeParams', 'ResourceFactory', '$location','dateFilter', mifosX.controllers.EditOfficeController]).run(function($log) {
    $log.info("EditOfficeController initialized");
  });
}(mifosX.controllers || {}));
