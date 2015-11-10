(function (module) {
    mifosX.controllers = _.extend(module, {
        EditFloatingRateController: function (scope, routeParams, resourceFactory, location, dateFilter, translate) {

            scope.formData = {};
            scope.formData.ratePeriods = [] ;

            resourceFactory.floatingrates.get({floatingRateId: routeParams.floatingRateId}, function (data) {
                scope.formData.name = data.name ;
                scope.formData.isBaseLendingRate = data.isBaseLendingRate;
                scope.formData.isActive = data.isActive ;
                scope.formData.ratePeriods = data.ratePeriods ;

                var i = 0 ;
                var length = scope.formData.ratePeriods.length;
                var futureratePeriods = [] ;

                for(i = 0 ; i < length; i++) {
                    scope.formData.ratePeriods[i].fromDate = new Date(scope.formData.ratePeriods[i].fromDate);
                    if(scope.formData.ratePeriods[i].fromDate > Date.now()) {
                        futureratePeriods.push(scope.formData.ratePeriods[i]) ;
                    }
                }
                scope.formData.ratePeriods = futureratePeriods ;
            });

            scope.addRatePeriod = function () {
                scope.formData.ratePeriods.push({
                });
            };

            scope.deleteRatePeriod = function (index) {
                scope.formData.ratePeriods.splice(index, 1);
            } ;

            scope.checkDate = function (index) {
                return scope.formData.ratePeriods[index].fromDate > Date.now() ;
            } ;


            scope.submit = function () {

                var i = 0 ;
                var length = this.formData.ratePeriods.length;
                for(i = 0 ; i < length; i++) {
                    delete this.formData.ratePeriods[i].id ;
                    delete this.formData.ratePeriods[i].isActive ;
                    delete this.formData.ratePeriods[i].createdBy ;
                    delete this.formData.ratePeriods[i].createdOn ;
                    delete this.formData.ratePeriods[i].modifiedBy ;
                    delete this.formData.ratePeriods[i].modifiedOn ;
                    this.formData.ratePeriods[i].locale = scope.optlang.code;
                    this.formData.ratePeriods[i].dateFormat =  scope.df;
                    this.formData.ratePeriods[i].fromDate = dateFilter(this.formData.ratePeriods[i].fromDate, scope.df);
                }

                resourceFactory.floatingrates.put({floatingRateId: routeParams.floatingRateId}, this.formData, function (data) {
                    location.path('/viewfloatingrate/' + data.resourceId);
                });
            } ;
        }
    });
    mifosX.ng.application.controller('EditFloatingRateController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', '$translate', mifosX.controllers.EditFloatingRateController]).run(function ($log) {
        $log.info("EditFloatingRateController initialized");
    });
}(mifosX.controllers || {}));
