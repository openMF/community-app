(function (module) {
    mifosX.controllers = _.extend(module, {
        CreatePaymentTypeController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            scope.formData = {};
            scope.isCashPayment =true;
                        


            scope.submit = function () {
                scope.errorDetails = [];
                scope.errorArray = [];
                this.formData.isCashPayment = this.formData.isCashPayment || false;
                if (isNaN(this.formData.position)){
                    var errorObj = new Object();
                    errorObj.field = "Position"
                    errorObj.code = "validation.msg.invalid.integer.format"
                    errorObj.args = {params: []};
                    errorObj.args.params.push({value:this.formData.position});
                    scope.errorArray.push(errorObj);
                    scope.errorDetails.push(scope.errorArray);
                    
                    
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
