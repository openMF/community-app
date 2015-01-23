(function (module) {
    mifosX.controllers = _.extend(module, {
        GroupController: function (scope, resourceFactory, location) {
            scope.groups = [];
            scope.groupsPerPage = 14;
            scope.routeTo = function (id) {
                location.path('/viewgroup/' + id);
            };

            if (!scope.searchCriteria.groups) {
                scope.searchCriteria.groups = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.groups;

            scope.onFilter = function () {
                scope.searchCriteria.groups = scope.filterText;
                scope.saveSC();
            };

            // var fetchFunction = function (offset, limit, callback) {
            //     resourceFactory.groupResource.get({
            //         offset: offset, limit: limit, paged: 'true',
            //         orderBy: 'name', sortOrder: 'ASC'
            //     }, callback);
            // };

            // scope.groups = paginatorService.paginate(fetchFunction, 14);

            scope.getResultsPage = function(pageNumber) {
                var items = resourceFactory.groupResource.getAllGroups({offset:((pageNumber - 1) * scope.groupsPerPage), limit:scope.groupsPerPage}, function(data) {
                    scope.groups = data;
                });
            }
            scope.initPage = function() {
                var items = resourceFactory.groupResource.get({offset:0, limit: scope.groupsPerPage, orderBy:'name', paged:true, sortOrder:'ASC'}, function(data) {
                    scope.totalGroups = data.totalFilteredRecords;
                    scope.groups = data.pageItems;
                });
            }
            scope.initPage();
        }
    });
    mifosX.ng.application.controller('GroupController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.GroupController]).run(function ($log) {
        $log.info("GroupController initialized");
    });
}(mifosX.controllers || {}));