/**
 * Created by Jose on 25/07/2017.
 */
(function (module) {
    mifosX.controllers = _.extend(module, {
        EditRateController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.template = [];
            scope.showdatefield = false;
            scope.repeatEvery = false;
            scope.first = {};
            scope.flag = false;
            scope.showPenalty = true ;


            resourceFactory.rateResource.getRate({rateId: routeParams.rateId}, function (data) {
                scope.template = data;

                scope.formData = {
                    id: data.id,
                    name: data.name,
                    active: data.active,
                    percentage: data.percentage,
                    productApply : data.productApply
                };


            });


            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.active = this.formData.active || false;
                resourceFactory.rateResource.update({rateId: routeParams.rateId}, this.formData, function (data) {
                    location.path('/viewrate/' + routeParams.rateId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditRateController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditRateController]).run(function ($log) {
        $log.info("EditRateController initialized");
    });
}(mifosX.controllers || {}));
