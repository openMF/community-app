(function (module) {
    mifosX.controllers = _.extend(module, {
        MainController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale, 
                  uiConfigService, $http) {

            $http.get('release.json').success(function(data) {
                scope.version = data.version;
                scope.releasedate = data.releasedate;
            } );
            uiConfigService.init(scope);

            //hides loader
            scope.domReady = true;
            scope.activity = {};
            scope.activityQueue = [];
            if (localStorageService.getFromLocalStorage('Location')) {
                scope.activityQueue = localStorageService.getFromLocalStorage('Location');
            }
            scope.loadSC = function () {
                if (!localStorageService.getFromLocalStorage('searchCriteria'))
                    localStorageService.addToLocalStorage('searchCriteria', {})
                scope.searchCriteria = localStorageService.getFromLocalStorage('searchCriteria');
            };
            scope.saveSC = function () {
                localStorageService.addToLocalStorage('searchCriteria', scope.searchCriteria);
            };
            scope.loadSC();
            scope.setDf = function () {
                if (localStorageService.getFromLocalStorage('dateformat')) {
                    scope.dateformat = localStorageService.getFromLocalStorage('dateformat');
                } else {
                    localStorageService.addToLocalStorage('dateformat', 'dd MMMM yyyy');
                    scope.dateformat = 'dd MMMM yyyy';
                }
                scope.df = scope.dateformat;
            };

            scope.updateDf = function(dateFormat){
                localStorageService.addToLocalStorage('dateformat', dateFormat);
                scope.dateformat = dateFormat;
                scope.setDf();
            };
            scope.setDf();
            $rootScope.setPermissions = function (permissions) {
                $rootScope.permissionList = permissions;
                localStorageService.addToLocalStorage('userPermissions', permissions);
                $rootScope.$broadcast('permissionsChanged')
            };

            $rootScope.hasPermission = function (permission) {
                permission = permission.trim();
                //FYI: getting all permissions from localstorage, because if scope changes permissions array will become undefined
                $rootScope.permissionList = localStorageService.getFromLocalStorage('userPermissions');
                //If user is a Super user return true
                if ($rootScope.permissionList && _.contains($rootScope.permissionList, "ALL_FUNCTIONS")) {
                    return true;
                } else if ($rootScope.permissionList && permission && permission != "") {
                    //If user have all read permission return true
                    if (permission.substring(0, 5) == "READ_" && _.contains($rootScope.permissionList, "ALL_FUNCTIONS_READ")) {
                        return true;
                    } else if (_.contains($rootScope.permissionList, permission)) {
                        //check for the permission if user doesn't have any special permissions
                        return true;
                    } else {
                        //return false if user doesn't have permission
                        return false;
                    }
                } else {
                    //return false if no value assigned to has-permission directive
                    return false;
                }
                ;
            };

            scope.$watch(function () {
                return location.path();
            }, function () {
                scope.activity = location.path();
                scope.activityQueue.push(scope.activity);
                localStorageService.addToLocalStorage('Location', scope.activityQueue);
            });

            //Logout the user if Idle
            scope.started = false;
            scope.$on('$idleTimeout', function () {
                scope.logout();
                $idle.unwatch();
                scope.started = false;
            });

            // Log out the user when the window/tab is closed.
            window.onunload = function () {
                scope.logout();
                $idle.unwatch();
                scope.started = false;
            };

            scope.start = function (session) {
                if (session) {
                    $idle.watch();
                    scope.started = true;
                }
            };

            scope.leftnav = false;
            scope.$on("UserAuthenticationSuccessEvent", function (event, data) {
                scope.authenticationFailed = false;
                scope.resetPassword = data.shouldRenewPassword;
                if (sessionManager.get(data)) {
                    scope.currentSession = sessionManager.get(data);
                    scope.start(scope.currentSession);
                    if (scope.currentSession.user && scope.currentSession.user.userPermissions) {
                        $rootScope.setPermissions(scope.currentSession.user.userPermissions);
                    }
                    location.path('/home').replace();
                } else {
                    scope.loggedInUserId = data.userId;
                }
                ;
            });

            var setSearchScopes = function () {
                var all = {name: "label.search.scope.all", value: "clients,clientIdentifiers,groups,savings,loans"};
                var clients = {
                    name: "label.search.scope.clients.and.clientIdentifiers",
                    value: "clients,clientIdentifiers"
                };
                var groups = {
                    name: "label.search.scope.groups.and.centers",
                    value: "groups"
                };
                var savings = {name: "label.input.adhoc.search.loans", value: "loans"};
                var loans = {name: "label.search.scope.savings", value: "savings"};
                scope.searchScopes = [all,clients,groups,loans,savings];
                scope.currentScope = all;
            }

            setSearchScopes();

            scope.changeScope = function (searchScope) {
                scope.currentScope = searchScope ;
            }

            scope.search = function () {
                var resource;
                var searchString=scope.search.query;
                var exactMatch=false;
                if(searchString != null){
                    searchString = searchString.replace(/(^"|"$)/g, '');
                    var n = searchString.localeCompare(scope.search.query);
                    if(n!=0)
                    {
                        exactMatch=true;
                    }
                }
                location.path('/search/' + searchString).search({exactMatch: exactMatch, resource: scope.currentScope.value});

            };

            scope.logout = function () {
                scope.currentSession = sessionManager.clear();
                scope.resetPassword = false;
                location.path('/').replace();
            };

            scope.langs = mifosX.models.Langs;
            if (localStorageService.getFromLocalStorage('Language')) {
                var temp = localStorageService.getFromLocalStorage('Language');
                for (var i in mifosX.models.Langs) {
                    if (mifosX.models.Langs[i].code == temp.code) {
                        scope.optlang = mifosX.models.Langs[i];
                        tmhDynamicLocale.set(mifosX.models.Langs[i].code);
                        }
                }
            } else {
                scope.optlang = scope.langs[0];
                tmhDynamicLocale.set(scope.langs[0].code);
                }
            translate.uses(scope.optlang.code);

            scope.isActive = function (route) {
                if (route == 'clients') {
                    var temp = ['/clients', '/groups', '/centers'];
                    for (var i in temp) {
                        if (temp[i] == location.path()) {
                            return true;
                        }
                    }
                }
                else if (route == 'acc') {
                    var temp1 = ['/accounting', '/freqposting', '/accounting_coa', '/journalentry', '/accounts_closure', '/Searchtransaction', '/accounting_rules'];
                    for (var i in temp1) {
                        if (temp1[i] == location.path()) {
                            return true;
                        }
                    }
                }
                else if (route == 'rep') {
                    var temp2 = ['/reports/all', '/reports/clients', '/reports/loans', '/reports/funds', '/reports/accounting', 'reports/savings'];
                    for (var i in temp2) {
                        if (temp2[i] == location.path()) {
                            return true;
                        }
                    }
                }
                else if (route == 'admin') {
                    var temp3 = ['/users/', '/organization', '/system', '/products', '/global'];
                    for (var i in temp3) {
                        if (temp3[i] == location.path()) {
                            return true;
                        }
                    }
                }
                else {
                    var active = route === location.path();
                    return active;
                }
            };

            keyboardManager.bind('ctrl+shift+n', function () {
                location.path('/nav/offices');
            });
            keyboardManager.bind('ctrl+shift+i', function () {
                location.path('/tasks');
            });
            keyboardManager.bind('ctrl+shift+o', function () {
                location.path('/entercollectionsheet');
            });
            keyboardManager.bind('ctrl+shift+c', function () {
                location.path('/createclient');
            });
            keyboardManager.bind('ctrl+shift+g', function () {
                location.path('/creategroup');
            });
            keyboardManager.bind('ctrl+shift+q', function () {
                location.path('/createcenter');
            });
            keyboardManager.bind('ctrl+shift+f', function () {
                location.path('/freqposting');
            });
            keyboardManager.bind('ctrl+shift+e', function () {
                location.path('/accounts_closure');
            });
            keyboardManager.bind('ctrl+shift+j', function () {
                location.path('/journalentry');
            });
            keyboardManager.bind('ctrl+shift+a', function () {
                location.path('/accounting');
            });
            keyboardManager.bind('ctrl+shift+r', function () {
                location.path('/reports/all');
            });
            keyboardManager.bind('ctrl+s', function () {
                document.getElementById('save').click();
            });
            keyboardManager.bind('ctrl+r', function () {
                document.getElementById('run').click();
            });
            keyboardManager.bind('ctrl+shift+x', function () {
                document.getElementById('cancel').click();
            });
            keyboardManager.bind('ctrl+shift+l', function () {
                document.getElementById('logout').click();
            });
            keyboardManager.bind('alt+x', function () {
                document.getElementById('search').focus();
            });
            keyboardManager.bind('ctrl+shift+h', function () {
                document.getElementById('help').click();
            });
            keyboardManager.bind('ctrl+n', function () {
                document.getElementById('next').click();
            });
            keyboardManager.bind('ctrl+p', function () {
                document.getElementById('prev').click();
            });
            scope.changeLang = function (lang, $event) {
                translate.uses(lang.code);
                localStorageService.addToLocalStorage('Language', lang);
                tmhDynamicLocale.set(lang.code);
                scope.optlang = lang;
            };

            /*redirecticg next pages*/
            scope.redirectCenter = function (id) {
                location.path('/viewcenter/' + id);
            };
            scope.redirectGroup = function (id) {
                location.path('/viewgroup/' + id);
            };
            scope.redirectOffice = function (id) {
                location.path('/viewoffice/' + id);
            };

            scope.viewClient = function (id) {
                location.path('/viewclient/' + id);
            };



            sessionManager.restore(function (session) {
                scope.currentSession = session;
                scope.start(scope.currentSession);
                if (session.user != null && session.user.userPermissions) {
                    $rootScope.setPermissions(session.user.userPermissions);
                    localStorageService.addToLocalStorage('userPermissions', session.user.userPermissions);
                }
                ;
            });
        }
    });
    mifosX.ng.application.controller('MainController', [
        '$scope',
        '$location',
        'SessionManager',
        '$translate',
        '$rootScope',
        'localStorageService',
        'keyboardManager', '$idle',
        'tmhDynamicLocale',
        'UIConfigService',
        '$http',
        mifosX.controllers.MainController
    ]).run(function ($log) {
        $log.info("MainController initialized");
    });
}(mifosX.controllers || {}));
