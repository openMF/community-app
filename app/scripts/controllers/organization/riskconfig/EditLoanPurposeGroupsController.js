(function (module) {
    mifosX.controllers = _.extend(module, {
        EditLoanPurposeGroupsController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            scope.formData = {};
            scope.typeEnums = [];
            scope.entityType = routeParams.entityType;

            resourceFactory.loanPurposeGroupTemplateResource.get(function (data) {
                scope.typeEnums = data.loanPurposeGroupTypeOptions;
            });

            resourceFactory.loanPurposeGroupResource.get({
                loanPurposeGroupsId: routeParams.id,
                isFetchLoanPurposeDatas: true
            }, function (data) {
                scope.formData = data;
                scope.formData.loanPurposeGroupTypeId = data.loanPurposeGroupType.id;
                delete scope.formData.loanPurposeGroupType;
            });

            scope.submit = function () {
                scope.formData.locale = "en";
                if (scope.formData) {
                    delete scope.formData.id;
                }
                if (scope.formData.shortName != null || scope.formData.shortName != "") {
                    delete scope.formData.shortName;
                }
                if (scope.formData.loanPurposeDatas) {
                    delete scope.formData.loanPurposeDatas;
                }
                resourceFactory.loanPurposeGroupResource.update({'loanPurposeGroupsId': routeParams.id}, scope.formData, function (data) {
                    location.path('/loanpurposegroups/');
                });
            };
        }
    });
    mifosX.ng.application.controller('EditLoanPurposeGroupsController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.EditLoanPurposeGroupsController]).run(function ($log) {
        $log.info("EditLoanPurposeGroupsController initialized");
    });
}(mifosX.controllers || {}));
