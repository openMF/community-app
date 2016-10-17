(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewLoanProductEligibilityController: function (scope, routeParams, resourceFactory, location, $modal, route, $http) {


            scope.eligibilityData = {};
            resourceFactory.loanProductEligibility.get({loanProductId: routeParams.id},
                function (data) {
                    scope.eligibilityData = data;
                    scope.eligibilityData.criterias.forEach(function (item) {
                        if(item.approvalLogic!== undefined && item.approvalLogic.expression!==undefined) {
                            item.approvalLogicStr = item.approvalLogic.expression.comparator + " " + item.approvalLogic.expression.value;
                        }
                        if(item.rejectionLogic!== undefined && item.rejectionLogic.expression!==undefined) {
                            item.rejectionLogicStr = item.rejectionLogic.expression.comparator + " " + item.rejectionLogic.expression.value;
                        }
                    });
                }
            );

        }
    });
    mifosX.ng.application.controller('ViewLoanProductEligibilityController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', '$http', mifosX.controllers.ViewLoanProductEligibilityController]).run(function ($log) {
        $log.info("ViewLoanProductEligibilityController initialized");
    });

}(mifosX.controllers || {}));