(function (module) {
    mifosX.controllers = _.extend(module, {
        AccCreateGLAccountController: function (scope, resourceFactory, location, $routeParams) {
            scope.coadata = [];
            scope.accountTypes = [];
            scope.usageTypes = [];
            scope.headerTypes = [];

            resourceFactory.accountCoaTemplateResource.get({type: '0'}, function (data) {
                scope.coadata = data;
                scope.accountTypes = data.accountTypeOptions;
                scope.usageTypes = data.usageOptions;
                
                scope.formData = {
                        manualEntriesAllowed: true,
                        type: scope.accountTypes[0].id,
                        usage: scope.usageTypes[0].id
                    };
                scope.formData.type;
                scope.formData.parentId;
                
                for (var i = 0; i < data.accountTypeOptions.length; i++) {
                	if(data.accountTypeOptions[i].value == $routeParams.acctype ) {
                		console.log($routeParams.acctype + data.accountTypeOptions[i].value)
                		scope.formData.type = scope.accountTypes[i].id;
                	}
                }
                
                //by default display assetTagsOptions and assetHeaderAccountOptions
                scope.types = data.allowedAssetsTagOptions,
                scope.headerTypes = data.assetHeaderAccountOptions
                changeType();

                function changeType () {
                    if (scope.formData.type == 1) {
                        scope.types = data.allowedAssetsTagOptions;
                        scope.headerTypes = data.assetHeaderAccountOptions
                    } else if (scope.formData.type == 2) {
                        scope.types = data.allowedLiabilitiesTagOptions;
                        scope.headerTypes = data.liabilityHeaderAccountOptions;
                    } else if (scope.formData.type == 3) {
                        scope.types = data.allowedEquityTagOptions;
                        scope.headerTypes = data.equityHeaderAccountOptions;
                    } else if (scope.formData.type == 4) {
                        scope.types = data.allowedIncomeTagOptions;
                        scope.headerTypes = data.incomeHeaderAccountOptions;
                    } else if (scope.formData.type == 5) {
                        scope.types = data.allowedExpensesTagOptions;
                        scope.headerTypes = data.expenseHeaderAccountOptions;
                    }

                }
                for (var i = 0; i < scope.headerTypes.length; i++) {
                    if(scope.headerTypes[i].id == $routeParams.parent ) {
                        console.log($routeParams.parent + scope.headerTypes[i].id)
                        scope.formData.parentId = scope.headerTypes[i].id;
                    }
                }

            });

            if($routeParams.parent){
            	scope.cancel = '#/viewglaccount/' + $routeParams.parent
        	}else{
        		scope.cancel = "#/accounting_coa"
        	}
            

            scope.submit = function () {
                resourceFactory.accountCoaResource.save(this.formData, function (data) {
                    location.path('/viewglaccount/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('AccCreateGLAccountController', ['$scope', 'ResourceFactory', '$location','$routeParams', mifosX.controllers.AccCreateGLAccountController]).run(function ($log) {
        $log.info("AccCreateGLAccountController initialized");
    });
}(mifosX.controllers || {}));
