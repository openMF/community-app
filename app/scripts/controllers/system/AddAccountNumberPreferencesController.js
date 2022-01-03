(function (module) {
    mifosX.controllers = _.extend(module, {
        AddAccountNumberPreferencesController: function (scope, resourceFactory, location, routeParams) {
            scope.formData = {};
            scope.addPrefix = true;
            scope.addCharacter = false;

            resourceFactory.accountNumberTemplateResource.get(function(data){
                scope.data = data;
                scope.accountTypeOptions = data.accountTypeOptions;
            });

            scope.getPrefixTypeOptions = function(accountType){
                if(accountType == 1){
                    scope.prefixTypeOptions = scope.data.prefixTypeOptions["accountType.client"];
                }
                if(accountType == 2){
                    scope.prefixTypeOptions = scope.data.prefixTypeOptions["accountType.loan"];
                }
                if(accountType == 3){
                    scope.prefixTypeOptions = scope.data.prefixTypeOptions["accountType.savings"];
                }
                if(accountType == 4){
                    scope.prefixTypeOptions = scope.data.prefixTypeOptions["accountType.center"];
                }
                if(accountType == 5){
                    scope.prefixTypeOptions = scope.data.prefixTypeOptions["accountType.group"];
                }
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
            }
            resourceFactory.configurationResource.get({'id': 40},function (data) {
                scope.isMaxlengthEnable = data.enabled;
                if(scope.isMaxlengthEnable == true){
                    scope.maxlength = data.value - 1;
                }
                else{
                    scope.maxlength = 8;
                }
            });

            scope.cancel = function(){
                location.path('/accountnumberpreferences');
            }

            scope.submit = function(){
                resourceFactory.accountNumberResources.save(scope.formData,function (data) {
                    scope.resourceId = data.resourceId;
                    location.path('/viewaccountnumberpreferences/' + scope.resourceId );
                });
            }
        }
    });
    mifosX.ng.application.controller('AddAccountNumberPreferencesController', ['$scope', 'ResourceFactory', '$location','$routeParams',mifosX.controllers.AddAccountNumberPreferencesController]).run(function ($log) {
        $log.info("AddAccountNumberPreferencesController initialized");
    });
}(mifosX.controllers || {}));
