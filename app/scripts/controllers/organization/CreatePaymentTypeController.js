(function (module) {
    mifosX.controllers = _.extend(module, {
        CreatePaymentTypeController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            scope.formData = {};
            scope.isCashPayment =true;


            scope.submit = function () {
                this.formData.isCashPayment = this.formData.isCashPayment || false;
                if (isNaN(this.formData.position)){
                    scope.errorDetails = [];
                    var errorObj = new Object();
                    errorObj.args = {params: []};
                    errorObj.args.params.push({value:"validation.msg.invalid.position.input"});
                    scope.errorDetails.push(errorObj);
                }
                resourceFactory.paymentTypeResource.save(this.formData, function (data) {
                    location.path('/viewpaymenttype/');
                });
            };

        }
    });
    mifosX.ng.application.controller('CreatePaymentTypeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.CreatePaymentTypeController]).run(function ($log) {
        $log.info("CreatePaymentTypeController initialized");
    });
}(mifosX.controllers || {}));
