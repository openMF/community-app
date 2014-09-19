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
                    scope.paramData.toSavingsOfficerId = data.fieldOfficerOptions[0].id;
                }
                scope.data = data;
            });


            scope.cancel = function () {
                location.path('/viewsavingaccount/' + scope.data.accountNo);
            };

            scope.submit = function () {
                console.log("print",scope);
                this.paramData.fromSavingsOfficerId = scope.data.fieldOfficerId || "";
                console.log("this.paramdata",this.paramData);
                resourceFactory.savingsResource.save({accountId: routeParams.id, command: 'assignSavingsOfficer'}, this.paramData, function (data) {
                    location.path('/viewsavingaccount/' + scope.data.accountNo);
                });
            };

        }
    });
    mifosX.ng.application.controller('AssignSavingsOfficerController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.AssignSavingsOfficerController]).run(function ($log) {
        $log.info("AssignSavingsOfficerController initialized");
    });
}(mifosX.controllers || {}));

