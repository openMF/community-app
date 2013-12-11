(function(module) {
  mifosX.controllers = _.extend(module, {
    EditHolidayController: function(scope, routeParams, resourceFactory, location,dateFilter) {
        scope.formData = {};
        scope.date = {};
        scope.restrictDate = new Date();

        resourceFactory.holValueResource.getholvalues({holId: routeParams.id} , function(data) {
            scope.holiday = data;
            scope.formData = {
                name : data.name,
                description : data.description,
            };

            scope.holidayStatusActive = false;
            if (data.status.value === "Active" || data.status.value === "Deleted") {
              scope.holidayStatusActiveDeleted = true;
            } else {
              scope.holidayStatusActive = false;
            }

            var fromDate = dateFilter(data.fromDate,'dd MMMM yyyy');
            scope.date.fromDate = new Date(fromDate);

            var toDate = dateFilter(data.toDate,'dd MMMM yyyy');
            scope.date.toDate = new Date(toDate);

            var repaymentsRescheduledTo = dateFilter(data.repaymentsRescheduledTo,'dd MMMM yyyy');
            scope.date.repaymentsRescheduledTo = new Date(repaymentsRescheduledTo);

        });

        scope.submit = function() {
          this.formData.locale = 'en';
          this.formData.dateFormat = 'dd MMMM yyyy';
          if (!scope.holidayStatusActive) {
              this.formData.fromDate = dateFilter(scope.date.fromDate,'dd MMMM yyyy');
              this.formData.toDate = dateFilter(scope.date.toDate,'dd MMMM yyyy');
          }
            this.formData.repaymentsRescheduledTo = dateFilter(scope.date.repaymentsRescheduledTo,'dd MMMM yyyy');
            resourceFactory.holValueResource.update({holId: routeParams.id},this.formData,function(data){
             location.path('/viewholiday/' + routeParams.id);
            });
        };
    }
  });
  mifosX.ng.application.controller('EditHolidayController', ['$scope', '$routeParams', 'ResourceFactory', '$location','dateFilter', mifosX.controllers.EditHolidayController]).run(function($log) {
    $log.info("EditHolidayController initialized");
  });
}(mifosX.controllers || {}));
