(function (module) {
    mifosX.controllers = _.extend(module, {
        AccCreateRuleController: function (scope, resourceFactory, location) {

            scope.formData = {};
            scope.creditRuleType = 'Account';
            scope.debitRuleType = 'Account';
            scope.formData.creditTags = [];
            scope.formData.debitTags = [];

            resourceFactory.accountingRulesTemplateResource.get(function (data) {
                scope.glAccounts = data.allowedAccounts;
                scope.offices = data.allowedOffices;
                scope.creditTagOptions = data.allowedCreditTagOptions;
                scope.debitTagOptions = data.allowedDebitTagOptions;
                scope.formData.officeId = scope.offices[0].id;
                scope.formData.accountToCredit = scope.glAccounts[0];
                scope.formData.accountToDebit = scope.glAccounts[1];
            });
            
            scope.addDebitTag = function () {
                for (var i in this.availableDebit) {
                    for (var j in scope.debitTagOptions) {
                        if (scope.debitTagOptions[j].id == this.availableDebit[i]) {
                            var temp = {};
                            temp.id = scope.debitTagOptions[j].id;
                            temp.name = scope.debitTagOptions[j].name;
                            scope.formData.debitTags.push(temp);
                            scope.debitTagOptions.splice(j, 1);
                        }
                    }
                }
                this.availableDebit = this.availableDebit-1;
            };
            scope.removeDebitTag = function () {
                for (var i in this.selectedDebit) {
                    for (var j in scope.formData.debitTags) {
                        if (scope.formData.debitTags[j].id == this.selectedDebit[i]) {
                            var temp = {};
                            temp.id = scope.formData.debitTags[j].id;
                            temp.name = scope.formData.debitTags[j].name;
                            scope.debitTagOptions.push(temp);
                            scope.formData.debitTags.splice(j, 1);
                        }
                    }
                }
                this.selectedDebit = this.selectedDebit-1;
            };
            scope.addCreditTag = function () {
                for (var i in this.availableCredit) {
                    for (var j in scope.creditTagOptions) {
                        if (scope.creditTagOptions[j].id == this.availableCredit[i]) {
                            var temp = {};
                            temp.id = scope.creditTagOptions[j].id;
                            temp.name = scope.creditTagOptions[j].name;
                            scope.formData.creditTags.push(temp);
                            scope.creditTagOptions.splice(j, 1);
                        }
                    }
                }
                this.availableCredit = this.availableCredit-1;
            };
            scope.removeCreditTag = function () {
                for (var i in this.selectedCredit) {
                    for (var j in scope.formData.creditTags) {
                        if (scope.formData.creditTags[j].id == this.selectedCredit[i]) {
                            var temp = {};
                            temp.id = scope.formData.creditTags[j].id;
                            temp.name = scope.formData.creditTags[j].name;
                            scope.creditTagOptions.push(temp);
                            scope.formData.creditTags.splice(j, 1);
                        }
                    }
                }
                this.selectedCredit = this.selectedCredit-1;
            };
            
            scope.resetCredits = function () {
                scope.formData.creditTags = [];
            }

            scope.resetDebits = function () {
                scope.formData.debitTags = [];
            }

            scope.submit = function () {
                var accountingRule = new Object();
                accountingRule.name = this.formData.name;
                accountingRule.officeId = this.formData.officeId;
                accountingRule.description = this.formData.description;

                //Construct creditsTags array
                if (this.creditRuleType == 'tags') {
                    accountingRule.allowMultipleCreditEntries = this.formData.allowMultipleCreditEntries;
                    accountingRule.creditTags = [];
                    for (var i = 0; i < this.formData.creditTags.length; i++) {
                        accountingRule.creditTags.push(this.formData.creditTags[i].id);
                    }
                } else {
                    accountingRule.accountToCredit = this.formData.accountToCredit.id;
                }

                //Construct debitTags array
                if (this.debitRuleType == 'tags') {
                    accountingRule.allowMultipleDebitEntries = this.formData.allowMultipleDebitEntries;
                    accountingRule.debitTags = [];
                    for (var i = 0; i < this.formData.debitTags.length; i++) {
                        accountingRule.debitTags.push(this.formData.debitTags[i].id);
                    }
                } else {
                    accountingRule.accountToDebit = this.formData.accountToDebit.id;
                }

                resourceFactory.accountingRulesResource.save(accountingRule, function (data) {
                    location.path('/viewaccrule/' + data.resourceId);
                });
            }

        }
    });
    mifosX.ng.application.controller('AccCreateRuleController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.AccCreateRuleController]).run(function ($log) {
        $log.info("AccCreateRuleController initialized");
    });
}(mifosX.controllers || {}));