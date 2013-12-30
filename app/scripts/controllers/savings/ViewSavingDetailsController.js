(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewSavingDetailsController: function(scope, routeParams, resourceFactory, location, route,dateFilter) {
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
            location.path('/savingaccountcharge/' + accountId + '/applyAnnualFees/' + scope.annualChargeId);
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
          scope.status = data.status.value;
          if(scope.status=="Submitted and pending approval" || scope.status=="Active" || scope.status=="Approved" ){
              scope.choice = true;
          }
          scope.chargeAction = data.status.value == "Submitted and pending approval" ? true : false;
          if(scope.savingaccountdetails.charges) {
            scope.charges = scope.savingaccountdetails.charges;
            scope.chargeTableShow = true;
          } else {
            scope.chargeTableShow = false;
          }
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
                                  name:"button.addcharge"
                              },
                              {
                                 name:"button.close"
                              }]
                              
                            };
            if (data.clientId) {
                scope.buttons.options.push({
                    name:"button.transferFunds"
                });
            }
          if(data.charges) {
            for (var i in scope.charges) {
              if(scope.charges[i].name == "Annual fee - INR") {
                scope.buttons.options.push({
                                name:"button.applyAnnualFees"
                              });
                scope.annualChargeId = scope.charges[i].id;
              }
            }
          }
        }
          var annualdueDate = [];
          annualdueDate = data.annualFee.feeOnMonthDay;
          annualdueDate.push(2013);
          scope.annualdueDate = new Date(annualdueDate);
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
          scope.singleRow = [];
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
            if(scope.datatabledetails.isData){
                for(var i in data.columnHeaders){
                    if(!scope.datatabledetails.isMultirow){
                        var row = {};
                        row.key = data.columnHeaders[i].columnName;
                        row.value = data.data[0].row[i];
                        scope.singleRow.push(row);
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
  mifosX.ng.application.controller('ViewSavingDetailsController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$route','dateFilter', mifosX.controllers.ViewSavingDetailsController]).run(function($log) {
    $log.info("ViewSavingDetailsController initialized");
  });
}(mifosX.controllers || {}));
