(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateEmployeeController: function (scope, resourceFactory, location, dateFilter) {
            scope.dateError = false;
            scope.offices = [];
            scope.restrictDate = new Date();
            resourceFactory.officeResource.getAllOfficesInAlphabeticalOrder(function (data) {
                scope.offices = data;
                scope.formData = {
                    isLoanOfficer: true,
                    officeId: scope.offices[0].id,
                };
            });

            scope.opening_date = function() {
             for(var i=0;i<scope.offices.length;i++) {
                 if ((scope.offices[i].id) === (scope.formData.officeId)) {
                    var opening_date = new Date(scope.offices[i].openingDate);
                    return opening_date;
                 }
             }
            };

            scope.submit = function () {
                if(this.formData.joiningDate >= scope.opening_date() && this.formData.joiningDate <= scope.restrictDate)
                {
                    scope.dateError = false;
                    this.formData.locale = scope.optlang.code;
                    var joiningDate = dateFilter(scope.formData.joiningDate, scope.df);
                    this.formData.dateFormat = scope.df;
                    this.formData.joiningDate = joiningDate;
                    resourceFactory.employeeResource.save(this.formData, function (data) {
                        location.path('/viewemployee/' + data.resourceId);
                    });
                }
                else
                    scope.dateError = true;
            };
        }
    });
    mifosX.ng.application.controller('CreateEmployeeController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateEmployeeController]).run(function ($log) {
        $log.info("CreateEmployeeController initialized");
    });
}(mifosX.controllers || {}));
