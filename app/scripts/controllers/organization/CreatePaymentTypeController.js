(function (module) {
    mifosX.controllers = _.extend(module, {
        CreatePaymentTypeController: function (scope, routeParams, resourceFactory, location, $uibModal, route) {

            scope.formData = {};
            scope.isCashPayment =true;


            scope.submit = function () {
                this.formData.isCashPayment = this.formData.isCashPayment || false;
                resourceFactory.paymentTypeResource.save(this.formData, function (data) {
                    location.path('/viewpaymenttype/');
                });
            };

        }
    });
    mifosX.ng.application.controller('CreatePaymentTypeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', '$route', mifosX.controllers.CreatePaymentTypeController]).run(function ($log) {
        $log.info("CreatePaymentTypeController initialized");
    });
}(mifosX.controllers || {}));
