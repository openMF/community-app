(function (module) {
    mifosX.controllers = _.extend(module, {
        EditMeetingBasedOnMeetingDatesController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.formData = {};
            scope.formData.presentMeetingDate = {};
            scope.formData.newMeetingDate = {};

            resourceFactory.attachMeetingResource.get({groupOrCenter: routeParams.entityType, groupOrCenterId: routeParams.groupOrCenterId,
                templateSource: routeParams.calendarId, template: 'true'}, function (data) {
                scope.entityType = routeParams.entityType;
                scope.groupOrCenterId = routeParams.groupOrCenterId;
                scope.calendarData = data;
                scope.restrictDate = new Date();
                scope.formData = {};
                scope.presentmeetingdates = [];

                for(var i in data.nextTenRecurringDates){
                    scope.presentmeetingdates.push(dateFilter(new Date(data.nextTenRecurringDates[i]), scope.df));
                }
            });

            scope.submit = function () {

                this.formData.reschedulebasedOnMeetingDates = true;
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;

                this.formData.presentMeetingDate = dateFilter(this.formData.presentMeetingDate, scope.df);
                this.formData.newMeetingDate = dateFilter(this.formData.newMeetingDate, scope.df);


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
    mifosX.ng.application.controller('EditMeetingBasedOnMeetingDatesController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditMeetingBasedOnMeetingDatesController]).run(function ($log) {
        $log.info("EditMeetingBasedOnMeetingDatesController initialized");
    });
}(mifosX.controllers || {}));


