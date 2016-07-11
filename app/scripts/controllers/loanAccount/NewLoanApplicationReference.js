(function (module) {
    mifosX.controllers = _.extend(module, {
        NewLoanApplicationReference: function (scope, routeParams, resourceFactory, location, dateFilter) {

            scope.clientId = routeParams.clientId;
            scope.groupId = routeParams.groupId;

            scope.restrictDate = new Date();

            scope.formData = {};

            scope.formData.submittedOnDate = dateFilter(scope.restrictDate,scope.df);

            scope.chargeFormData = {}; //For charges

            scope.inparams = {resourceType: 'template', activeOnly: 'true'};
            if (scope.clientId && scope.groupId) {
                scope.inparams.templateType = 'jlg';
            } else if (scope.groupId) {
                scope.inparams.templateType = 'group';
            } else if (scope.clientId) {
                scope.inparams.templateType = 'individual';
            }
            if (scope.clientId) {
                scope.inparams.clientId = scope.clientId;
                scope.formData.clientId = scope.clientId;
            }
            if (scope.groupId) {
                scope.inparams.groupId = scope.groupId;
                scope.formData.groupId = scope.groupId;
            }
            scope.inparams.staffInSelectedOfficeOnly = true;

            resourceFactory.loanResource.get(scope.inparams, function (data) {
                scope.loanaccountinfo = data;
                if (data.clientName) {
                    scope.clientName = data.clientName;
                }
                if (data.group) {
                    scope.groupName = data.group.name;
                }
            });

            scope.loanProductChange = function (loanProductId) {

                scope.inparams.productId = loanProductId;

                resourceFactory.loanResource.get(scope.inparams, function (data) {
                    scope.loanaccountinfo = data;
                    if(scope.loanaccountinfo.loanOfficerOptions){
                        resourceFactory.clientResource.get({clientId: scope.clientId}, function (data) {
                            if(data.staffId != null){
                                scope.formData.loanOfficerId =  data.staffId;
                            }
                        })
                    }
                    if(scope.loanaccountinfo.multiDisburseLoan == true && scope.loanaccountinfo.product && scope.loanaccountinfo.product.maxTrancheCount){
                        scope.formData.noOfTranche = parseInt(scope.loanaccountinfo.product.maxTrancheCount);
                    }
                    scope.formData.loanAmountRequested = scope.loanaccountinfo.principal;
                    scope.formData.fixedEmiAmount = scope.loanaccountinfo.fixedEmiAmount;
                    scope.formData.numberOfRepayments = scope.loanaccountinfo.numberOfRepayments;
                    scope.formData.termFrequency = (scope.loanaccountinfo.repaymentEvery * scope.loanaccountinfo.numberOfRepayments);
                    scope.formData.termPeriodFrequencyEnum = scope.loanaccountinfo.repaymentFrequencyType.id;
                    scope.formData.repayEvery = scope.loanaccountinfo.repaymentEvery;
                    scope.formData.repaymentPeriodFrequencyEnum = scope.loanaccountinfo.repaymentFrequencyType.id;
                    scope.charges = scope.loanaccountinfo.charges || [];
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
                this.formData.charges = [];
                for (var i = 0; i < scope.charges.length; i++) {
                    var charge = {};
                    if(scope.charges[i].id){
                        charge.chargeId = scope.charges[i].id;
                    }
                    if(scope.charges[i].chargeId){
                        charge.chargeId = scope.charges[i].chargeId;
                    }
                    charge.amount = scope.charges[i].amount;
                    if(scope.charges[i].dueDate){
                        charge.dueDate = dateFilter(scope.charges[i].dueDate,scope.df);
                    }
                    charge.locale = scope.optlang.code;
                    charge.dateFormat = scope.df;
                    this.formData.charges.push(charge);
                }
                this.formData.submittedOnDate = dateFilter(this.formData.submittedOnDate,scope.df);
                this.formData.accountType = scope.inparams.templateType;
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                resourceFactory.loanApplicationReferencesResource.save(this.formData, function (data) {
                    location.path('/viewloanapplicationreference/' + data.resourceId);
                });
            };

            scope.cancel = function () {
                if (scope.groupId) {
                    location.path('/viewgroup/' + scope.groupId);
                } else if (scope.clientId) {
                    location.path('/viewclient/' + scope.clientId);
                }
            };
        }
    });
    mifosX.ng.application.controller('NewLoanApplicationReference', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.NewLoanApplicationReference]).run(function ($log) {
        $log.info("NewLoanApplicationReference initialized");
    });
}(mifosX.controllers || {}));