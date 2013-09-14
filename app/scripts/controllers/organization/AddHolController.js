(function(module) {
    mifosX.controllers = _.extend(module, {
        AddHolController: function(scope, resourceFactory, location) {
            scope.offices = [];
            scope.holidays = [];
            resourceFactory.officeResource.getAllOffices(function(data) {
                scope.offices = data;
            });
            scope.submit = function() {
                var newholiday = new Object();
                newholiday.locale = 'en';
                newholiday.dateFormat = 'dd MMMM yyyy';
                newholiday.name = this.formData.name;
                newholiday.fromDate = this.formData.fromDate;
                newholiday.toDate = this.formData.toDate;
                newholiday.repaymentsRescheduledTo = this.formData.repaymentsRescheduledTo;
                newholiday.description = this.formData.description;
                newholiday.offices = [];
                for (var i = 0; i < this.formData.officeId.length; i++) {
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
    mifosX.ng.application.controller('AddHolController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.AddHolController]).run(function($log) {
        $log.info("AddHolController initialized");
    });
}(mifosX.controllers || {}));

