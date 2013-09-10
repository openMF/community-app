(function(module) {
  mifosX.controllers = _.extend(module, {
    AccEditGLAccountController: function(scope, routeParams, resourceFactory, location) {
        scope.coadata = [];
        scope.accountTypes = [];
        scope.usageTypes = [];
        scope.headerTypes = [];
        scope.accountOptions = [];

        resourceFactory.accountCoaResource.get({glAccountId: routeParams.id, template: 'true'}, function(data) {
            scope.coadata = data;
            scope.glAccountId = data.id;
            scope.accountTypes = data.accountTypeOptions;
            scope.usageTypes = data.usageOptions;
            scope.formData = {
              name : data.name,
              glCode : data.glCode,
              manualEntriesAllowed : data.manualEntriesAllowed,
              description : data.description
             };

             //to display accountType name on i/p field
             for(var i=0; i< data.accountTypeOptions.length; i++){
                if(data.accountTypeOptions[i].id == data.type.id){
                  scope.formData.type = data.accountTypeOptions[i];
                  break;
                }
              }

              //to display usage name on i/p field
              for(var i=0; i< data.usageOptions.length; i++){
                if(data.usageOptions[i].id == data.usage.id){
                  scope.formData.usage = data.usageOptions[i];
                  break;
                }
              }

              //to display tag name on i/p field
              if(data.type.value == "ASSET") {
                for(var i=0; i< data.allowedAssetsTagOptions.length; i++){
                  if(data.allowedAssetsTagOptions[i].id == data.tagId.id){
                    scope.formData.tag = data.allowedAssetsTagOptions[i];
                    break;
                  }
                }
                scope.tags = data.allowedAssetsTagOptions;
              } else if(data.type.value == "LIABILITY") {
                for(var i=0; i< data.allowedLiabilitiesTagOptions.length; i++){
                  if(data.allowedLiabilitiesTagOptions[i].id == data.tagId.id){
                  scope.formData.tag = data.allowedLiabilitiesTagOptions[i];
                  break;
                  }
                }
                scope.tags = data.allowedLiabilitiesTagOptions;
              } else if(data.type.value == "EQUITY") {
                for(var i=0; i< data.allowedEquityTagOptions.length; i++){
                  if(data.allowedEquityTagOptions[i].id == data.tagId.id){
                    scope.formData.tag = data.allowedEquityTagOptions[i];
                    break;
                  }
                }
                scope.tags = data.allowedEquityTagOptions;
              } else if(data.type.value == "INCOME") {
                for(var i=0; i< data.allowedIncomeTagOptions.length; i++){
                  if(data.allowedIncomeTagOptions[i].id == data.tagId.id){
                    scope.formData.tag = data.allowedIncomeTagOptions[i];
                    break;
                  }
                }
                scope.tags = data.allowedIncomeTagOptions;
              } else if(data.type.value == "EXPENSE") {
                for(var i=0; i< data.allowedExpensesTagOptions.length; i++){
                  if(data.allowedExpensesTagOptions[i].id == data.tagId.id){
                    scope.formData.tag = data.allowedExpensesTagOptions[i];
                    break;
                  }
                }
                scope.tags = data.allowedExpensesTagOptions;
              }

            //to display parent name
            if(data.type.value == "ASSET") {
              scope.accountOptions = data.assetHeaderAccountOptions;
              for(var i=0; i<scope.accountOptions.length; i++) {
                if(scope.accountOptions[i].id == data.parentId) {
                  scope.formData.parent =  scope.accountOptions[i];
                }
              }
              scope.headerTypes = data.assetHeaderAccountOptions;
            } else if(data.type.value == "LIABILITY") {
                scope.accountOptions = data.liabilityHeaderAccountOptions;
                for(var i=0; i<scope.accountOptions.length; i++) {
                  if(scope.accountOptions[i].id == data.parentId) {
                    scope.formData.parent =  scope.accountOptions[i]; 
                  }
                }
                scope.headerTypes = data.liabilityHeaderAccountOptions;
            } else if(data.type.value == "EQUITY") {
                scope.accountOptions = data.equityHeaderAccountOptions;
                for(var i=0; i<scope.accountOptions.length; i++) {
                  if(scope.accountOptions[i].id == data.parentId) {
                    scope.formData.parent =  scope.accountOptions[i];
                  }
                }
                scope.headerTypes = data.equityHeaderAccountOptions;
            } else if(data.type.value == "INCOME") {
                scope.accountOptions = data.incomeHeaderAccountOptions;
                for(var i=0; i<scope.accountOptions.length; i++) {
                  if(scope.accountOptions[i].id == data.parentId) {
                    scope.formData.parent =  scope.accountOptions[i];
                  }
                }
                scope.headerTypes = data.incomeHeaderAccountOptions;
            } else if(data.type.value == "EXPENSE") {
                scope.accountOptions = data.expenseHeaderAccountOptions;
                for(var i=0; i<scope.accountOptions.length; i++) {
                  if(scope.accountOptions[i].id == data.parentId) {
                    scope.formData.parent =  scope.accountOptions[i];
                  }
                }
                scope.headerTypes = data.expenseHeaderAccountOptions;
            }  

            //this function calls when change account types
             scope.changeType = function (value) {
              if(value == 1) {
                  scope.tags = data.allowedAssetsTagOptions;
                  scope.headerTypes = data.assetHeaderAccountOptions;
              } else if(value == 2) {
                  scope.tags = data.allowedLiabilitiesTagOptions;
                  scope.headerTypes = data.liabilityHeaderAccountOptions;
              } else if(value == 3) {
                  scope.tags = data.allowedEquityTagOptions;
                  scope.headerTypes = data.equityHeaderAccountOptions;
              } else if(value == 4) {
                  scope.tags = data.allowedIncomeTagOptions;
                  scope.headerTypes = data.incomeHeaderAccountOptions;
              } else if(value == 5) {
                  scope.tags = data.allowedExpensesTagOptions;
                  scope.headerTypes = data.expenseHeaderAccountOptions;
              }
              
            }
        
        });

        scope.submit = function() {  
            
            if(this.formData.parent) {
              this.formData.parentId = this.formData.parent.id;
              delete this.formData.parent;
            }

            if(this.formData.tag) {
              this.formData.tagId = this.formData.tag.id;
              delete this.formData.tag;
            }

            this.formData.type = this.formData.type.id;
            this.formData.usage = this.formData.usage.id;
            resourceFactory.accountCoaResource.update({'glAccountId': routeParams.id},this.formData,function(data){
            location.path('/viewglaccount/' + data.resourceId);
          });
        };
    }
  });
  mifosX.ng.application.controller('AccEditGLAccountController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.AccEditGLAccountController]).run(function($log) {
    $log.info("AccEditGLAccountController initialized");
  });
}(mifosX.controllers || {}));
