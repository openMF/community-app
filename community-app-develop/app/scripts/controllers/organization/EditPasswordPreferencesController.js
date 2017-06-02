(function (module) {
    mifosX.controllers = _.extend(module, {
        EditPasswordPreferencesController: function (scope, routeParams, resourceFactory, location, dateFilter) {
            scope.formData = {};
            resourceFactory.passwordPrefTemplateResource.get(function(data){
                scope.dataOptions = data;
                for(var i in data){
                    if(data[i].active == true){
                        scope.formData.validationPolicyId = data[i].id;
                    }
                }
            });

            scope.submit = function(){
                resourceFactory.passwordPrefResource.put(scope.formData, function(data){
                    location.path('/organization/');
                });
            }
        }
        });
    mifosX.ng.application.controller('EditPasswordPreferencesController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditPasswordPreferencesController]).run(function ($log) {
        $log.info("EditPasswordPreferencesController initialized");
    });
}(mifosX.controllers || {}));