(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewClientController: function(scope, routeParams , route, location, resourceFactory, http, $modal, API_VERSION,$rootScope,$upload) {
        scope.client = [];
        scope.identitydocuments = [];
        scope.buttons = [];
        scope.clientdocuments = [];
        scope.staffData = {};
        scope.openLoan = true;
        scope.openSaving = true;
        scope.routeToLoan = function(id){
          location.path('/viewloanaccount/' + id);
        };
        scope.routeToSaving = function(id){
            location.path('/viewsavingaccount/' + id);
        };
        scope.haveFile = [];
        resourceFactory.clientResource.get({clientId: routeParams.id} , function(data) {
            scope.client = data;
            scope.staffData.staffId = data.staffId;
            if (data.imagePresent) {
              http({
                method:'GET',
                url: $rootScope.hostUrl + API_VERSION + '/clients/'+routeParams.id+'/images'
              }).then(function(imageData) {
                scope.image = imageData.data;
              });
            }
            if (data.status.value == "Pending") {
              scope.buttons = [{
                                name:"label.button.edit",
                                href:"#/editclient",
                                icon :"icon-edit"
                              },
                              {
                                name:"label.button.activate",
                                href:"#/client",
                                subhref:"activate",
                                icon :"icon-ok-sign"
                              },
                              {
                                name:"label.button.close",
                                href:"#/client",
                                subhref:"close",
                                icon :"icon-remove-circle"
                              }]
                            
              }

            if (data.status.value == "Active") {
              scope.buttons = [{
                                name:"label.button.edit",
                                href:"#/editclient",
                                icon :"icon-edit"
                              },
                              {
                                name:"label.button.newloan",
                                href:"#/newclientloanaccount",
                                icon :"icon-plus"
                              },
                              {
                                name:"label.button.newsaving",
                                href:"#/new_client_saving_application",
                                icon :"icon-plus"
                              },
                              {
                                name:"label.button.transferclient",
                                href:"#/transferclient",
                                icon :"icon-arrow-right"
                              },
                              {
                                name:"label.button.close",
                                href:"#/client",
                                subhref:"close",
                                icon :"icon-remove-circle"
                              }]
            }

            if (data.status.value == "Transfer in progress") {
              scope.buttons = [{
                                name:"label.button.accepttransfer",
                                href:"#/client",
                                subhref:"acceptclienttransfer",
                                icon :"icon-check-sign"
                              },
                              {
                                name:"label.button.rejecttransfer",
                                href:"#/client",
                                subhref:"rejecttransfer",
                                icon :"icon-remove"
                              },
                              {
                                name:"label.button.undotransfer",
                                href:"#/client",
                                subhref:"undotransfer",
                                icon :"icon-undo"
                              }]
            }

            if (data.status.value == "Transfer on hold") {
              scope.buttons = [{
                                name:"label.button.undotransfer",
                                href:"#/client",
                                subhref:"undotransfer",
                                icon :"icon-undo"
                              }]
            }

            if (data.status.value == "Pending" || data.status.value == "Active"){
              if(data.staffId) {

              }
              else {
                scope.buttons.push({
                  name:"label.button.assignstaff",
                  href:"#/client",
                  subhref:"assignstaff",
                  icon :"icon-user"
                });
              }
            }

            scope.buttonsArray = {
              options: [{
                          name:"button.clientscreenreports"
                        }]
            };
            scope.buttonsArray.singlebuttons = scope.buttons;
          resourceFactory.runReportsResource.get({reportSource: 'ClientSummary',genericResultSet: 'false',R_clientId: routeParams.id} , function(data) {
            scope.client.ClientSummary = data[0];
          });
        });
        scope.deleteClient = function () {
            $modal.open({
                templateUrl: 'deleteClient.html',
                controller: ClientDeleteCtrl
            });
        };
        scope.uploadPic = function () {
            $modal.open({
                templateUrl: 'uploadpic.html',
                controller: UploadPicCtrl
            });
        };
        var UploadPicCtrl = function ($scope, $modalInstance) {
            $scope.onFileSelect = function($files) {
                scope.file = $files[0];
            };
            $scope.upload = function () {
                if (scope.file) {
                    $upload.upload({
                        url: $rootScope.hostUrl + API_VERSION + '/clients/'+routeParams.id+'/images',
                        data: {},
                        file: scope.file
                    }).then(function(imageData) {
                            // to fix IE not refreshing the model
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                            route.reload();
                        });
                }
                $modalInstance.close('upload');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
        scope.unassignStaffCenter = function () {
            $modal.open({
                templateUrl: 'clientunassignstaff.html',
                controller: ClientUnassignCtrl
            });
        };
        var ClientDeleteCtrl = function ($scope, $modalInstance) {
            $scope.delete = function () {
                resourceFactory.clientResource.delete({clientId: routeParams.id}, {}, function(data){
                    location.path('/clients');
                });
                $modalInstance.close('delete');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
        var ClientUnassignCtrl = function ($scope, $modalInstance) {
            $scope.unassign = function () {
                resourceFactory.clientResource.save({clientId: routeParams.id, command : 'unassignstaff'}, scope.staffData,function(data){
                    route.reload();
                });
                $modalInstance.close('unassign');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
        resourceFactory.clientAccountResource.get({clientId: routeParams.id} , function(data) {
            scope.clientAccounts = data;
        });
        scope.isClosed = function(loanaccount) {
            if(loanaccount.status.code === "loanStatusType.closed.written.off" ||
                loanaccount.status.code === "loanStatusType.closed.obligations.met" ||
                loanaccount.status.code === "loanStatusType.closed.reschedule.outstanding.amount" ||
                loanaccount.status.code === "loanStatusType.withdrawn.by.client" ||
                loanaccount.status.code === "loanStatusType.rejected") {
                return true;
            } else{
                return false;
            }
        };
        scope.isSavingClosed = function(savingaccount) {
            if (savingaccount.status.code === "savingsAccountStatusType.withdrawn.by.applicant" ||
                savingaccount.status.code === "savingsAccountStatusType.closed" ||
                savingaccount.status.code === "savingsAccountStatusType.rejected") {
                return true;
            } else{
                return false;
            }
        };
        scope.setLoan = function(){
            if(scope.openLoan){
                scope.openLoan = false
            }else{
                scope.openLoan = true;
            }
        };
        scope.setSaving = function(){
            if(scope.openSaving){
                scope.openSaving = false;
            }else{
                scope.openSaving = true;
            }
        };
        resourceFactory.clientNotesResource.getAllNotes({clientId: routeParams.id} , function(data) {
            scope.clientNotes = data;
        });
        scope.getClientIdentityDocuments = function () {
          resourceFactory.clientResource.getAllClientDocuments({clientId: routeParams.id, anotherresource: 'identifiers'} , function(data) {
              scope.identitydocuments = data;
              for(var i = 0; i<scope.identitydocuments.length; i++) {
                resourceFactory.clientIdentifierResource.get({clientIdentityId: scope.identitydocuments[i].id} , function(data) {
                  for(var j = 0; j<scope.identitydocuments.length; j++) {
                     if(data.length > 0 && scope.identitydocuments[j].id == data[0].parentEntityId)
                      {
                        for(var l in data){

                            var loandocs = {};
                            loandocs = API_VERSION + '/' + data[l].parentEntityType + '/' + data[l].parentEntityId + '/documents/' + data[l].id + '/attachment?tenantIdentifier=default';
                            data[l].docUrl = loandocs;
                        }
                          scope.identitydocuments[j].documents = data;
                      }
                  }
                });
              }
          });
        };

        resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_client'} , function(data) {
          scope.clientdatatables = data;
        });

        scope.dataTableChange = function(clientdatatable) {
          resourceFactory.DataTablesResource.getTableDetails({datatablename: clientdatatable.registeredTableName,
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
            }}

          });
        };
        scope.deleteAll = function (apptableName, entityId) {
          resourceFactory.DataTablesResource.delete({datatablename:apptableName, entityId:entityId, genericResultSet:'true'}, {}, function(data){
            route.reload();
          });
        };

        scope.getClientDocuments = function () {
          resourceFactory.clientDocumentsResource.getAllClientDocuments({clientId: routeParams.id} , function(data) {
              for(var l in data){

                  var loandocs = {};
                  loandocs = API_VERSION + '/' + data[l].parentEntityType + '/' + data[l].parentEntityId + '/documents/' + data[l].id + '/attachment?tenantIdentifier=default';
                  data[l].docUrl = loandocs;
              }
            scope.clientdocuments = data;
          });
        };

        scope.deleteDocument = function (documentId, index) {
          resourceFactory.clientDocumentsResource.delete({clientId: routeParams.id, documentId: documentId}, '', function(data) {
            scope.clientdocuments.splice(index,1);
          });
        };

        scope.downloadDocument = function(documentId) {
            resourceFactory.clientDocumentsResource.get({clientId: routeParams.id, documentId: documentId}, '', function(data) {
                scope.clientdocuments.splice(index,1);
            });
        };

        scope.isLoanNotClosed = function (loanaccount) {
          if(loanaccount.status.code === "loanStatusType.closed.written.off" || 
            loanaccount.status.code === "loanStatusType.closed.obligations.met" || 
            loanaccount.status.code === "loanStatusType.closed.reschedule.outstanding.amount" || 
            loanaccount.status.code === "loanStatusType.withdrawn.by.client" || 
            loanaccount.status.code === "loanStatusType.rejected") {
            return false;
          } else {
             return true;
          }
        };

        scope.isSavingNotClosed = function (savingaccount) {
          if (savingaccount.status.code === "savingsAccountStatusType.withdrawn.by.applicant" || 
            savingaccount.status.code === "savingsAccountStatusType.closed" ||
            savingaccount.status.code === "savingsAccountStatusType.rejected") {
            return false;
          } else {
             return true;
          }
        };

        scope.saveNote = function() {   
            resourceFactory.clientResource.save({clientId: routeParams.id, anotherresource: 'notes'}, this.formData , function(data){
            var today = new Date();
            temp = { id: data.resourceId , note : scope.formData.note , createdByUsername : "test" , createdOn : today } ;
            scope.clientNotes.push(temp);
            scope.formData.note = "";
            scope.predicate = '-id';
          });
        }

        scope.deleteClientIdentifierDocument = function (clientId, entityId, index){
          resourceFactory.clientIdenfierResource.delete({clientId: clientId, id: entityId}, '', function(data) {
            scope.identitydocuments.splice(index,1);
          });
        };

        scope.downloadClientIdentifierDocument=function (identifierId, documentId){
          console.log(identifierId,documentId);
        };
        // devcode: !production
		// *********************** InVenture controller ***********************

        scope.fetchInventureScore = function(){
          // dummy data for the graph - DEBUG purpose
          var inventureScore = getRandomInt(450,800);
          var natAverage = getRandomInt(450,800);
          var industryAverage = getRandomInt(450,800);
          var inventureMinScore = 300;
          var inventureMaxScore = 850;

          // dummy data for inventure loan recommendation - DEBUG purpose
          scope.inventureAgricultureLimit = '21,000';
          scope.inventureFishermenLimit = '27,500';
          scope.inventureHousingLimit = '385,000';
          scope.inventureBusinessLimit = '10,000';

          // this part is used to generate data to see the look of the graph
          function getRandomInt (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          }

          // CHART1 - comparison chart control
          var comparisonData = [
            {
              key: "Score Comparison",
                values: [
                  { 
                    "label" : "National Average",
                    "value" : (natAverage)
                  }, 
                  { 
                    "label" : "Agriculture Average", 
                    "value" : (industryAverage)
                  }, 
                  { 
                    "label" : "This Client", 
                    "value" : (inventureScore)
                  }
                ]
              }
            ];

          // add the comparison chart to the viewclient.html
          nv.addGraph(function() {
            var comparisonChart = nv.models.discreteBarChart()
              .x(function(d) { return d.label })
              .y(function(d) { return d.value })
              .staggerLabels(true)
              .tooltips(true)
              .showValues(true);
                
            // set all display value to integer
            comparisonChart.yAxis.tickFormat(d3.format('d'));
            comparisonChart.valueFormat(d3.format('d'));
            comparisonChart.forceY([inventureMinScore, inventureMaxScore]);

            d3.select('#inventureBarChart svg')
              .datum(comparisonData)
              .transition().duration(1500)
              .call(comparisonChart);

            nv.utils.windowResize(comparisonChart.update);
            return comparisonChart;
          });

          // CHART2 - inventure score bullet chart control
          nv.addGraph(function() {  
            var bullet = nv.models.bulletChart()
              .tooltips(false);

            d3.select('#inventureBulletChart svg')
              .datum(scoreData())
              .transition().duration(1500)
              .call(bullet);

            nv.utils.windowResize(bullet.update);
            return bullet;
          });

          function scoreData() {
            return {
              "title": "",
              "ranges": [(inventureMinScore - 300), (inventureMaxScore - 300)],
              "measures": [(inventureScore - 300)],
              "markers": [(inventureScore - 300)]};	
          }

          // this will be used to display the score on the viewclient.html
          scope.inventureScore = inventureScore;
        };    // endcode
    }
  });
  mifosX.ng.application.controller('ViewClientController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$http','$modal', 'API_VERSION','$rootScope','$upload', mifosX.controllers.ViewClientController]).run(function($log) {
    $log.info("ViewClientController initialized");
  });
}(mifosX.controllers || {}));
