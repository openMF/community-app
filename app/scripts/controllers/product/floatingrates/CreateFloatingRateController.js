(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateFloatingRateController: function (scope, resourceFactory, location, dateFilter, translate) {

            scope.formData = {};
            scope.formData.ratePeriods = [] ;
            scope.formData.isBaseLendingRate = false;
            scope.formData.isActive = false;
            scope.addRatePeriod = function () {
                scope.formData.ratePeriods.push({
                });
            };

            scope.deleteRatePeriod = function (index) {
                scope.formData.ratePeriods.splice(index, 1);
            } ;

            scope.submit = function () {
                var i = 0 ;
                var length = this.formData.ratePeriods.length;
                for(i = 0 ; i < length; i++) {
                    this.formData.ratePeriods[i].locale = scope.optlang.code;
                    this.formData.ratePeriods[i].dateFormat =  scope.df;
                    this.formData.ratePeriods[i].fromDate = dateFilter(this.formData.ratePeriods[i].fromDate, scope.df);
                }

                resourceFactory.floatingrates.save(this.formData, function (data) {
                    location.path('/viewfloatingrate/' + data.resourceId);
                });
            } ;
        }
    });
    mifosX.ng.application.controller('CreateFloatingRateController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$translate', mifosX.controllers.CreateFloatingRateController]).run(function ($log) {
        $log.info("CreateFloatingRateController initialized");
    });
}(mifosX.controllers || {}));
