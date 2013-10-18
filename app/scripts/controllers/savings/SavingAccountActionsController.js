(function(module) {
  mifosX.controllers = _.extend(module, {
    SavingAccountActionsController: function(scope, resourceFactory, location, routeParams, dateFilter) {

        scope.action = routeParams.action || "";
        scope.accountId = routeParams.id;
        scope.savingAccountId = routeParams.id;
        scope.formData = {};

        // Transaction UI Related
        scope.isTransaction = false;
        scope.showPaymentDetails =false;
        scope.paymentTypes = [];
        switch (scope.action) {
          case "approve":
            scope.title = 'label.approve.saving.account';
            scope.labelName = 'label.saving.account.approvedOnDate';
            scope.modelName = 'approvedOnDate';
            scope.showDateField = true;
            scope.showNoteField = true;
          break;
          case "reject":
            scope.title = 'label.reject.saving.account';
            scope.labelName = 'label.saving.account.rejectedOnDate';
            scope.modelName = 'rejectedOnDate';
            scope.showDateField = true;
            scope.showNoteField = true;
          break;
          case "withdrawnByApplicant":
            scope.title = 'label.withdraw.saving.account';
            scope.labelName = 'label.saving.account.withdrawnOnDate';
            scope.modelName = 'withdrawnOnDate';
            scope.showDateField = true;
            scope.showNoteField = true;
          break;
          case "undoapproval":
            scope.title = 'label.undoapprove.saving.account';
            scope.showDateField = false;
            scope.showNoteField = true;
          break;
          case "activate":
            scope.title = 'label.activate.saving.account';
            scope.labelName = 'label.saving.account.activatedOnDate';
            scope.modelName = 'activatedOnDate';
            scope.showDateField = true;
            scope.showNoteField = false;
          break;
          case "deposit":
            resourceFactory.savingsTrxnsTemplateResource.get({savingsId:scope.accountId, command:'deposit'}, function(data){
              scope.paymentTypes=data.paymentTypeOptions;
            });
            scope.title = 'label.deposit.money.to.saving.account';
            scope.labelName = 'label.saving.account.transactionDate';
            scope.modelName = 'transactionDate';
            scope.showDateField = true;
            scope.showNoteField = false;
            scope.isTransaction = true;
            scope.showPaymentDetails = false;
          break;
          case "withdrawal":
            resourceFactory.savingsTrxnsTemplateResource.get({savingsId:scope.accountId, command:'withdrawal'}, function(data){
              scope.paymentTypes=data.paymentTypeOptions;
            });
            scope.title = 'label.withdraw.money.from.saving.account';
            scope.labelName = 'label.saving.account.transactionDate';
            scope.modelName = 'transactionDate';
            scope.showDateField = true;
            scope.showNoteField = false;
            scope.isTransaction = true;
            scope.showPaymentDetails = false;
          break;
          case "applyAnnualFees":
            resourceFactory.savingsResource.get({accountId : routeParams.id, resourceType : 'charges', chargeId : routeParams.chargeId}, function(data) {
              scope.formData.amount = data.amount;
              if (data.dueDate) var dueDate = dateFilter(data.dueDate, 'dd MMMM yyyy');
              scope.formData.dueDate = new Date(dueDate);
            });
            scope.title = 'label.saving.account.apply.annualFee';
            scope.labelName = 'label.saving.account.annualFeeTransactionDate';
            scope.modelName = 'dueDate';
            scope.showDateField = true;
            scope.showAnnualAmountField = true;
            scope.showAmountField = false;
            scope.showNoteField = false;
          break;
          case "close":
            scope.title = 'label.close.saving.account';
            scope.labelName = 'label.saving.account.closedOnDate';
            scope.modelName = 'closedOnDate';
            scope.showDateField = true;
            scope.showNoteField = true;
          break;
          case "modifytransaction":
            resourceFactory.savingsTrxnsResource.get({savingsId:scope.accountId, transactionId:routeParams.transactionId, template:'true'}, function(data){
              scope.paymentTypes=data.paymentTypeOptions;
              scope.formData.transactionAmount = data.amount;
              if (data.paymentDetailData) {
                if (data.paymentDetailData.paymentType) scope.formData.paymentTypeId = data.paymentDetailData.paymentType.id;
                scope.formData.accountNumber = data.paymentDetailData.accountNumber;
                scope.formData.checkNumber = data.paymentDetailData.checkNumber;
                scope.formData.routingCode = data.paymentDetailData.routingCode;
                scope.formData.receiptNumber = data.paymentDetailData.receiptNumber;
                scope.formData.bankNumber = data.paymentDetailData.bankNumber;
              }
            });
            scope.title = 'label.edit.saving.account.transaction';
            scope.labelName = 'label.saving.account.transactionDate';
            scope.modelName = 'transactionDate';
            scope.showDateField = true;
            scope.showNoteField = false;
            scope.isTransaction = true;
            scope.showPaymentDetails = false;
          break;
          case "editsavingcharge":
            resourceFactory.savingsResource.get({accountId : routeParams.id, resourceType : 'charges', chargeId : routeParams.chargeId}, function(data) {
              scope.formData.amount = data.amount;
              if (data.feeOnMonthDay) {
                scope.dateArray = [];
                scope.dateArray.push(2013)
                for (var i in data.feeOnMonthDay) {
                scope.dateArray.push(data.feeOnMonthDay[i]);
                }
                console.log(dateFilter(scope.dateArray, 'dd MMMM yyyy'));
                var feeOnMonthDay = dateFilter(scope.dateArray, 'dd MMMM yyyy');
                scope.formData.feeOnMonthDayFullDate = new Date(feeOnMonthDay);
                scope.labelName = 'label.saving.account.transactionDate';
                scope.modelName = 'feeOnMonthDayFullDate';
                scope.showDateField = true;
                scope.showAnnualAmountField = true;
                scope.showAmountField = false;
              } else {
                scope.labelName = 'label.amount';
                scope.modelName = 'amount';
                scope.showDateField = false;
                scope.showAnnualAmountField = false;
                scope.showAmountField = true;
              }
            });
          break;
          case "deletesavingcharge":
            scope.showDelete = true;
          break;
        }

        scope.submit = function() {
          var params = {command:scope.action};
          if (scope.action != "undoapproval") {
            this.formData.locale = 'en';
            this.formData.dateFormat = 'dd MMMM yyyy';
          }
          if (scope.action == "deposit" || scope.action == "withdrawal" || scope.action == "modifytransaction") {
            if(scope.action == "withdrawal") {
              if (this.formData.transactionDate) this.formData.transactionDate = dateFilter(this.formData.transactionDate,'dd MMMM yyyy');
            } else if(scope.action == "deposit") {
              if (this.formData.transactionDate) this.formData.transactionDate = dateFilter(this.formData.transactionDate,'dd MMMM yyyy');
            }
            if(scope.action == "modifytransaction") {
              params.command = 'modify';
              if (this.formData.transactionDate) this.formData.transactionDate = dateFilter(this.formData.transactionDate,'dd MMMM yyyy');
              params.transactionId = routeParams.transactionId;
            }
            params.savingsId = scope.accountId;
            resourceFactory.savingsTrxnsResource.save(params, this.formData, function(data){
              location.path('/viewsavingaccount/' + data.savingsId);
            });
          } else if(scope.action == "editsavingcharge") {
              if (this.formData.feeOnMonthDayFullDate) {
                this.formData.feeOnMonthDay = dateFilter(this.formData.feeOnMonthDayFullDate,'dd MMMM yyyy');
                this.formData.monthDayFormat = "dd MMM";
                this.formData.feeOnMonthDay = this.formData.feeOnMonthDay.substring(0, this.formData.feeOnMonthDay.length - 5);
                delete this.formData.feeOnMonthDayFullDate;
              }
              resourceFactory.savingsResource.update({accountId : routeParams.id, resourceType : 'charges', chargeId : routeParams.chargeId}, this.formData, function(data) {
                 location.path('/viewsavingaccount/' + data.savingsId);
              });
          }else if(scope.action == "deletesavingcharge") {
              resourceFactory.savingsResource.delete({accountId : routeParams.id, resourceType : 'charges', chargeId : routeParams.chargeId}, this.formData, function(data) {
                 location.path('/viewsavingaccount/' + data.savingsId);
              });
          } else {
              params.accountId=scope.accountId;
              if(scope.action == "approve") {
                if (this.formData.approvedOnDate) this.formData.approvedOnDate = dateFilter(this.formData.approvedOnDate,'dd MMMM yyyy');
              } else if(scope.action == "withdrawnByApplicant") {
                if (this.formData.withdrawnOnDate) this.formData.withdrawnOnDate = dateFilter(this.formData.withdrawnOnDate,'dd MMMM yyyy');
              }else if(scope.action == "reject") {
                if (this.formData.rejectedOnDate) this.formData.rejectedOnDate = dateFilter(this.formData.rejectedOnDate,'dd MMMM yyyy');
              } else if(scope.action == "activate"){
                if (this.formData.activatedOnDate) this.formData.activatedOnDate = dateFilter(this.formData.activatedOnDate,'dd MMMM yyyy');
              }else if(scope.action == "applyAnnualFees"){
                params = {accountId : routeParams.id, resourceType : 'charges', chargeId : routeParams.chargeId, command : 'paycharge'};
                if (this.formData.dueDate) this.formData.dueDate = dateFilter(this.formData.dueDate,'dd MMMM yyyy');
              }else if(scope.action == "close"){
                if (this.formData.closedOnDate) this.formData.closedOnDate = dateFilter(this.formData.closedOnDate,'dd MMMM yyyy');
              }

            resourceFactory.savingsResource.save(params, this.formData, function(data){
              location.path('/viewsavingaccount/' + data.savingsId);
            });
          }
        };
    }
  });
  mifosX.ng.application.controller('SavingAccountActionsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.SavingAccountActionsController]).run(function($log) {
    $log.info("SavingAccountActionsController initialized");
  });
}(mifosX.controllers || {}));
