(function (module) {
    mifosX.controllers = _.extend(module, {
        NewJLGLoanAccAppController: function (scope, rootScope, routeParams, resourceFactory, location, dateFilter) {

            scope.previewRepayment = {};
            scope.previewRepayment.clients = [];
            scope.showForm = false;
            scope.groupId = routeParams.groupId;
            scope.removed = [];
            scope.added = [];
            scope.formData = {};
            scope.formData.clients= [];
            scope.batchRequests = [];
            scope.restrictDate = new Date();
            scope.chargeFormData = {}; //For charges
            scope.chargeFormData.clients = [];
            scope.repaymentscheduleinfo = {};
            scope.repaymentscheduleinfo.clients = [];            
            scope.staffInSelectedOfficeOnly = true;
            scope.requestIdentifier = "clientId";
            //scope.collateralFormData = {}; //For collaterals
            scope.inparams = { resourceType: 'template', templateType: 'jlgbulk', lendingStrategy: 300 };

            if (scope.groupId) {
                scope.inparams.groupId = scope.groupId;
                scope.formData.groupId = scope.groupId;
            }

            resourceFactory.loanResource.get(scope.inparams, function (data) {
                scope.products = data.productOptions;
                if (data.group) {
                    scope.groupName = data.group.name;
                }
            });
            
            scope.loanProductChange = function (loanProductId) {
                scope.clients = [];                
                scope.inparams.productId = loanProductId;
                resourceFactory.loanResource.get(scope.inparams, function (data) {
                    scope.loanaccountinfo = data;
                    if (data.group.clientMembers) {
                        for (var i in data.group.clientMembers) {
                            scope.clients.push({selected: true, clientId: data.group.clientMembers[i].id, name: data.group.clientMembers[i].displayName,
                                amount: data.memberVariations[data.group.clientMembers[i].id]['principal'],
                                interest: data.memberVariations[data.group.clientMembers[i].id]['interestRatePerPeriod'], 
                                repayments: data.memberVariations[data.group.clientMembers[i].id]['numberOfRepayments'],
                                frequency: data.memberVariations[data.group.clientMembers[i].id]['termFrequency'],
                                frequencyType: data.repaymentFrequencyType.id,
                                interestCalculationPeriodType: data.memberVariations[data.group.clientMembers[i].id]['interestCalculationPeriodType'],});
                        }
                    }                    
                });

               /* resourceFactory.loanResource.get({resourceType: 'template', templateType: 'collateral', productId: loanProductId, fields: 'id,loanCollateralOptions'}, function (data) {
                    scope.collateralOptions = data.loanCollateralOptions || [];
                });*/

                //makes a copy of all the clients for selection
                scope.removedClients = scope.clients;
                scope.addedClients = [];
            }           

            // function to add selected clients in multi-select window
            scope.add = function () {
                for (var i in this.removed) {
                    for (var j in scope.removedClients) {
                        if (scope.removedClients[j].clientId == this.removed[i]) {
                            var temp = scope.removedClients[j];
                            scope.addedClients.push(temp);
                            scope.removedClients.splice(j, 1);                           
                        }
                    }
                }
            };

            // function to remove clients from selected ones
            scope.remove = function () {
                for (var i in this.added) {
                    for (var j in scope.addedClients) {
                        if (scope.addedClients[j].clientId == this.added[i]) {
                            var temp = scope.addedClients[j];
                            scope.removedClients.push(temp);
                            scope.addedClients.splice(j, 1);
                        }
                    }
                }
            };

            scope.showLoanForm = function () {
                if(scope.addedClients.length > 0) {
                    scope.showForm = true;
                    scope.previewClientLoanAccInfo();                    
                }
            };

            scope.previewClientLoanAccInfo = function () {
                scope.previewRepayment = {};   
                scope.previewRepayment.clients = [];           
                scope.charges = scope.loanaccountinfo.charges || [];
                scope.charges.clients = [];
                scope.formData.disbursementData = scope.loanaccountinfo.disbursementDetails || [];
                //scope.collaterals = [];

                if (scope.loanaccountinfo.calendarOptions) {
                    scope.formData.syncRepaymentsWithMeeting = true;
                    scope.formData.syncDisbursementWithMeeting = true;
                }

                scope.multiDisburseLoan = scope.loanaccountinfo.multiDisburseLoan
                scope.formData.productId = scope.loanaccountinfo.loanProductId;
                scope.formData.fundId = scope.loanaccountinfo.fundId;
                scope.formData.loanTermFrequency = scope.loanaccountinfo.termFrequency;
                scope.formData.loanTermFrequencyType = scope.loanaccountinfo.termPeriodFrequencyType.id;
                scope.formData.numberOfRepayments = scope.loanaccountinfo.numberOfRepayments;
                scope.formData.repaymentEvery = scope.loanaccountinfo.repaymentEvery;
                scope.formData.repaymentFrequencyType = scope.loanaccountinfo.repaymentFrequencyType.id;
                scope.formData.interestRatePerPeriod = scope.loanaccountinfo.interestRatePerPeriod;
                //scope.formData.interestRateFrequencyType = scope.loanaccountinfo.interestRateFrequencyType.id;
                scope.formData.amortizationType = scope.loanaccountinfo.amortizationType.id;
                scope.formData.interestType = scope.loanaccountinfo.interestType.id;
                scope.formData.interestCalculationPeriodType = scope.loanaccountinfo.interestCalculationPeriodType.id;
                scope.formData.inArrearsTolerance = scope.loanaccountinfo.inArrearsTolerance;
                scope.formData.graceOnPrincipalPayment = scope.loanaccountinfo.graceOnPrincipalPayment;
                scope.formData.graceOnInterestPayment = scope.loanaccountinfo.graceOnInterestPayment;
                scope.formData.transactionProcessingStrategyId = scope.loanaccountinfo.transactionProcessingStrategyId;
                scope.formData.graceOnInterestCharged = scope.loanaccountinfo.graceOnInterestCharged;
                scope.formData.maxOutstandingLoanBalance = scope.loanaccountinfo.maxOutstandingLoanBalance;
                
                for (var i = 0; i < scope.addedClients.length; i++ ){
                    scope.formData.clients.push({});
                    scope.chargeFormData.clients.push({});                    
                    scope.charges.clients.push([]);
                    scope.formData.clients[i].charges = [];
                    scope.previewRepayment.clients.push(false);

                    for (var j = 0; j < scope.loanaccountinfo.charges.length; j++) {
                        scope.charges.clients[i][j] = scope.loanaccountinfo.charges[j];
                    }
                   
                    //fill up the initial form data for each client
                    for (var key in scope.formData) {
                        if (key != "clients" && key != "syncRepaymentsWithMeeting" && key != "syncDisbursementWithMeeting") {
                            scope.formData.clients[i][key] = scope.formData[key];
                        }
                    }

                    scope.formData.clients[i].principal = scope.addedClients[i].amount;                                   
                }
            }

            scope.viewLoanSchedule = function (index) {
                scope.formData.clientId = scope.clients[index].clientId;
                scope.formData.principal = scope.clients[index].amount;
                scope.formData.interestRatePerPeriod = scope.clients[index].interest;
                scope.formData.numberOfRepayments = scope.clients[index].repayments;
                scope.formData.loanTermFrequencyType = scope.clients[index].frequencyType;
                scope.formData.loanTermFrequency = scope.clients[index].frequency;
                scope.previewRepayments();
            }

            // function to add a new common/specific charge
            scope.addCharge = function (index) {
                if (!index && scope.chargeFormData.chargeId) {
                    resourceFactory.chargeResource.get({chargeId: this.chargeFormData.chargeId, template: 'true'}, function (data) {
                        data.chargeId = data.id;
                        scope.charges.push(data);
                        for (var i in scope.charges.clients) {
                            scope.charges.clients[i].push(data);
                        }

                        scope.chargeFormData.chargeId = undefined;
                        for (var i in scope.chargeFormData.clients) {
                            scope.chargeFormData.clients[i].chargeId = undefined; 
                        }
                    });
                }
                else if (scope.chargeFormData.clients[index].chargeId) {
                    resourceFactory.chargeResource.get({chargeId: this.chargeFormData.clients[index].chargeId, template: 'true'}, function (data) {
                        data.chargeId = data.id;
                        scope.charges.clients[index].push(data);
                        scope.chargeFormData.clients[index].chargeId = undefined;
                    });
                }
            }
            
            //function to remove an added common/specific charge
            scope.deleteCharge = function (outerIndex, innerIndex) {
                if (outerIndex >= 0 && innerIndex >= 0) {                   
                    scope.charges.clients[outerIndex].splice(innerIndex, 1);
                } else {
                    var chargeId = scope.charges[outerIndex].id;
                    scope.charges.splice(outerIndex, 1);

                    //delete the common charges from all the specific clients as well
                    for (var i = 0; i < scope.charges.clients.length; i++) {
                        for (var j = 0; j < scope.charges.clients[i].length; j++) {
                            if (scope.charges.clients[i][j].id == chargeId) {
                                scope.charges.clients[i].splice(j, 1);
                            }

                        }
                    }
                }  
                scope.$apply();
            }

            scope.addTranches = function () {
                scope.formData.disbursementData.push({
                });
            };
            scope.deleteTranches = function (index) {
                scope.formData.disbursementData.splice(index, 1);
            }


            scope.syncRepaymentsWithMeetingchange = function () {
                if (!scope.formData.syncRepaymentsWithMeeting) {
                    scope.formData.syncDisbursementWithMeeting = false;
                }
            };

            scope.syncDisbursementWithMeetingchange = function () {
                if (scope.formData.syncDisbursementWithMeeting) {
                    scope.formData.syncRepaymentsWithMeeting = true;
                }
            };

           /* scope.addCollateral = function () {
                if (scope.collateralFormData.collateralIdTemplate && scope.collateralFormData.collateralValueTemplate) {
                    scope.collaterals.push({type: scope.collateralFormData.collateralIdTemplate.id, name: scope.collateralFormData.collateralIdTemplate.name, value: scope.collateralFormData.collateralValueTemplate, description: scope.collateralFormData.collateralDescriptionTemplate});
                    scope.collateralFormData.collateralIdTemplate = undefined;
                    scope.collateralFormData.collateralValueTemplate = undefined;
                    scope.collateralFormData.collateralDescriptionTemplate = undefined;
                }
            };

            scope.deleteCollateral = function (index) {
                scope.collaterals.splice(index, 1);
            };*/

            scope.previewRepayments = function (index) {
                // Make sure charges and collaterals are empty before initializing.
                
                // delete scope.formData.collateral;

                if (scope.charges.clients[index].length > 0) {
                    scope.formData.clients[index].charges = [];
                    for (var i in scope.charges.clients[index]) {
                        scope.formData.clients[index].charges.push({ chargeId: scope.charges.clients[index][i].chargeId, amount: scope.charges.clients[index][i].amount, dueDate: dateFilter(scope.charges.clients[index][i].dueDate, scope.df) });
                    }
                }
                
                /*if (scope.collaterals.length > 0) {
                    scope.formData.collateral = [];
                    for (var i in scope.collaterals) {
                        scope.formData.collateral.push({type: scope.collaterals[i].type, value: scope.collaterals[i].value, description: scope.collaterals[i].description});
                    }
                    ;
                }*/

                if (this.formData.syncRepaymentsWithMeeting) {
                    this.formData.clients[index].calendarId = scope.loanaccountinfo.calendarOptions[0].id;
                    scope.syncRepaymentsWithMeeting = this.formData.syncRepaymentsWithMeeting;
                }
                delete this.formData.syncRepaymentsWithMeeting;

                if (this.formData.submittedOnDate) {
                    this.formData.submittedOnDate = dateFilter(this.formData.submittedOnDate, scope.df);
                    this.formData.clients[index].submittedOnDate = this.formData.submittedOnDate;
                }
                if (this.formData.clients[index].expectedDisbursementDate) {
                    this.formData.clients[index].expectedDisbursementDate = dateFilter(this.formData.clients[index].expectedDisbursementDate, scope.df);
                }
                if (this.formData.clients[index].interestChargedFromDate) {
                    this.formData.clients[index].interestChargedFromDate = dateFilter(this.formData.interestChargedFromDate, scope.df);
                }
                if (this.formData.repaymentsStartingFromDate) {
                    this.formData.clients[index].repaymentsStartingFromDate = dateFilter(this.formData.repaymentsStartingFromDate, scope.df);
                }

                this.formData.clients[index].locale = scope.optlang.code;
                this.formData.clients[index].dateFormat = scope.df;
                this.formData.clients[index].loanType = 'jlg';
                this.formData.clients[index].loanOfficerId = this.formData.loanOfficerId;
                this.formData.clients[index].productId = this.formData.productId;                   
                this.formData.clients[index].loanTermFrequency = this.formData.loanTermFrequency;
                this.formData.clients[index].loanTermFrequencyType = this.formData.loanTermFrequencyType;
                this.formData.clients[index].repaymentEvery = this.formData.repaymentEvery;
                this.formData.clients[index].repaymentFrequencyType = this.formData.repaymentFrequencyType;
                this.formData.clients[index].interestRatePerPeriod = this.formData.interestRatePerPeriod;
                this.formData.clients[index].interestType = this.formData.interestType;
                this.formData.clients[index].amortizationType = this.formData.amortizationType;
                this.formData.clients[index].clientId = scope.addedClients[index].clientId;

                this.tempFormData = this.formData.clients[index];

                resourceFactory.loanResource.save({command: 'calculateLoanSchedule'}, this.tempFormData, function (data) {
                    scope.repaymentscheduleinfo.clients[index] = data;
                    scope.previewRepayment.clients[index] = true;
                    scope.formData.syncRepaymentsWithMeeting = scope.syncRepaymentsWithMeeting;
                });

            }

            // watchers to automatically update specific values as well
            scope.$watch(function() {
                return scope.formData.expectedDisbursementDate = dateFilter(scope.formData.expectedDisbursementDate, scope.df);
            }, function(disbursementDate){
                for (var i in scope.formData.clients) {
                    scope.formData.clients[i].expectedDisbursementDate = disbursementDate;
                }
            });

            scope.$watch(function() {
                return scope.formData.numberOfRepayments;
            }, function(numberOfRepayments){
                for (var i in scope.formData.clients) {
                    scope.formData.clients[i].numberOfRepayments = numberOfRepayments;
                }
            });

            scope.submit = function () {                

                /*delete scope.formData.collateral;

                if (scope.collaterals.length > 0) {
                    scope.formData.collateral = [];
                    for (var i in scope.collaterals) {
                        scope.formData.collateral.push({type: scope.collaterals[i].type, value: scope.collaterals[i].value, description: scope.collaterals[i].description});
                    }
                    ;
                }*/

                if (scope.formData.disbursementData.length > 0) {
                    for (var i in scope.formData.disbursementData) {
                        scope.formData.disbursementData[i].expectedDisbursementDate = dateFilter(scope.formData.disbursementData[i].expectedDisbursementDate, 'dd MMMM yyyy');
                    }
                }

                if (this.formData.syncRepaymentsWithMeeting) {
                    this.formData.calendarId = scope.loanaccountinfo.calendarOptions[0].id;
                }
                delete this.formData.syncRepaymentsWithMeeting;
                //delete this.formData.interestRateFrequencyType;

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.loanType = 'jlg';
                if (this.formData.submittedOnDate) {
                    this.formData.submittedOnDate = dateFilter(this.formData.submittedOnDate, scope.df);
                }                
                if (this.formData.interestChargedFromDate) {
                    this.formData.interestChargedFromDate = dateFilter(this.formData.interestChargedFromDate, scope.df);
                }
                if (this.formData.repaymentsStartingFromDate) {
                    this.formData.repaymentsStartingFromDate = dateFilter(this.formData.repaymentsStartingFromDate, scope.df);
                }

                //logic for proper redirecting
                var selectedClients = 0;
                var successfullyCreated = 0;

                for (var i in scope.addedClients) {
                    if (scope.addedClients[i].selected) {
                        selectedClients = selectedClients + 1;
                    }                    
                }

                //add the common details for every client
                for (var i in this.formData.clients) {
                    //set up all the common properties
                    for (var key in this.formData) {
                        if(key != "clients" && !this.formData.clients[i].hasOwnProperty(key)) {
                            this.formData.clients[i][key] = this.formData[key];
                        }
                    }

                    this.formData.clients[i].charges = [];

                    for (var j in scope.charges.clients[i]) {
                        this.formData.clients[i].charges.push({chargeId: scope.charges.clients[i][j].chargeId, amount: scope.charges.clients[i][j].amount, dueDate: dateFilter(scope.charges.clients[i][j].dueDate, scope.df) });                        
                    }

                    if (this.formData.clients[i].expectedDisbursementDate) {
                        this.formData.clients[i].expectedDisbursementDate = dateFilter(this.formData.clients[i].expectedDisbursementDate, scope.df);
                    }

                    //set up specific properties
                    this.formData.clients[i].loanOfficerId = this.formData.loanOfficerId;
                    this.formData.clients[i].productId = this.formData.productId;
                    this.formData.clients[i].fundId =  this.formData.fundId;
                    this.formData.clients[i].submittedOnDate = this.formData.submittedOnDate;                    
                    this.formData.clients[i].loanTermFrequency = this.formData.loanTermFrequency;
                    this.formData.clients[i].loanTermFrequencyType = this.formData.loanTermFrequencyType;
                    this.formData.clients[i].repaymentEvery = this.formData.repaymentEvery;
                    this.formData.clients[i].repaymentFrequencyType = this.formData.repaymentFrequencyType;
                    this.formData.clients[i].interestRatePerPeriod = this.formData.interestRatePerPeriod;
                    this.formData.clients[i].interestType = this.formData.interestType;
                    this.formData.clients[i].amortizationType = this.formData.amortizationType;
                    this.formData.clients[i].clientId = scope.addedClients[i].clientId;
                }

                //make sure there are no previous batch Requests
                this.batchRequests = [];
                
                //fill up the batch Requests array with JSON Request data
                for (var i in this.formData.clients) {
                        this.batchRequests.push({requestId: i, relativeUrl: "loans", 
                        method: "POST", body: JSON.stringify(this.formData.clients[i])});                        
                }       

                //send the request to the Batch API
                resourceFactory.batchResource.post(this.batchRequests, function (data) {
                    for(var i = 0; i < data.length; i++) {
                        data[i].body = JSON.parse(data[i].body);                   
                        for(var x = 0; x < scope.addedClients.length; x++) {                                     
                            if(data[i].body.clientId == scope.addedClients[x].clientId) {                                
                                if(data[i].statusCode == 200) {
                                    scope.addedClients[x]['status'] = 'Created';
                                    successfullyCreated = successfullyCreated + 1;                                    
                                }
                            } 
                        }                    
                       
                        if (successfullyCreated == selectedClients) {
                            location.path('/viewgroup/' + scope.groupId);
                        } 
                    }

                    if(successfullyCreated != selectedClients) {
                            var temp = [];
                            for (var i = 0; i < scope.addedClients.length; i++) {                                
                                if (scope.addedClients[i]['status'] != 'Created') {
                                    temp.push(scope.addedClients[i]);
                                }
                            }
                            //clean up previous values
                            scope.addedClients = temp; 
                            scope.formData.clients = [];                      
                            scope.showLoanForm();                                 
                    }
                });

            };

            scope.cancel = function () {
                if (scope.groupId) {
                    location.path('/viewgroup/' + scope.groupId);
                }
            };
        }
    });
    mifosX.ng.application.controller('NewJLGLoanAccAppController', ['$scope', '$rootScope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.NewJLGLoanAccAppController]).run(function ($log) {
        $log.info("NewJLGLoanAccAppController initialized");
    });
}(mifosX.controllers || {}));