(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateEmployeeController: function (scope, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.restrictDate = new Date();
            resourceFactory.officeResource.getAllOfficesInAlphabeticalOrder(function (data) {
                scope.offices = data;
                scope.formData = {
                    isLoanOfficer: true,
                    officeId: scope.offices[0].id,
                };
            });

             scope.minDat = function() {
                 for(var i=0;i<scope.offices.length;i++) {
                     if ((scope.offices[i].id) === (scope.formData.officeId)) {
                         return scope.offices[i].openingDate;
                     }
                 }
                };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                var joiningDate = dateFilter(scope.formData.joiningDate, scope.df);
                this.formData.dateFormat = scope.df;
                this.formData.joiningDate = joiningDate;
                resourceFactory.employeeResource.save(this.formData, function (data) {
                    location.path('/viewemployee/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateEmployeeController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateEmployeeController]).run(function ($log) {
        $log.info("CreateEmployeeController initialized");
    });
}(mifosX.controllers || {}));
