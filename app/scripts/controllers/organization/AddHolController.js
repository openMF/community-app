(function(module) {
    mifosX.controllers = _.extend(module, {
        AddHolController: function(scope, resourceFactory, location,dateFilter) {
            scope.offices = [];
            scope.holidays = [];
            scope.date = {};
            scope.date.first = new Date();
            scope.date.second = new Date();
            scope.date.third = new Date();
            resourceFactory.officeResource.getAllOffices(function(data) {
                scope.offices = data;
            });
            scope.minDat = new Date();
            scope.submit = function() {
                var reqFirstDate = dateFilter(scope.date.first,scope.df);
                var reqSecondDate = dateFilter(scope.date.second,scope.df);
                var reqThirdDate = dateFilter(scope.date.third,scope.df);
                var newholiday = new Object();
                newholiday.locale = scope.optlang.code;
                newholiday.dateFormat = scope.df;
                newholiday.name = this.formData.name;
                newholiday.fromDate = reqFirstDate;
                newholiday.toDate = reqSecondDate;
                newholiday.repaymentsRescheduledTo = reqThirdDate;
                newholiday.description = this.formData.description;
                newholiday.offices = [];
                for (var i in this.formData.officeId) {
                    var temp = new Object();
                    temp.officeId = this.formData.officeId[i];
                    newholiday.offices.push(temp);
                }
                resourceFactory.holValueResource.save(newholiday,function(data){
                    location.path('/holidays');
                });
            };
        }
    });
    mifosX.ng.application.controller('AddHolController', ['$scope', 'ResourceFactory', '$location','dateFilter', mifosX.controllers.AddHolController]).run(function($log) {
        $log.info("AddHolController initialized");
    });
}(mifosX.controllers || {}));

