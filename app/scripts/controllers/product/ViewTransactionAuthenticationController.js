/**
 * Created by 37 on 8/30/2016.
 */
(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewTransactionAuthenticationController: function (scope, routeParams, resourceFactory, location, $modal, route) {
            scope.transactionAuthentications = [];
            resourceFactory.transactionAuthenticationResource.getAllTransactionAuthenticationDetails({},function (data){
                scope.transactionAuthentications = data;
            }) ;

            scope.showEdit = function(id){
                location.path('/edittransactionauthentication/' + id);
            }

            var TransactionAuthenticationTypeDeleteCtrl = function ($scope, $modalInstance,transactionAuthenticationTypeId) {
                $scope.delete = function () {
                    resourceFactory.transactionAuthenticationResource.delete({transactionAuthenticationId: transactionAuthenticationTypeId}, {}, function (data) {
                        $modalInstance.close('delete');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
            scope.deleteTransactionAuthentication = function (id) {
                $modal.open({
                    templateUrl: 'deleteTransactionAuthentication.html',
                    controller: TransactionAuthenticationTypeDeleteCtrl,
                    resolve: {
                        transactionAuthenticationTypeId: function () {
                            return id;
                        }
                    }
                });
            };
        }


    });
    mifosX.ng.application.controller('ViewTransactionAuthenticationController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.ViewTransactionAuthenticationController]).run(function ($log) {
        $log.info("ViewTransactionAuthenticationController initialized");
    });
}(mifosX.controllers || {}));
