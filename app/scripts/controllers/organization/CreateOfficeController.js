(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateOfficeController: function (scope, resourceFactory, location, dateFilter) {
            scope.dateError = false;
            scope.offices = [];
            scope.first = {};
            scope.first.date = new Date();
            scope.restrictDate = new Date();
            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                scope.formData = {
                    parentId: scope.offices[0].id
                }
            });

             scope.minDat = function() {
                 for(var i=0;i<scope.offices.length;i++) {
                     if ((scope.offices[i].id) === (scope.formData.parentId)) {
                         return scope.offices[i].openingDate;
                     }
                 }
                };

            scope.submit = function () {
                if(this.first.date <= scope.restrictDate)
                {
                    scope.dateError = false;
                    this.formData.locale = scope.optlang.code;
                    var reqDate = dateFilter(scope.first.date, scope.df);
                    this.formData.dateFormat = scope.df;
                    this.formData.openingDate = reqDate;
                    resourceFactory.officeResource.save(this.formData, function (data) {
                        location.path('/viewoffice/' + data.resourceId);
                    });
                }
                else
                    scope.dateError = true;
            };
        }
    });
    mifosX.ng.application.controller('CreateOfficeController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateOfficeController]).run(function ($log) {
        $log.info("CreateOfficeController initialized");
    });
}(mifosX.controllers || {}));
