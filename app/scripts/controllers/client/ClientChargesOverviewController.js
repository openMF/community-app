(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientChargesOverviewController: function (scope, resourceFactory, location,routeParams, dateFilter) {
            scope.clientId =  routeParams.id
            scope.charges = [];
            scope.actualCharges = [];
            scope.searchText = "";

           scope.routeTo = function (chargeId) {
                location.path('/viewclient/'+ scope.clientId + '/charges/'+chargeId);
            };

            scope.chargesPerPage =100;

            scope.getClientChargeResultsPage = function (pageNumber) {
                if(scope.searchText){
                    var startPosition = (pageNumber - 1) * scope.chargesPerPage;
                    scope.charges = scope.actualCharges.slice(startPosition, startPosition + scope.chargesPerPage);
                    return;
                }
                var items = resourceFactory.clientChargesResource.getCharges({clientId: routeParams.id,
                    offset: ((pageNumber - 1) * scope.chargesPerPage),
                    limit: scope.chargesPerPage
                }, function (data) {
                    scope.charges = data.pageItems;
                });

            }


            scope.initPage = function () {

               var chargesItems = resourceFactory.clientChargesResource.getCharges({clientId: routeParams.id,
                    offset: 0,
                    limit: scope.chargesPerPage
                }, function (data) {
                    scope.totalCharges= data.totalFilteredRecords;
                    scope.charges = data.pageItems;
                });

            }
            scope.initPage();

    }
});
    mifosX.ng.application.controller('ClientChargesOverviewController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.ClientChargesOverviewController]).run(function ($log) {
        $log.info("ClientChargesOverviewController initialized");
    });
}(mifosX.controllers || {}));
