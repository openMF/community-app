(function (module) {
    mifosX.directives = _.extend(module, {
        TabsPersistenceDirective: function (localStorageService) {
            function setSavedTab (tabsetName, tabHeading) {
                var savedTabs = localStorageService.getFromLocalStorage("tabPersistence");
                if(savedTabs == null) {
                    savedTabs = {};
                }
                savedTabs[tabsetName] = tabHeading;
                localStorageService.addToLocalStorage("tabPersistence", savedTabs);
            }

            function getSavedTabHeading (tabsetName) {
                var savedTabs = localStorageService.getFromLocalStorage("tabPersistence");
                if(savedTabs == null || typeof savedTabs[tabsetName] === 'undefined') {
                    return null;
                }

                return savedTabs[tabsetName];
            }

            return {
                require: '^tabset',
                restrict: 'E',
                link: function (scope, elm, attrs, tabsetCtrl) {
                    var tabScope = elm.isolateScope();
                    // Tab persistence is not needed
                    if(attrs.tabsetName == null) {
                        return;
                    }

                    tabScope.tabName = attrs.tabsetName;

                    tabScope.$watchCollection('tabs', function (tabs) {
                        var savedTabHeading = getSavedTabHeading(tabScope.tabName);
                        angular.forEach(tabs, function(tab) {
                            if(typeof tab.usePersistence === "undefined") {
                                if(tab.heading == savedTabHeading) {
                                    tabsetCtrl.select(tab);
                                }

                                tab.usePersistence = true;
                                // Register the state watcher for new entries
                                tab.$watch('active', function (active, prevValue) {
                                    if (active === true && prevValue !== true) {
                                        setSavedTab(tabScope.tabName, tab.heading);
                                    }
                                });
                            }
                        });
                    });
                }
            }
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("tabset", ['localStorageService', mifosX.directives.TabsPersistenceDirective]).run(function ($log) {
    $log.info("tabsPersistenceDirective initialized");
});