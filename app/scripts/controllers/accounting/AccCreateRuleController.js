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

            scope.addCreditTag = function () {
                if (scope.formData.creditTagTemplate != undefined) {
                    scope.formData.creditTags.push({id: scope.formData.creditTagTemplate.id, name: scope.formData.creditTagTemplate.name});
                    scope.formData.creditTagTemplate = undefined;
                }
            }

            scope.removeCrTag = function (index) {
                scope.formData.creditTags.splice(index, 1);
            }

            scope.resetCredits = function () {
                scope.formData.creditTags = [];
            }

            scope.addDebitTag = function () {
                if (scope.formData.debitTagTemplate != undefined) {
                    scope.formData.debitTags.push({id: scope.formData.debitTagTemplate.id, name: scope.formData.debitTagTemplate.name});
                    scope.formData.debitTagTemplate = undefined;
                }
            }

            scope.resetDebits = function () {
                scope.formData.debitTags = [];
            }

            scope.removeDebitTag = function (index) {
                scope.formData.debitTags.splice(index, 1);
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