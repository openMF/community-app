/**
 * Created by Jose on 24/07/2017.
 */
(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateRateController: function (scope, resourceFactory, location, dateFilter, translate, webStorage) {
            scope.template = [];
            scope.formData = {};
            scope.first = {};
            scope.rateError = false;
            scope.translate = translate;


            // resourceFactory.chargeTemplateResource.get(function (data) {
            //     scope.template = data;
            //     scope.showChargePaymentByField = true;
            //     scope.chargeCalculationTypeOptions = data.chargeCalculationTypeOptions;
            //     scope.chargeTimeTypeOptions = data.chargeTimeTypeOptions;
            //
            //     scope.incomeAccountOptions = data.incomeOrLiabilityAccountOptions.incomeAccountOptions || [];
            //     scope.liabilityAccountOptions = data.incomeOrLiabilityAccountOptions.liabilityAccountOptions || [];
            //     scope.incomeAndLiabilityAccountOptions = scope.incomeAccountOptions.concat(scope.liabilityAccountOptions);
            // });

            //Right now only loan is accepted for a rate.
            scope.rateOptions = [{id : "m_loan"}];


            scope.rateAppliesToSelected = function (rateAppliesId) {

                if("m_loan" === rateAppliesId){
                    console.log("Loan charged");
                }


            };

            scope.setChoice = function () {
                if (this.formData.active) {
                    scope.choice = 1;
                }
                else if (!this.formData.active) {
                    scope.choice = 0;
                }
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                resourceFactory.rateResource.save(this.formData, function (data) {
                    location.path('/rates/');
                },function(error){
                    console.log(error);
                    scope.rateError = true;

                });
            };
        }
    });
    mifosX.ng.application.controller('CreateRateController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$translate','webStorage', mifosX.controllers.CreateRateController]).run(function ($log) {
        $log.info("CreateRateController initialized");
    });
}(mifosX.controllers || {}));
