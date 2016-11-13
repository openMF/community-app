(function (module) {
    mifosX.controllers = _.extend(module, {
        CreatePaymentTypeController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            scope.formData = {};
            scope.isCashPayment =true;


            scope.submit = function () {
                scope.errorDetails = [];
                this.formData.isCashPayment = this.formData.isCashPayment || false;
                if (typeof this.formData.position != "number"){
                    var errorObj = new Object();
                    errorObj.args = {params: []};
                    errorObj.args.params.push({value:"validation.msg.invalid.postion.input"});
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
