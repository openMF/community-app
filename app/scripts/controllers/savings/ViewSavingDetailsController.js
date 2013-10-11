(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewSavingDetailsController: function(scope, routeParams, resourceFactory, location, route) {
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
            location.path('/savingaccount/' + accountId + '/withdrawnByApplicant');
          break;
          case "delete":
            resourceFactory.savingsResource.delete({accountId:accountId}, {}, function(data){
              var destination = '/viewgroup/' + data.groupId;
              if (data.clientId) destination = '/viewclient/' + data.clientId;
              location.path(destination);
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
          case "addcharge":
            location.path('/savingaccounts/' + accountId + '/charges');
          break;
          case "calculateInterest":
            resourceFactory.savingsResource.save({accountId:accountId,command:'calculateInterest'}, {}, function(data){
              route.reload();
            });
          break;
          case "postInterest":
            resourceFactory.savingsResource.save({accountId:accountId,command:'postInterest'}, {}, function(data){
              route.reload();
            });
          break;
          case "applyAnnualFees":
            location.path('/savingaccount/' + accountId + '/applyAnnualFees');
          break;
          case "transferFunds":
            if (scope.savingaccountdetails.clientId) {
              location.path('/accounttransfers/fromsavings/'+accountId);
            }
          break;
          case "close":
            location.path('/savingaccount/' + accountId + '/close');
          break;
        }
      };

      resourceFactory.savingsResource.get({accountId: routeParams.id, associations: 'all'}, function(data) {
          scope.savingaccountdetails = data;
          if(scope.savingaccountdetails.charges) {
            scope.charges = scope.savingaccountdetails.charges;
            scope.chargeTableShow = true;
          } else {
            scope.chargeTableShow = false;
          }
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
                                 name:"button.addcharge"
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

      resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_savings_account'} , function(data) {
        scope.savingdatatables = data;
      });

      scope.dataTableChange = function(datatable) {
        resourceFactory.DataTablesResource.getTableDetails({datatablename: datatable.registeredTableName,
        entityId: routeParams.id, genericResultSet: 'true'} , function(data) {
          scope.datatabledetails = data;
          scope.datatabledetails.isData = data.data.length > 0 ? true : false;
          scope.datatabledetails.isMultirow = data.columnHeaders[0].columnName == "id" ? true : false;

          for(var i in data.columnHeaders) {
            if (scope.datatabledetails.columnHeaders[i].columnCode) {
              for (var j in scope.datatabledetails.columnHeaders[i].columnValues){
                for(var k in data.data) {
                  if (data.data[k].row[i] == scope.datatabledetails.columnHeaders[i].columnValues[j].id) {
                    data.data[k].row[i] = scope.datatabledetails.columnHeaders[i].columnValues[j].value;
                  }
                }
              }
            } 
          }

        });
      };

      scope.deleteAll = function (apptableName, entityId) {
        resourceFactory.DataTablesResource.delete({datatablename:apptableName, entityId:entityId, genericResultSet:'true'}, {}, function(data){
          route.reload();
        });
      };

      scope.modifyTransaction = function(accountId, transactionId) {
        location.path('/savingaccount/' + accountId + '/modifytransaction?transactionId=' + transactionId);
      };
    }
  });
  mifosX.ng.application.controller('ViewSavingDetailsController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$route', mifosX.controllers.ViewSavingDetailsController]).run(function($log) {
    $log.info("ViewSavingDetailsController initialized");
  });
}(mifosX.controllers || {}));
