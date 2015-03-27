(function (module) {
    mifosX.controllers = _.extend(module, {
        EditPasswordPreferencesController: function (scope, routeParams, resourceFactory, location, dateFilter) {
            resourceFactory.passwordPrefResource.get(function(data){
                scope.formData= [];
                scope.description = data.description;
                scope.id = data.id;
                scope.isActive = data.active;
                if(scope.isActive){
                    scope.formData.preference = '1';
                }
            });
            scope.submit = function(){
                this.formData = {};
                this.formData.validationPolicyId = scope.id;
                resourceFactory.passwordPrefResource.put(this.formData, function(data){
                    location.path('/organization/');
                });
            }
        }
        });
    mifosX.ng.application.controller('EditPasswordPreferencesController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditPasswordPreferencesController]).run(function ($log) {
        $log.info("EditPasswordPreferencesController initialized");
    });
}(mifosX.controllers || {}));