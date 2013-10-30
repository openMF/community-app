(function(module) {
  mifosX.controllers = _.extend(module, {
    ClientActionsController: function(scope, resourceFactory, location, routeParams, dateFilter) {

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
          case "close":
            scope.labelName = 'label.closuredate';
            scope.labelNameClosurereason = 'label.closurereason';
            scope.breadcrumbName = 'label.close';
            scope.modelName = 'closureDate';
            scope.closureReasonField = true;
            scope.showDateField = true;
            resourceFactory.clientResource.get({anotherresource: 'template', commandParam : 'close'} , function(data) {
              scope.closureReasons = data.closureReasons;
              scope.formData.closureReasonId = scope.closureReasons[0].id;
            });
          break;
          case "delete":
            scope.breadcrumbName = 'label.delete';
            scope.labelName = 'Are you sure?';
            scope.showDeleteClient = true;
          break;
          case "unassignstaff":
            scope.labelName = 'Are you sure?';
            scope.showDeleteClient = true;
          break;
          case "acceptclienttransfer":
            scope.showNoteField = true;
          break;
          case "rejecttransfer":
            scope.showNoteField = true;
          break;
          case "undotransfer":
            scope.showNoteField = true;
          break;
        }

        scope.cancel = function() {
          location.path('/viewclient/' + routeParams.id);
        }

        scope.submit = function() {
          this.formData.locale = 'en';
          this.formData.dateFormat = 'dd MMMM yyyy';
          if (this.formData[scope.modelName]) {
            this.formData[scope.modelName] = dateFilter(this.formData[scope.modelName],'dd MMMM yyyy');
          }

          if (scope.action == "activate") {
            resourceFactory.clientResource.save({clientId: routeParams.id, command : 'activate'}, this.formData,function(data){
                location.path('/viewclient/' + data.clientId);
            });
          }
          if (scope.action == "assignstaff") {
            delete this.formData.locale;
            delete this.formData.dateFormat;
            resourceFactory.clientResource.save({clientId: routeParams.id, command : 'assignStaff'}, this.formData,function(data){
              location.path('/viewclient/' + data.clientId);
            });
          }
          if (scope.action == "unassignstaff") {
            delete this.formData.locale;
            delete this.formData.dateFormat;
            resourceFactory.clientResource.save({clientId: routeParams.id, command : 'unassignstaff'}, {staffId:routeParams.staffId},function(data){
              location.path('/viewclient/' + data.clientId);
            });
          }
          if (scope.action == "close") {
            resourceFactory.clientResource.save({clientId: routeParams.id, command : 'close'}, this.formData,function(data){
                location.path('/viewclient/' + data.clientId);
            });
          }
          if (scope.action == "acceptclienttransfer") {
            delete this.formData.locale;
            delete this.formData.dateFormat;
            resourceFactory.clientResource.save({clientId: routeParams.id, command : 'acceptTransfer'}, this.formData, function(data){
              location.path('/viewclient/' + data.clientId);
            });
          }
          if (scope.action == "rejecttransfer") {
            delete this.formData.locale;
            delete this.formData.dateFormat;
            resourceFactory.clientResource.save({clientId: routeParams.id, command : 'rejectTransfer'}, this.formData, function(data){
              location.path('/viewclient/' + data.clientId);
            });
          }
          if (scope.action == "undotransfer") {
            delete this.formData.locale;
            delete this.formData.dateFormat;
            resourceFactory.clientResource.save({clientId: routeParams.id, command : 'withdrawTransfer'}, this.formData, function(data){
              location.path('/viewclient/' + data.clientId);
            });
          }
        };
    }
  });
  mifosX.ng.application.controller('ClientActionsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.ClientActionsController]).run(function($log) {
    $log.info("ClientActionsController initialized");
  });
}(mifosX.controllers || {}));
