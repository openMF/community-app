(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewPaymentTypeController: function (scope, routeParams, resourceFactory, location, $uibModal, route) {
            scope.paymentTypes = [];
            scope.formData = [];
            resourceFactory.paymentTypeResource.getAll( function (data) {
                scope.paymentTypes = data;
            });

            scope.showEdit = function(id){
                location.path('/editPaymentType/' + id);
            }

           var PaymentTypeDeleteCtrl = function ($scope, $uibModalInstance,paymentTypeId) {
               $scope.delete = function () {
                   resourceFactory.paymentTypeResource.delete({paymentTypeId: paymentTypeId}, {}, function (data) {
                       $uibModalInstance.close('delete');
                       route.reload();
                   });
               };
               $scope.cancel = function () {
                   $uibModalInstance.dismiss('cancel');
               };
           }
                scope.deletePaymentType = function (id) {
                    $uibModal.open({
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
    mifosX.ng.application.controller('ViewPaymentTypeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', '$route', mifosX.controllers.ViewPaymentTypeController]).run(function ($log) {
        $log.info("ViewPaymentTypeController initialized");
    });
}(mifosX.controllers || {}));
