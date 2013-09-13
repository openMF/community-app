(function(module) {
  mifosX.controllers = _.extend(module, {
    UserFormController: function(scope, resourceFactory) {
      scope.offices = [];
      scope.roles = [];
      resourceFactory.officeResource.getAllOffices({}, function(data) {
        scope.offices = data;
      });
      resourceFactory.roleResource.getAllRoles({}, function(data) {
        scope.roles = data;
      });

      scope.$on('OpenUserFormDialog', function() {
        scope.userFormData = {selectedRoles: {}, sendPasswordToEmail: false};
        scope.formInError = false;
        scope.errors = [];
      });

      scope.submitUserForm = function() {
        scope.formInError = false;
        scope.errors = [];
        var userData = {
          username:            scope.userFormData.username,
          firstname:           scope.userFormData.firstname,
          lastname:            scope.userFormData.lastname,
          email:               scope.userFormData.email,
          officeId:            scope.userFormData.office.id,
          sendPasswordToEmail: scope.userFormData.sendPasswordToEmail,
          roles:              _.map(
            _.keys(scope.userFormData.selectedRoles), function(roleId) {return parseInt(roleId, 10);}
          )
        };

        scope.$emit('SubmitUserFormStart');
        new resourceFactory.userResource(userData).$save({}, 
          function(data) {
            userData.id = data.resourceId;
            scope.users.push(userData);
            scope.$emit('SubmitUserFormSuccess');
          },
          function(response) {
            scope.formInError = true;
            scope.errors = response.data.errors;
            scope.$emit('SubmitUserFormError');
          }
        );
      };

      scope.cancelUserForm = function() {
        scope.$emit('CloseUserForm');
      };
    }
  });
  mifosX.ng.application.controller('UserFormController', ['$scope', 'ResourceFactory', mifosX.controllers.UserFormController]).run(function($log) {
    $log.info("UserFormController initialized");
  });
}(mifosX.controllers || {}));
