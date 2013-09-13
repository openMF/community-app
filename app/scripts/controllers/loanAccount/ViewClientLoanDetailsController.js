(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewClientLoanDetailsController: function(scope, routeParams, resourceFactory) {
      scope.$broadcast('ClientLoanAccountDataLoadingStartEvent');
      scope.loandocuments = [];

      resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.id, associations: 'all'}, function(data) {
          scope.clientloandetails = data;
          scope.$broadcast('ClientLoanAccountDataLoadingCompleteEvent');

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
                                 name:"button.close"
                              }]
                              
                            };
        }


      });

      resourceFactory.LoanDocumentResource.getLoanDocuments({loanId: routeParams.id}, function(data) {
          scope.loandocuments = data;
      });
    }
  });
  mifosX.ng.application.controller('ViewClientLoanDetailsController', ['$scope', '$routeParams', 'ResourceFactory', mifosX.controllers.ViewClientLoanDetailsController]).run(function($log) {
    $log.info("ViewClientLoanDetailsController initialized");
  });
}(mifosX.controllers || {}));
