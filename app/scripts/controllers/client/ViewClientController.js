(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewClientController: function (scope, routeParams, route, location, resourceFactory, http, $modal, API_VERSION, $rootScope, $upload) {
            scope.client = [];
            scope.identitydocuments = [];
            scope.buttons = [];
            scope.clientdocuments = [];
            scope.staffData = {};
            scope.formData = {};
            scope.openLoan = true;
            scope.openSaving = true;
            scope.openShares = true ;
            scope.updateDefaultSavings = false;
            scope.charges = [];

            // address
            scope.addresses=[];
            scope.view={};
            var entityname="client";
            scope.addressTypeId={};
            formdata={};


            scope.routeTo=function()
            {
                location.path('/address/'+ routeParams.id);
            }



            resourceFactory.addressFieldConfiguration.get({entity:entityname},function(data){
                scope.view.addresstypId=data[0].is_enabled;
                scope.view.street=data[1].is_enabled;
                scope.view.address_line_1=data[2].is_enabled;
                scope.view.address_line_2=data[3].is_enabled;
                scope.view.address_line_3=data[4].is_enabled;
                scope.view.town_village=data[5].is_enabled;
                scope.view.city=data[6].is_enabled;
                scope.view.county_district=data[7].is_enabled;
                scope.view.state_province=data[8].is_enabled;
                scope.view.country=data[9].is_enabled;
                scope.view.postal_code=data[10].is_enabled;
                scope.view.latitue=data[11].is_enabled;
                scope.view.longitude=data[12].is_enabled;
                scope.view.isActive=data[13].is_enabled;
            })

            // resourceFactory.clientAddress.get({clientId:scope.client.id},function(data)routeParams.id
            resourceFactory.clientAddress.get({clientId:routeParams.id},function(data)
            {

                scope.addresses=data;
                scope.addressTypeId=data[0].addressTypeId;


            })

            scope.ChangeAddressStatus=function(id,status,addtyp)
            {
                console.log("status received "+status)
                formdata.is_active=!status
                resourceFactory.clientAddress.put({clientId:id,type:addtyp,status:status},formdata,function(data)
                {
                    console.log("client id received: "+id)
                    route.reload();
                })
            }

            scope.routeToEdit=function(id)
            {
                location.path('/editAddress/'+id+'/'+ routeParams.id);

                console.log("address type"+scope.addressTypeId)
            }

            resourceFactory.configurationResource.get({id:29},function(data)
            {
                scope.enableAddress=data.enabled;
            });

            // end of address
            scope.routeToLoan = function (id) {
                location.path('/viewloanaccount/' + id);
            };
            scope.routeToChargeOverview = function () {
                location.path(scope.pathToChargeOverview());
            };

            scope.pathToChargeOverview =function (){
                return ('/viewclient/'+ scope.client.id + '/chargeoverview');
            }

            scope.routeToCharge = function (chargeId) {
                location.path('/viewclient/'+ scope.client.id + '/charges/' + chargeId);
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

            scope.routeToShareAccount = function(id) {
                location.path('/viewshareaccount/'+id)
            } ;

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

                scope.navigateToSavingsOrDepositAccount = function (eventName, accountId, savingProductType) {
                    switch(eventName) {

                        case "deposit":
                            if(savingProductType==100)
                                location.path('/savingaccount/' + accountId + '/deposit');
                            if(savingProductType==300)
                                location.path('/recurringdepositaccount/' + accountId + '/deposit');
                            break;
                        case "withdraw":
                            if(savingProductType==100)
                                location.path('/savingaccount/' + accountId + '/withdrawal');
                            if(savingProductType==300)
                                location.path('/recurringdepositaccount/' + accountId + '/withdrawal');
                            break;
                    }
                }


                var clientStatus = new mifosX.models.ClientStatus();

                if (clientStatus.statusKnown(data.status.value)) {
                    scope.buttons = clientStatus.getStatus(data.status.value);
                    scope.savingsActionbuttons = [
                            {
                                name: "button.deposit",
                                type: "100",
                                icon: "icon-arrow-right",
                                taskPermissionName: "DEPOSIT_SAVINGSACCOUNT"
                            },
                            {
                                name: "button.withdraw",
                                type: "100",
                                icon: "icon-arrow-left",
                                taskPermissionName: "WITHDRAW_SAVINGSACCOUNT"
                            },
                            {
                                name: "button.deposit",
                                type: "300",
                                icon: "icon-arrow-right",
                                taskPermissionName: "DEPOSIT_RECURRINGDEPOSITACCOUNT"
                            },
                            {
                                name: "button.withdraw",
                                type: "300",
                                icon: "icon-arrow-left",
                                taskPermissionName: "WITHDRAW_RECURRINGDEPOSITACCOUNT"
                            }
                        ];
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
            scope.capturePic = function () {
                $modal.open({
                    templateUrl: 'capturepic.html',
                    controller: CapturePicCtrl,
                    windowClass: 'modalwidth700'
                });
            };
            var CapturePicCtrl = function ($scope, $modalInstance) {

                $scope.video = null;
                $scope.picture = null;
                $scope.error = null;

                $scope.onVideoSuccess = function (video) {
                    $scope.video = video;
                    $scope.error = null;
                };

                $scope.onVideoError = function (err) {
                    if(typeof err != "undefined")
                        $scope.error = err.message + '(' + err.name + ')';
                };

                $scope.takeScreenshot = function () {
                    var picCanvas = document.createElement('canvas');
                    var width = $scope.video.width;
                    var height = $scope.video.height;

                    picCanvas.width = width;
                    picCanvas.height = height;
                    var ctx = picCanvas.getContext("2d");
                    ctx.drawImage($scope.video, 0, 0, width, height);
                    var imageData = ctx.getImageData(0, 0, width, height);
                    document.querySelector('#clientSnapshot').getContext("2d").putImageData(imageData, 0, 0);
                    $scope.picture = picCanvas.toDataURL();
                };
                $scope.uploadscreenshot = function () {
                    if($scope.picture != null) {
                        http({
                            method: 'POST',
                            url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/images',
                            data: $scope.picture
                        }).then(function (imageData) {
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
                $scope.reset = function () {
                    $scope.picture = null;
                }
            };
            scope.deletePic = function () {
                $modal.open({
                    templateUrl: 'deletePic.html',
                    controller: DeletePicCtrl
                });
            };
            var DeletePicCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    http({
                        method: 'DELETE',
                        url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/images',
                    }).then(function (imageData) {
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                        $modalInstance.close('delete');
                        route.reload();
                    });
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
                            file: scope.file,
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
            resourceFactory.clientAccountResource.get({clientId: routeParams.id}, function (data) {
                scope.clientAccounts = data;
                if (data.savingsAccounts) {
                    for (var i in data.savingsAccounts) {
                        if (data.savingsAccounts[i].status.value == "Active") {
                            scope.updateDefaultSavings = true;
                            break;
                        }
                    }
                }
            });

            resourceFactory.clientChargesResource.getCharges({clientId: routeParams.id, pendingPayment:true}, function (data) {
                scope.charges = data.pageItems;
            });

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

            scope.isShareClosed = function (shareAccount) {
                if ( shareAccount.status.code === "shareAccountStatusType.closed" ||
                    shareAccount.status.code === "shareAccountStatusType.rejected") {
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

            scope.setShares = function () {
                if (scope.openShares) {
                    scope.openShares = false;
                } else {
                    scope.openShares = true;
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

            scope.isShareNotClosed = function (shareAccount) {
                if ( shareAccount.status.code === "shareAccountStatusType.closed" ||
                    shareAccount.status.code === "shareAccountStatusType.rejected") {
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

            scope.waiveCharge = function(chargeId){
                resourceFactory.clientChargesResource.waive({clientId: routeParams.id, resourceType:chargeId}, function (data) {
                    route.reload();
                });
            }

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

    mifosX.ng.application.controller('ViewClientController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$http', '$modal', 'API_VERSION', '$rootScope', '$upload', mifosX.controllers.ViewClientController]).run(function ($log) {
        $log.info("ViewClientController initialized");
    });
}(mifosX.controllers || {}));
