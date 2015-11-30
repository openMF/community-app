(function (module) {
    mifosX.controllers = _.extend(module, {
        VillageController: function (scope, resourceFactory, location) {
            scope.villages = [];
            scope.actualVillages = [];
            scope.searchText = "";
            scope.searchResults = [];
            scope.routeTo = function (id) {
                location.path('/viewvillage/' + id);
            };

            if (!scope.searchCriteria.villages) {
                scope.searchCriteria.villages = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.villages;

            scope.onFilter = function () {
                scope.searchCriteria.villages = scope.filterText;
                scope.saveSC();
            };


            scope.villagesPerPage = 15;
            scope.getResultsPage = function (pageNumber) {
                if(scope.searchText){
                    var startPosition = (pageNumber - 1) * scope.villagesPerPage;
                    scope.villages = scope.actualVillages.slice(startPosition, startPosition + scope.villagesPerPage);
                    return;
                }
                var items = resourceFactory.villageResource.get({
                    offset: ((pageNumber - 1) * scope.villagesPerPage),
                    limit: scope.villagesPerPage,
                    paged: 'true',
                    orderBy: 'name',
                    sortOrder: 'ASC'
                }, function (data) {
                    scope.villages = data.pageItems;
                });
            }

            scope.initPage = function () {
                var items = resourceFactory.villageResource.get({
                    offset: 0,
                    limit: scope.villagesPerPage,
                    paged: 'true',
                    orderBy: 'name',
                    sortOrder: 'ASC'
                }, function (data) {
                    scope.totalVillages = data.totalFilteredRecords;
                    scope.villages = data.pageItems;
                });
            }
            scope.initPage();

            scope.search = function () {
                scope.actualVillages = [];
                scope.searchResults = [];
                scope.filterText = "";
                if(!scope.searchText){
                    scope.initPage();
                } else {
                    resourceFactory.globalSearch.search({query: scope.searchText ,  resource: "villages"}, function (data) {
                        var arrayLength = data.length;
                        for (var i = 0; i < arrayLength; i++) {
                            var result = data[i];
                            var village = {};
                            village.status = {};
                            village.subStatus = {};
                            if(result.entityType  == 'VILLAGE') {
                                village.villageName = result.entityName;
                                village.villageId = result.entityId;
                                village.officeName = result.parentName;
                                village.status.value = result.entityStatus.value;
                                village.status.code = result.entityStatus.code;
                                village.externalId = result.entityExternalId;
                                scope.actualVillages.push(village);
                            }
                        }
                        var numberOfVillages = scope.actualVillages.length;
                        scope.totalVillages = numberOfVillages;
                        scope.villages = scope.actualVillages.slice(0, scope.villagesPerPage);
                    });
                }
            }
        }
    });
    mifosX.ng.application.controller('VillageController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.VillageController]).run(function ($log) {
        $log.info("VillageController initialized");
    });
}(mifosX.controllers || {}));