(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewSavingDetailsController: function(scope, routeParams, resourceFactory) {
      scope.$broadcast('SavingAccountDataLoadingStartEvent');

      scope.isDebit = function (savingsTransactionType) {
        return savingsTransactionType.withdrawal == true || savingsTransactionType.feeDeduction == true;
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

    }
  });
  mifosX.ng.application.controller('ViewSavingDetailsController', ['$scope', '$routeParams', 'ResourceFactory', mifosX.controllers.ViewSavingDetailsController]).run(function($log) {
    $log.info("ViewSavingDetailsController initialized");
  });
}(mifosX.controllers || {}));
