(function (module) {
    mifosX.controllers = _.extend(module, {
        AssignSavingsOfficerController: function (scope, resourceFactory, routeParams, location, dateFilter) {

            scope.loanOfficers = [];
            scope.formData = {};
            scope.staffData = {};
            scope.paramData = {};
            scope.accountNo = routeParams.id;


            resourceFactory.savingsResource.get({accountId: routeParams.id, template: 'true'}, function (data) {
                if(data.fieldOfficerOptions) {
                    scope.fieldOfficers = data.fieldOfficerOptions;
                    scope.formData.toSavingsOfficerId = data.fieldOfficerOptions[0].id;
                }
                scope.data = data;
            });


            scope.cancel = function () {
                location.path('/viewsavingaccount/' + scope.data.accountNo);
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.fromSavingsOfficerId = scope.data.fieldOfficerId || "";
                this.formData.assignmentDate = dateFilter(this.formData.assignmentDate, scope.df);
                resourceFactory.savingsResource.save({accountId: routeParams.id, command: 'assignSavingsOfficer'}, this.formData, function (data) {
                    location.path('/viewsavingaccount/' + scope.data.accountNo);
                });
            };

        }
    });
    mifosX.ng.application.controller('AssignSavingsOfficerController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.AssignSavingsOfficerController]).run(function ($log) {
        $log.info("AssignSavingsOfficerController initialized");
    });
}(mifosX.controllers || {}));

