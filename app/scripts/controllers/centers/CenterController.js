(function (module) {
    mifosX.controllers = _.extend(module, {
        CenterController: function (scope, resourceFactory, location) {
            scope.centers = [];
            scope.searchText = "";
            scope.searchResults = [];
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


            scope.centersPerPage = 15;
            scope.getResultsPage = function (pageNumber) {
                var items = resourceFactory.centerResource.get({
                    offset: ((pageNumber - 1) * scope.centersPerPage),
                    limit: scope.centersPerPage,
                    paged: 'true',
                    orderBy: 'name',
                    sortOrder: 'ASC'
                }, function (data) {
                    scope.centers = data.pageItems;
                });
            }

            scope.initPage = function () {
                var items = resourceFactory.centerResource.get({
                    offset: 0,
                    limit: scope.centersPerPage,
                    paged: 'true',
                    orderBy: 'name',
                    sortOrder: 'ASC'
                }, function (data) {
                    scope.totalCenters = data.totalFilteredRecords;
                    scope.centers = data.pageItems;
                });
            }
            scope.initPage();

            scope.search = function () {
                scope.centers = [];
                scope.searchResults = [];
                scope.filterText = "";
                if(!scope.searchText){
                    scope.initPage();
                } else {
                    resourceFactory.globalSearch.search({query: scope.searchText}, function (data) {
                        var arrayLength = data.length;
                        for (var i = 0; i < arrayLength; i++) {
                            var result = data[i];
                            var center = {};
                            center.status = {};
                            center.subStatus = {};
                            if(result.entityType  == 'CENTER') {
                                center.name = result.entityName;
                                center.id = result.entityId;
                                center.officeName = result.parentName;
                                center.status.value = result.entityStatus.value;
                                center.status.code = result.entityStatus.code;
                                center.externalId = result.entityExternalId;
                                scope.centers.push(center);
                            }
                        }
                    });
                }
            }

        }
    });
    mifosX.ng.application.controller('CenterController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CenterController]).run(function ($log) {
        $log.info("CenterController initialized");
    });
}(mifosX.controllers || {}));