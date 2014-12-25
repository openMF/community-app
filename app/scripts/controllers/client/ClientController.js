(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientController: function (scope, resourceFactory, location) {
            scope.clients = [];

            scope.routeTo = function (id) {
                location.path('/viewclient/' + id);
            };

            scope.clientsPerPage = 15;
            /* -----Throws error on test-----
             if (!scope.searchCriteria.clients) {
             scope.searchCriteria.clients = null;
             scope.saveSC();
             }
             scope.filterText = scope.searchCriteria.clients;

             scope.onFilter = function () {
             scope.searchCriteria.clients = scope.filterText;
             scope.saveSC();
             };*/

            // var fetchFunction = function (offset, limit, callback) {
            //     resourceFactory.clientResource.getAllClients({offset: offset, limit: limit}, callback);
            // };

            // scope.clients = paginatorService.paginate(fetchFunction, 14);

            scope.getResultsPage = function(pageNumber) {
                var items = resourceFactory.clientResource.getAllClients({offset:((pageNumber - 1) * scope.clientsPerPage), limit:scope.clientsPerPage}, function(data) {
                    scope.clients = data.pageItems;
                });
            }
            scope.initPage = function() {
                var items = resourceFactory.clientResource.getAllClients({offset:0, limit: scope.clientsPerPage}, function(data) {
                    scope.totalClients = data.totalFilteredRecords;
                    scope.clients = data.pageItems;
                });
            }
            scope.initPage();
        }
    });
    mifosX.ng.application.controller('ClientController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.ClientController]).run(function ($log) {
        $log.info("ClientController initialized");
    });
}(mifosX.controllers || {}));