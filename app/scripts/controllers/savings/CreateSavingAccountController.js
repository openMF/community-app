(function(module) {
  mifosX.controllers = _.extend(module, {
    CreateSavingAccountController: function(scope, resourceFactory, location, routeParams) {
        scope.products = [];
        scope.fieldOfficers = [];
        scope.formData = {};
        scope.isCollapsed = true;
        scope.clientId = routeParams.clientId;
        scope.groupId = routeParams.groupId;

        scope.inparams = {};
        if (scope.clientId) {scope.inparams.clientId = scope.clientId};
        if (scope.groupId) {scope.inparams.groupId = scope.groupId};

        resourceFactory.savingsTemplateResource.get(scope.inparams, function(data) {
            scope.products = data.productOptions;
            scope.charges = data.chargeOptions;
            scope.clientName = data.clientName;
            scope.groupName = data.groupName;
        });
        
         scope.changeProduct =function() {
          scope.inparams.productId = scope.formData.productId;
          resourceFactory.savingsTemplateResource.get(scope.inparams, function(data) {

            scope.isCollapsed = false;
            scope.data = data;

            scope.fieldOfficers = data.fieldOfficerOptions;
            scope.formData.nominalAnnualInterestRate = data.nominalAnnualInterestRate;
            scope.formData.minRequiredOpeningBalance = data.minRequiredOpeningBalance;
            scope.formData.lockinPeriodFrequency = data.lockinPeriodFrequency;
            /* FIX-ME: uncomment annualFeeAmount when datepicker avialable, because it depends on the date field 'annualFeeOnMonthDay'*/
            //scope.formData.annualFeeAmount = data.annualFeeAmount;
            scope.formData.withdrawalFeeAmount = data.withdrawalFeeAmount;
            scope.formData.withdrawalFeeForTransfers = data.withdrawalFeeForTransfers;

            if (data.interestCompoundingPeriodType) scope.formData.interestCompoundingPeriodType = data.interestCompoundingPeriodType.id;
            if (data.interestPostingPeriodType) scope.formData.interestPostingPeriodType = data.interestPostingPeriodType.id;
            if (data.interestCalculationType) scope.formData.interestCalculationType = data.interestCalculationType.id;
            if (data.interestCalculationDaysInYearType) scope.formData.interestCalculationDaysInYearType = data.interestCalculationDaysInYearType.id;
            if (data.lockinPeriodFrequencyType) scope.formData.lockinPeriodFrequencyType = data.lockinPeriodFrequencyType.id;
            if (data.withdrawalFeeType) scope.formData.withdrawalFeeType = data.withdrawalFeeType.id;

          });
        };

        scope.submit = function() {
          this.formData.locale = 'en';
          this.formData.dateFormat = 'dd MMMM yyyy';
          this.formData.monthDayFormat= "dd MMM";
          if (scope.clientId) this.formData.clientId = scope.clientId;
          if (scope.groupId) this.formData.groupId = scope.groupId;
          resourceFactory.savingsResource.save(this.formData,function(data){
            location.path('/viewsavingaccount/' + data.savingsId);
          });
        };
    }
  });
  mifosX.ng.application.controller('CreateSavingAccountController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.CreateSavingAccountController]).run(function($log) {
    $log.info("CreateSavingAccountController initialized");
  });
}(mifosX.controllers || {}));
