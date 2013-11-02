(function(module) {
    mifosX.controllers = _.extend(module, {
        EditGuarantorController: function(scope, resourceFactory, routeParams, location,dateFilter) {
            scope.template = {};
            scope.clientview = false;
            scope.date = {};
            resourceFactory.guarantorResource.get({ loanId: routeParams.loanId,templateResource:routeParams.id,template:true}, function(data) {
                scope.template = data;
                scope.date.first = new Date(data.dob)
                scope.formData = {
                    relationshipType: data.clientRelationshipType.id,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    city: data.city,
                    zip: data.zip,
                    mobile: data.mobileNumber,
                    residence: data.housePhoneNumber
                }
            });
            scope.submit = function(){
                var guarantor = {};
                var reqDate = dateFilter(scope.date.first,'dd MMMM yyyy');
                guarantor.addressLine1=this.formData.addressLine1;
                guarantor.addressLine2=this.formData.addressLine2;
                guarantor.city = this.formData.city;
                guarantor.dob=reqDate;
                guarantor.zip=this.formData.zip;
                guarantor.dateFormat="dd MMMM yyyy";
                guarantor.locale='en';
                guarantor.firstname = this.formData.firstname;
                guarantor.lastname = this.formData.lastname;
                guarantor.mobileNumber = this.formData.mobile;
                guarantor.housePhoneNumber = this.formData.residence;
                guarantor.clientRelationshipTypeId = this.formData.relationshipType;
                guarantor.guarantorTypeId = 3;
                resourceFactory.guarantorResource.update({ loanId:routeParams.loanId,templateResource:routeParams.id},guarantor, function(data) {
                    location.path('viewloanaccount/'+routeParams.loanId);
                });
            }
        }
    });
    mifosX.ng.application.controller('EditGuarantorController', ['$scope', 'ResourceFactory', '$routeParams', '$location','dateFilter', mifosX.controllers.EditGuarantorController]).run(function($log) {
        $log.info("EditGuarantorController initialized");
    });
}(mifosX.controllers || {}));
