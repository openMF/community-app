(function (module) {
    mifosX.controllers = _.extend(module, {
        EditWorkingDaysController: function (scope, routeParams, resourceFactory, location, dateFilter, $filter) {
            scope.workingDays = [];
            scope.selectedRepaymentType = "";
            scope.compareWith = [
                {name: "MO", value: "Monday", code: "day.monday"},
                {name: "TU", value: "Tuesday", code: "day.tuesday"},
                {name: "WE", value: "Wednesday", code: "day.wednesday"},
                {name: "TH", value: "Thursday", code: "day.thursday"},
                {name: "FR", value: "Friday", code: "day.friday"},
                {name: "SA", value: "Saturday", code: "day.saturday"},
                {name: "SU", value: "Sunday", code: "day.sunday"}
            ];
            resourceFactory.workingDaysResource.get(function (data) {
                scope.selectedRepaymentType = data.repaymentRescheduleType.id;
                scope.repaymentRescheduleOptions = data.repaymentRescheduleOptions ; //Good have template options as part of a single REST call
                scope.extendTermForDailyRepayments = data.extendTermForDailyRepayments;
                var temp = data.recurrence.split("=");
                var days = temp[3].split(",");

                for (var i in scope.compareWith) {
                    if (days.indexOf(scope.compareWith[i].name.toString()) > -1) {
                        scope.workingDays.push({
                            day: scope.compareWith[i].value,
                            code: scope.compareWith[i].code,
                            value: true
                        });
                    }
                    else {
                        scope.workingDays.push({
                            day: scope.compareWith[i].value,
                            code: scope.compareWith[i].code,
                            value: false
                        });
                    }
                }
            });

            scope.showLabel = function(day){
                if(day != "Monday"){
                    return true;
                }
                return false;
            };
            scope.submit = function () {
                this.formData = {};
                var stringFormat = "FREQ=WEEKLY;INTERVAL=1;BYDAY=";
                var selectedDays = "";
                for(var i in scope.workingDays) {
                    if (scope.workingDays[i].value == true &&
                        scope.workingDays[i].day.indexOf(scope.compareWith[i].value.toString()) > -1) {
                        if (selectedDays != "") {
                            selectedDays = selectedDays + ",";
                        }
                        selectedDays = selectedDays.concat(scope.compareWith[i].name);
                    }
                }
                if(selectedDays == ""){
                    selectedDays = ",";
                }
                this.formData.repaymentRescheduleType = scope.selectedRepaymentType ;
                this.formData.recurrence = 	stringFormat.concat(selectedDays);
                this.formData.locale = scope.optlang.code;
                this.formData.extendTermForDailyRepayments = scope.extendTermForDailyRepayments;
                resourceFactory.workingDaysResource.put(this.formData, function(data){
                    location.path('/organization/');
                })

            }

        }
    });
    mifosX.ng.application.controller('EditWorkingDaysController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', '$filter',  mifosX.controllers.EditWorkingDaysController]).run(function ($log) {
        $log.info("EditWorkingDaysController initialized");
    });
}(mifosX.controllers || {}));
