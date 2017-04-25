(function (module) {
    mifosX.controllers = _.extend(module, {
        EditPaymentTypeController: function (scope, routeParams, resourceFactory, location, $uibModal, route) {
            /*scope.formData = {};*/
            resourceFactory.paymentTypeResource.get({paymentTypeId: routeParams.id}, function (data) {
                scope.formData = {
                    name: data.name,
                    description: data.description,
                    isCashPayment: data.isCashPayment,
                    position : data.position
                };
            });

            scope.submit = function () {
                this.formData.isCashPayment = this.formData.isCashPayment || false;
                resourceFactory.paymentTypeResource.update({paymentTypeId: routeParams.id},this.formData, function (data) {
                    location.path('/viewpaymenttype/');
                });
            };

        }
    });
    mifosX.ng.application.controller('EditPaymentTypeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', '$route', mifosX.controllers.EditPaymentTypeController]).run(function ($log) {
        $log.info("EditPaymentTypeController initialized");
    });
}(mifosX.controllers || {}));
