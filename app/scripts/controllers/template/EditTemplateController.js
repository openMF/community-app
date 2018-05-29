(function (module) {
    mifosX.controllers = _.extend(module, {
        EditTemplateController: function (scope, resourceFactory, location, routeParams, $rootScope) {
            scope.mappers = [];
            scope.formData = {};
            resourceFactory.templateResource.getTemplateDetails({templateId: routeParams.id, resourceType: 'template'}, function (data) {
                scope.template = data;
                scope.templateId = data.template.id;
                scope.advanceOption = 'false';

                for (var i in data.entities) {
                    if (data.entities[i].name == data.template.entity) {
                        scope.formData.entity = data.entities[i].id;
                        break;
                    }
                }

                for (var i in data.types) {
                    if (data.types[i].name == data.template.type) {
                        scope.formData.type = data.types[i].id;
                        break;
                    }
                }

                scope.templateKeyEntity = data.template.entity;
                scope.formData.name = data.template.name;
                scope.formData.text = data.template.text;

                for (var i in data.template.mappers) {
                    if (i == 0) {
                        scope.mappers.push({
                            mappersorder: data.template.mappers[i].mapperorder,
                            mapperskey: data.template.mappers[i].mapperkey,
                            mappersvalue: data.template.mappers[i].mappervalue,
                            defaultAddIcon: 'true'
                        });
                    } else {
                        scope.mappers.push({
                            mappersorder: data.template.mappers[i].mapperorder,
                            mapperskey: data.template.mappers[i].mapperkey,
                            mappersvalue: data.template.mappers[i].mappervalue,
                            defaultAddIcon: 'false'
                        });
                    }
                }

                if (data.template.entity == "client") {
                    scope.clientKeys();
                } else if (data.template.entity == "loan") {
                    scope.loanKeys();
                }
                CKEDITOR.instances.templateeditor.insertHtml(data.template.text);
            });

            scope.clientKeys = function () {
                scope.clientTemplateKeys = ["{{client.accountNo}}", "{{client.status.value}}", "{{client.fullname}}",
                    "{{client.displayName}}", "{{client.officeName}}", "{{#client.groups}}", "{{/client.groups}}"];
                scope.templateEntity = [
                    {"entityName": "Client",
                        "templateKeys": scope.clientTemplateKeys}
                ];
                if (scope.templateKeyEntity != "client") {
                    CKEDITOR.instances.templateeditor.setData('');
                }
            }

            scope.loanKeys = function () {
                scope.loanTemplateKeys = ["{{loan.accountNo}}", "{{loan.status.value}}", "{{loan.loanProductId}}",
                    "{{loan.loanProductName}}", "{{loan.loanProductDescription}}"];
                scope.repaymentTemplateKeys = ["{{loan.repaymentSchedule.loanTermInDays}}", "{{loan.repaymentSchedule.totalPrincipalDisbursed}}",
                    "{{loan.repaymentSchedule.totalPrincipalExpected}}", "{{loan.repaymentSchedule.totalPrincipalPaid}}",
                    "{{loan.repaymentSchedule.totalInterestCharged}}", "{{loan.repaymentSchedule.totalFeeChargesCharged}}",
                    "{{loan.repaymentSchedule.totalPenaltyChargesCharged}}", "{{loan.repaymentSchedule.totalWaived}}",
                    "{{loan.repaymentSchedule.totalWrittenOff}}", "{{loan.repaymentSchedule.totalRepaymentExpected}}",
                    "{{loan.repaymentSchedule.totalRepayment}}", "{{loan.repaymentSchedule.totalPaidInAdvance}}",
                    "{{loan.repaymentSchedule.totalPaidLate}}", "{{loan.repaymentSchedule.totalOutstanding}}"];
                scope.templateEntity = [
                    {"entityName": "Loan",
                        "templateKeys": scope.loanTemplateKeys
                    },
                    {"entityName": "Repayment Schedule",
                        "templateKeys": scope.repaymentTemplateKeys
                    }
                ];
                if (scope.templateKeyEntity != "loan") {
                    CKEDITOR.instances.templateeditor.setData('');
                }
            }

            scope.entityChange = function (entityId) {
                if (entityId != 0) {
                    scope.mappers.splice(0, 1, {
                        mappersorder: 0,
                        mapperskey: "loan",
                        mappersvalue: "loans/{{loanId}}?associations=all&tenantIdentifier=" + $rootScope.tenantIdentifier,
                        defaultAddIcon: 'true'
                    });
                    scope.loanKeys();
                    scope.templateKeyEntity = "Loan";
                } else {
                    scope.templateKeyEntity = "Client";
                    scope.mappers.splice(0, 1, {
                        mappersorder: 0,
                        mapperskey: "client",
                        mappersvalue: "clients/{{clientId}}?tenantIdentifier=" + $rootScope.tenantIdentifier,
                        defaultAddIcon: 'true'
                    });
                    scope.clientKeys();
                }
            }

            scope.templateKeySelected = function (templateKey) {
                CKEDITOR.instances.templateeditor.insertText(templateKey);
            }

            scope.addMapperKeyValue = function () {
                scope.mappers.push({
                    mappersorder: scope.mappers.length,
                    mapperskey: "",
                    mappersvalue: ""
                });
            }

            scope.deleteMapperKeyValue = function (index) {
                scope.mappers.splice(index, 1);
            }

            scope.advanceOptionClick = function () {
                if (scope.advanceOption == 'false') {
                    scope.advanceOption = 'true';
                } else {
                    scope.advanceOption = 'false';
                }
            }

            scope.submit = function () {
                for (var i in scope.mappers) {
                    delete scope.mappers[i].defaultAddIcon;
                }
                this.formData.mappers = scope.mappers;
                this.formData.text = CKEDITOR.instances.templateeditor.getData();
                resourceFactory.templateResource.update({templateId: routeParams.id}, this.formData, function (data) {
                    location.path('/viewtemplate/' + data.resourceId);
                });
            }


        }
    });
    mifosX.ng.application.controller('EditTemplateController', ['$scope', 'ResourceFactory', '$location', '$routeParams', '$rootScope', mifosX.controllers.EditTemplateController]).run(function ($log) {
        $log.info("EditTemplateController initialized");
    });
}(mifosX.controllers || {}));
