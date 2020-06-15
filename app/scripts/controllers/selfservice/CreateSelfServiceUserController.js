(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateSelfServiceUserController: function (scope, resourceFactory, routeParams,$uibModal) {
            // TODO: Add Account Is Active Logic through email validation
            scope.accountActive = false;    
            scope.available = [];
            scope.selected = [];
            scope.selectedRoles = [] ;
            scope.availableRoles = [];
            scope.formData = {
                isSelfServiceUser: true,
                sendPasswordToEmail: true,
                roles: []
            };
            scope.clientId = routeParams.clientId;
            resourceFactory.userTemplateResource.get(function (data) {
                scope.availableRoles = data.availableRoles;
                // Assign the Self Service User Role to user
                scope.selectedRoles = scope.availableRoles.filter(function (role) {
                    return role.name == "Self Service User";
                });
            });
            resourceFactory.clientResource.get({clientId: scope.clientId},function(data){
                scope.formData.firstname = data.firstname;
                scope.formData.lastname = data.lastname;
                scope.formData.email = '';
                scope.formData.officeId = data.officeId;
                scope.formData.staffId = data.staffId;
                scope.formData.clients = [scope.clientId];
            });

            scope.submit = function(){
                for (var i in scope.selectedRoles) {
                    scope.formData.roles.push(scope.selectedRoles[i].id) ;
                }
                resourceFactory.userListResource.save(this.formData, function (data) {
                    scope.accountActive = true;
                    $uibModal.open({
                        templateUrl: 'selfserviceModal.html',
                        controller: SuccessModalCtrl,
                    });
                });
                
            }

            var SuccessModalCtrl = function ($scope, $uibModalInstance) {
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('CreateSelfServiceUserController', ['$scope', 'ResourceFactory', '$routeParams','$uibModal', mifosX.controllers.CreateSelfServiceUserController]).run(function ($log) {
        $log.info("CreateSelfServiceUserController initialized");
    });
}(mifosX.controllers || {}));