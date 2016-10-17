(function (module) {
    mifosX.controllers = _.extend(module, {
        LoanProductEligibilityController: function (scope, routeParams, resourceFactory, location, $modal, route, $http) {

            scope.loanProducts = [];

            resourceFactory.loanProductAssociationResource.getAll({associations: "eligibility"},function (data) {
                scope.loanProducts = data;
            });

            scope.routeTo = function (id) {
                location.path('/loanproduct/' + id +'/vieweligibility');
            };

            scope.showEdit = function (id) {
                location.path('/loanproduct/' + id +'/editeligibility');
            };
        }
    });
    mifosX.ng.application.controller('LoanProductEligibilityController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', '$http', mifosX.controllers.LoanProductEligibilityController]).run(function ($log) {
        $log.info("LoanProductEligibilityController initialized");
    });

}(mifosX.controllers || {}));