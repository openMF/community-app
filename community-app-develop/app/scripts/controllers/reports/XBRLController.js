(function (module) {
    mifosX.controllers = _.extend(module, {
        XBRLController: function (scope, resourceFactory, location, dateFilter, route, http, API_VERSION, $rootScope, localStorageService, $timeout) {
            scope.offices = [];
            scope.date = {};
            scope.restrictDate = new Date();
            scope.formData = {};
            scope.mixtaxonomyArray = [];
            resourceFactory.xbrlMixtaxonomyResource.get(function (data) {
                scope.mixtaxonomyArray = data;
                http({
                    method: 'GET',
                    url: $rootScope.hostUrl + API_VERSION + '/mixmapping'
                })
                    .success(function (data) {
                        var mappingJson = data.config;
                        if (mappingJson != undefined && mappingJson.length > 0) {
                            for (var i = scope.mixtaxonomyArray.length - 1; i >= 0; i--) {
                                var taxonomyId = scope.mixtaxonomyArray[i]["id"];
                                var mapping = ($.parseJSON(mappingJson))['' + taxonomyId];
                                if (mapping != undefined) {
                                    scope.mixtaxonomyArray[i].mapping = mapping;
                                }

                            }
                        }
                    });
            });

            resourceFactory.accountCoaResource.getAllAccountCoas(function (data) {
                scope.glaccounts = [];

                for (var i = 0; i < data.length; i++) {
                    var glaccount = {};
                    glaccount.label = "{" + data[i].glCode + "}" + " - " + data[i].name;
                    glaccount.value = "{" + data[i].glCode + "}";
                    scope.glaccounts.push(glaccount);
                }

            });

            if (localStorageService.getFromLocalStorage('XbrlReportSaveSuccess') == 'true') {
                scope.savesuccess = true;
                localStorageService.removeFromLocalStorage('XbrlReportSaveSuccess');
                scope.XbrlSuccess = true;
                $timeout(function () {
                    scope.XbrlSuccess = false;
                }, 3000);

            }

            scope.isPortfolio = function (mixtaxonomy) {
                if (mixtaxonomy.type === 0) {
                    return true;
                } else {
                    return false;
                }
            };

            scope.isBalanceSheet = function (mixtaxonomy) {
                if (mixtaxonomy.type === 1) {
                    return true;
                } else {
                    return false;
                }
            };

            scope.isIncome = function (mixtaxonomy) {
                if (mixtaxonomy.type === 2) {
                    return true;
                } else {
                    return false;
                }
            };

            scope.isExpense = function (mixtaxonomy) {
                if (mixtaxonomy.type === 3) {
                    return true;
                } else {
                    return false;
                }
            };

            scope.run = function () {
                scope.startDate = dateFilter(scope.date.startDate, 'yyyy-MM-dd');
                scope.endDate = dateFilter(scope.date.endDate, 'yyyy-MM-dd');

                if (scope.startDate === undefined) {
                    scope.startDate = "";
                }
                if (scope.endDate === undefined) {
                    scope.endDate = "";
                }

                http({
                    method: 'GET',
                    url: $rootScope.hostUrl + API_VERSION + '/mixreport?startDate=' + scope.startDate + '&endDate=' + scope.endDate
                }).success(function (data) {
                        var parser = new DOMParser();
                        var xmlDoc = parser.parseFromString(data, "text/xml");
                        $rootScope.xmlData = xmlDoc;
                        location.path('/xbrlreport');
                    });
            };

            scope.submit = function () {
                var config = {};
                var serialObject = {};
                for (var i = scope.mixtaxonomyArray.length - 1; i >= 0; i--) {
                    var taxonomyId = scope.mixtaxonomyArray[i]["id"];
                    var mapping = scope.mixtaxonomyArray[i].mapping;
                    config["" + taxonomyId] = mapping;
                }
                serialObject["config"] = JSON.stringify(config);
                serialObject["identifier"] = "default";
                resourceFactory.xbrlMixMappingResource.update({}, JSON.stringify(serialObject), function (data) {
                    localStorageService.addToLocalStorage('XbrlReportSaveSuccess', true);
                    route.reload();
                });
            };
        }
    });
    mifosX.ng.application.controller('XBRLController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$route', '$http', 'API_VERSION', '$rootScope',
            'localStorageService', '$timeout', mifosX.controllers.XBRLController]).run(function ($log) {
            $log.info("XBRLController initialized");
        });
}(mifosX.controllers || {}));
