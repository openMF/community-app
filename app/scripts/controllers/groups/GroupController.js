(function (module) {
    mifosX.controllers = _.extend(module, {
        GroupController: function (scope, resourceFactory, location) {
            scope.groups = [];
            scope.actualGroups = [];
            scope.searchText = "";
            scope.searchResults = [];
            scope.showClosed = false;
            scope.routeTo = function (id) {
                location.path('/viewgroup/' + id);
            };

            if (!scope.searchCriteria.groups) {
                scope.searchCriteria.groups = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.groups || '';

            scope.onFilter = function () {
                scope.searchCriteria.groups = scope.filterText;
                scope.saveSC();
            };

            scope.groupsPerPage = 15;
            scope.getResultsPage = function (pageNumber) {
                if(scope.searchText){
                    var startPosition = (pageNumber - 1) * scope.groupsPerPage;
                    scope.groups = scope.actualGroups.slice(startPosition, startPosition + scope.groupsPerPage);
                    return;
                }
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
                scope.actualGroups = [];
                scope.searchResults = [];
                scope.filterText = "";
                var searchString = scope.searchText;
                searchString = searchString.replace(/(^"|"$)/g, '');
                var exactMatch=false;
                var n = searchString.localeCompare(scope.searchText);
                if(n!=0)
                {
                    exactMatch=true;
                }
                if(!scope.searchText){
                    scope.initPage();
                } else {
                    resourceFactory.globalSearch.search({query: searchString, resource: "groups",exactMatch: exactMatch}, function (data) {
                        var arrayLength = data.length;
                        for (var i = 0; i < arrayLength; i++) {
                            var result = data[i];
                            var group = {};
                            group.status = {};
                            group.subStatus = {};
                            if(result.entityType  == 'GROUP') {
                                group.name = result.entityName;
                                group.id = result.entityId;
                                group.accountNo = result.entityAccountNo;
                                group.officeName = result.parentName;
                                group.status.value = result.entityStatus.value;
                                group.status.code = result.entityStatus.code;
                                group.externalId = result.entityExternalId;
                                scope.actualGroups.push(group);
                            }
                        }
                        var numberOfGroups = scope.actualGroups.length;
                        scope.totalGroups = numberOfGroups;
                        scope.groups = scope.actualGroups.slice(0, scope.groupsPerPage);
                    });
                }
            }

        }
    });
    mifosX.ng.application.controller('GroupController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.GroupController]).run(function ($log) {
        $log.info("GroupController initialized");
    });
}(mifosX.controllers || {}));