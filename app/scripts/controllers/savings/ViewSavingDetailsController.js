(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewSavingDetailsController: function(scope, routeParams, resourceFactory, location) {
      scope.$broadcast('SavingAccountDataLoadingStartEvent');

      scope.isDebit = function (savingsTransactionType) {
        return savingsTransactionType.withdrawal == true || savingsTransactionType.feeDeduction == true;
      };

      scope.clickEvent = function(eventName, accountId) {
        eventName = eventName || "";
        switch (eventName) {
          case "modifyapplication":
            location.path('/editsavingaccount/' + accountId);
          break;
          case "approve":
            location.path('/savingaccount/' + accountId + '/approve');
          break;
          case "reject":
            location.path('/savingaccount/' + accountId + '/reject');
          break;
          case "withdrawnbyclient":
            location.path('/savingaccount/' + accountId + '/withdrawnbyclient');
          break;
          case "delete":
            resourceFactory.savingsResource.delete({accountId:accountId}, {}, function(data){
              location.path('/viewclient/' + data.clientId);
            });
          break;
          case "undoapproval":
            location.path('/savingaccount/' + accountId + '/undoapproval');
          break;
          case "activate":
            location.path('/savingaccount/' + accountId + '/activate');
          break;
          case "deposit":
            location.path('/savingaccount/' + accountId + '/deposit');
          break;
          case "withdraw":
            location.path('/savingaccount/' + accountId + '/withdrawal');
          break;
          case "calculateInterest":
            resourceFactory.savingsResource.save({accountId:accountId,command:'calculateInterest'}, {}, function(data){
              resourceFactory.savingsResource.get({accountId: data.savingsId, associations: 'all'}, function(savingAccountData) {
                scope.savingaccountdetails = savingAccountData;
              });
            });
          break;
          case "postInterest":
            resourceFactory.savingsResource.save({accountId:accountId,command:'postInterest'}, {}, function(data){
              resourceFactory.savingsResource.get({accountId: data.savingsId, associations: 'all'}, function(savingAccountData) {
                scope.savingaccountdetails = savingAccountData;
              });
            });
          break;
          case "applyAnnualFees":
            location.path('/savingaccount/' + accountId + '/applyAnnualFees');
          break;
          case "transferFunds":
          break;
          case "close":
            location.path('/savingaccount/' + accountId + '/close');
          break;
        }
      };

      resourceFactory.savingsResource.get({accountId: routeParams.id, associations: 'all'}, function(data) {
          scope.savingaccountdetails = data;
          scope.$broadcast('SavingAccountDataLoadingCompleteEvent');

          if (data.status.value == "Submitted and pending approval") {
            scope.buttons = { singlebuttons : [{
                                name:"button.modifyapplication",
                                icon :"icon-pencil "
                              },
                              {
                                name:"button.approve",
                                icon :"icon-ok-sign"
                              }],
                              options: [{
                                name:"button.reject"
                              },
                              {
                                 name:"button.withdrawnbyclient"
                               },
                               {
                                 name:"button.delete"
                               }]
                            };
        }

        if (data.status.value == "Approved") {
            scope.buttons = { singlebuttons : [{
                                name:"button.undoapproval",
                                icon :"icon-undo"
                              },
                              {
                              	name:"button.activate",
                                icon :"icon-ok-sign"
                              }
                            ] 
                            };
        }

        if (data.status.value == "Active") {
            scope.buttons = { singlebuttons : [{
                                name:"button.deposit",
                                icon :"icon-arrow-right"
                              },
                              {
                                name:"button.withdraw",
                                icon :"icon-arrow-left"
                              },
                              {
                                name:"button.calculateInterest",
                                icon :"icon-table"
                              } 
                            ],
                              options: [{
                                name:"button.postInterest"
                              },
                              {
                                name:"button.applyAnnualFees"
                              },
                              {
                                name:"button.transferFunds"
                              },
                              {
                                 name:"button.close"
                              }]
                              
                            };
        }
      });

      scope.modifyTransaction = function(accountId, transactionId) {
        location.path('/savingaccount/' + accountId + '/modifytransaction?transactionId=' + transactionId);
      };

      scope.undoTransaction = function(accountId, transactionId) {
        var params = {savingsId:accountId, transactionId:transactionId, command:'undo'};
        var formData = {dateFormat:'dd MMMM yyyy', locale:'en', transactionAmount:0};
        // FIX-ME: need to be update the date dynamically when datepicker available.
        formData.transactionDate = '18 September 2013';
        resourceFactory.savingsTrxnsResource.save(params, formData, function(data){
          resourceFactory.savingsResource.get({accountId: data.savingsId, associations: 'all'}, function(savingAccountData) {
            scope.savingaccountdetails = savingAccountData;
          });
        });
      };

    }
  });
  mifosX.ng.application.controller('ViewSavingDetailsController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.ViewSavingDetailsController]).run(function($log) {
    $log.info("ViewSavingDetailsController initialized");
  });
}(mifosX.controllers || {}));
