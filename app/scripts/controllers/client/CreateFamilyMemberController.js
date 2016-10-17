(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateFamilyMemberController: function (scope, routeParams, resourceFactory, location, $modal, route, dateFilter) {

            scope.clientId = routeParams.clientId;
            scope.salutationOptions = [];
            scope.relationshipOptions = [];
            scope.genderOptions = [];
            scope.educationOptions = [];
            scope.occupationOptions = [];
            scope.subOccupations = [];

            resourceFactory.familyDetailsTemplate.get({clientId: scope.clientId}, function (data) {
                scope.salutationOptions = data.salutationOptions;
                scope.relationshipOptions = data.relationshipOptions;
                scope.genderOptions = data.genderOptions;
                scope.educationOptions = data.educationOptions;
                scope.occupationOptions = data.occupationOptions;
            });

            scope.submit = function () {
                if (scope.salutationId) {
                    this.formData.salutationId = scope.salutationId;
                }
                if (scope.relationshipId) {
                    this.formData.relationshipId = scope.relationshipId;
                }
                if (scope.genderId) {
                    this.formData.genderId = scope.genderId;
                }
                if (scope.formData.dateOfBirth) {
                    this.formData.dateOfBirth = dateFilter(scope.formData.dateOfBirth, scope.df);
                }
                if (scope.occupationId) {
                    this.formData.occupationDetailsId = scope.occupationOption.id;
                }

                if (scope.educationId) {
                    this.formData.educationId = scope.educationId;
                }
                scope.formData.dateFormat = scope.df;
                this.formData.locale = scope.optlang.code;
                resourceFactory.familyDetails.save({clientId: scope.clientId}, this.formData, function (data) {
                    location.path('/listfamilydetails/' + scope.clientId)
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateFamilyMemberController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', 'dateFilter', mifosX.controllers.CreateFamilyMemberController]).run(function ($log) {
        $log.info("CreateFamilyMemberController initialized");
    });

}(mifosX.controllers || {}));