(function(module) {
  mifosX.controllers = _.extend(module, {
    SavingAccountActionsController: function(scope, resourceFactory, location, routeParams) {

        scope.action = routeParams.action || "";
        scope.accountId = routeParams.id;
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
            scope.title = 'label.saving.account.apply.annualFee';
            scope.labelName = 'label.saving.account.annualFeeTransactionDate';
            scope.modelName = 'annualFeeTransactionDate';
            scope.showDateField = true;
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
        }

        scope.submit = function() {
          var params = {command:scope.action};
          if (scope.action != "undoapproval") {
            this.formData.locale = 'en';
            this.formData.dateFormat = 'dd MMMM yyyy';
          }
          if (scope.action == "deposit" || scope.action == "withdrawal" || scope.action == "modifytransaction") {
            if(scope.action == "modifytransaction") {
              params.command = 'modify';
              params.transactionId = routeParams.transactionId;
            }
            params.savingsId = scope.accountId;
            resourceFactory.savingsTrxnsResource.save(params, this.formData, function(data){
              location.path('/viewsavingaccount/' + data.savingsId);
            });
          } else {
            params.accountId=scope.accountId;
            resourceFactory.savingsResource.save(params, this.formData, function(data){
              location.path('/viewsavingaccount/' + data.savingsId);
            });
          }
        };
    }
  });
  mifosX.ng.application.controller('SavingAccountActionsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.SavingAccountActionsController]).run(function($log) {
    $log.info("SavingAccountActionsController initialized");
  });
}(mifosX.controllers || {}));
