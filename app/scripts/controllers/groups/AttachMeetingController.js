(function (module) {
    mifosX.controllers = _.extend(module, {
        AttachMeetingController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.repeatsOnDayOfMonthOptions = [];
            for (var i = 1; i <= 28; i++) {
                scope.repeatsOnDayOfMonthOptions.push(i);
            }
            resourceFactory.attachMeetingResource.get({groupOrCenter: routeParams.entityType, groupOrCenterId: routeParams.id,
                templateSource: 'template'}, function (data) {
                scope.entityType = routeParams.entityType;
                scope.groupOrCenterId = routeParams.id;
                scope.groupCenterData = data;
                scope.restrictDate = new Date();
                scope.first = {};
                scope.periodValue = "day(s)";
                scope.repeatsOptions = [
                    {id: 1, value: "daily"},
                    {id: 2, value: "weekly"},
                    {id: 3, value: "monthly"},
                    {id: 4, value: "yearly"}
                ];
                scope.repeatsEveryOptions = ["1", "2", "3"];
                //to display default in select boxes
                scope.formData = {
                    repeating: 'true',
                    frequency: '0',
                    interval: '1'
                }
            });
            scope.meetingtime = new Date();
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
                    scope.frequencyNthDayOptions = [
                        {id: 1, value: "first"},
                        {id: 2, value: "second"},
                        {id: 3, value: "third"},
                        {id: 4, value: "fourth"},
                        {id: -1, value: "last"},
                        {id: -2, value: "on day"}
                    ];
                    scope.frequencyDayOfWeekOptions = [
                        {name: "MON", value: "1"},
                        {name: "TUE", value: "2"},
                        {name: "WED", value: "3"},
                        {name: "THU", value: "4"},
                        {name: "FRI", value: "5"},
                        {name: "SAT", value: "6"},
                        {name: "SUN", value: "7"}
                    ];
                }
                if (period == 4) {
                    scope.periodValue = "year(s)";
                    scope.repeatsEveryOptions = ["1", "2", "3"];
                }
            }

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.startDate = reqDate;
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.typeId = "1";
                this.formData.timeFormat='HH:mm:ss';
                this.formData.location=scope.formData.location;
                this.formData.meetingtime = dateFilter(scope.meetingtime,'HH:mm');
               this.formData.meetingtime = this.formData.meetingtime.concat(":00"); // setting the second portion of the time to zero
                if (routeParams.entityType == "groups") {
                    this.formData.title = "groups_" + routeParams.id + "_CollectionMeeting";
                    scope.r = "viewgroup/";
                }
                else if (routeParams.entityType == "centers") {
                    this.formData.title = "centers_" + routeParams.id + "_CollectionMeeting";
                    scope.r = "viewcenter/";
                }

                resourceFactory.attachMeetingResource.save({groupOrCenter: routeParams.entityType, groupOrCenterId: routeParams.id}, this.formData, function (data) {
                    location.path(scope.r + routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('AttachMeetingController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.AttachMeetingController]).run(function ($log) {
        $log.info("AttachMeetingController initialized");
    });
}(mifosX.controllers || {}));

