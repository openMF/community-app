(function (module) {
    mifosX.controllers = _.extend(module, {
        GroupController: function (scope, resourceFactory, location) {
            scope.groups = [];
            scope.searchText = "";
            scope.searchResults = [];
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

            scope.groupsPerPage = 15;
            scope.getResultsPage = function (pageNumber) {
                var items = resourceFactory.groupResource.get({
                    offset: ((pageNumber - 1) * scope.groupsPerPage),
                    limit: scope.groupsPerPage,
                    paged: 'true',
                    orderBy: 'name',
                    sortOrder: 'ASC'
                }, function (data) {
                    scope.groups = data.pageItems;
                });
            }

            scope.initPage = function () {
                var items = resourceFactory.groupResource.get({
                    offset: 0,
                    limit: scope.groupsPerPage,
                    paged: 'true',
                    orderBy: 'name',
                    sortOrder: 'ASC'
                }, function (data) {
                    scope.totalGroups = data.totalFilteredRecords;
                    scope.groups = data.pageItems;
                });
            }

            scope.initPage();

            scope.search = function () {
                scope.groups = [];
                scope.searchResults = [];
                scope.filterText = "";
                if(!scope.searchText){
                    scope.initPage();
                } else {
                    resourceFactory.globalSearch.search({query: scope.searchText}, function (data) {
                        var arrayLength = data.length;
                        for (var i = 0; i < arrayLength; i++) {
                            var result = data[i];
                            var group = {};
                            group.status = {};
                            group.subStatus = {};
                            if(result.entityType  == 'GROUP') {
                                group.name = result.entityName;
                                group.id = result.entityId;
                                group.officeName = result.parentName;
                                group.status.value = result.entityStatus.value;
                                group.status.code = result.entityStatus.code;
                                group.externalId = result.entityExternalId;
                                scope.groups.push(group);
                            }
                        }
                    });
                }
            }

        }
    });
    mifosX.ng.application.controller('GroupController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.GroupController]).run(function ($log) {
        $log.info("GroupController initialized");
    });
}(mifosX.controllers || {}));