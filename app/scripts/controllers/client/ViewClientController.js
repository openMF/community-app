(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewClientController: function(scope, routeParams , route, location, resourceFactory) {
        scope.client = [];
        scope.identitydocuments = [];
        scope.buttons = [];

        resourceFactory.clientResource.get({clientId: routeParams.id} , function(data) {
            scope.client = data;
            if (data.status.value == "Pending") {
              scope.buttons = [{
                                name:"button.edit",
                                href:"#/editclient",
                                icon :"icon-edit"
                              },
                              {
                                name:"button.activate",
                                href:"#/client",
                                subhref:"activate",
                                icon :"icon-ok-sign"
                              },
                              {
                                name:"button.delete",
                                icon :"icon-warning-sign"
                              },
                              {
                                name:"button.close",
                                icon :"icon-remove-circle"
                              }]
                            
              }

            if (data.status.value == "Active") {
              scope.buttons = [{
                                name:"button.edit",
                                href:"#/editclient",
                                icon :"icon-edit"
                              },
                              {
                                name:"button.newloan",
                                href:"#/newclientloanaccount",
                                icon :"icon-plus"
                              },
                              {
                                name:"link.new.savings.application",
                                href:"#/new_client_saving_application",
                                icon :"icon-plus"
                              },
                              {
                                name:"button.transferclient",
                                href:"#/transferclient",
                                icon :"icon-arrow-right"
                              },
                              {
                                name:"button.close",
                                icon :"icon-remove-circle"
                              }]
            }

            if(data.staffId) {
              scope.buttons.push({
                name:"button.unassignstaff",
                href:"#/client",
                subhref:"unassignstaff",
                icon :"icon-user"
              });
            } else {
              scope.buttons.push({
                name:"button.assignstaff",
                href:"#/client",
                subhref:"assignstaff",
                icon :"icon-user"
              });
            }

          resourceFactory.runReportsResource.get({reportSource: 'ClientSummary',genericResultSet: 'false',R_clientId: routeParams.id} , function(data) {
            scope.client.ClientSummary = data[0];
          });
        });

        resourceFactory.clientAccountResource.get({clientId: routeParams.id} , function(data) {
            scope.clientAccounts = data;

        });

        resourceFactory.clientNotesResource.getAllNotes({clientId: routeParams.id} , function(data) {
            scope.clientNotes = data;
        });

        resourceFactory.clientResource.getAllClientDocuments({clientId: routeParams.id, anotherresource: 'identifiers'} , function(data) {
            scope.identitydocuments = data;
            for(var i = 0; i<scope.identitydocuments.length; i++) {
              resourceFactory.clientIdentifierResource.get({clientIdentityId: scope.identitydocuments[i].id} , function(data) {
                for(var j = 0; j<scope.identitydocuments.length; j++) {
                   if(data.length > 0 && scope.identitydocuments[j].id == data[0].parentEntityId)
                    {
                      scope.identitydocuments[j].documents = data;
                    }
                }
              });
            }
        });

        resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_client'} , function(data) {
          scope.clientdatatables = data;
        });

        scope.dataTableChange = function(clientdatatable) {
          resourceFactory.DataTablesResource.getTableDetails({datatablename: clientdatatable.registeredTableName,
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

        scope.isNotClosed = function(loanaccount) {
          if(loanaccount.status.code === "loanStatusType.closed.written.off" || 
            loanaccount.status.code === "loanStatusType.rejected") {
            return false;
          } else{
             return true;
          }
           
        };

        scope.isClosed = function(loanaccount) {
          if(loanaccount.status.code === "loanStatusType.closed.written.off" || 
            loanaccount.status.code === "loanStatusType.rejected") {
            return true;
          } else{
             return false;
          }
        };


        scope.saveNote = function() {   
            resourceFactory.clientResource.save({clientId: routeParams.id, anotherresource: 'notes'}, this.formData , function(data){
            //further we have to make changes of this.
            temp = { id: data.resourceId , note : scope.formData.note , createdByUsername : "test" , createdOn : "1380183750700" } ;
            scope.clientNotes.push(temp);
            scope.formData.note = "";
            scope.predicate = '-id';
          });
        }
    }
  });
  mifosX.ng.application.controller('ViewClientController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewClientController]).run(function($log) {
    $log.info("ViewClientController initialized");
  });
}(mifosX.controllers || {}));
