(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientPaymentsController: function (scope, routeParams, route, location, resourceFactory, http, $modal, API_VERSION, $rootScope, $upload) {
            scope.client = [];
            scope.identitydocuments = [];
            scope.buttons = [];
            scope.clientdocuments = [];
            scope.staffData = {};
            scope.formData = {};
            scope.openLoan = true;
            scope.openSaving = true;
            scope.updateDefaultSavings = false;
            scope.showPaymentDetails = true;
            scope.isTransaction = true;
            scope.paymentTypes = [];
            scope.restrictDate = new Date();
            scope.formData.submittedOnDate = new Date();
            scope.formData.totalAmount = 0;

            scope.routeToLoan = function (id) {
                location.path('/viewloanaccount/' + id);
            };
            scope.routeToSaving = function (id, depositTypeCode) {
                if (depositTypeCode === "depositAccountType.savingsDeposit") {
                    location.path('/viewsavingaccount/' + id);
                } else if (depositTypeCode === "depositAccountType.fixedDeposit") {
                    location.path('/viewfixeddepositaccount/' + id);
                } else if (depositTypeCode === "depositAccountType.recurringDeposit") {
                    location.path('/viewrecurringdepositaccount/' + id);
                }
            };
            scope.haveFile = [];
            resourceFactory.clientResource.get({clientId: routeParams.id}, function (data) {
                scope.client = data;
                scope.isClosedClient = scope.client.status.value == 'Closed';
                scope.staffData.staffId = data.staffId;
                if (data.imagePresent) {
                    http({
                        method: 'GET',
                        url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/images?maxHeight=150'
                    }).then(function (imageData) {
                        scope.image = imageData.data;
                    });

                }
                http({
                    method: 'GET',
                    url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents'
                }).then(function (docsData) {
                    var docId = -1;
                    for (var i = 0; i < docsData.data.length; ++i) {
                        if (docsData.data[i].name == 'clientSignature') {
                            docId = docsData.data[i].id;
                            scope.signature_url = $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents/' + docId + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                        }
                    }
                });


                var clientStatus = new mifosX.models.ClientStatus();

                if (clientStatus.statusKnown(data.status.value)) {
                    scope.buttons = clientStatus.getStatus(data.status.value);
                }

                if (data.status.value == "Pending" || data.status.value == "Active") {
                    if (data.staffId) {

                    }
                    else {
                        scope.buttons.push(clientStatus.getStatus("Assign Staff"));
                    }
                }

                scope.buttonsArray = {
                    options: [
                        {
                            name: "button.clientscreenreports"
                        }
                    ]
                };
                scope.buttonsArray.singlebuttons = scope.buttons;
                resourceFactory.runReportsResource.get({reportSource: 'ClientSummary', genericResultSet: 'false', R_clientId: routeParams.id}, function (data) {
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
                $scope.onFileSelect = function ($files) {
                    scope.file = $files[0];
                };
                $scope.upload = function () {
                    if (scope.file) {
                        $upload.upload({
                            url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/images',
                            data: {},
                            file: scope.file
                        }).then(function (imageData) {
                            // to fix IE not refreshing the model
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                            $modalInstance.close('upload');
                            route.reload();
                        });
                    }
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            scope.uploadSig = function () {
                $modal.open({
                    templateUrl: 'uploadsig.html',
                    controller: UploadSigCtrl
                });
            };
            var UploadSigCtrl = function ($scope, $modalInstance) {
                $scope.onFileSelect = function ($files) {
                    scope.file = $files[0];
                };
                $scope.upload = function () {
                    if (scope.file) {
                        $upload.upload({
                            url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents',
                            data: {
                                name: 'clientSignature',
                                description: 'client signature'
                            },
                            file: scope.file
                        }).then(function (imageData) {
                            // to fix IE not refreshing the model
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                            $modalInstance.close('upload');
                            route.reload();
                        });
                    }
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
                    resourceFactory.clientResource.delete({clientId: routeParams.id}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/clients');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            var ClientUnassignCtrl = function ($scope, $modalInstance) {
                $scope.unassign = function () {
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'unassignstaff'}, scope.staffData, function (data) {
                        $modalInstance.close('unassign');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            resourceFactory.clientAccountResource.get({clientId: routeParams.id, command: 'loanrepaymentamount'}, function (data) {
                scope.clientAccounts = data;
                if(data.paymentTypeOptions != null){
                    scope.paymentTypes = data.paymentTypeOptions;
                    scope.formData.paymentTypeId = data.paymentTypeOptions[0].id;
                }
                if (data.loanAccounts) {
                    scope.loanAccounts = data.loanAccounts || [];
                    for(var i in scope.loanAccounts){
                        scope.loanAccounts[i].relativeUrl = "loans/"+scope.loanAccounts[i].id+"/repayment?command=repayment";
                        scope.loanAccounts[i].repaymentAmount = scope.loanAccounts[i].loanrepaymentamount;
                        scope.formData.totalAmount = scope.formData.totalAmount + scope.loanAccounts[i].loanrepaymentamount;
                    }
                }
                if (data.savingsAccounts) {
                    scope.savingsAccounts = data.savingsAccounts || [];
                    for (var i in data.savingsAccounts) {
                        scope.savingsAccounts[i].relativeUrl = "savingsaccounts/"+scope.savingsAccounts[i].id+"/transactions?command=deposit";
                        scope.savingsAccounts[i].depositAmount = "";
                    }
                }
                if (data.savingsAccounts) {
                    for (var i in data.savingsAccounts) {
                        if (data.savingsAccounts[i].status.value == "Active") {
                            scope.updateDefaultSavings = true;
                            break;
                        }
                    }
                }
            });

            scope.keyPress = function(){
                scope.formData.totalAmount = 0;
                for(var l in scope.loanAccounts) {
                    if (scope.loanAccounts[l].active) {
                        if (scope.loanAccounts[l].repaymentAmount != null && scope.loanAccounts[l].repaymentAmount != "") {
                            scope.formData.totalAmount = scope.formData.totalAmount + scope.loanAccounts[l].repaymentAmount;
                        }
                    }
                }
                for(var l in scope.savingsAccounts) {
                    if (scope.savingsAccounts[l].active) {
                        if (scope.savingsAccounts[l].depositAmount != null && scope.savingsAccounts[l].depositAmount != "") {
                            scope.formData.totalAmount = scope.formData.totalAmount + scope.savingsAccounts[l].depositAmount;
                        }
                    }
                }
            };

            scope.submitPayments = function(){
                var requests = [];
                var d = scope.formData.submittedOnDate;
                var today =formatDate(d);
                var submitProcess = false;
                var requestId = 1;
                var req = 0;
                //Header Requests
                var headers = [{name: "Content-type", value: "application/json"}];
                for(var l in scope.loanAccounts) {
                    if (scope.loanAccounts[l].active) {
                        if (scope.loanAccounts[l].repaymentAmount != null && scope.loanAccounts[l].repaymentAmount != "") {
                            submitProcess = true;
                            var request = {};
                            request.requestId = requestId;
                            request.relativeUrl = "loans/" + scope.loanAccounts[l].id + "/repayment?command=repayment";
                            request.method = "POST";
                            request.headers = headers;
                            var bodyJson = "{";
                            bodyJson += "\"transactionAmount\":\"" + scope.loanAccounts[l].repaymentAmount + "\"";
                            bodyJson += ",\"transactionDate\":\"" + today + "\"";
                            bodyJson += ",\"paymentTypeId\":\"" + scope.formData.paymentTypeId + "\"";
                            bodyJson += ",\"receiptNumber\":\"" + scope.formData.receiptNumber + "\"";
                            bodyJson += ",\"accountNumber\":\"" + scope.formData.accountNumber + "\"";
                            bodyJson += ",\"checkNumber\":\"" + scope.formData.checkNumber + "\"";
                            bodyJson += ",\"routingCode\":\"" + scope.formData.routingCode + "\"";
                            bodyJson += ",\"bankNumber\":\"" + scope.formData.bankNumber + "\"";
                            bodyJson += ",\"locale\":\"en\"";
                            bodyJson += ",\"dateFormat\":\"dd MMMM yyyy\"";
                            bodyJson += "}";
                            request.body = bodyJson;

                            requests[req++] = request;
                            requestId++
                        }
                    }
                }
                for(var s in scope.savingsAccounts) {
                    if (scope.savingsAccounts[s].active) {
                        if (scope.savingsAccounts[s].depositAmount != null && scope.savingsAccounts[s].depositAmount != "") {
                            submitProcess = true;
                            var request = {};
                            request.requestId = requestId;
                            request.relativeUrl = "savingsaccounts/" + scope.savingsAccounts[s].id + "/transactions?command=deposit";
                            request.method = "POST";
                            request.headers = headers;
                            var bodyJson = "{";
                            bodyJson += "\"transactionAmount\":\"" + scope.savingsAccounts[s].depositAmount + "\"";
                            bodyJson += ",\"transactionDate\":\"" + today + "\"";
                            bodyJson += ",\"paymentTypeId\":\"" + scope.formData.paymentTypeId + "\"";
                            bodyJson += ",\"receiptNumber\":\"" + scope.formData.receiptNumber + "\"";
                            bodyJson += ",\"accountNumber\":\"" + scope.formData.accountNumber + "\"";
                            bodyJson += ",\"checkNumber\":\"" + scope.formData.checkNumber + "\"";
                            bodyJson += ",\"routingCode\":\"" + scope.formData.routingCode + "\"";
                            bodyJson += ",\"bankNumber\":\"" + scope.formData.bankNumber + "\"";
                            bodyJson += ",\"locale\":\"en\"";
                            bodyJson += ",\"dateFormat\":\"dd MMMM yyyy\"";
                            bodyJson += "}";
                            request.body = bodyJson;

                            requests[req++] = request;
                            requestId++
                        }
                    }
                }
                if(submitProcess){
                    resourceFactory.batchResource.post(requests, function (data) {
                        location.path('/viewclient/' + routeParams.id);
                    });
                }else{
                    alert("Please enter amount");
                }
            };

            var m_names = new Array("January", "February", "March",
                "April", "May", "June", "July", "August", "September",
                "October", "November", "December");

            function formatDate(d) {
                var month = d.getMonth();
                var day = d.getDate();
                day = day + "";
                if (day.length == 1){
                    day = "0" + day;
                }
                return day + ' ' + m_names[month] + ' ' + d.getFullYear();
            };

            scope.isClosed = function (loanaccount) {
                if (loanaccount.status.code === "loanStatusType.closed.written.off" ||
                    loanaccount.status.code === "loanStatusType.closed.obligations.met" ||
                    loanaccount.status.code === "loanStatusType.closed.reschedule.outstanding.amount" ||
                    loanaccount.status.code === "loanStatusType.withdrawn.by.client" ||
                    loanaccount.status.code === "loanStatusType.rejected") {
                    return true;
                } else {
                    return false;
                }
            };
            scope.isSavingClosed = function (savingaccount) {
                if (savingaccount.status.code === "savingsAccountStatusType.withdrawn.by.applicant" ||
                    savingaccount.status.code === "savingsAccountStatusType.closed" ||
                    savingaccount.status.code === "savingsAccountStatusType.pre.mature.closure" ||
                    savingaccount.status.code === "savingsAccountStatusType.rejected") {
                    return true;
                } else {
                    return false;
                }
            };
            scope.setLoan = function () {
                if (scope.openLoan) {
                    scope.openLoan = false
                } else {
                    scope.openLoan = true;
                }
            };
            scope.setSaving = function () {
                if (scope.openSaving) {
                    scope.openSaving = false;
                } else {
                    scope.openSaving = true;
                }
            };
            resourceFactory.clientNotesResource.getAllNotes({clientId: routeParams.id}, function (data) {
                scope.clientNotes = data;
            });
            scope.getClientIdentityDocuments = function () {
                resourceFactory.clientResource.getAllClientDocuments({clientId: routeParams.id, anotherresource: 'identifiers'}, function (data) {
                    scope.identitydocuments = data;
                    for (var i = 0; i < scope.identitydocuments.length; i++) {
                        resourceFactory.clientIdentifierResource.get({clientIdentityId: scope.identitydocuments[i].id}, function (data) {
                            for (var j = 0; j < scope.identitydocuments.length; j++) {
                                if (data.length > 0 && scope.identitydocuments[j].id == data[0].parentEntityId) {
                                    for (var l in data) {

                                        var loandocs = {};
                                        loandocs = API_VERSION + '/' + data[l].parentEntityType + '/' + data[l].parentEntityId + '/documents/' + data[l].id + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                                        data[l].docUrl = loandocs;
                                    }
                                    scope.identitydocuments[j].documents = data;
                                }
                            }
                        });
                    }
                });
            };

            resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_client'}, function (data) {
                scope.clientdatatables = data;
            });

            scope.dataTableChange = function (clientdatatable) {
                resourceFactory.DataTablesResource.getTableDetails({datatablename: clientdatatable.registeredTableName,
                    entityId: routeParams.id, genericResultSet: 'true'}, function (data) {
                    scope.datatabledetails = data;
                    scope.datatabledetails.isData = data.data.length > 0 ? true : false;
                    scope.datatabledetails.isMultirow = data.columnHeaders[0].columnName == "id" ? true : false;
                    scope.showDataTableAddButton = !scope.datatabledetails.isData || scope.datatabledetails.isMultirow;
                    scope.showDataTableEditButton = scope.datatabledetails.isData && !scope.datatabledetails.isMultirow;
                    scope.singleRow = [];
                    for (var i in data.columnHeaders) {
                        if (scope.datatabledetails.columnHeaders[i].columnCode) {
                            for (var j in scope.datatabledetails.columnHeaders[i].columnValues) {
                                for (var k in data.data) {
                                    if (data.data[k].row[i] == scope.datatabledetails.columnHeaders[i].columnValues[j].id) {
                                        data.data[k].row[i] = scope.datatabledetails.columnHeaders[i].columnValues[j].value;
                                    }
                                }
                            }
                        }
                    }
                    if (scope.datatabledetails.isData) {
                        for (var i in data.columnHeaders) {
                            if (!scope.datatabledetails.isMultirow) {
                                var row = {};
                                row.key = data.columnHeaders[i].columnName;
                                row.value = data.data[0].row[i];
                                scope.singleRow.push(row);
                            }
                        }
                    }
                });
            };

            scope.cancel = function(){
                location.path('/viewclient/' + scope.client.id);
            };

            scope.viewstandinginstruction = function () {
                location.path('/liststandinginstructions/' + scope.client.officeId + '/' + scope.client.id);
            };
            scope.createstandinginstruction = function () {
                location.path('/createstandinginstruction/' + scope.client.officeId + '/' + scope.client.id + '/fromsavings');
            };
            scope.deleteAll = function (apptableName, entityId) {
                resourceFactory.DataTablesResource.delete({datatablename: apptableName, entityId: entityId, genericResultSet: 'true'}, {}, function (data) {
                    route.reload();
                });
            };

            scope.getClientDocuments = function () {
                resourceFactory.clientDocumentsResource.getAllClientDocuments({clientId: routeParams.id}, function (data) {
                    for (var l in data) {

                        var loandocs = {};
                        loandocs = API_VERSION + '/' + data[l].parentEntityType + '/' + data[l].parentEntityId + '/documents/' + data[l].id + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                        data[l].docUrl = loandocs;
                    }
                    scope.clientdocuments = data;
                });
            };

            scope.deleteDocument = function (documentId, index) {
                resourceFactory.clientDocumentsResource.delete({clientId: routeParams.id, documentId: documentId}, '', function (data) {
                    scope.clientdocuments.splice(index, 1);
                });
            };

            scope.viewDataTable = function (registeredTableName, data) {
                if (scope.datatabledetails.isMultirow) {
                    location.path("/viewdatatableentry/" + registeredTableName + "/" + scope.client.id + "/" + data.row[0]);
                } else {
                    location.path("/viewsingledatatableentry/" + registeredTableName + "/" + scope.client.id);
                }
            };

            scope.downloadDocument = function (documentId) {
                resourceFactory.clientDocumentsResource.get({clientId: routeParams.id, documentId: documentId}, '', function (data) {
                    scope.clientdocuments.splice(index, 1);
                });
            };

            scope.isLoanNotClosed = function (loanaccount) {
                if (loanaccount.status.code === "loanStatusType.closed.written.off" ||
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
                    savingaccount.status.code === "savingsAccountStatusType.pre.mature.closure" ||
                    savingaccount.status.code === "savingsAccountStatusType.rejected") {
                    return false;
                } else {
                    return true;
                }
            };

            scope.saveNote = function () {
                resourceFactory.clientResource.save({clientId: routeParams.id, anotherresource: 'notes'}, this.formData, function (data) {
                    var today = new Date();
                    temp = { id: data.resourceId, note: scope.formData.note, createdByUsername: "test", createdOn: today };
                    scope.clientNotes.push(temp);
                    scope.formData.note = "";
                    scope.predicate = '-id';
                });
            }

            scope.deleteClientIdentifierDocument = function (clientId, entityId, index) {
                resourceFactory.clientIdenfierResource.delete({clientId: clientId, id: entityId}, '', function (data) {
                    scope.identitydocuments.splice(index, 1);
                });
            };

            scope.downloadClientIdentifierDocument = function (identifierId, documentId) {
                console.log(identifierId, documentId);
            };
            // devcode: !production
            // *********************** InVenture controller ***********************

            scope.fetchInventureScore = function () {
                // dummy data for the graph - DEBUG purpose
                var inventureScore = getRandomInt(450, 800);
                var natAverage = getRandomInt(450, 800);
                var industryAverage = getRandomInt(450, 800);
                var inventureMinScore = 300;
                var inventureMaxScore = 850;

                // dummy data for inventure loan recommendation - DEBUG purpose
                scope.inventureAgricultureLimit = '21,000';
                scope.inventureFishermenLimit = '27,500';
                scope.inventureHousingLimit = '385,000';
                scope.inventureBusinessLimit = '10,000';

                // this part is used to generate data to see the look of the graph
                function getRandomInt(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }

                // CHART1 - comparison chart control
                var comparisonData = [
                    {
                        key: "Score Comparison",
                        values: [
                            {
                                "label": "National Average",
                                "value": (natAverage)
                            },
                            {
                                "label": "Agriculture Average",
                                "value": (industryAverage)
                            },
                            {
                                "label": "This Client",
                                "value": (inventureScore)
                            }
                        ]
                    }
                ];

                // add the comparison chart to the viewclient.html
                nv.addGraph(function () {
                    var comparisonChart = nv.models.discreteBarChart()
                        .x(function (d) {
                            return d.label
                        })
                        .y(function (d) {
                            return d.value
                        })
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
                nv.addGraph(function () {
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
            };

            scope.showSignature = function()
            {
                $modal.open({
                    templateUrl: 'clientSignature.html',
                    controller: ViewLargerClientSignature,
                    size: "lg"
                });
            };

            scope.showWithoutSignature = function()
            {
                $modal.open({
                    templateUrl: 'clientWithoutSignature.html',
                    controller: ViewClientWithoutSignature,
                    size: "lg"
                });
            };

            scope.showPicture = function () {
                $modal.open({
                    templateUrl: 'photo-dialog.html',
                    controller: ViewLargerPicCtrl,
                    size: "lg"
                });
            };

            var ViewClientWithoutSignature = function($scope,$modalInstance){
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            var ViewLargerClientSignature = function($scope,$modalInstance){
                var loadSignature = function(){
                    http({
                        method: 'GET',
                        url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents'
                    }).then(function (docsData) {
                        var docId = -1;
                        for (var i = 0; i < docsData.data.length; ++i) {
                            if (docsData.data[i].name == 'clientSignature') {
                                docId = docsData.data[i].id;
                                scope.signature_url = $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents/' + docId + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                            }
                        }
                        if (scope.signature_url != null) {
                            http({
                                method: 'GET',
                                url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents/' + docId + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier
                            }).then(function (docsData) {
                                $scope.largeImage = scope.signature_url;
                            });
                        }
                    });
                };
                loadSignature();
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            var ViewLargerPicCtrl = function ($scope, $modalInstance) {
                var loadImage = function () {
                    if (scope.client.imagePresent) {
                        http({
                            method: 'GET',
                            url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/images?maxWidth=860'
                        }).then(function (imageData) {
                            $scope.largeImage = imageData.data;
                        });
                    }
                };
                loadImage();
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        }
    });

    mifosX.ng.application.controller('ClientPaymentsController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$http', '$modal', 'API_VERSION', '$rootScope', '$upload', mifosX.controllers.ClientPaymentsController]).run(function ($log) {
        $log.info("ClientPaymentsController initialized");
    });
}(mifosX.controllers || {}));