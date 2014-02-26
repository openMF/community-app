(function(module) {
    mifosX.controllers = _.extend(module, {
    ManageFundsController: function(scope, location, resourceFactory) {
        scope.funderror = false;
        scope.formData = [];
        scope.formFundData = {};
        resourceFactory.codeValueResource.getAllCodeValues({codeId: 30} , function(data) {
            scope.codevalues = data;
            scope.formFundData.fundTypeId = data[0].id;
            resourceFactory.fundsResource.getAllFunds(function(data){
                scope.funds = data;
            });
        });

        scope.editFund = function(fund, name, id, fundTypeId){
            fund.edit = !fund.edit;
            for (var i = 0; i <scope.funds.length; i++) {
                if (scope.funds[i].id == id) {
                    scope.funds[i].name = name;
                    scope.funds[i].fundTypeId = fundTypeId;
                }
            }
        };
        scope.saveFund = function(id, name, fundTypeId){
            resourceFactory.fundsResource.update({fundId:id} ,{'name': name, 'fundTypeId' : fundTypeId}, function(data){
                location.path('/managefunds');
            });
        };
        scope.addFund = function (){
            if(scope.formFundData.name != undefined ) {
              scope.funderror = false;
              resourceFactory.fundsResource.save(scope.formFundData, function(data){
                  location.path('/managefunds');
              });
            } else {
              scope.funderror = true;
            }
    
            scope.newfund = undefined;
        };

     }
  });
  mifosX.ng.application.controller('ManageFundsController', ['$scope', '$location', 'ResourceFactory', mifosX.controllers.ManageFundsController]).run(function($log) {
    $log.info("ManageFundsController initialized");
  });
}(mifosX.controllers || {}));
