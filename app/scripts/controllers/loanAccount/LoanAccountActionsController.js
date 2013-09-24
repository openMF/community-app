(function(module) {
  mifosX.controllers = _.extend(module, {
    LoanAccountActionsController: function(scope, resourceFactory, location, routeParams) {

        scope.action = routeParams.action || "";
        scope.accountId = routeParams.id;
        scope.formData = {};
        scope.showDateField = true;
        scope.showNoteField = true;
        scope.showAmountField = false;

        // Transaction UI Related
        scope.isTransaction = false;
        scope.showPaymentDetails =false;
        scope.paymentTypes = [];

        switch (scope.action) {
          case "approve":
            scope.title = 'label.approve.loan.account';
            scope.labelName = 'label.loan.account.approvedOnDate';
            scope.modelName = 'approvedOnDate';
          break;
          case "reject":
            scope.title = 'label.reject.loan.account';
            scope.labelName = 'label.loan.account.rejectedOnDate';
            scope.modelName = 'rejectedOnDate';
          break;
          case "withdrawnByApplicant":
            scope.title = 'label.withdraw.loan.account';
            scope.labelName = 'label.loan.account.withdrawnOnDate';
            scope.modelName = 'withdrawnOnDate';
          break;
          case "undoapproval":
            scope.title = 'label.undoapprove.loan.account';
            scope.showDateField = false;
          break;
          case "undodisbursal":
            scope.title = 'label.undodisburse.loan.account';
            scope.showDateField = false;
          break;
          case "disburse":
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'disburse'}, function(data){
              scope.paymentTypes=data.paymentTypeOptions;
            });
            scope.title = 'label.disburse.loan.account';
            scope.labelName = 'label.loan.account.disbursedOnDate';
            scope.modelName = 'actualDisbursementDate';
            scope.isTransaction = true;
          break;
          case "repayment":
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'repayment'}, function(data){
              scope.paymentTypes=data.paymentTypeOptions;
              scope.formData.transactionAmount = data.amount;
            });
            scope.title = 'label.loan.repayments';
            scope.labelName = 'label.loan.account.transactionDate';
            scope.modelName = 'transactionDate';
            scope.isTransaction = true;
            scope.showAmountField = true;
          break;
          case "waiveinterest":
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'waiveinterest'}, function(data){
              scope.paymentTypes=data.paymentTypeOptions;
              scope.formData.transactionAmount = data.amount;
            });
            scope.title = 'label.loan.waiveinterest';
            scope.labelName = 'label.loan.account.interestwaivedOn';
            scope.modelName = 'transactionDate';
            scope.showAmountField = true;
          break;
          case "writeoff":
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'writeoff'}, function(data){
              scope.writeoffOnDate=data.date;
            });
            scope.title = 'label.writeoff.loan.account';
            scope.labelName = 'label.loan.account.writeoffOnDate';
            scope.modelName = 'transactionDate';
          break;
          case "close-rescheduled":
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'close-rescheduled'}, function(data){
              scope.closedOnDate=data.date;
            });
            scope.title = 'label.close.loan.account.asrescheduled';
            scope.labelName = 'label.loan.account.closedOnDate';
            scope.modelName = 'transactionDate';
          break;
          case "close":
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'close'}, function(data){
              scope.closedOnDate=data.date;
            });
            scope.title = 'label.close.loan.account';
            scope.labelName = 'label.loan.account.closedOnDate';
            scope.modelName = 'transactionDate';
          break;
          case "modifytransaction":
          break;
        }

        scope.submit = function() {
          var params = {command:scope.action};
          if (scope.action != "undoapproval" && scope.action != "undodisbursal") {
            this.formData.locale = 'en';
            this.formData.dateFormat = 'dd MMMM yyyy';
          }
          if (scope.action == "repayment" || scope.action == "waiveinterest" || scope.action == "writeoff" || scope.action == "close-rescheduled" || scope.action == "close") {
            if(scope.action == "modifytransaction") {
              params.command = 'modify';
              params.transactionId = routeParams.transactionId;
            }
            params.loanId = scope.accountId;
            resourceFactory.loanTrxnsResource.save(params, this.formData, function(data){
              location.path('/viewloanaccount/' + data.loanId);
            });
          } else {
            params.loanId=scope.accountId;
            resourceFactory.LoanAccountResource.save(params, this.formData, function(data){
              location.path('/viewloanaccount/' + data.loanId);
            });
          }
        };
    }
  });
  mifosX.ng.application.controller('LoanAccountActionsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.LoanAccountActionsController]).run(function($log) {
    $log.info("LoanAccountActionsController initialized");
  });
}(mifosX.controllers || {}));
