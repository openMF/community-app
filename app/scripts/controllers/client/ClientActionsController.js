(function(module) {
  mifosX.controllers = _.extend(module, {
    ClientActionsController: function(scope, resourceFactory, location, routeParams) {

        scope.action = routeParams.action || "";
        scope.clientId = routeParams.id;
        scope.formData = {};

        // Transaction UI Related

        switch (scope.action) {
          case "activate":
            scope.labelName = 'label.activationdate';
            scope.breadcrumbName = 'label.activate';
            scope.modelName = 'activationDate';
            scope.showDateField = true;
          break;
          case "assignstaff":
            scope.breadcrumbName = 'label.assignstaff';
            scope.labelName = 'label.form.staff';
            scope.staffField = true;
            resourceFactory.clientResource.get({clientId: routeParams.id, template : 'true'},function(data){
              scope.staffOptions = data.staffOptions;
              scope.formData.staffId = scope.staffOptions[0].id;
            });
          break;
          case "unassignloanofficer":

          break;
        }

        scope.cancel = function() {
          location.path('/viewclient/' + routeParams.id);
        }
        scope.submit = function() {

          if (scope.action == "activate") {
            this.formData.locale = 'en';
            this.formData.dateFormat = 'dd MMMM yyyy';

            resourceFactory.clientResource.save({clientId: routeParams.id, command : 'activate'}, this.formData,function(data){
                location.path('/viewclient/' + data.clientId);
            });
          }
          if (scope.action == "assignstaff") {
            resourceFactory.clientResource.save({clientId: routeParams.id, command : 'assignStaff'}, this.formData,function(data){
              location.path('/viewclient/' + data.clientId);
            });
          } 
        };
    }
  });
  mifosX.ng.application.controller('ClientActionsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.ClientActionsController]).run(function($log) {
    $log.info("ClientActionsController initialized");
  });
}(mifosX.controllers || {}));
