(function(module) {
  mifosX.controllers = _.extend(module, {
    LoanAccountActionsController: function(scope, resourceFactory, location, routeParams, dateFilter) {

        scope.action = routeParams.action || "";
        scope.accountId = routeParams.id;
        scope.formData = {};
        scope.showDateField = true;
        scope.showNoteField = true;
        scope.showAmountField = false;
        scope.restrictDate = new Date();
        // Transaction UI Related
        scope.isTransaction = false;
        scope.showPaymentDetails =false;
        scope.paymentTypes = [];

        switch (scope.action) {
          case "approve":
            scope.title = 'label.heading.approveloanaccount';
            scope.labelName = 'label.input.approvedondate';
            scope.modelName = 'approvedOnDate';
            scope.formData[scope.modelName] = new Date();
          break;
          case "reject":
            scope.title = 'label.heading.rejectloanaccount';
            scope.labelName = 'label.input.rejectedondate';
            scope.modelName = 'rejectedOnDate';
            scope.formData[scope.modelName] = new Date();
          break;
          case "withdrawnByApplicant":
            scope.title = 'label.heading.withdrawloanaccount';
            scope.labelName = 'label.input.withdrawnondate';
            scope.modelName = 'withdrawnOnDate';
            scope.formData[scope.modelName] = new Date();
          break;
          case "undoapproval":
            scope.title = 'label.heading.undoapproveloanaccount';
            scope.showDateField = false;
          break;
          case "undodisbursal":
            scope.title = 'label.heading.undodisburseloanaccount';
            scope.showDateField = false;
          break;
          case "disburse":
            scope.modelName = 'actualDisbursementDate';
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'disburse'}, function(data){
              scope.paymentTypes=data.paymentTypeOptions;
              if (data.paymentTypeOptions.length > 0) {
                scope.formData.paymentTypeId = data.paymentTypeOptions[0].id;
              }
              scope.formData[scope.modelName] = new Date();
            });
            scope.title = 'label.heading.disburseloanaccount';
            scope.labelName = 'label.input.disbursedondate';
            scope.isTransaction = true;
          break;
          case "repayment":
            scope.modelName = 'transactionDate';
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'repayment'}, function(data){
              scope.paymentTypes=data.paymentTypeOptions;
              if (data.paymentTypeOptions.length > 0) {
                scope.formData.paymentTypeId = data.paymentTypeOptions[0].id;
              }
              scope.formData.transactionAmount = data.amount;
              scope.formData[scope.modelName] = new Date(data.date) || new Date();
            });
            scope.title = 'label.heading.loanrepayments';
            scope.labelName = 'label.input.transactiondate';
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
            scope.title = 'label.heading.loanwaiveinterest';
            scope.labelName = 'label.input.interestwaivedon';
            scope.showAmountField = true;
          break;
          case "writeoff":
            scope.modelName = 'transactionDate';
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'writeoff'}, function(data){
              scope.formData[scope.modelName] = new Date(data.date) || new Date();
            });
            scope.title = 'label.heading.writeoffloanaccount';
            scope.labelName = 'label.input.writeoffondate';
          break;
          case "close-rescheduled":
            scope.modelName = 'transactionDate';
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'close-rescheduled'}, function(data){
              scope.formData[scope.modelName] = new Date(data.date) || new Date();
            });
            scope.title = 'label.heading.closeloanaccountasrescheduled';
            scope.labelName = 'label.input.closedondate';
          break;
          case "close":
            scope.modelName = 'transactionDate';
            resourceFactory.loanTrxnsTemplateResource.get({loanId:scope.accountId, command:'close'}, function(data){
              scope.formData[scope.modelName] = new Date(data.date) || new Date();
            });
            scope.title = 'label.heading.closeloanaccount';
            scope.labelName = 'label.input.closedondate';
          break;
          case "unassignloanofficer":
            scope.title = 'label.heading.unassignloanofficer';
            scope.labelName = 'label.input.loanofficerunassigneddate';
            scope.modelName = 'unassignedDate';
            scope.showNoteField = false;
            scope.formData[scope.modelName] = new Date();
          break;
          case "modifytransaction":
            resourceFactory.loanTrxnsResource.get({loanId:scope.accountId, transactionId:routeParams.transactionId, template:'true'},
              function (data) {
              scope.title = 'label.heading.editloanaccounttransaction';
              scope.labelName = 'label.input.transactiondate';
              scope.modelName = 'transactionDate';
              scope.paymentTypes=data.paymentTypeOptions || [];
              scope.formData.transactionAmount = data.amount;
              scope.formData[scope.modelName] = new Date(data.date) || new Date();
              if (data.paymentDetailData) {
                if (data.paymentDetailData.paymentType) {
                    scope.formData.paymentTypeId = data.paymentDetailData.paymentType.id;
                }
                scope.formData.accountNumber = data.paymentDetailData.accountNumber;
                scope.formData.checkNumber = data.paymentDetailData.checkNumber;
                scope.formData.routingCode = data.paymentDetailData.routingCode;
                scope.formData.receiptNumber = data.paymentDetailData.receiptNumber;
                scope.formData.bankNumber = data.paymentDetailData.bankNumber;
              }
            });
            scope.showDateField = true;
            scope.showNoteField = false;
            scope.showAmountField = true;
            scope.isTransaction = true;
            scope.showPaymentDetails = false;
          break;
          case "deleteloancharge":
            scope.showDelete = true;
            scope.showNoteField = false;
            scope.showDateField = false;
          break;
          case "waivecharge":
              resourceFactory.LoanAccountResource.get({loanId : routeParams.id, resourceType : 'charges', chargeId : routeParams.chargeId}, function(data){
                  if (data.chargeTimeType.value !== "Specified due date" && data.installmentChargeData) {
                      scope.installmentCharges = data.installmentChargeData;
                      scope.formData.installmentNumber = data.installmentChargeData[0].installmentNumber;
                      scope.installmentchargeField = true;
                  } else {
                    scope.installmentchargeField = false;
                    scope.showwaiveforspecicficduedate = true;
                  }
              });
              
              scope.title = 'label.heading.waiveloancharge';
              scope.labelName = 'label.input.installment';
              scope.showNoteField = false;
              scope.showDateField = false;
          break;
          case "paycharge":
              resourceFactory.LoanAccountResource.get({loanId : routeParams.id, resourceType : 'charges', chargeId : routeParams.chargeId, command : 'pay'}, function(data){
                  if (data.dueDate) {
                      scope.formData.transactionDate = new Date(data.dueDate);
                  }
                  if (data.chargeTimeType.value === "Instalment Fee" && data.installmentChargeData) {
                      scope.installmentCharges = data.installmentChargeData;
                      scope.formData.installmentNumber = data.installmentChargeData[0].installmentNumber;
                      scope.installmentchargeField = true;
                  }
              });
              scope.title = 'label.heading.payloancharge';
              scope.showNoteField = false;
              scope.showDateField = false;
              scope.paymentDatefield = true;
          break;
          case "editcharge":
              resourceFactory.LoanAccountResource.get({loanId : routeParams.id, resourceType : 'charges', chargeId : routeParams.chargeId}, function(data){
                  if (data.amountOrPercentage) {
                      scope.showEditChargeAmount = true;
                      scope.formData.amount = data.amountOrPercentage;
                      if (data.dueDate) { 
                          scope.formData.dueDate = new Date(data.dueDate);
                          scope.showEditChargeDueDate = true;
                      }
                  }

              });
              scope.title = 'label.heading.editcharge';
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
            this.formData[scope.modelName] = dateFilter(this.formData[scope.modelName],scope.df);
          }
          if (scope.action != "undoapproval" && scope.action != "undodisbursal" || scope.action === "paycharge") {
            this.formData.locale = scope.optlang.code;
            this.formData.dateFormat = scope.df;
          }
          if (scope.action == "repayment" || scope.action == "waiveinterest" || scope.action == "writeoff" || scope.action == "close-rescheduled" || scope.action == "close"  || scope.action == "modifytransaction") {
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
          }else if (scope.action === "waivecharge") {
              resourceFactory.LoanAccountResource.save({loanId : routeParams.id, resourceType : 'charges', chargeId : routeParams.chargeId, 'command' :'waive'}, this.formData, function(data){
                  location.path('/viewloanaccount/' + data.loanId);
              });
          }else if (scope.action === "paycharge") {
              this.formData.transactionDate = dateFilter(this.formData.transactionDate,scope.df);
              resourceFactory.LoanAccountResource.save({loanId : routeParams.id, resourceType : 'charges', chargeId : routeParams.chargeId, 'command' :'pay'}, this.formData, function(data){
                  location.path('/viewloanaccount/' + data.loanId);
              });
          }else if (scope.action === "editcharge") {
              this.formData.dueDate = dateFilter(this.formData.dueDate,scope.df);
              resourceFactory.LoanAccountResource.update({loanId : routeParams.id, resourceType : 'charges', chargeId : routeParams.chargeId}, this.formData, function(data){
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
