(function (module) {
    mifosX.controllers = _.extend(module, {
        AccEditRuleController: function (scope, resourceFactory, location, routeParams) {

            scope.formData = {};
            scope.creditRuleType = 'Account';
            scope.debitRuleType = 'Account';
            scope.formData.creditTags = [];
            scope.formData.debitTags = [];
            scope.offices = [];

            resourceFactory.accountingRulesResource.getById({accountingRuleId: routeParams.id, template: true}, function (data) {
                //Initialize the template options
                scope.glAccounts = data.allowedAccounts;
                scope.offices = data.allowedOffices;
                scope.creditTagOptions = data.allowedCreditTagOptions;
                scope.debitTagOptions = data.allowedDebitTagOptions;
                scope.accountingRuleId = data.id;
                //update text fields
                scope.formData.name = data.name;
                scope.formData.officeId = data.officeId;
                scope.formData.description = data.description;

                //update formData for view previous details.
                for (var i = 0; i < data.allowedOffices.length; i++) {
                    if (data.officeId == data.allowedOffices[i].id) {
                        scope.formData.office = data.allowedOffices[i].id;
                    }
                }

                //update credits
                if (data.creditAccounts) {
                    //if the selected type is account then creditAccounts array will have only 1 account, which is a selected account.
                    scope.formData.accountToCredit = data.creditAccounts[0].id;
                    scope.creditRuleType = 'Account';
                } else {
                    //if the selected type is tags then push the tags into creditTags array
                    scope.formData.creditTags = [];
                    scope.creditRuleType = 'tags';
                    scope.formData.allowMultipleCreditEntries = data.allowMultipleCreditEntries;
                    for (var i = 0; i < data.creditTags.length; i++) {
                        scope.formData.creditTags.push(data.creditTags[i].tag);
                    }
                }

                //update debits
                if (data.debitAccounts) {
                    //if the selected type is account then debitAccounts array will have only 1 account, which is a selected account.
                    scope.formData.accountToDebit = data.debitAccounts[0].id;
                    scope.debitRuleType = 'Account';
                } else {
                    //if the selected type is tags then push the tags into debitTags array
                    scope.formData.debitTags = [];
                    scope.debitRuleType = 'tags';
                    scope.formData.allowMultipleDebitEntries = data.allowMultipleDebitEntries;
                    for (var i = 0; i < data.debitTags.length; i++) {
                        scope.formData.debitTags.push(data.debitTags[i].tag);
                    }
                }
            });
            
            scope.addDebitTag = function () {
                for (var i in this.availableDebit) {
                    for (var j in scope.debitTagOptions) {
                        if (scope.debitTagOptions[j].id == this.availableDebit[i].id) {
                            var temp = {};
                            temp.id = this.availableDebit[i].id;
                            temp.name = this.availableDebit[i].name;
                            scope.formData.debitTags.push(temp);
                            scope.debitTagOptions.splice(j, 1);
                        }
                    }
                }
            };
            scope.removeDebitTag = function () {
                for (var i in this.selectedDebit) {
                    for (var j in scope.formData.debitTags) {
                        if (scope.formData.debitTags[j].id == this.selectedDebit[i].id) {
                            var temp = {};
                            temp.id = this.selectedDebit[i].id;
                            temp.name = this.selectedDebit[i].name;
                            scope.debitTagOptions.push(temp);
                            scope.formData.debitTags.splice(j, 1);
                        }
                    }
                }
            };
            scope.addCreditTag = function () {
                for (var i in this.availableCredit) {
                    for (var j in scope.creditTagOptions) {
                        if (scope.creditTagOptions[j].id == this.availableCredit[i].id) {
                            var temp = {};
                            temp.id = this.availableCredit[i].id;
                            temp.name = this.availableCredit[i].name;
                            scope.formData.creditTags.push(temp);
                            scope.creditTagOptions.splice(j, 1);
                        }
                    }
                }
            };
            scope.removeCreditTag = function () {
                for (var i in this.selectedCredit) {
                    for (var j in scope.formData.creditTags) {
                        if (scope.formData.creditTags[j].id == this.selectedCredit[i].id) {
                            var temp = {};
                            temp.id = this.selectedCredit[i].id;
                            temp.name = this.selectedCredit[i].name;
                            scope.creditTagOptions.push(temp);
                            scope.formData.creditTags.splice(j, 1);
                        }
                    }
                }
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
                    accountingRule.accountToCredit = this.formData.accountToCredit;
                }

                //Construct debitTags array
                if (this.debitRuleType == 'tags') {
                    accountingRule.allowMultipleDebitEntries = this.formData.allowMultipleDebitEntries;
                    accountingRule.debitTags = [];
                    for (var i = 0; i < this.formData.debitTags.length; i++) {
                        accountingRule.debitTags.push(this.formData.debitTags[i].id);
                    }
                } else {
                    accountingRule.accountToDebit = this.formData.accountToDebit;
                }

                resourceFactory.accountingRulesResource.update({accountingRuleId: routeParams.id}, accountingRule, function (data) {
                    location.path('/viewaccrule/' + data.resourceId);
                });
            }

        }
    });
    mifosX.ng.application.controller('AccEditRuleController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.AccEditRuleController]).run(function ($log) {
        $log.info("AccEditRuleController initialized");
    });
}(mifosX.controllers || {}));