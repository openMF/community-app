(function (module) {
    mifosX.controllers = _.extend(module, {
        AssignSavingsOfficerController: function (scope, resourceFactory, routeParams, location, dateFilter) {

            scope.loanOfficers = [];
            scope.formData = {};
            scope.staffData = {};
            scope.accountNo = routeParams.id;


            resourceFactory.savingsResource.get({accountId: routeParams.id, template: 'true'}, function (data) {
                if(data.fieldOfficerOptions) {
                    scope.fieldOfficers = data.fieldOfficerOptions;
                    scope.formData.fieldOfficerId = data.fieldOfficerOptions[0].id;
                }
                scope.data = data;
            });


            scope.cancel = function () {
                location.path('/viewsavingaccount/' + scope.data.accountNo);
            };

            scope.submit = function () {
                scope.staffData.staffId = scope.formData.fieldOfficerId;
                resourceFactory.savingsResource.save({accountId: routeParams.id, command: 'assignFieldOfficer'}, scope.staffData, function (data) {
                    location.path('/viewsavingaccount/' + scope.data.accountNo);
                });
            };

        }
    });
    mifosX.ng.application.controller('AssignSavingsOfficerController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.AssignSavingsOfficerController]).run(function ($log) {
        $log.info("AssignSavingsOfficerController initialized");
    });
}(mifosX.controllers || {}));

