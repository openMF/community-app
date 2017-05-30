(function (module) {
    mifosX.controllers = _.extend(module, {
        GuarantorController: function (scope, resourceFactory, routeParams, location, dateFilter) {
            scope.template = {};
            scope.clientview = false;
            scope.temp = true;
            scope.date = {};
            scope.formData = {};
            scope.restrictDate = new Date();

            resourceFactory.guarantorResource.get({ loanId: routeParams.id, templateResource: 'template'}, function (data) {
                scope.template = data;
                scope.loanId = routeParams.id;
            });
            resourceFactory.clientResource.getAllClientsWithoutLimit(function (data) {
                scope.clients = data.pageItems;
            });
            scope.viewClient = function (item) {
                scope.clientview = true;
                scope.client = item;
                scope.changeEvent();
            };
            scope.checkClient = function () {
                if (!scope.temp) {
                    scope.clientview = false;
                }
            };

            scope.changeEvent = function () {
                resourceFactory.guarantorAccountResource.get({ loanId: routeParams.id, clientId: scope.client.id},  function (data) {
                    scope.accounts = data.accountLinkingOptions;
                });
            }

            scope.submit = function () {
                var guarantor = {};
                var reqDate = dateFilter(scope.date.first, scope.df);
                if (scope.temp == true) {
                    guarantor.guarantorTypeId = scope.template.guarantorTypeOptions[0].id;
                    guarantor.locale = scope.optlang.code;
                    if (this.formData) {
                        guarantor.clientRelationshipTypeId = this.formData.relationship;
                    }
                    if (scope.client) {
                        guarantor.entityId = scope.client.id;
                        guarantor.savingsId =  this.formData.savingsId;
                        guarantor.amount =  this.formData.amount;
                    }
                }
                else if (this.formData) {
                    guarantor.addressLine1 = this.formData.addressLine1;
                    guarantor.addressLine2 = this.formData.addressLine2;
                    guarantor.city = this.formData.city;
                    guarantor.dob = reqDate;
                    guarantor.zip = this.formData.zip;
                    guarantor.dateFormat = scope.df;
                    guarantor.locale = scope.optlang.code;
                    guarantor.firstname = this.formData.firstname;
                    guarantor.lastname = this.formData.lastname;
                    guarantor.mobileNumber = this.formData.mobile;
                    guarantor.housePhoneNumber = this.formData.residence;
                    guarantor.guarantorTypeId = scope.template.guarantorTypeOptions[2].id;
                    guarantor.clientRelationshipTypeId = this.formData.relationshipType;
                }
                resourceFactory.guarantorResource.save({ loanId: routeParams.id}, guarantor, function (data) {
                    location.path('viewloanaccount/' + routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('GuarantorController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.GuarantorController]).run(function ($log) {
        $log.info("GuarantorController initialized");
    });
}(mifosX.controllers || {}));
