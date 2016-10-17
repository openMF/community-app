(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateFamilyMemberSummaryController: function (scope, routeParams, resourceFactory, location, $modal, route, $http) {

            scope.clientId = routeParams.clientId;

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                resourceFactory.familyDetailsSummary.save({clientId: scope.clientId}, this.formData, function (data) {
                    location.path('/viewclient/' + scope.clientId)
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateFamilyMemberSummaryController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', '$http', mifosX.controllers.CreateFamilyMemberSummaryController]).run(function ($log) {
        $log.info("CreateFamilyMemberSummaryController initialized");
    });

}(mifosX.controllers || {}));