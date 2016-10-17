(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewFamilyMemberDetailsController: function (scope, routeParams, resourceFactory, location, $modal, route, dateFilter) {

            scope.clientId = routeParams.clientId;
            scope.familyDetailId = routeParams.familyDetailId;

            resourceFactory.familyDetails.get({
                clientId: scope.clientId,
                familyDetailId: scope.familyDetailId
            }, function (data) {
                scope.familyDetail = data;
                if(data.dateOfBirth){
                    scope.familyDetail.dateOfBirth = dateFilter(new Date(scope.familyDetail.dateOfBirth), scope.df);
                }
            });
        }
    });
    mifosX.ng.application.controller('ViewFamilyMemberDetailsController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', 'dateFilter', mifosX.controllers.ViewFamilyMemberDetailsController]).run(function ($log) {
        $log.info("ViewFamilyMemberDetailsController initialized");
    });

}(mifosX.controllers || {}));