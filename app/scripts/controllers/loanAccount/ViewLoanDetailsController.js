(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewLoanDetailsController: function(scope, routeParams, resourceFactory, location) {
      scope.$broadcast('LoanAccountDataLoadingStartEvent');
      scope.loandocuments = [];

      scope.clickEvent = function(eventName, accountId) {
        eventName = eventName || "";
        switch (eventName) {
          case "addloancharge":
            location.path('/addloancharge/' + accountId);
          break;
          case "addcollateral":
            location.path('/addcollateral/' + accountId);
          break;
          case "assignloanofficer":
            location.path('/assignloanofficer/' + accountId);
          break;
          case "modifyapplication":
            location.path('/editloanaccount/' + accountId);
          break;
          case "approve":
            location.path('/loanaccount/' + accountId + '/approve');
          break;
          case "reject":
            location.path('/loanaccount/' + accountId + '/reject');
          break;
          case "withdrawnbyclient":
            location.path('/loanaccount/' + accountId + '/withdrawnByApplicant');
          break;
          case "delete":
            resourceFactory.LoanAccountResource.delete({loanId:accountId}, {}, function(data){
              var destination = '/viewgroup/' + data.groupId;
              if (data.clientId) destination = '/viewclient/' + data.clientId;
              location.path(destination);
            });
          break;
          case "undoapproval":
            location.path('/loanaccount/' + accountId + '/undoapproval');
          break;
          case "disburse":
            location.path('/loanaccount/' + accountId + '/disburse');
          break;
          case "undodisbursal":
            location.path('/loanaccount/' + accountId + '/undodisbursal');
          break;
          case "makerepayment":
            location.path('/loanaccount/' + accountId + '/repayment');
          break;
          case "waiveinterest":
            location.path('/loanaccount/' + accountId + '/waiveinterest');
          break;
          case "writeoff":
            location.path('/loanaccount/' + accountId + '/writeoff');
          break;
          case "close-rescheduled":
            location.path('/loanaccount/' + accountId + '/close-rescheduled');
          break;
          case "transferFunds":
            if (scope.loandetails.clientId) {
              location.path('/accounttransfers/fromloans/'+accountId);
            }
          break;
          case "close":
            location.path('/loanaccount/' + accountId + '/close');
          break;
        }
      };

      resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.id, associations: 'all'}, function(data) {
          scope.loandetails = data;

          scope.$broadcast('LoanAccountDataLoadingCompleteEvent');

          if (data.status.value == "Submitted and pending approval") {
            scope.buttons = { singlebuttons : [{
                                name:"button.addloancharge",
                                icon :"icon-plus-sign"
                              },
                              {
                                name:"button.addcollateral",
                                icon :"icon-link"
                              },
                              {
                                name:"button.assignloanofficer",
                                icon :"icon-user"
                              }
                            ],
                              options: [{
                                name:"button.modifyapplication",
                              },
                              {
                                name:"button.approve"
                              },
                              {
                                name:"button.reject"
                              },
                              {
                                name:"button.withdrawnbyclient"
                              },
                              {
                                name:"button.delete"
                              },
                              {
                                name:"button.guarantor"
                              }]
                              
                            };
        }

        if (data.status.value == "Approved") {
            scope.buttons = { singlebuttons : [{
                                name:"button.addloancharge",
                                icon :"icon-plus-sign"
                              },
                              {
                                name:"button.assignloanofficer",
                                icon :"icon-user"
                              },
                              {
                                name:"button.undoapproval",
                                icon :"icon-undo"
                              },
                            ],
                              options: [{
                                name:"button.disburse",
                              },
                              {
                               name:"button.guarantor"
                              }]
                              
                            };
        }

        if (data.status.value == "Active") {
            scope.buttons = { singlebuttons : [{
                                name:"button.addloancharge",
                                icon :"icon-plus-sign"
                              },
                              {
                                name:"button.assignloanofficer",
                                icon :"icon-user"
                              },
                              {
                                name:"button.undodisbursal",
                                icon :"icon-undo"
                              } 
                            ],
                              options: [{
                                name:"button.makerepayment",
                              },
                              {
                                name:"button.waiveinterest"
                              },
                              {
                                name:"button.writeoff"
                              },
                              {
                                name:"button.close-rescheduled"
                              },
                              {
                                 name:"button.close"
                              }]
                              
                            };
        }
        if (data.status.value == "Overpaid") {
            scope.buttons = { singlebuttons : [{
                                name:"button.transferFunds",
                                icon :"icon-exchange"
                              } 
                            ]                              
                            };
        }


      });

      resourceFactory.LoanDocumentResource.getLoanDocuments({loanId: routeParams.id}, function(data) {
          scope.loandocuments = data;
      });
    }
  });
  mifosX.ng.application.controller('ViewLoanDetailsController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.ViewLoanDetailsController]).run(function($log) {
    $log.info("ViewLoanDetailsController initialized");
  });
}(mifosX.controllers || {}));
