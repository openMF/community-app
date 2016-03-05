(function (module) {
    mifosX.controllers = _.extend(module, {
        SearchPledgeController: function (scope, resourceFactory, location) {
            scope.pledges = [];
            scope.actualPledges = [];
            scope.searchText = "";
            scope.searchResults = [];
            scope.filteredPledges = [1,2,3];

            scope.status = {initiated : true, active : true, closed : true};

            scope.pledgesPerPage = 15;

            scope.routeTo = function(pledgeId){
                location.path("/viewpledge/" + pledgeId);
            };

            scope.initPage = function () {
                var items = resourceFactory.pledgeResource.getAllPledges({
                    offset: 0,
                    limit: scope.pledgesPerPage
                }, function (data) {
                    scope.totalPledges = data.totalFilteredRecords;
                    scope.pledges = data.pageItems;
                });
            }

            scope.getResultsPage = function (pageNumber) {
                if(scope.searchText){
                    var startPosition = (pageNumber - 1) * scope.pledgesPerPage;
                    scope.clients = scope.actualPledges.slice(startPosition, startPosition + scope.pledgesPerPage);
                    return;
                }
                var items = resourceFactory.pledgeResource.getAllPledges({
                    offset: ((pageNumber - 1) * scope.pledgesPerPage),
                    limit: scope.pledgesPerPage
                }, function (data) {
                    scope.pledges = data.pageItems;
                });
            }

            scope.search = function () {
                scope.actualPledges = [];
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
                    resourceFactory.globalSearch.search({query: searchString , resource: "pledges",exactMatch: exactMatch}, function (data) {
                        var arrayLength = data.length;
                        for (var i = 0; i < arrayLength; i++) {
                            var result = data[i];
                            var pledge = {};
                            if(result.entityType  == 'PLEDGE'){

                                pledge.clientName = result.entityName;
                                pledge.sealNumber = result.entityAccountNo;
                                pledge.id = result.entityId;
                                pledge.pledgeNumber = result.entityExternalId;
                                pledge.officeName = result.parentName;
                                pledge.systemValue = result.systemValue;
                                pledge.userValue = result.userValue;
                                pledge.status = result.status;
                            }
                            scope.actualPledges.push(pledge);
                        }
                        var numberOfPledges = scope.actualPledges.length;
                        scope.totalPledges = numberOfPledges;
                        scope.pledges = scope.actualPledges.slice(0, scope.pledgesPerPage);
                    });
                }
            }

            scope.filterByStatus = function(statusType, statusValue){
                if(statusValue && scope.filteredPledges.indexOf(statusType)<0){
                    scope.filteredPledges.push(statusType);
                }else{
                    var index = scope.filteredPledges.indexOf(statusType);
                    scope.filteredPledges.splice(index,1);
                }
            };
        }
    });



    mifosX.ng.application.controller('SearchPledgeController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.SearchPledgeController]).run(function ($log) {
        $log.info("SearchPledgeController initialized");
    });
}(mifosX.controllers || {}));