(function (module) {
    mifosX.controllers = _.extend(module, {
        CloseCenterController: function (scope, routeParams, route, location, resourceFactory, dateFilter) {
            scope.template = [];
            scope.center = [];
            scope.first = {};
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.first.date = new Date();
            resourceFactory.centerResource.get({centerId: routeParams.id, associations: 'groupMembers,collectionMeetingCalendar'}, function (data) {
                scope.center = data;
            });
            resourceFactory.centerTemplateResource.get({command: 'close'}, function (data) {
                scope.template = data;
                if(data.closureReasons[0]) {
                    scope.formData.closureReasonId = data.closureReasons[0].id;
                }
            });

            scope.closeGroup = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.closureDate = reqDate;
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                resourceFactory.centerResource.save({centerId: routeParams.id, command: 'close'}, this.formData, function (data) {
                    location.path('/viewcenter/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CloseCenterController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', 'dateFilter', mifosX.controllers.CloseCenterController]).run(function ($log) {
        $log.info("CloseCenterController initialized");
    });
}(mifosX.controllers || {}));

