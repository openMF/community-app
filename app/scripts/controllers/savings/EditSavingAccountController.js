(function(module) {
  mifosX.controllers = _.extend(module, {
    EditSavingAccountController: function(scope, resourceFactory, location, routeParams, dateFilter) {
        scope.products = [];
        scope.fieldOfficers = [];
        scope.formData = {};
        scope.isCollapsed = false;
        scope.accountId = routeParams.id;
        scope.charges = [];

        resourceFactory.savingsResource.get({accountId:scope.accountId, template:'true', associations : 'charges'}, function(data) {
          scope.data = data;
          scope.charges = data.charges || [];
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
          if(data.fieldOfficerId != 0)scope.formData.fieldOfficerId = data.fieldOfficerId;
          if(data.timeline) {
            var submittedOnDate = dateFilter(data.timeline.submittedOnDate, 'dd MMMM yyyy');
            scope.formData.submittedOnDate = new Date(submittedOnDate);
          }
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

        scope.addCharge = function(chargeId) {
          if (chargeId) {
            resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, function(data){
                data.chargeId = data.id;
                delete data.id;
                scope.charges.push(data);
                scope.chargeId = undefined;
            });
          }
        }

        scope.deleteCharge = function(index) {
          scope.charges.splice(index,1);
        }
        
        scope.cancel = function() {
          location.path('/viewsavingaccount/' +scope.accountId);
        }

        scope.submit = function() {
          if(this.formData.submittedOnDate)  this.formData.submittedOnDate = dateFilter(this.formData.submittedOnDate,'dd MMMM yyyy');
          this.formData.locale = 'en';
          this.formData.dateFormat = 'dd MMMM yyyy';
          this.formData.monthDayFormat= "dd MMM";
          scope.formData.charges = [];
          if (scope.charges.length > 0) {
            for (var i in scope.charges) {
              if(scope.charges[i].chargeTimeType.value=='Annual Fee') {
                var feeOnMonthDay = scope.charges[i].feeOnMonthDay==undefined ? "" :scope.charges[i].feeOnMonthDay;
                scope.formData.charges.push({ chargeId:scope.charges[i].chargeId, amount:scope.charges[i].amount,
                 feeOnMonthDay:feeOnMonthDay, id:scope.charges[i].id});
              } else {
                scope.formData.charges.push({ chargeId:scope.charges[i].chargeId, amount:scope.charges[i].amount, id:scope.charges[i].id});
              }
            }
          }

          resourceFactory.savingsResource.update({'accountId': scope.accountId}, this.formData, function(data){
            location.path('/viewsavingaccount/' + data.savingsId);
          });
        };
    }
  });
  mifosX.ng.application.controller('EditSavingAccountController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditSavingAccountController]).run(function($log) {
    $log.info("EditSavingAccountController initialized");
  });
}(mifosX.controllers || {}));
