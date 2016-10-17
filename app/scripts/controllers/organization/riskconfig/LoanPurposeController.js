(function (module) {
    mifosX.controllers = _.extend(module, {
        LoanPurposeController: function (scope, routeParams, resourceFactory, location, $modal, route, $http) {

            scope.loanPurposes = [];
            scope.loanPurposeId = routeParams.id;
            scope.loanPurposeGroupDatas = [];
            scope.desccription = "";
            scope.name = "";
            scope.categoryOptions = [];
            scope.classificationOptions = [];
            scope.loanPurposeGroupIds = [];

            resourceFactory.loanPurposeResource.getAll(function (data) {
                scope.loanPurposes = data;
            });

            scope.routeTo = function (id) {
                location.path('/viewloanpurpose/' + id);
            };

            scope.showEdit = function (id) {
                location.path('/editloanpurpose/' + id);
            };
        }
    });
    mifosX.ng.application.controller('LoanPurposeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', '$http', mifosX.controllers.LoanPurposeController]).run(function ($log) {
        $log.info("LoanPurposeController initialized");
    });

}(mifosX.controllers || {}));