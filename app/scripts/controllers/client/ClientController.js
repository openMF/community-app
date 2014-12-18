(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientController: function (scope, resourceFactory, paginatorService, location) {
            scope.clients = [];

            scope.routeTo = function (id) {
                location.path('/viewclient/' + id);
            };

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

            var fetchFunction = function (offset, limit, callback) {
                resourceFactory.clientResource.getAllClients({offset: offset, limit: limit}, callback);
            };

            scope.clients = paginatorService.paginate(fetchFunction, 14);
        }
    });
    mifosX.ng.application.controller('ClientController', ['$scope', 'ResourceFactory', 'PaginatorService', '$location', mifosX.controllers.ClientController]).run(function ($log) {
        $log.info("ClientController initialized");
    });
}(mifosX.controllers || {}));