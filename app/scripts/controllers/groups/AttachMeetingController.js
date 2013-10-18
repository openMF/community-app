(function(module) {
    mifosX.controllers = _.extend(module, {
        AttachMeetingController: function(scope, resourceFactory, location, routeParams,dateFilter) {
            resourceFactory.attachMeetingResource.get({groupOrCenter : routeParams.entityType, groupOrCenterId : routeParams.id, 
                templateSource : 'template'}, function(data) {
                scope.groupCenterData = data;
                scope.first = {};
                //to display default in select boxes
                scope.formData = {
                    repeating :'true',
                    repeats:'daily',
                    repeatsEvery:'1'
                }
                scope.periodValue = "day(s)";
                scope.repeatsOptions = ["daily", "weekly", "monthly", "yearly"];
                scope.repeatsEveryOptions = ["1","2","3"];
            });

            scope.selectedPeriod = function(period) {
                if(period == "daily") {
                    scope.repeatsEveryOptions = ["1","2","3"];
                    scope.periodValue = "day(s)"
                }
                if(period == "weekly") {
                    scope.repeatsEveryOptions = ["1","2","3"];
                    scope.formData.repeatsOnDay = 'MO';
                    scope.periodValue = "week(s)";
                    scope.repeatsOnOptions  = [
                    {name : "MON", value : "MO"},
                    {name : "TUE", value : "TU"},
                    {name : "WED", value : "WE"},
                    {name : "THU", value : "TH"},
                    {name : "FRI", value : "FR"},
                    {name : "SAT", value : "SA"},
                    {name : "SUN", value : "SU"}
                    ]
                }
                if(period == "monthly") {
                    scope.periodValue = "month(s)";
                    scope.repeatsEveryOptions = ["1","2","3","4", "5", "6", "7", "8", "9", "10", "11"];
                }
                if(period == "yearly") {
                    scope.periodValue = "year(s)";
                    scope.repeatsEveryOptions = ["1","2","3"];
                }
            }

            scope.submit = function() {
                var reqDate = dateFilter(scope.first.date,'dd MMMM yyyy');
                this.formData.startDate = reqDate;
                this.formData.locale = "en";
                this.formData.dateFormat = "dd MMMM yyyy";
                this.formData.typeId = "1";
                if(routeParams.entityType == "groups") {
                    this.formData.title = "groups_"+routeParams.id+"_CollectionMeeting";
                    scope.r = "viewgroup/";
                }
                else if(routeParams.entityType == "centers") {
                    this.formData.title = "centers_"+routeParams.id+"_CollectionMeeting";
                    scope.r = "viewcenter/";
                }

                resourceFactory.attachMeetingResource.save({groupOrCenter : routeParams.entityType, groupOrCenterId : routeParams.id}, this.formData,function(data){
                    location.path(scope.r + routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('AttachMeetingController', ['$scope', 'ResourceFactory', '$location', '$routeParams','dateFilter', mifosX.controllers.AttachMeetingController]).run(function($log) {
        $log.info("AttachMeetingController initialized");
    });
}(mifosX.controllers || {}));

