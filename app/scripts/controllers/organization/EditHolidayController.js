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
            if (data.status.value === "Active") {
              scope.holidayStatusActive = true;
            }

            var fromDate = dateFilter(data.fromDate,scope.df);
            scope.date.fromDate = new Date(fromDate);

            var toDate = dateFilter(data.toDate,scope.df);
            scope.date.toDate = new Date(toDate);

            var repaymentsRescheduledTo = dateFilter(data.repaymentsRescheduledTo,scope.df);
            scope.date.repaymentsRescheduledTo = new Date(repaymentsRescheduledTo);

        });

        scope.submit = function() {
          this.formData.locale = scope.optlang.code;
          this.formData.dateFormat = scope.df;
          if (!scope.holidayStatusActive) {
              this.formData.fromDate = dateFilter(scope.date.fromDate,scope.df);
              this.formData.toDate = dateFilter(scope.date.toDate,scope.df);
          }
            this.formData.repaymentsRescheduledTo = dateFilter(scope.date.repaymentsRescheduledTo,scope.df);
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
