(function(module) {
  mifosX.controllers = _.extend(module, {
    CreateSavingAccountController: function(scope, resourceFactory, location, routeParams, dateFilter) {
        scope.products = [];
        scope.fieldOfficers = [];
        scope.formData = {};
        scope.isCollapsed = true;
        scope.clientId = routeParams.clientId;
        scope.groupId = routeParams.groupId;
        if (routeParams.centerEntity) {
          scope.centerEntity = true;
        }
        scope.charges = [];
        scope.inparams = {};
        if (scope.clientId) {scope.inparams.clientId = scope.clientId};
        if (scope.groupId) {scope.inparams.groupId = scope.groupId};
        if (scope.centerId) {scope.inparams.centerId = scope.centerId};

        resourceFactory.savingsTemplateResource.get(scope.inparams, function(data) {
            scope.products = data.productOptions;
            scope.chargeOptions = data.chargeOptions;
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

        scope.addCharge = function(chargeId) {
          if (chargeId) {
            resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, function(data){
                data.chargeId = data.id;
                scope.charges.push(data);
                scope.chargeId = undefined;
            });
          }
        }

        scope.deleteCharge = function(index) {
          scope.charges.splice(index,1);
        }

        scope.submit = function() {
          this.formData.submittedOnDate = dateFilter(scope.date.submittedOnDate,'dd MMMM yyyy');
          this.formData.locale = 'en';
          this.formData.dateFormat = 'dd MMMM yyyy';
          this.formData.monthDayFormat= "dd MMM";
          this.formData.charges = [];

          if (scope.clientId) this.formData.clientId = scope.clientId;
          if (scope.groupId) this.formData.groupId = scope.groupId;
          if (scope.centerId) this.formData.centerId = scope.centerId;

          if (scope.charges.length > 0) {
            for (var i in scope.charges) {
              if(scope.charges[i].chargeTimeType.value=='Annual Fee') {
                var feeOnMonthDay = scope.charges[i].feeOnMonthDay==undefined ? "" :scope.charges[i].feeOnMonthDay;
                this.formData.charges.push({ chargeId:scope.charges[i].chargeId, amount:scope.charges[i].amount,
                 feeOnMonthDay:feeOnMonthDay});
              } else {
                this.formData.charges.push({ chargeId:scope.charges[i].chargeId, amount:scope.charges[i].amount});
              }
            }
          }
          resourceFactory.savingsResource.save(this.formData,function(data){
            location.path('/viewsavingaccount/' + data.savingsId);
          });
        };

        scope.cancel = function() {
          if (scope.groupId) {
            location.path('/viewgroup/' + scope.groupId);
          } else if (scope.clientId) {
            location.path('/viewclient/' + scope.clientId);
          }
        }
    }
  });
  mifosX.ng.application.controller('CreateSavingAccountController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.CreateSavingAccountController]).run(function($log) {
    $log.info("CreateSavingAccountController initialized");
  });
}(mifosX.controllers || {}));
