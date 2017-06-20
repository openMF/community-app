(function (module) {
    mifosX.controllers = _.extend(module, {
        UnAssignSavingsOfficerController: function (scope, resourceFactory, routeParams, location, dateFilter) {

            scope.loanOfficers = [];
            scope.formData = {};
            scope.staffData = {};
            scope.accountNo = routeParams.id;

            /*resourceFactory.savingsResource.get({accountId: routeParams.id, template: 'true'}, function (data) {
                scope.data = data;
            });*/

            scope.cancel = function () {
                location.path('/viewsavingaccount/' + scope.accountNo);
            };

            scope.submit = function () {
                scope.staffData.staffId = scope.formData.fieldOfficerId;
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.unassignedDate = dateFilter(this.formData.unassignedDate, scope.df);
                resourceFactory.savingsResource.save({accountId: routeParams.id, command:'unassignSavingsOfficer'}, this.formData, function (data) {
                    location.path('/viewsavingaccount/' + scope.accountNo);
                });

            };

        }
    });
    mifosX.ng.application.controller('UnAssignSavingsOfficerController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.UnAssignSavingsOfficerController]).run(function ($log) {
        $log.info("UnAssignSavingsOfficerController initialized");
    });
}(mifosX.controllers || {}));

