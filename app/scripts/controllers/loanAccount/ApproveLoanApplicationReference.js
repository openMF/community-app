(function (module) {
    mifosX.controllers = _.extend(module, {
        ApproveLoanApplicationReference: function (scope, routeParams, resourceFactory, location, dateFilter) {

            scope.loanApplicationReferenceId = routeParams.loanApplicationReferenceId;
            scope.restrictDate = new Date();

            scope.formRequestData = {};
            scope.formRequestData.approvedOnDate = dateFilter(new Date(scope.restrictDate), scope.df);

            scope.charges = [];
            scope.existingCharges = [];
            var curIndex = 0;

            resourceFactory.loanApplicationReferencesResource.getByLoanAppId({loanApplicationReferenceId: scope.loanApplicationReferenceId}, function (applicationData) {
                scope.formData = applicationData;
                scope.loanProductChange(applicationData.loanProductId);
                resourceFactory.loanApplicationReferencesResource.getChargesByLoanAppId({
                    loanApplicationReferenceId: scope.loanApplicationReferenceId,
                    command: 'loanapplicationcharges'
                }, function (loanAppChargeData) {
                    scope.loanAppChargeData = loanAppChargeData;
                    for (var i = 0; i < scope.loanAppChargeData.length; i++) {
                        if (scope.loanAppChargeData[i].chargeId) {
                            scope.constructExistingCharges(i, scope.loanAppChargeData[i].chargeId);
                        } else {
                            curIndex++;
                        }
                    }
                });
            });

            scope.constructExistingCharges = function (index, chargeId) {
                resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, function (data) {
                    data.chargeId = data.id;
                    scope.charges.push(data);
                    curIndex++;
                    if (curIndex == scope.loanAppChargeData.length) {
                        for (var i = 0; i < scope.charges.length; i++) {
                            for (var j = 0; j < scope.loanAppChargeData.length; j++) {
                                if (scope.charges[i].chargeId == scope.loanAppChargeData[j].chargeId) {
                                    scope.charges[i].loanAppChargeId = scope.loanAppChargeData[j].loanAppChargeId;
                                    scope.charges[i].loanApplicationReferenceId = scope.loanAppChargeData[j].loanApplicationReferenceId;
                                    scope.charges[i].dueDate = scope.loanAppChargeData[j].dueDate;
                                    scope.charges[i].amount = scope.loanAppChargeData[j].amount;
                                }
                            }
                        }
                        angular.copy(scope.charges,scope.existingCharges);
                    }
                });
            };

            scope.loanProductChange = function (loanProductId) {
                scope.inparams = {resourceType: 'template', activeOnly: 'true'};
                if (scope.formData.clientId && scope.formData.groupId) {
                    scope.inparams.templateType = 'jlg';
                } else if (scope.formData.groupId) {
                    scope.inparams.templateType = 'group';
                } else if (scope.formData.clientId) {
                    scope.inparams.templateType = 'individual';
                }
                if (scope.formData.clientId) {
                    scope.inparams.clientId = scope.formData.clientId;
                }
                if (scope.formData.groupId) {
                    scope.inparams.groupId = scope.formData.groupId;
                }
                scope.inparams.staffInSelectedOfficeOnly = true;
                scope.inparams.productId = loanProductId;

                resourceFactory.loanResource.get(scope.inparams, function (data) {
                    scope.loanaccountinfo = data;
                    if (scope.loanaccountinfo.product.multiDisburseLoan) {
                        scope.formRequestData.loanApplicationSanctionTrancheDatas = [];
                    }
                    if (data.clientName) {
                        scope.clientName = data.clientName;
                    }
                    if (data.group) {
                        scope.groupName = data.group.name;
                    }
                    resourceFactory.loanApplicationReferencesResource.getByLoanAppId({
                        loanApplicationReferenceId: scope.loanApplicationReferenceId,
                        command: 'approveddata'
                    }, function (approveddata) {
                        if (approveddata.loanAppSanctionId) {
                            scope.formRequestData = approveddata;
                            if(scope.formRequestData.repaymentsStartingFromDate){
                                scope.formRequestData.repaymentsStartingFromDate = dateFilter(new Date(scope.formRequestData.repaymentsStartingFromDate), scope.df);
                            }
                            delete scope.formRequestData.loanAppSanctionId;
                            delete scope.formRequestData.loanApplicationReferenceId;
                            scope.formRequestData.repaymentPeriodFrequencyEnum = scope.formRequestData.repaymentPeriodFrequency.id;
                            delete scope.formRequestData.repaymentPeriodFrequency;
                            scope.formRequestData.termPeriodFrequencyEnum = scope.formRequestData.termPeriodFrequency.id;
                            delete scope.formRequestData.termPeriodFrequency;
                            scope.formRequestData.expectedDisbursementDate = dateFilter(new Date(scope.formRequestData.expectedDisbursementDate), scope.df);
                            if (approveddata.loanApplicationSanctionTrancheDatas) {
                                for (var i = 0; i < scope.formRequestData.loanApplicationSanctionTrancheDatas.length; i++) {
                                    scope.formRequestData.loanApplicationSanctionTrancheDatas[i].expectedTrancheDisbursementDate = dateFilter(new Date(scope.formRequestData.loanApplicationSanctionTrancheDatas[i].expectedTrancheDisbursementDate), scope.df);
                                }
                            }
                            if(scope.formRequestData.approvedOnDate){
                                scope.formRequestData.approvedOnDate = dateFilter(new Date(scope.formRequestData.approvedOnDate),scope.df);
                            }
                        } else {
                            scope.formRequestData.loanAmountApproved = scope.formData.loanAmountRequested;
                            scope.formRequestData.numberOfRepayments = scope.formData.numberOfRepayments;
                            scope.formRequestData.repaymentPeriodFrequencyEnum = scope.formData.repaymentPeriodFrequency.id;
                            scope.formRequestData.repayEvery = scope.formData.repayEvery;
                            scope.formRequestData.termPeriodFrequencyEnum = scope.formData.termPeriodFrequency.id;
                            scope.formRequestData.termFrequency = scope.formData.termFrequency;
                            if (scope.formData.noOfTranche && scope.formData.noOfTranche > 0) {
                                scope.constructTranches();
                            }
                        }
                        if(scope.formData.fixedEmiAmount){
                            scope.formRequestData.fixedEmiAmount = scope.formData.fixedEmiAmount;
                        }
                        scope.formRequestData.maxOutstandingLoanBalance = scope.loanaccountinfo.maxOutstandingLoanBalance;
                        scope.formDataForValidtion();
                    });
                });
            };

            scope.formValidationData = {};
            scope.formDataForValidtion = function () {
                scope.formValidationData.submittedOnDate = dateFilter(scope.formData.submittedOnDate, scope.df);
                scope.formValidationData.clientId = scope.formData.clientId;
                if (scope.formData.groupId) {
                    scope.formValidationData.groupId = scope.formData.groupId;
                }
                scope.previewClientLoanAccInfo();
                if (scope.loanaccountinfo.loanOfficerOptions && !scope.formData.loanOfficerId) {
                    resourceFactory.clientResource.get({clientId: routeParams.clientId}, function (data) {
                        scope.clientData = data;
                        if (data.staffId != null) {
                            scope.formValidationData.loanOfficerId = data.staffId;
                        }
                    });
                } else {
                    scope.formValidationData.loanOfficerId = scope.formData.loanOfficerId;
                }
            };

            scope.previewClientLoanAccInfo = function () {

                if (scope.loanaccountinfo.calendarOptions) {
                    scope.formValidationData.syncRepaymentsWithMeeting = true;
                    if (scope.response && !scope.response.uiDisplayConfigurations.loanAccount.isDefaultValue.syncDisbursementWithMeeting) {
                        scope.formValidationData.syncDisbursementWithMeeting = false;
                    } else {
                        scope.formValidationData.syncDisbursementWithMeeting = true;
                    }
                }

                if (scope.response && scope.response.uiDisplayConfigurations.loanAccount.isDefaultValue.fundId != null) {
                    scope.formValidationData.fundId = scope.response.uiDisplayConfigurations.loanAccount.isDefaultValue.fundId;
                } else {
                    scope.formValidationData.fundId = scope.loanaccountinfo.fundId;
                }
                scope.formValidationData.productId = scope.formData.loanProductId;
                scope.formValidationData.loanPurposeId = scope.formData.loanPurposeId;
                scope.formValidationData.principal = scope.formRequestData.loanAmountApproved;

                scope.formValidationData.loanTermFrequency = scope.formRequestData.termFrequency;
                scope.formValidationData.loanTermFrequencyType = scope.formRequestData.termPeriodFrequencyEnum;
                scope.formValidationData.numberOfRepayments = scope.formRequestData.numberOfRepayments;
                scope.formValidationData.repaymentEvery = scope.formRequestData.repayEvery;
                scope.formValidationData.repaymentFrequencyType = scope.formRequestData.repaymentPeriodFrequencyEnum;

                scope.formValidationData.interestRatePerPeriod = scope.loanaccountinfo.interestRatePerPeriod;
                scope.formValidationData.amortizationType = scope.loanaccountinfo.amortizationType.id;
                scope.formValidationData.interestType = scope.loanaccountinfo.interestType.id;
                scope.formValidationData.interestCalculationPeriodType = scope.loanaccountinfo.interestCalculationPeriodType.id;
                scope.formValidationData.allowPartialPeriodInterestCalcualtion = scope.loanaccountinfo.allowPartialPeriodInterestCalcualtion;
                scope.formValidationData.inArrearsTolerance = scope.loanaccountinfo.inArrearsTolerance;
                scope.formValidationData.graceOnPrincipalPayment = scope.loanaccountinfo.graceOnPrincipalPayment;
                scope.formValidationData.graceOnInterestPayment = scope.loanaccountinfo.graceOnInterestPayment;
                scope.formValidationData.graceOnArrearsAgeing = scope.loanaccountinfo.graceOnArrearsAgeing;
                scope.formValidationData.transactionProcessingStrategyId = scope.loanaccountinfo.transactionProcessingStrategyId;
                scope.formValidationData.graceOnInterestCharged = scope.loanaccountinfo.graceOnInterestCharged;
                // scope.formValidationData.fixedEmiAmount = scope.loanaccountinfo.fixedEmiAmount;
                scope.formValidationData.maxOutstandingLoanBalance = scope.formRequestData.maxOutstandingLoanBalance;

                if (scope.loanaccountinfo.isInterestRecalculationEnabled && scope.loanaccountinfo.interestRecalculationData.recalculationRestFrequencyDate) {
                    //scope.formValidationData.recalculationRestFrequencyDate = new Date(scope.loanaccountinfo.interestRecalculationData.recalculationRestFrequencyDate);
                }
                if (scope.loanaccountinfo.isInterestRecalculationEnabled && scope.loanaccountinfo.interestRecalculationData.recalculationCompoundingFrequencyDate) {
                    //scope.formValidationData.recalculationCompoundingFrequencyDate = new Date(scope.loanaccountinfo.interestRecalculationData.recalculationCompoundingFrequencyDate);
                }

                if (scope.loanaccountinfo.isLoanProductLinkedToFloatingRate) {
                    scope.formValidationData.isFloatingInterestRate = false;
                }
            }

            scope.constructTranches = function () {
                var noOfTranche = scope.formData.noOfTranche;
                var i = 0;
                while (i < noOfTranche) {
                    var loanApplicationSanctionTrancheDatas = {};
                    //loanApplicationSanctionTrancheDatas.fixedEmiAmount = scope.formData.fixedEmiAmount;
                    scope.formRequestData.loanApplicationSanctionTrancheDatas.push(loanApplicationSanctionTrancheDatas);
                    i++;
                }
            };

            scope.rejectApprovalLoanAppRef = function () {
                resourceFactory.loanApplicationReferencesResource.update({
                    loanApplicationReferenceId: scope.loanApplicationReferenceId,
                    command: 'reject'
                }, {}, function (data) {
                    location.path('/viewclient/' + scope.formData.clientId);
                });
            };

            scope.calculateTermFrequency = function () {
                scope.formRequestData.termFrequency = (scope.formRequestData.repayEvery * scope.formRequestData.numberOfRepayments);
                scope.formRequestData.termPeriodFrequencyEnum  = scope.formRequestData.repaymentPeriodFrequencyEnum;
            };

            scope.syncRepaymentsWithMeetingchange = function () {
                if (!scope.formValidationData.syncRepaymentsWithMeeting) {
                    scope.formValidationData.syncDisbursementWithMeeting = false;
                }
            };

            scope.syncDisbursementWithMeetingchange = function () {
                if (scope.formValidationData.syncDisbursementWithMeeting) {
                    scope.formValidationData.syncRepaymentsWithMeeting = true;
                }
            };

            scope.previewRepayments = function (isDisplayData) {

                scope.repaymentscheduleinfo = {};

                var reqFirstDate = dateFilter(new Date(scope.formValidationData.submittedOnDate), scope.df);
                var reqSecondDate = dateFilter(new Date(scope.formRequestData.expectedDisbursementDate), scope.df);
                var reqThirdDate = dateFilter(new Date(scope.formRequestData.expectedDisbursementDate), scope.df);
                //var reqFourthDate = dateFilter(scope.date.fourth, scope.df);
                if (scope.charges.length > 0) {
                    scope.formValidationData.charges = [];
                    for (var i in scope.charges) {
                        scope.formValidationData.charges.push({
                            chargeId: scope.charges[i].chargeId,
                            amount: scope.charges[i].amount,
                            dueDate: dateFilter(scope.charges[i].dueDate, scope.df)
                        });
                    }
                }

                if (scope.formRequestData.loanApplicationSanctionTrancheDatas && scope.formRequestData.loanApplicationSanctionTrancheDatas.length > 0) {
                    for (var i = 0; i < scope.formRequestData.loanApplicationSanctionTrancheDatas.length; i++) {
                        var dateValue = scope.formRequestData.loanApplicationSanctionTrancheDatas[i].expectedTrancheDisbursementDate;
                        if ((new Date(dateValue)).toString() != 'Invalid Date') {
                            scope.formValidationData.disbursementData = [];
                            break;
                        }
                    }
                }

                if (scope.formValidationData.disbursementData) {
                    for (var j = 0; j < scope.formRequestData.loanApplicationSanctionTrancheDatas.length; j++) {
                        var dateValue = scope.formRequestData.loanApplicationSanctionTrancheDatas[j].expectedTrancheDisbursementDate;
                        if (scope.formRequestData.loanApplicationSanctionTrancheDatas[j].expectedTrancheDisbursementDate && (new Date(dateValue)).toString() != 'Invalid Date' && scope.formRequestData.loanApplicationSanctionTrancheDatas[j].trancheAmount) {
                            var disbursementData = {};
                            disbursementData.expectedDisbursementDate = dateFilter(new Date(scope.formRequestData.loanApplicationSanctionTrancheDatas[j].expectedTrancheDisbursementDate), scope.df);
                            disbursementData.principal = scope.formRequestData.loanApplicationSanctionTrancheDatas[j].trancheAmount;
                            scope.formValidationData.disbursementData.push(disbursementData);
                        }
                    }
                }

                if (this.formValidationData.syncRepaymentsWithMeeting) {
                    this.formValidationData.calendarId = scope.loanaccountinfo.calendarOptions[0].id;
                    scope.syncRepaymentsWithMeeting = this.formValidationData.syncRepaymentsWithMeeting;
                }
                //delete this.formValidationData.syncRepaymentsWithMeeting;

                if (scope.formRequestData.expectedDisbursementDate) {
                    this.formValidationData.interestChargedFromDate = reqThirdDate;
                }

                if(scope.formRequestData.repaymentsStartingFromDate){
                    this.formValidationData.repaymentsStartingFromDate = dateFilter(new Date(scope.formRequestData.repaymentsStartingFromDate), scope.df);
                }

                this.formValidationData.principal = this.formRequestData.loanAmountApproved;

                this.formValidationData.loanType = scope.inparams.templateType;
                if (scope.formRequestData.expectedDisbursementDate) {
                    this.formValidationData.expectedDisbursementDate = reqSecondDate;
                }

                this.formValidationData.submittedOnDate = reqFirstDate;
                if (this.formValidationData.interestCalculationPeriodType == 0) {
                    this.formValidationData.allowPartialPeriodInterestCalcualtion = false;
                }

                if(this.formRequestData.fixedEmiAmount){
                    this.formValidationData.fixedEmiAmount = this.formRequestData.fixedEmiAmount;
                }else if(this.formValidationData.fixedEmiAmount){
                    delete this.formValidationData.fixedEmiAmount;
                }

                if(this.formRequestData.maxOutstandingLoanBalance){
                    this.formValidationData.maxOutstandingLoanBalance = this.formRequestData.maxOutstandingLoanBalance;
                }

                this.formValidationData.loanTermFrequency = this.formRequestData.termFrequency;
                this.formValidationData.loanTermFrequencyType = this.formRequestData.termPeriodFrequencyEnum;
                this.formValidationData.numberOfRepayments = this.formRequestData.numberOfRepayments;
                this.formValidationData.repaymentEvery = this.formRequestData.repayEvery;
                this.formValidationData.repaymentFrequencyType = this.formRequestData.repaymentPeriodFrequencyEnum;

                this.formValidationData.locale = scope.optlang.code;
                this.formValidationData.dateFormat = scope.df;
                scope.calculateLoanScheduleData = {};
                angular.copy(scope.formValidationData,scope.calculateLoanScheduleData);
                delete scope.calculateLoanScheduleData.syncRepaymentsWithMeeting;
                if (isDisplayData) {
                    resourceFactory.loanResource.save({command: 'calculateLoanSchedule'}, scope.calculateLoanScheduleData, function (data) {
                        scope.repaymentscheduleinfo = data;
                        scope.formValidationData.syncRepaymentsWithMeeting = scope.syncRepaymentsWithMeeting;
                    });
                }
            };

            scope.$watch('formRequestData.expectedDisbursementDate', function () {
                if (scope.formRequestData.loanApplicationSanctionTrancheDatas && scope.formRequestData.loanApplicationSanctionTrancheDatas[0]) {
                    if (scope.formRequestData.expectedDisbursementDate != '' && scope.formRequestData.expectedDisbursementDate != undefined) {
                        var dateValue = scope.formRequestData.expectedDisbursementDate;
                        if ((new Date(dateValue)).toString() != 'Invalid Date') {
                            scope.formRequestData.loanApplicationSanctionTrancheDatas[0].expectedTrancheDisbursementDate = dateFilter(new Date(dateValue), scope.df);
                        }
                    }
                }
            });

            scope.submit = function () {
                scope.previewRepayments(false);
                scope.formRequestData.expectedDisbursementDate = dateFilter(scope.formRequestData.expectedDisbursementDate, scope.df);
                scope.formRequestData.repaymentsStartingFromDate =  dateFilter(scope.formRequestData.repaymentsStartingFromDate, scope.df);
                if(scope.formRequestData.approvedOnDate){
                    scope.formRequestData.approvedOnDate = dateFilter(new Date(scope.formRequestData.approvedOnDate),scope.df);
                }
                this.formRequestData.locale = scope.optlang.code;
                this.formRequestData.dateFormat = scope.df;
                if (scope.formRequestData.loanApplicationSanctionTrancheDatas != undefined && scope.formRequestData.loanApplicationSanctionTrancheDatas.length > 0) {
                    for (var i = 0; i < scope.formRequestData.loanApplicationSanctionTrancheDatas.length; i++) {
                        scope.formRequestData.loanApplicationSanctionTrancheDatas[i].expectedTrancheDisbursementDate = dateFilter(scope.formRequestData.loanApplicationSanctionTrancheDatas[i].expectedTrancheDisbursementDate, scope.df);
                        scope.formRequestData.loanApplicationSanctionTrancheDatas[i].locale = scope.optlang.code;
                        scope.formRequestData.loanApplicationSanctionTrancheDatas[i].dateFormat = scope.df;
                    }
                }

                scope.submitData = {};
                scope.submitData.formValidationData = {};
                angular.copy(scope.formValidationData,scope.submitData.formValidationData);
                if(scope.submitData.formValidationData.syncRepaymentsWithMeeting){
                    delete scope.submitData.formValidationData.syncRepaymentsWithMeeting;
                }
                scope.submitData.formValidationData = scope.formValidationData;
                scope.submitData.formRequestData = scope.formRequestData;
                /**
                 * This formValidationData data is required only for validation purpose
                 * @type {{}|*}
                 */
                resourceFactory.loanApplicationReferencesResource.update({
                    loanApplicationReferenceId: scope.loanApplicationReferenceId,
                    command: 'approve'
                }, this.submitData, function (data) {
                    location.path('/viewclient/' + scope.formData.clientId);
                });
            };

            scope.cancel = function () {
                if (scope.formData.groupId) {
                    location.path('/viewgroup/' + scope.formData.groupId);
                } else if (scope.formData.clientId) {
                    location.path('/viewclient/' + scope.formData.clientId);
                }
            };

            scope.addTranches = function () {
                var loanApplicationSanctionTrancheDatas = {};
                loanApplicationSanctionTrancheDatas.fixedEmiAmount = scope.formData.fixedEmiAmount;
                scope.formRequestData.loanApplicationSanctionTrancheDatas.push(loanApplicationSanctionTrancheDatas);
            };

            scope.deleteTranches = function (index) {
                scope.formRequestData.loanApplicationSanctionTrancheDatas.splice(index, 1);
            };

            scope.addCharge = function () {
                if (scope.chargeFormData.chargeId) {
                    resourceFactory.chargeResource.get({chargeId: this.chargeFormData.chargeId, template: 'true'}, function (data) {
                        data.chargeId = data.id;
                        scope.charges.push(data);
                        scope.chargeFormData.chargeId = undefined;
                    });
                }
            };

            scope.deleteCharge = function (index) {
                scope.charges.splice(index, 1);
            };

            scope.report = false;
            scope.viewRepaymentDetails = function() {
                if(scope.repaymentscheduleinfo && scope.repaymentscheduleinfo.periods){
                    resourceFactory.clientResource.get({clientId: scope.formData.clientId}, function (data) {
                        scope.clientData = data;
                    });
                    scope.repaymentData = [];
                    scope.disbursedData = [];
                    for(var i in scope.repaymentscheduleinfo.periods) {
                        if(scope.repaymentscheduleinfo.periods[i].period) {
                            scope.repaymentData.push(scope.repaymentscheduleinfo.periods[i]);
                        } else {
                            scope.disbursedData.push(scope.repaymentscheduleinfo.periods[i]);
                        }
                    }
                    scope.report = true;
                }
            };

            scope.printDiv = function(print) {
                var printContents = document.getElementById(print).innerHTML;
                var popupWin = window.open('', '_blank', 'width=300,height=300');
                popupWin.document.open();
                popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/repaymentscheduleprintstyle.css" />' +
                    '</head><body onload="window.print()">' + printContents + '<br><br><table class="table"><tr><td width="210"><h4>Credit Officer</h4></td><td width="210"><h4>Branch Manager</h4></td><td><h4>Customer Signature</h4></td></tr></table></body></html>');
                popupWin.document.close();
            };

            scope.backToLoanDetails = function () {
                scope.report = false;
            }
        }
    });
    mifosX.ng.application.controller('ApproveLoanApplicationReference', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.ApproveLoanApplicationReference]).run(function ($log) {
        $log.info("ApproveLoanApplicationReference initialized");
    });
}(mifosX.controllers || {}));