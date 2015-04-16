(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientController: function (scope, resourceFactory, location, routeParams) {
            scope.clients = [];
            scope.searchResults = [];
            scope.routeTo = function (id) {
                location.path('/viewclient/' + id);
            };
            scope.search = function () {
                location.path('/clients/' + scope.client.query);
            }
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

            if (routeParams.query == null) {

                scope.getResultsPage = function (pageNumber) {
                    var items = resourceFactory.clientResource.getAllClients({
                        offset: ((pageNumber - 1) * scope.clientsPerPage),
                        limit: scope.clientsPerPage
                    }, function (data) {
                        scope.clients = data.pageItems;
                    });
                }
                scope.initPage = function () {
                    var items = resourceFactory.clientResource.getAllClients({
                        offset: 0,
                        limit: scope.clientsPerPage
                    }, function (data) {
                        scope.totalClients = data.totalFilteredRecords;
                        scope.clients = data.pageItems;
                    });
                }
                scope.initPage();
            }

            scope.query = routeParams.query;
            if (routeParams.query == 'undefined') {
                routeParams.query = '';
            }
            resourceFactory.globalSearch.search({query: routeParams.query}, function (data) {
                scope.searchResults = data;
            });

        }
    });



    mifosX.ng.application.controller('ClientController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.ClientController]).run(function ($log) {
        $log.info("ClientController initialized");
    });
}(mifosX.controllers || {}));