(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewFloatingRateController: function (scope, routeParams, resourceFactory, location, dateFilter, translate) {
            resourceFactory.floatingrates.get({floatingRateId: routeParams.floatingRateId}, function (data) {
                scope.id = data.id ;
                scope.name = data.name ;
                scope.isBaseLendingRate = data.isBaseLendingRate;
                scope.isActive = data.isActive ;
                scope.createdBy = data.createdBy ;
                scope.ratePeriods = data.ratePeriods ;

                var i = 0 ;
                var length = scope.ratePeriods.length;
                for(i = 0 ; i < length; i++) {
                    scope.ratePeriods[i].fromDate = new Date(scope.ratePeriods[i].fromDate);
                    scope.ratePeriods[i].fromDate = dateFilter(scope.ratePeriods[i].fromDate, scope.df);
                }
            });


        }
    });
    mifosX.ng.application.controller('ViewFloatingRateController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', '$translate', mifosX.controllers.ViewFloatingRateController]).run(function ($log) {
        $log.info("ViewFloatingRateController initialized");
    });
}(mifosX.controllers || {}));
