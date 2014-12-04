(function (module) {
    mifosX.controllers = _.extend(module, {
        EditAccountNumberPreferencesController: function (scope, resourceFactory, location,routeParams) {
            scope.resourceId = routeParams.id;
            scope.formData = {};
            scope.addPrefix = false;
            resourceFactory.accountNumberResources.get({accountNumberFormatId:scope.resourceId},function(data){
                scope.accountType = data["accountType"].value;
                scope.formData.prefixType = data["prefixType"].value;
                scope.accountTypeId = data["accountType"].id;
                if(scope.formData.prefixType != null){
                    scope.addPrefix = true;
                }
                resourceFactory.accountNumberTemplateResource.get(function(data){
                    scope.data = data;
                    if(scope.accountTypeId == 1){
                        scope.prefixTypeOptions = scope.data.prefixTypeOptions["accountType.client"];
                    }
                    if(scope.accountTypeId == 2){
                        scope.prefixTypeOptions = scope.data.prefixTypeOptions["accountType.loan"];
                    }
                    if(scope.accountTypeId == 3){
                        scope.prefixTypeOptions = scope.data.prefixTypeOptions["accountType.savings"];
                    }
                });
            });


            scope.cancel = function(){
                location.path('/accountnumberpreferences');
            }
            scope.submit = function(){
                console.log("pref",scope.formData);
                resourceFactory.accountNumberResources.put({accountNumberFormatId:scope.resourceId},scope.formData,function(data){
                    location.path('/viewaccountnumberpreferences/' + data.resourceId );
                });
            }
        }
    });
    mifosX.ng.application.controller('EditAccountNumberPreferencesController', ['$scope', 'ResourceFactory', '$location','$routeParams',mifosX.controllers.EditAccountNumberPreferencesController]).run(function ($log) {
        $log.info("EditAccountNumberPreferencesController initialized");
    });
}(mifosX.controllers || {}));