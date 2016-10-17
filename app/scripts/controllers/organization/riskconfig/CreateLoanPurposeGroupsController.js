(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateLoanPurposeGroupsController: function (scope, routeParams, resourceFactory, location, $modal, route) {
            scope.formData = {};
            scope.formData.isActive = true;
            resourceFactory.loanPurposeGroupTemplateResource.get(function (data) {
                scope.typeEnums = data.loanPurposeGroupTypeOptions;
            });
            scope.submit = function () {
                this.formData.locale = "en";
                resourceFactory.loanPurposeGroupResource.save(this.formData, function (response) {
                    location.path('/loanpurposegroups/')
                });
            }
        }
    });
    mifosX.ng.application.controller('CreateLoanPurposeGroupsController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.CreateLoanPurposeGroupsController]).run(function ($log) {
        $log.info("CreateLoanPurposeGroupsController initialized");
    });

}(mifosX.controllers || {}));