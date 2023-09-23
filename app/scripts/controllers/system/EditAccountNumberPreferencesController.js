(function (module) {
    mifosX.controllers = _.extend(module, {
        EditAccountNumberPreferencesController: function (scope,resourceFactory, location,routeParams) {
            scope.resourceId = routeParams.id;
            scope.addPrefix = false;

            resourceFactory.configurationResource.get({'id': 40},function (data) {
                scope.isMaxlengthEnable = data.enabled;
                if(scope.isMaxlengthEnable == true){
                    scope.maxlength = data.value - 1;
                }
                else{
                    scope.maxlength = 8;
                }
            });

            resourceFactory.accountNumberResources.getPrefixType({accountNumberFormatId:scope.resourceId},function(data){
                scope.accountType = data["accountType"].value;
                scope.formData ={
                    prefixType:data.prefixType.id,
                    prefixCharacter:data.prefixCharacter
                }
                scope.prefixTypeOptions = data.prefixTypeOptions[data["accountType"].code]

                scope.prefixCharacter = data.prefixCharacter;
                scope.prefixTypeValue = data["prefixType"].value;
                if(scope.prefixTypeValue == 'PREFIX_SHORT_NAME'){
                    scope.addCharacter = true;
                }

                if(scope.formData.prefixType != null){
                    scope.addPrefix = true;
                }
            });

            scope.cancel = function(){
                location.path('/accountnumberpreferences');
            }
            scope.submit = function(){
                resourceFactory.accountNumberResources.put({accountNumberFormatId:scope.resourceId},scope.formData,function(data){
                    location.path('/viewaccountnumberpreferences/' + data.resourceId );
                });
            }

            scope.accountNumberPrefix = function (prefixType) {
                for (var i in scope.prefixTypeOptions) {
                    if (prefixType === scope.prefixTypeOptions[i].id) {
                        if (scope.prefixTypeOptions[i].value == "PREFIX_SHORT_NAME"){
                            scope.addCharacter = true;
                        }
                        else{
                            scope.addCharacter = false;
                        }
                    }
                }
            };
        }
    });
    mifosX.ng.application.controller('EditAccountNumberPreferencesController', ['$scope', 'ResourceFactory', '$location','$routeParams',mifosX.controllers.EditAccountNumberPreferencesController]).run(function ($log) {
        $log.info("EditAccountNumberPreferencesController initialized");
    });
}(mifosX.controllers || {}));
