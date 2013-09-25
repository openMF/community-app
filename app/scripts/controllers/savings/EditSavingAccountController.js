(function(module) {
  mifosX.controllers = _.extend(module, {
    EditSavingAccountController: function(scope, resourceFactory, location, routeParams) {
        scope.products = [];
        scope.fieldOfficers = [];
        scope.formData = {};
        scope.isCollapsed = false;
        scope.accountId = routeParams.id;

        resourceFactory.savingsResource.get({accountId:scope.accountId, template:true}, function(data) {
          scope.data = data;
          if (data.clientId) {
            scope.formData.clientId = data.clientId;
            scope.clientName = data.clientName;
          }
          if (data.groupId) {
            scope.formData.groupId = data.groupId;
            scope.groupName = data.groupName;
          }
          scope.formData.productId = data.savingsProductId;
          scope.products = data.productOptions;
          scope.formData.fieldOfficerId = data.fieldOfficerId;
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
        
         scope.changeProduct =function() {
          var inparams = {productId : scope.formData.productId};
          if (scope.formData.clientId) inparams.clientId = scope.formData.clientId;
          if (scope.formData.groupId) inparams.groupId = scope.formData.groupId;
          resourceFactory.savingsTemplateResource.get(inparams, function(data) {

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
        }

        scope.submit = function() {
          this.formData.locale = 'en';
          this.formData.dateFormat = 'dd MMMM yyyy';
          this.formData.monthDayFormat= "dd MMM";
          resourceFactory.savingsResource.update({'accountId': scope.accountId}, this.formData, function(data){
            location.path('/viewsavingaccount/' + data.savingsId);
          });
        };
    }
  });
  mifosX.ng.application.controller('EditSavingAccountController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.EditSavingAccountController]).run(function($log) {
    $log.info("EditSavingAccountController initialized");
  });
}(mifosX.controllers || {}));
