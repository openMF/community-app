(function (module) {
    mifosX.controllers = _.extend(module, {
        EditWorkingDaysController: function (scope, routeParams, resourceFactory, location, dateFilter, $filter) {
            scope.workingDays = [];
            scope.selectedRepaymentType = "";
            scope.compareWith = [
                {name: "MO", value: "Monday"},
                {name: "TU", value: "Tuesday"},
                {name: "WE", value: "Wednesday"},
                {name: "TH", value: "Thursday"},
                {name: "FR", value: "Friday"},
                {name: "SA", value: "Saturday"},
                {name: "SU", value: "Sunday"}
            ];

            resourceFactory.workingDaysResource.get(function(data){
                scope.repaymentRescheduleTypes = [{
                    id: data.repaymentRescheduleType.id,
                    value:data.repaymentRescheduleType.value,
                    code :data.repaymentRescheduleType.code
                }];
                scope.selectedRepaymentType = scope.repaymentRescheduleTypes[0].id;
                scope.extendTermForDailyRepayments = data.extendTermForDailyRepayments;
                var temp = data.recurrence.split("=");
                var days = temp[3].split(",");

                for(var i in scope.compareWith){
                    if(days.indexOf(scope.compareWith[i].name.toString()) > -1){
                        scope.workingDays.push({
                            day : scope.compareWith[i].value,
                            value : true
                        });
                    }
                    else{
                        scope.workingDays.push({
                            day : scope.compareWith[i].value,
                            value : false
                        });
                    }
                }
            });
            resourceFactory.workingDaysResourceTemplate.get(function(data){
                scope.repaymentRescheduleOptions = data.repaymentRescheduleOptions;
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
                this.formData.recurrence = 	stringFormat.concat(selectedDays);
                this.formData.locale = scope.optlang.code;
                this.formData.repaymentRescheduleType = scope.selectedRepaymentType;
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