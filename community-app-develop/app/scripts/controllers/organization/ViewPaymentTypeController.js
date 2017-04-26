(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewPaymentTypeController: function (scope, routeParams, resourceFactory, location, $modal, route) {
            scope.paymentTypes = [];
            scope.formData = [];
            resourceFactory.paymentTypeResource.getAll( function (data) {
                scope.paymentTypes = data;
            });

            scope.showEdit = function(id){
                location.path('/editPaymentType/' + id);
            }

           var PaymentTypeDeleteCtrl = function ($scope, $modalInstance,paymentTypeId) {
               $scope.delete = function () {
                   resourceFactory.paymentTypeResource.delete({paymentTypeId: paymentTypeId}, {}, function (data) {
                       $modalInstance.close('delete');
                       route.reload();
                   });
               };
               $scope.cancel = function () {
                   $modalInstance.dismiss('cancel');
               };
           }
                scope.deletePaymentType = function (id) {
                    $modal.open({
                        templateUrl: 'deletePaymentType.html',
                        controller: PaymentTypeDeleteCtrl,
                        resolve: {
                            paymentTypeId: function () {
                                return id;
                            }
                        }
                    });
                };

                }
    });
    mifosX.ng.application.controller('ViewPaymentTypeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.ViewPaymentTypeController]).run(function ($log) {
        $log.info("ViewPaymentTypeController initialized");
    });
}(mifosX.controllers || {}));
