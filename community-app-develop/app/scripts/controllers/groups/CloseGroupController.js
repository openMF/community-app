(function (module) {
    mifosX.controllers = _.extend(module, {
        CloseGroupController: function (scope, routeParams, route, location, resourceFactory, dateFilter) {
            scope.group = [];
            scope.template = [];
            scope.first = {};
            scope.first.date = new Date();
            scope.restrictDate = new Date();
            scope.formData = {};
            resourceFactory.groupResource.get({groupId: routeParams.id, associations: 'all'}, function (data) {
                scope.group = data;
            });
            resourceFactory.groupTemplateResource.get({command: 'close'}, function (data) {
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
                resourceFactory.groupResource.save({groupId: routeParams.id, command: 'close'}, this.formData, function (data) {
                    location.path('/viewgroup/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CloseGroupController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', 'dateFilter', mifosX.controllers.CloseGroupController]).run(function ($log) {
        $log.info("CloseGroupController initialized");
    });
}(mifosX.controllers || {}));

