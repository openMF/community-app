(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewLoanDetailsController: function(scope, routeParams, resourceFactory, location, route, http,$modal) {
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
          case "guarantor":
            location.path('/guarantor/' + accountId);
          break;
          case "unassignloanofficer":
            location.path('/loanaccount/' + accountId + '/unassignloanofficer');
          break;
        }
      };
      resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.id, associations: 'all'}, function(data) {
          scope.loandetails = data;
          scope.guarantorDetails = data.guarantors;
          scope.status = data.status.value;
          scope.chargeAction = data.status.value == "Submitted and pending approval" ? true : false;

          if(scope.loandetails.charges) {
            scope.charges = scope.loandetails.charges;
            scope.chargeTableShow = true;
          } else {
            scope.chargeTableShow = false;
          }
          
          scope.$broadcast('LoanAccountDataLoadingCompleteEvent');
          if(scope.status=="Submitted and pending approval" || scope.status=="Active" || scope.status=="Approved" ){
              scope.choice = true;
          }
              if (data.status.value == "Submitted and pending approval") {
            scope.buttons = { singlebuttons : [
                              {
                                name:"button.addloancharge",
                                icon :"icon-plus-sign"
                              },
                              {
                                name:"button.addcollateral",
                                icon :"icon-link"
                              },
                              {
                                name:"button.approve",
                                icon :"icon-ok"
                              },
                              {
                                name:"button.modifyapplication",
                                icon :"icon-edit"
                              },
                              {
                                name:"button.reject",
                                icon :"icon-remove"
                              }
                            ],
                              options: [
                              {
                                name:"button.assignloanofficer"
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
                                name:"button.disburse"
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
                                name:"button.makerepayment",
                                icon:"icon-dollar"
                              },
                              {
                                name:"button.undodisbursal",
                                icon :"icon-undo"
                              } 
                            ],
                              options: [
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
      scope.showDetails = function(id){
          resourceFactory.guarantorResource.get({loanId: routeParams.id,templateResource:id}, {}, function(data) {
              scope.guarantorData = data;
          });

      };
      scope.deleteGroup = function (id) {
          scope.guarantorId = id;
        $modal.open({
            templateUrl: 'deleteguarantor.html',
            controller: GuarantorDeleteCtrl,
            resolve: {
                id: function(){
                    return scope.guarantorId;
                }
            }
        });
      };
      var GuarantorDeleteCtrl = function ($scope, $modalInstance,id) {
        $scope.delete = function () {
            resourceFactory.guarantorResource.delete({loanId: routeParams.id,templateResource:id}, {}, function(data) {
                route.reload();
            });
            $modalInstance.close('delete');
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
      };
      scope.getLoanTemplateDocuments = function() {
        resourceFactory.templateResource.get({entityId : 1, typeId : 0}, function(data) {
          scope.loanTemplateData = data;
        })
      }

      scope.getLoanTemplate = function(templateId) {
        scope.selectedTemplate = templateId;
        http({
          method:'POST',
          url: 'https://demo.openmf.org/mifosng-provider/api/v1/templates/'+templateId+'?loanId='+routeParams.id,
          data: {}
        }).then(function(data) {
          scope.template = data.data;
        });
      }

      scope.getLoanDocuments = function (){
        resourceFactory.LoanDocumentResource.getLoanDocuments({loanId: routeParams.id}, function(data) {
            scope.loandocuments = data;
        });
      };

      resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_loan'} , function(data) {
        scope.loandatatables = data;
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

      scope.deleteDocument = function (documentId, index) {
        resourceFactory.LoanDocumentResource.delete({loanId: scope.loandetails.id, documentId: documentId}, '', function(data) {
          scope.loandocuments.splice(index,1);
        });
      };

      scope.downloadDocument = function(documentId) {

      };

    }
  });
  mifosX.ng.application.controller('ViewLoanDetailsController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$route', '$http','$modal', mifosX.controllers.ViewLoanDetailsController]).run(function($log) {
    $log.info("ViewLoanDetailsController initialized");
  });
}(mifosX.controllers || {}));
