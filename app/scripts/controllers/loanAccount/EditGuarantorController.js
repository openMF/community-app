(function (module) {
    mifosX.controllers = _.extend(module, {
        EditGuarantorController: function (scope, resourceFactory, routeParams, location, dateFilter) {
            scope.template = {};
            scope.clientview = false;
            scope.date = {};
            scope.restrictDate = new Date();
            resourceFactory.guarantorResource.get({ loanId: routeParams.loanId, templateResource: routeParams.id, template: true}, function (data) {
                scope.template = data;
                scope.formData = {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    city: data.city,
                    zip: data.zip,
                    mobile: data.mobileNumber,
                    residence: data.housePhoneNumber,
                    addressLine1: data.addressLine1,
                    addressLine2:data.addressLine2
                }

                if (data.clientRelationshipType) {
                    scope.formData.relationshipType = data.clientRelationshipType.id;
                }

                if (data.dob) {
                    scope.date.first = new Date(dateFilter(data.dob, scope.df));
                }
            });
            scope.submit = function () {
                var guarantor = {};
                var reqDate = dateFilter(scope.date.first, scope.df);
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
                guarantor.clientRelationshipTypeId = this.formData.relationshipType;
                guarantor.guarantorTypeId = 3;
                resourceFactory.guarantorResource.update({ loanId: routeParams.loanId, templateResource: routeParams.id}, guarantor, function (data) {
                    location.path('listguarantors/' + routeParams.loanId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditGuarantorController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.EditGuarantorController]).run(function ($log) {
        $log.info("EditGuarantorController initialized");
    });
}(mifosX.controllers || {}));
