(function (module) {
    mifosX.controllers = _.extend(module, {
        UnAssignSavingsOfficerController: function (scope, resourceFactory, routeParams, location, dateFilter) {

            scope.loanOfficers = [];
            scope.formData = {};
            scope.staffData = {};
            scope.accountNo = routeParams.id;

            resourceFactory.savingsResource.get({accountId: routeParams.id, template: 'true'}, function (data) {
                if(data.fieldOfficerOptions) {
                    scope.formData.fieldOfficerId = data.fieldOfficerId;
                }
                scope.data = data;
            });

            scope.cancel = function () {
                location.path('/viewsavingaccount/' + scope.accountNo);
            };

            scope.submit = function () {
                scope.staffData.staffId = scope.formData.fieldOfficerId;
                resourceFactory.savingsResource.save({accountId: routeParams.id, command:'unassignFieldOfficer'}, scope.staffData, function (data) {
                    location.path('/viewsavingaccount/' + scope.accountNo);
                });

            };

        }
    });
    mifosX.ng.application.controller('UnAssignSavingsOfficerController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.UnAssignSavingsOfficerController]).run(function ($log) {
        $log.info("UnAssignSavingsOfficerController initialized");
    });
}(mifosX.controllers || {}));

