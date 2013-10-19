(function(module) {
  mifosX.controllers = _.extend(module, {
    AddNewSavingsChargeController: function(scope, resourceFactory, location, routeParams, dateFilter) {
        scope.offices = [];
        resourceFactory.savingsChargeResource.get({accountId : routeParams.id, resourceType : 'template'}, function(data) {
            scope.chargeOptions = data.chargeOptions;
        });

        scope.chargeSelected = function(id) {
          resourceFactory.chargeResource.get({chargeId : id, template : 'true'},function(data){
            scope.chargeCalculationType = data.chargeCalculationType.id;
            scope.feeOnMonthDay = '';
            scope.chargeTimeType = data.chargeTimeType.id;
            scope.chargeDetails = data;
            scope.formData.amount = data.amount;
            scope.withDrawCharge = data.name == "Withdrawal fee-Percentage-UGX" ? true : false;
          });
        }
        
        scope.submit = function() {   
          this.formData.locale = "en";

          if(scope.withDrawCharge == true) {
            delete this.formData.feeOnMonthDay;
          } else {
            this.formData.monthDayFormat = "dd MMM";
            if (this.formData.feeOnMonthDay) this.formData.feeOnMonthDay = dateFilter(this.formData.feeOnMonthDay,'dd MMMM');
          }
          resourceFactory.savingsChargeResource.save({accountId : routeParams.id}, this.formData, function(data) {
            location.path('/viewsavingaccount/'+routeParams.id);
          });
        };
    }
  });
  mifosX.ng.application.controller('AddNewSavingsChargeController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.AddNewSavingsChargeController]).run(function($log) {
    $log.info("AddNewSavingsChargeController initialized");
  });
}(mifosX.controllers || {}));
