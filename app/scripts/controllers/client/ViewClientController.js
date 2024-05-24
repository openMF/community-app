(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewClientController: function (scope, routeParams, route, location, resourceFactory, http, $uibModal, API_VERSION, $timeout, $rootScope, Upload) {
            scope.client = [];
            scope.identitydocuments = [];
            scope.buttons = [];
            scope.clientdocuments = [];
            scope.staffData = {};
            scope.formData = {};
            scope.openLoan = true;
            scope.openSaving = true;
            scope.openShares = true ;
            scope.openFixed = true;
            scope.openRecurring = true;
            scope.showFixed = false;
            scope.showRecurring = false;
            scope.updateDefaultSavings = false;
            scope.charges = [];
            scope.legalform = 'm_client';

            scope.collaterals = [];


            // address
            scope.addresses=[];
            scope.view={};
            scope.view.data=[];
           // scope.families=[];
            var entityname="ADDRESS";
            formdata={};


            resourceFactory.clientTemplateResource.get(function(data)
            {
                scope.enableAddress=data.isAddressEnabled;
                if(scope.enableAddress===true)
                {

                    resourceFactory.addressFieldConfiguration.get({entity:entityname},function(data){


                        for(var i=0;i<data.length;i++)
                        {
                            data[i].field='scope.view.'+data[i].field;
                            eval(data[i].field+"="+data[i].isEnabled);

                        }


                    })


                    resourceFactory.clientAddress.get({clientId:routeParams.id},function(data)
                    {

                        scope.addresses=data;


                    })


                }


               /* resourceFactory.getAllFamilyMembers.get({clientId:routeParams.id},function(data)
                {

                    scope.families=data;


                })*/

            });




            scope.routeTo=function()
            {
                location.path('/address/'+ routeParams.id);
            }

            scope.ChangeAddressStatus=function(id,status,addressId)
            {

                formdata.isActive=!status
                formdata.addressId=addressId
                resourceFactory.clientAddress.put({clientId:id},formdata,function(data)
                {
                    route.reload();
                })
            }

            scope.routeToEdit=function(clientId,addressId)
            {
                location.path('/editAddress/'+clientId+'/'+addressId+'/'+ routeParams.id);


            }

            // family members

            scope.families=[];

            resourceFactory.familyMembers.get({clientId:routeParams.id},function(data)
            {
                scope.families=data;

            });

            scope.deleteFamilyMember=function(clientFamilyMemberId)
            {

                resourceFactory.familyMember.delete({clientId:routeParams.id,clientFamilyMemberId:clientFamilyMemberId},function(data)
                {

                    route.reload();
                })

            }

            scope.viewCollaterals=function() {
                location.path('/clients/'+ routeParams.id +'/viewallclientcollaterals');
            }

            scope.editFamilyMember=function(clientFamilyMemberId)
            {

                location.path('/editfamilymember/'+routeParams.id+'/'+clientFamilyMemberId);


            }

            scope.routeToaddFamilyMember=function()
            {
                location.path('/addfamilymembers/'+ routeParams.id);
            }


            // end of family members



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
            };

            scope.routeToCollateral = function(id) {
                location.path('/viewclient/' + routeParams.id + '/viewclientcollateral/' + id);
            }

            scope.haveFile = [];
            resourceFactory.clientResource.get({clientId: routeParams.id}, function (data) {
                scope.client = data;
                scope.collaterals = scope.client.clientCollateralManagements;
                scope.collateralSize = scope.collaterals.length;
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
                            icon: "fa fa-arrow-up",
                            taskPermissionName: "DEPOSIT_SAVINGSACCOUNT"
                        },
                        {
                            name: "button.withdraw",
                            type: "100",
                            icon: "fa fa-arrow-down",
                            taskPermissionName: "WITHDRAW_SAVINGSACCOUNT"
                        },
                        {
                            name: "button.deposit",
                            type: "300",
                            icon: "fa fa-arrow-up",
                            taskPermissionName: "DEPOSIT_RECURRINGDEPOSITACCOUNT"
                        },
                        {
                            name: "button.withdraw",
                            type: "300",
                            icon: "fa fa-arrow-down",
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
                scope.entitySubType = data.legalForm.value;

                resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_client'}, function (data) {
                    scope.clientdatatables = data;
                });
            });


            scope.entitySubTypeFilter = function (datatable) {
                if (datatable.entitySubType.toLowerCase() === scope.entitySubType.toLowerCase()) {
                    return true;
                }
            }

            scope.deleteClient = function () {
                $uibModal.open({
                    templateUrl: 'deleteClient.html',
                    controller: ClientDeleteCtrl
                });
            };
            scope.uploadPic = function () {
                $uibModal.open({
                    templateUrl: 'uploadpic.html',
                    controller: UploadPicCtrl
                });
            };
            var UploadPicCtrl = function ($scope, $uibModalInstance) {
                $scope.upload = function (file) {
                    if (file) {
                        Upload.upload({
                            url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/images',
                            data: {},
                            file: file
                        }).then(function (imageData) {
                            // to fix IE not refreshing the model
                            $timeout(function () {
                                scope.$apply();
                            });
                            $uibModalInstance.close('upload');
                            route.reload();
                        });
                    }
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            scope.capturePic = function () {
                $uibModal.open({
                    templateUrl: 'capturepic.html',
                    controller: CapturePicCtrl,
                    windowClass: 'modalwidth700'
                });
            };
            var CapturePicCtrl = function ($scope, $uibModalInstance) {

                $scope.picture = null;
                $scope.error = null;
                $scope.videoChannel = {
                    video: null,
                    videoWidth: 320,
                    videoHeight: 240
                };
                $scope.stream = null;

                $scope.onVideoSuccess = function () {
                    $scope.error = null;
                };

                $scope.onStream = function(stream) {
                    $scope.stream = stream
                }

                $scope.onVideoError = function (err) {
                    if(typeof err != "undefined")
                        $scope.error = err.message + '(' + err.name + ')';
                };

                $scope.takeScreenshot = function () {
                    if($scope.videoChannel.video) {
                        var picCanvas = document.createElement('canvas');
                        var width = $scope.videoChannel.video.width;
                        var height = $scope.videoChannel.video.height;

                        picCanvas.width = width;
                        picCanvas.height = height;
                        var ctx = picCanvas.getContext("2d");
                        ctx.drawImage($scope.videoChannel.video, 0, 0, width, height);
                        var imageData = ctx.getImageData(0, 0, width, height);
                        document.querySelector('#clientSnapshot').getContext("2d").putImageData(imageData, 0, 0);
                        $scope.picture = picCanvas.toDataURL();
                    }
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
                            $scope.stream.getVideoTracks()[0].stop();
                            $uibModalInstance.close('upload');
                            route.reload();
                        });
                    }
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                    $scope.stream.getVideoTracks()[0].stop();
                };
                $scope.reset = function () {
                    $scope.picture = null;
                }
            };
            scope.deletePic = function () {
                $uibModal.open({
                    templateUrl: 'deletePic.html',
                    controller: DeletePicCtrl
                });
            };
            var DeletePicCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    http({
                        method: 'DELETE',
                        url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/images',
                    }).then(function (imageData) {
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                        $uibModalInstance.close('delete');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            scope.uploadSig = function () {
                $uibModal.open({
                    templateUrl: 'uploadsig.html',
                    controller: UploadSigCtrl
                });
            };
            var UploadSigCtrl = function ($scope, $uibModalInstance) {
                $scope.upload = function (file) {
                    if (file) {
                        Upload.upload({
                            url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents',
                            data: {
                                name: 'clientSignature',
                                description: 'client signature'
                            },
                            file: file
                        }).then(function (imageData) {
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                            $uibModalInstance.close('upload');
                            route.reload();
                        });
                    }
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            
            scope.deleteSig = function () {
                $uibModal.open({
                    templateUrl: 'deletesig.html',
                    controller: DeleteSigCtrl
                });
            };
            var DeleteSigCtrl = function ($scope, $uibModalInstance) {
                http({
                        method: 'GET',
                        url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents'
                    }).then(function (docsData) {
                        $scope.docId = -1;
                        for (var i = 0; i < docsData.data.length; ++i) {
                            if (docsData.data[i].name == 'clientSignature') {
                                $scope.docId = docsData.data[i].id;
                                scope.signature_url = $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents/' + docId + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                            }
                        }
                    });
                $scope.delete = function (file) {
                    http({
                        method: 'DELETE',
                        url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents/' + $scope.docId
                    }).then(function () {
                        if (!scope.$$phase) {
                                scope.$apply();
                            }
                            $uibModalInstance.close('upload');
                            route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.unassignStaffCenter = function () {
                $uibModal.open({
                    templateUrl: 'clientunassignstaff.html',
                    controller: ClientUnassignCtrl
                });
            };
            var ClientDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.clientResource.delete({clientId: routeParams.id}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/clients');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            var ClientUnassignCtrl = function ($scope, $uibModalInstance) {
                $scope.unassign = function () {
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'unassignstaff'}, scope.staffData, function (data) {
                        $uibModalInstance.close('unassign');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            resourceFactory.clientAccountResource.get({clientId: routeParams.id}, function (data) {
                scope.clientAccounts = data;
                if(data.loanAccounts){
                    for(var i in data.loanAccounts){
                        if(data.loanAccounts[i].status.value == "Active" && data.loanAccounts[i].inArrears){
                            scope.clientAccounts.loanAccounts[i].status.value = "Active in Bad Standing"
                        }
                    }
                }
                if (data.savingsAccounts) {
                    for (var i in data.savingsAccounts) {
                        if (data.savingsAccounts[i].status.value == "Active") {
                            scope.updateDefaultSavings = true;
                            break;
                        }
                    }
                    scope.totalAllSavingsAccountsBalanceBasedOnCurrency=[];
                    for (var i in data.savingsAccounts) {
                        if (!scope.isSavingClosed(data.savingsAccounts[i])) {
                            var isNewEntryMap = true;
                            for(var j in scope.totalAllSavingsAccountsBalanceBasedOnCurrency){
                                if(scope.totalAllSavingsAccountsBalanceBasedOnCurrency[j].code === data.savingsAccounts[i].currency.code){
                                    isNewEntryMap = false;
                                    var totalSavings = scope.totalAllSavingsAccountsBalanceBasedOnCurrency[j].totalSavings + data.savingsAccounts[i].accountBalance;
                                    scope.totalAllSavingsAccountsBalanceBasedOnCurrency[j].totalSavings = totalSavings;
                                }
                            }
                            if(isNewEntryMap){
                                var map = {};
                                map.code = data.savingsAccounts[i].currency.code;
                                map.totalSavings = data.savingsAccounts[i].accountBalance;
                                scope.totalAllSavingsAccountsBalanceBasedOnCurrency.push(map);
                            }
                        }
                    }
                }
                for(var i in data.savingsAccounts){
                    if(data.savingsAccounts[i].depositType.value == 'Recurring Deposit'){
                    scope.showRecurring = true;
                    }
                }
                for(var i in data.savingsAccounts){
                    if(data.savingsAccounts[i].depositType.value == 'Fixed Deposit'){
                    scope.showFixed = true;
                    }
                }


            });

            scope.isSavings = function (savingaccount) {
                if(savingaccount.depositType.value == 'Savings'){
                    return true;
                }
                else{
                    return false;
                }
            };
            scope.isFixed = function (savingaccount) {
                if(savingaccount.depositType.value == 'Fixed Deposit'){
                    return true;
                }
                else{
                    return false;
                }
            };
            scope.isRecurring = function(savingaccount) {
                if(savingaccount.depositType.value == 'Recurring Deposit'){
                    return true;
                }
                else{
                    return false;
                }
            };

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

            scope.setFixed = function () {
                if(scope.openFixed) {
                    scope.openFixed = false;
                } else {
                    scope.openFixed = true;
                }
            };

            scope.setRecurring = function () {
                if(scope.openRecurring) {
                    scope.openRecurring = false;
                }else {
                    scope.openRecurring = true;
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

            scope.dataTableChange = function (clientdatatable) {
                resourceFactory.DataTablesResource.getTableDetails({
                    datatablename: clientdatatable.registeredTableName,
                    entityId: routeParams.id, genericResultSet: 'true'
                }, function (data) {
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
                        if (data[l].fileName)
                            if (data[l].fileName.toLowerCase().indexOf('.jpg') != -1 || data[l].fileName.toLowerCase().indexOf('.jpeg') != -1 || data[l].fileName.toLowerCase().indexOf('.png') != -1)
                                data[l].fileIsImage = true;
                        if (data[l].type)
                             if (data[l].type.toLowerCase().indexOf('image') != -1)
                                data[l].fileIsImage = true;
                    }
                    scope.clientdocuments = data;
                });
            };

            scope.deleteDocument = function (documentId, index) {
                resourceFactory.clientDocumentsResource.delete({clientId: routeParams.id, documentId: documentId}, '', function (data) {
                    scope.clientdocuments.splice(index, 1);
                });
            };

            scope.previewDocument = function (url, fileName) {
                scope.preview =  true;
                scope.fileUrl = scope.hostUrl + url;
                if(fileName.toLowerCase().indexOf('.png') != -1)
                    scope.fileType = 'image/png';
                else if(fileName.toLowerCase().indexOf('.jpg') != -1)
                    scope.fileType = 'image/jpg';
                else if(fileName.toLowerCase().indexOf('.jpeg') != -1)
                    scope.fileType = 'image/jpeg';
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
                    scope.clientNotes.unshift(temp);
                    scope.formData.note = "";
                    scope.predicate = '-id';
                });
            }

            scope.showEditNote = function(clientId, clientNote, index) {
                $uibModal.open({
                    templateUrl: 'editNote.html',
                    controller: EditNoteCtrl,
                    resolve: {
                        items: function(){
                            return {
                                clientId: clientId,
                                clientNote: clientNote,
                                index: index
                            }
                        }
                    },
                    size: "lg"
                });
            }

            scope.showDeleteNote = function(clientId, clientNote, index) {
                $uibModal.open({
                    templateUrl: 'deleteNote.html',
                    controller: DeleteNoteCtrl,
                    resolve: {
                        items: function(){
                            return {
                                clientId: clientId,
                                clientNote: clientNote,
                                index: index
                            }
                        }
                    },
                    size: "lg"
                });
            }

            var EditNoteCtrl = function ($scope, $uibModalInstance, items) {
                scope.editData = {};
                editData = {};
                $scope.editNote = function (clientId, entityId, index, editData) {
                    resourceFactory.clientNotesResource.put({clientId: items.clientId, noteId: items.clientNote}, {note: this.editData.editNote}, function(data) {
                        scope.clientNotes[items.index].note = $scope.editData.editNote;
                        scope.editData.editNote = "";
                        $uibModalInstance.close();
                    });
                };
                $scope.cancel = function (index) {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            var DeleteNoteCtrl = function ($scope, $uibModalInstance, items) {
                $scope.deleteNote = function (clientId, entityId, index) {
                    resourceFactory.clientNotesResource.delete({clientId: items.clientId, noteId: items.clientNote}, '', function(data) {
                        $uibModalInstance.close();
                        scope.clientNotes.splice(items.index, 1);
                    });
                };
                $scope.cancel = function (index) {
                    $uibModalInstance.dismiss('cancel');
                };
            };

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
                $uibModal.open({
                    templateUrl: 'clientSignature.html',
                    controller: ViewLargerClientSignature,
                    size: "lg"
                });
            };

            scope.showWithoutSignature = function()
            {
                $uibModal.open({
                    templateUrl: 'clientWithoutSignature.html',
                    controller: ViewClientWithoutSignature,
                    size: "lg"
                });
            };

            scope.showPicture = function () {
                $uibModal.open({
                    templateUrl: 'photo-dialog.html',
                    controller: ViewLargerPicCtrl,
                    size: "lg"
                });
            };

            var ViewClientWithoutSignature = function($scope,$uibModalInstance){
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.uploadSig = function () {
                    $uibModalInstance.dismiss('cancel');
                    scope.uploadSig();
                };
            };

            var ViewLargerClientSignature = function($scope,$uibModalInstance){
                var loadSignature = function(){
                    http({
                        method: 'GET',
                        url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents'
                    }).then(function (docsData) {
                        $scope.docId = -1;
                        for (var i = 0; i < docsData.data.length; ++i) {
                            if (docsData.data[i].name == 'clientSignature') {
                                $scope.docId = docsData.data[i].id;
                                scope.signature_url = $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents/' + $scope.docId + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                            }
                        }
                        if (scope.signature_url != null) {
                            http({
                                method: 'GET',
                                url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents/' + $scope.docId + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier
                            }).then(function (docsData) {
                                $scope.largeImage = scope.signature_url;
                            });
                        }
                    });
                };
                loadSignature();
                $scope.deleteSig = function () {
                    $uibModalInstance.dismiss('cancel');
                    scope.deleteSig();
                };
                $scope.uploadSig = function () {
                    $uibModalInstance.dismiss('cancel');
                    scope.uploadSig();
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            var ViewLargerPicCtrl = function ($scope, $uibModalInstance) {
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
                    $uibModalInstance.dismiss('cancel');
                };
            };

            resourceFactory.creditBureauTemplate.get(function (data) {
                scope.creditbureaus = data;
                scope.creditbureauname = scope.creditbureaus.creditBureauName;

            });

            scope.getcreditreport = function(creditBureauId) {
                scope.creditbureau = creditBureauId;
               if (creditBureauId == 1) { //id 1 is assigned for ThitsaWorks CreditBureau
                    location.path('/creditreport/thitsaworkCreditbureau/'+scope.creditbureau);
                }
               else{
                   alert("Please Select Respective integrated Credit Bureau");
               }
            };

            scope.onFileSelect = function (files) {
                scope.formData.file = files[0];
            };

            scope.upload = function () {
                Upload.upload({
                    url: $rootScope.hostUrl + API_VERSION + '/creditBureauIntegration/addCreditReport?creditBureauId=1',
                    data: {file: scope.formData.file},
                }).then(function (data) {
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                });
            };

            scope.uploadReport = function (creditBureauId) {
                scope.creditbureau = creditBureauId;
                if (creditBureauId == 1) {
                    location.path('/creditreport/thitsaworkUploadCreditbureau/' + routeParams.id +'/'+ scope.creditbureau);
                }
            };

            scope.downloadCreditReport = function (creditBureauId) {
                scope.creditbureau = creditBureauId;
                if (creditBureauId == 1) { //id 1 is assigned for ThitsaWorks CreditBureau
                    location.path('/creditreport/thitsaworkDownloadCreditbureau/' + routeParams.id +'/'+ scope.creditbureau);
                }else{
                    alert("Please Select Respective integrated Credit Bureau");
                }
            };

        }
    });

    mifosX.ng.application.controller('ViewClientController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$http', '$uibModal', 'API_VERSION', '$timeout', '$rootScope', 'Upload', mifosX.controllers.ViewClientController]).run(function ($log) {
        $log.info("ViewClientController initialized");
    });
}(mifosX.controllers || {}));
