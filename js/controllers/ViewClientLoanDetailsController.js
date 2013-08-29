(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewClientLoanDetailsController: function(scope, routeParams, resourceFactory) {
      scope.$broadcast('ClientLoanAccountDataLoadingStartEvent');
      scope.loandocuments = [];
      scope.buttons1 = [1,2];

      resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.id, associations: 'all'}, function(data) {
          scope.clientloandetails = data;
          scope.$broadcast('ClientLoanAccountDataLoadingCompleteEvent');

          if (data.status.value == "Submitted and pending approval") {
             scope.buttons = [
                              {tooltip : "tooltip.addloancharge" , icon :"icon-plus-sign" , action : "editloan"} ,
                              {tooltip : "tooltip.addcollateral" , icon :"icon-link" , action : "editloan"} ,
                              {tooltip : "tooltip.assignloanofficer" , icon :"icon-user" , action : "editloan"} ,
                              {tooltip : "tooltip.modifyapplication" , icon :"icon-edit" , action : "editloan"} ,
                              {tooltip : "tooltip.approve" , icon :"icon-thumbs-up" , action : "editloan"}, 
                              {tooltip : "tooltip.reject" , icon :"icon-thumbs-down" , action : "editloan"},
                              {tooltip : "tooltip.withdrawnbyclient" , icon :"icon-mail-reply" , action : "editloan"},
                              {tooltip : "tooltip.delete" , icon :"icon-trash" , action : "editloan"},
                              {tooltip : "tooltip.guarantor" , icon :"icon-female" , action : "editloan"} 
                          ];
          } if (data.status.value == "Approved") {
              scope.buttons = [
                              {tooltip : "tooltip.addloancharge" , icon :"icon-plus-sign" , action : "editloan"} ,
                              {tooltip : "tooltip.assignloanofficer" , icon :"icon-user" , action : "editloan"} ,
                              {tooltip : "tooltip.undoapproval" , icon :"icon-undo" , action : "editloan"} ,
                              {tooltip : "tooltip.disburse" , icon :"icon-thumbs-up" , action : "editloan"} ,
                              {tooltip : "tooltip.guarantor" , icon :"icon-female" , action : "editloan"} 
            ];
          } else if (data.status.value == "Active") {
            scope.buttons = [
                              {tooltip : "tooltip.addloancharge" , icon :"icon-plus-sign" , action : "editloan"} ,
                              {tooltip : "tooltip.assignloanofficer" , icon :"icon-user" , action : "editloan"} ,
                              {tooltip : "tooltip.undodisbursal" , icon :"icon-undo " , action : "editloan"} ,
                              {tooltip : "tooltip.makerepayment" , icon :"icon-play" , action : "editloan"} ,
                              {tooltip : "tooltip.waiveinterest" , icon :"icon-minus-sign" , action : "editloan"} ,
                              {tooltip : "tooltip.writeoff" , icon :"icon-off" , action : "editloan"} ,
                              {tooltip : "tooltip.close" , icon :"icon-warning-sign" , action : "editloan"} ,
            ];
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
