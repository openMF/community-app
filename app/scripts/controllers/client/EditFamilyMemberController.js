(function (module) {
    mifosX.controllers = _.extend(module, {
        EditFamilyMemberController: function (scope, routeParams, resourceFactory, location, $modal, route, dateFilter) {

            scope.clientId = routeParams.clientId;
            scope.familyDetailId = routeParams.familyDetailId;

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

                resourceFactory.familyDetails.get({
                    clientId: scope.clientId,
                    familyDetailId: scope.familyDetailId
                }, function (data) {
                    //console.log(JSON.stringify(data));
                    scope.formData = {};
                    scope.formData.firstname = data.firstname;
                    scope.formData.middlename = data.middlename;
                    scope.formData.lastname = data.lastname;
                    scope.formData.dateOfBirth = dateFilter(new Date(data.dateOfBirth), scope.df);
                    scope.formData.age = data.age;
                    scope.formData.isDependent = data.isDependent;
                    scope.formData.isSeriousIllness = data.isSeriousIllness;
                    scope.formData.isDeceased = data.isDeceased;
                    if(data.salutation){
                        scope.formData.salutationId = data.salutation.id;
                    }
                    if(data.relationship){
                        scope.formData.relationshipId = data.relationship.id;
                    }
                    if(data.gender){
                        scope.formData.genderId = data.gender.id;
                    }
                    if(data.education){
                        scope.formData.educationId = data.education.id;
                    }
                    if(data.occupation){
                        scope.occupationOption = data.occupation;
                        scope.formData.occupationDetailsId = scope.occupationOption.id;
                    }
                });
            });

            scope.submit = function () {
                if(scope.formData.dateOfBirth) {
                    scope.formData.dateOfBirth = dateFilter(scope.formData.dateOfBirth, scope.df);
                }
                scope.formData.dateFormat = scope.df;
                scope.formData.locale = scope.optlang.code;

                resourceFactory.familyDetails.update({
                    clientId: scope.clientId,
                    familyDetailId: scope.familyDetailId
                }, scope.formData, function (data) {
                    location.path('/listfamilydetails/' + scope.clientId)
                });
            };
        }
    });
    mifosX.ng.application.controller('EditFamilyMemberController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', 'dateFilter', mifosX.controllers.EditFamilyMemberController]).run(function ($log) {
        $log.info("EditFamilyMemberController initialized");
    });

}(mifosX.controllers || {}));