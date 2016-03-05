(function (module) {
    mifosX.controllers = _.extend(module, {
        AttachPledgeToExistingCustomerController: function ($q, scope, routeParams, route, location, resourceFactory, $modal) {
            scope.group = [];
            scope.indexOfClientToBeDeleted = "";
            scope.allMembers = [];

            scope.viewClient = function (item) {
                scope.client = item;
            };

            scope.clientOptions = function(value){
                var deferred = $q.defer();
                resourceFactory.clientResource.getAllClients({displayName: value, orderBy : 'displayName',
                    sortOrder : 'ASC'}, function (data) {
                    deferred.resolve(data.pageItems);
                });
                return deferred.promise;
            };

            scope.add = function () {
                if(scope.available != ""){
                    var id = scope.client.id;
                    resourceFactory.pledgeResource.update({ pledgeId : routeParams.pledgeId}, {clientId : id}, function(pledgeData){
                        location.path('/viewclient/' + id);
                    });
                }
            };
        }
    });
    mifosX.ng.application.controller('AttachPledgeToExistingCustomerController', ['$q','$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$modal', mifosX.controllers.AttachPledgeToExistingCustomerController]).run(function ($log) {
        $log.info("AttachPledgeToExistingCustomerController initialized");
    });
}(mifosX.controllers || {}));
