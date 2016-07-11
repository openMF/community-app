(function (module) {
    mifosX.controllers = _.extend(module, {
        UpdateLoanApplicationReference: function (scope, routeParams, resourceFactory, location, dateFilter) {

            scope.loanApplicationReferenceId = routeParams.loanApplicationReferenceId;

            scope.restrictDate = new Date();
            scope.formData = {};
            scope.chargeFormData = {}; //For charges
            scope.charges = [];

            resourceFactory.loanApplicationReferencesResource.getByLoanAppId({loanApplicationReferenceId: scope.loanApplicationReferenceId}, function (applicationData) {
                scope.applicationData = applicationData;
                scope.formData.clientId = applicationData.clientId;
                scope.formData.groupId = applicationData.groupId;
                scope.loanProductChange(applicationData.loanProductId, false);
            });

            var curIndex = 0;
            scope.loanProductChange = function (loanProductId, isNewCall) {
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
                    if (data.clientName) {
                        scope.clientName = data.clientName;
                    }
                    if (data.group) {
                        scope.groupName = data.group.name;
                    }
                    if (isNewCall) {
                        if (scope.loanaccountinfo.loanOfficerOptions) {
                            resourceFactory.clientResource.get({clientId: scope.clientId}, function (data) {
                                if (data.staffId != null) {
                                    scope.formData.loanOfficerId = data.staffId;
                                }
                            })
                        }
                        scope.formData.loanAmountRequested = scope.loanaccountinfo.principal;
                        scope.formData.numberOfRepayments = scope.loanaccountinfo.numberOfRepayments;
                        scope.formData.termFrequency = (scope.loanaccountinfo.repaymentEvery * scope.loanaccountinfo.numberOfRepayments);
                        scope.formData.termPeriodFrequencyEnum = scope.loanaccountinfo.repaymentFrequencyType.id;
                        scope.formData.repayEvery = scope.loanaccountinfo.repaymentEvery;
                        scope.formData.repaymentPeriodFrequencyEnum = scope.loanaccountinfo.repaymentFrequencyType.id;
                        scope.charges = scope.loanaccountinfo.charges || [];
                    }else{
                        scope.formData.externalIdOne = scope.applicationData.externalIdOne;
                        scope.formData.externalIdTwo = scope.applicationData.externalIdTwo;
                        scope.formData.loanOfficerId = scope.applicationData.loanOfficerId;
                        scope.formData.loanProductId = scope.applicationData.loanProductId;
                        scope.formData.loanPurposeId = scope.applicationData.loanPurposeId;
                        scope.formData.loanAmountRequested = scope.applicationData.loanAmountRequested;
                        scope.formData.numberOfRepayments = scope.applicationData.numberOfRepayments;
                        scope.formData.repaymentPeriodFrequencyEnum = scope.applicationData.repaymentPeriodFrequency.id;
                        scope.formData.repayEvery = scope.applicationData.repayEvery;
                        scope.formData.termPeriodFrequencyEnum = scope.applicationData.termPeriodFrequency.id;
                        scope.formData.termFrequency = scope.applicationData.termFrequency;
                        scope.formData.fixedEmiAmount = scope.applicationData.fixedEmiAmount;
                        scope.formData.noOfTranche = scope.applicationData.noOfTranche;
                        scope.formData.submittedOnDate = dateFilter(new Date(scope.applicationData.submittedOnDate),scope.df);

                        resourceFactory.loanApplicationReferencesResource.getChargesByLoanAppId({
                            loanApplicationReferenceId: scope.loanApplicationReferenceId,
                            command: 'loanapplicationcharges'
                        }, function (loanAppChargeData) {
                            scope.loanAppChargeData = loanAppChargeData;
                            for(var i = 0; i < scope.loanAppChargeData.length; i++){
                                if(scope.loanAppChargeData[i].chargeId){
                                    scope.constructExistingCharges(i,scope.loanAppChargeData[i].chargeId);
                                }else{
                                    curIndex++;
                                }
                            }
                        });
                    }
                });
            };

            scope.constructExistingCharges = function (index,chargeId) {
                resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, function (data) {
                    data.chargeId = data.id;
                    scope.charges.push(data);
                    curIndex++;
                    if(curIndex == scope.loanAppChargeData.length){
                        for(var i = 0 ; i < scope.charges.length; i++){
                            for(var j = 0; j < scope.loanAppChargeData.length; j++){
                                if(scope.charges[i].chargeId == scope.loanAppChargeData[j].chargeId){
                                    scope.charges[i].loanAppChargeId = scope.loanAppChargeData[j].loanAppChargeId;
                                    scope.charges[i].loanApplicationReferenceId = scope.loanAppChargeData[j].loanApplicationReferenceId;
                                    if(scope.loanAppChargeData[j].dueDate){
                                        scope.charges[i].dueDate = dateFilter(new Date(scope.loanAppChargeData[j].dueDate),scope.df);
                                    }
                                    scope.charges[i].amount = scope.loanAppChargeData[j].amount;
                                }
                            }
                        }
                    }
                });
            };

            scope.calculateTermFrequency = function (){
                scope.formData.termFrequency = (scope.formData.repayEvery * scope.formData.numberOfRepayments);
                scope.formData.termPeriodFrequencyEnum =  scope.formData.repaymentPeriodFrequencyEnum;
            };

            scope.addCharge = function () {
                if (scope.chargeFormData.chargeId) {
                    resourceFactory.chargeResource.get({chargeId: this.chargeFormData.chargeId, template: 'true'}, function (data) {
                        data.chargeId = data.id;
                        scope.charges.push(data);
                        scope.chargeFormData.chargeId = undefined;
                    });
                }
            }

            scope.deleteCharge = function (index) {
                scope.charges.splice(index, 1);
            }

            scope.submit = function () {
                this.formData.accountType = scope.applicationData.accountType.value.toLowerCase();
                this.formData.charges = [];
                for(var i = 0 ; i < scope.charges.length; i++){
                    var charge = {};
                    if(scope.charges[i].loanAppChargeId){
                        charge.loanAppChargeId = scope.charges[i].loanAppChargeId;
                    }
                    charge.chargeId = scope.charges[i].chargeId;
                    charge.amount = scope.charges[i].amount;
                    if(scope.charges[i].dueDate){
                        charge.dueDate = dateFilter(scope.charges[i].dueDate,scope.df);
                    }
                    charge.locale = scope.optlang.code;
                    charge.dateFormat = scope.df;
                    this.formData.charges.push(charge);
                }
                this.formData.submittedOnDate = dateFilter(this.formData.submittedOnDate,scope.df);
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                resourceFactory.loanApplicationReferencesResource.update({loanApplicationReferenceId: scope.loanApplicationReferenceId}, this.formData, function (data) {
                    location.path('/viewloanapplicationreference/' + scope.loanApplicationReferenceId);
                });
            };

            scope.cancel = function () {
                location.path('/viewloanapplicationreference/' + scope.loanApplicationReferenceId);
            };
        }
    });
    mifosX.ng.application.controller('UpdateLoanApplicationReference', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.UpdateLoanApplicationReference]).run(function ($log) {
        $log.info("UpdateLoanApplicationReference initialized");
    });
}(mifosX.controllers || {}));