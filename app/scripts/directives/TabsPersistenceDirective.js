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
                restrict: 'A',
                link: function (scope, elm, attrs) {
                    var tabScope = elm.isolateScope();
                    // Tab persistence is not needed
                    if(attrs.tabsetName == null) {
                        return;
                    }

                    tabScope.tabName = attrs.tabsetName;

                    tabScope.$watch('tabset.active', function (data) {
                       setSavedTab(tabScope.tabName, data);
                    });

                    var savedTabIndex = getSavedTabHeading(tabScope.tabName);
                    if(savedTabIndex != null) {
                        tabScope.tabset.active = savedTabIndex;
                    }
                }
            }
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("persistentTab", ['localStorageService', mifosX.directives.TabsPersistenceDirective]).run(function ($log) {
    $log.info("tabsPersistenceDirective initialized");
});