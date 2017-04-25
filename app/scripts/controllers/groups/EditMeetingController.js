(function (module) {
    mifosX.controllers = _.extend(module, {
        EditMeetingController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.formData = {};
            resourceFactory.attachMeetingResource.get({groupOrCenter: routeParams.entityType, groupOrCenterId: routeParams.groupOrCenterId,
                templateSource: routeParams.calendarId, template: 'true'}, function (data) {
                scope.entityType = routeParams.entityType;
                scope.calendarId = routeParams.calendarId;
                scope.groupOrCenterId = routeParams.groupOrCenterId;
                scope.calendarData = data;
                scope.restrictDate = new Date();
                scope.first = {date: new Date(data.startDate)};
                scope.repeatsOptions = [
                    {id: 1, value: "daily"},
                    {id: 2, value: "weekly"},
                    {id: 3, value: "monthly"},
                    {id: 4, value: "yearly"}
                ];
                scope.repeatsEveryOptions = [1, 2, 3];
                scope.selectedPeriod(scope.calendarData.frequency.id);
                //to display default in select boxes
                scope.formData = {
                    repeating: scope.calendarData.repeating,
                    frequency: scope.calendarData.frequency.id,
                    interval: Math.abs(scope.calendarData.interval)
                }
                for(var i in scope.repeatsEveryOptions){
                    if (scope.formData.interval == scope.repeatsEveryOptions[i]){
                        scope.formData.interval = scope.repeatsEveryOptions[i];
                    }
                }
                //update interval option
                for (var i in scope.repeatsEveryOptions) {
                    if (scope.repeatsEveryOptions[i] == scope.calendarData.interval) {
                        scope.formData.interval = scope.repeatsEveryOptions[i];
                    }
                }
                //update radio button option
                if (scope.formData.frequency == 2) {
                    scope.formData.repeatsOnDay = scope.calendarData.repeatsOnDay.id;
                }
            });

            scope.selectedPeriod = function (period) {
                if (period == 1) {
                    scope.repeatsEveryOptions = ["1", "2", "3"];
                    scope.periodValue = "day(s)"
                }
                if (period == 2) {
                    scope.repeatsEveryOptions = ["1", "2", "3","4","5"];
                    scope.formData.repeatsOnDay = '1';
                    scope.periodValue = "week(s)";
                    scope.repeatsOnOptions = [
                        {name: "MON", value: "1"},
                        {name: "TUE", value: "2"},
                        {name: "WED", value: "3"},
                        {name: "THU", value: "4"},
                        {name: "FRI", value: "5"},
                        {name: "SAT", value: "6"},
                        {name: "SUN", value: "7"}
                    ]
                }
                if (period == 3) {
                    scope.periodValue = "month(s)";
                    scope.repeatsEveryOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
                }
                if (period == 4) {
                    scope.periodValue = "year(s)";
                    scope.repeatsEveryOptions = ["1", "2", "3"];
                }
            }

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.startDate = reqDate;
                this.formData.title = scope.calendarData.title;
                this.formData.locale = scope.optlang.code;
                this.formData.repeating = true;
                this.formData.dateFormat = scope.df;
                this.formData.typeId = "1";
                if (this.formData.interval < 0) {
                    scope.formData.interval = Math.abs(this.formData.interval);
                }
                resourceFactory.attachMeetingResource.update({groupOrCenter: routeParams.entityType,
                    groupOrCenterId: routeParams.groupOrCenterId, templateSource: routeParams.calendarId}, this.formData, function (data) {
                    var destURI = "";
                    if (routeParams.entityType == "groups") {
                        destURI = "viewgroup/" + routeParams.groupOrCenterId;
                    }
                    else if (routeParams.entityType == "centers") {
                        destURI = "viewcenter/" + routeParams.groupOrCenterId;
                    }
                    location.path(destURI);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditMeetingController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditMeetingController]).run(function ($log) {
        $log.info("EditMeetingController initialized");
    });
}(mifosX.controllers || {}));

