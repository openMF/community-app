(function (module) {
    mifosX.controllers = _.extend(module, {
        CenterController: function (scope, resourceFactory, location) {
            scope.centers = [];
            scope.centersPerPage = 14;
            scope.routeTo = function (id) {
                location.path('/viewcenter/' + id);
            };

            if (!scope.searchCriteria.centers) {
                scope.searchCriteria.centers = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.centers;

            scope.onFilter = function () {
                scope.searchCriteria.centers = scope.filterText;
                scope.saveSC();
            };

            // var fetchFunction = function (offset, limit, callback) {
            //     resourceFactory.centerResource.get({offset: offset, limit: limit, paged: 'true', orderBy: 'name', sortOrder: 'ASC'}, callback);
            // };

            // scope.centers = paginatorService.paginate(fetchFunction, 14);
            scope.getResultsPage = function(pageNumber) {
                var items = resourceFactory.centerResource.getAllCenters({offset:((pageNumber - 1) * scope.centersPerPage), limit:scope.centersPerPage}, function(data) {
                    scope.centers = data;
                });
            }
            scope.initPage = function() {
                var items = resourceFactory.centerResource.get({offset:0, limit: scope.groupsPerPage, orderBy:'name', paged:true, sortOrder:'ASC'}, function(data) {
                    scope.totalCenters = data.totalFilteredRecords;
                    scope.centers = data.pageItems;
                });
            }
            scope.initPage();
        }
    });
    mifosX.ng.application.controller('CenterController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CenterController]).run(function ($log) {
        $log.info("CenterController initialized");
    });
}(mifosX.controllers || {}));