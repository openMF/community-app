(function(module) {
  mifosX.controllers = _.extend(module, {
    LoanAccountActionsController: function(scope, resourceFactory, location, routeParams, dateFilter) {

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
            scope.formData[scope.modelName] = new Date();
          break;
          case "reject":
            scope.title = 'label.reject.loan.account';
            scope.labelName = 'label.loan.account.rejectedOnDate';
            scope.modelName = 'rejectedOnDate';
            scope.formData[scope.modelName] = new Date();
          break;
          case "withdrawnByApplicant":
            scope.title = 'label.withdraw.loan.account';
            scope.labelName = 'label.loan.account.withdrawnOnDate';
            scope.modelName = 'withdrawnOnDate';
            scope.formData[scope.modelName] = new Date();
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
            scope.modelName = 'actualDisbursementDate';
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'disburse'}, function(data){
              scope.paymentTypes=data.paymentTypeOptions;
              scope.formData[scope.modelName] = new Date();
            });
            scope.title = 'label.disburse.loan.account';
            scope.labelName = 'label.loan.account.disbursedOnDate';
            scope.isTransaction = true;
          break;
          case "repayment":
            scope.modelName = 'transactionDate';
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'repayment'}, function(data){
              scope.paymentTypes=data.paymentTypeOptions;
              scope.formData.paymentTypeId = data.paymentTypeOptions[0].id;
              scope.formData.transactionAmount = data.amount;
              scope.formData[scope.modelName] = new Date(data.date) || new Date();
            });
            scope.title = 'label.loan.repayments';
            scope.labelName = 'label.loan.account.transactionDate';
            scope.isTransaction = true;
            scope.showAmountField = true;
          break;
          case "waiveinterest":
            scope.modelName = 'transactionDate';
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'waiveinterest'}, function(data){
              scope.paymentTypes=data.paymentTypeOptions;
              scope.formData.transactionAmount = data.amount;
              scope.formData[scope.modelName] = new Date(data.date) || new Date();
            });
            scope.title = 'label.loan.waiveinterest';
            scope.labelName = 'label.loan.account.interestwaivedOn';
            scope.showAmountField = true;
          break;
          case "writeoff":
            scope.modelName = 'transactionDate';
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'writeoff'}, function(data){
              scope.formData[scope.modelName] = new Date(data.date) || new Date();
            });
            scope.title = 'label.writeoff.loan.account';
            scope.labelName = 'label.loan.account.writeoffOnDate';
          break;
          case "close-rescheduled":
            scope.modelName = 'transactionDate';
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'close-rescheduled'}, function(data){
              scope.formData[scope.modelName] = new Date(data.date) || new Date();
            });
            scope.title = 'label.close.loan.account.asrescheduled';
            scope.labelName = 'label.loan.account.closedOnDate';
          break;
          case "close":
            scope.modelName = 'transactionDate';
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'close'}, function(data){
              scope.formData[scope.modelName] = new Date(data.date) || new Date();
            });
            scope.title = 'label.close.loan.account';
            scope.labelName = 'label.loan.account.closedOnDate';
          break;
          case "unassignloanofficer":
            scope.title = 'label.unassignloanofficer';
            scope.labelName = 'label.loan.offiecer.unassigneddate';
            scope.modelName = 'unassignedDate';
            scope.showNoteField = false;
            scope.formData[scope.modelName] = new Date();
          break;
          case "modifytransaction":
          break;
          case "deleteloancharge":
            scope.showDelete = true;
            scope.showNoteField = false;
            scope.showDateField = false;
          break;
        }

        scope.cancel = function() {
          location.path('/viewloanaccount/' + routeParams.id);
        };

        scope.submit = function() {
          var params = {command:scope.action};
          if (this.formData[scope.modelName]) {
            this.formData[scope.modelName] = dateFilter(this.formData[scope.modelName],'dd MMMM yyyy');
          }
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
          } else if(scope.action == "deleteloancharge") {
              resourceFactory.LoanAccountResource.delete({loanId : routeParams.id, resourceType : 'charges', chargeId : routeParams.chargeId}, this.formData, function(data) {
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
  mifosX.ng.application.controller('LoanAccountActionsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.LoanAccountActionsController]).run(function($log) {
    $log.info("LoanAccountActionsController initialized");
  });
}(mifosX.controllers || {}));
