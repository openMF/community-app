(function (module) {
    mifosX.controllers = _.extend(module, {
        LoanPurposeGroupsController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            scope.typeEnums = [];
            scope.showEditFromView = true;

            resourceFactory.loanPurposeGroupResource.getAll(function (data) {
                scope.loanpurposegroups = data;
            });

            scope.routeTo = function (id) {
                location.path('/viewloanpurposegroup/' + id);
            };

            scope.showEdit = function (id) {
                location.path('/loanpurposegroup/editloanpurposegroup/' + id);
            }
        }
    });
    mifosX.ng.application.controller('LoanPurposeGroupsController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.LoanPurposeGroupsController]).run(function ($log) {
        $log.info("LoanPurposeGroupsController initialized");
    });

}(mifosX.controllers || {}));