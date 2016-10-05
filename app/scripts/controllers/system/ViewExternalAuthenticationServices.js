/**
 * Created by conflux37 on 9/1/2016.
 */
(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewExternalAuthenticationServices: function (scope, routeParams, resourceFactory, location, $modal, route) {
            scope.transactionAuthentications = [];
            scope.serviceData = {};
            resourceFactory.viewTransactionAuthenticationServicesResource.get({},function (data){
                scope.formData = data;
            }) ;

            scope.showEdit = function(id){
                location.path('/edittransactionauthentication/' + id);
            }

            scope.serviceUpdate = function (transactionAuthenticationService) {
                scope.serviceData.isActive = false;
                if(transactionAuthenticationService.isActive){
                    scope.serviceData.isActive = false;
                }else {
                    scope.serviceData.isActive = true;
                }
                resourceFactory.viewTransactionAuthenticationServicesResource.update({serviceId: transactionAuthenticationService.id}, scope.serviceData, function(data){
                    route.reload();
                });

            };
        }


    });
    mifosX.ng.application.controller('ViewExternalAuthenticationServices', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.ViewExternalAuthenticationServices]).run(function ($log) {
        $log.info("ViewExternalAuthenticationServices initialized");
    });
}(mifosX.controllers || {}));
