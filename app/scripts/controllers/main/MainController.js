(function (module) {
    mifosX.controllers = _.extend(module, {
        MainController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale, 
                  uiConfigService, $http) {

            $http.get('release.json').success(function(data) {
                scope.version = data.version;
                scope.releasedate = data.releasedate;
            } );
            uiConfigService.init();
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

            scope.search = function () {
                location.path('/search/' + scope.search.query);
            };
            scope.text = '<span>Mifos X is designed by the <a href="http://www.openmf.org/">Mifos Initiative</a>.' +
            '<a href="http://mifos.org/resources/community/"> A global community </a> thats aims to speed the elimination of poverty by enabling Organizations to more effectively and efficiently deliver responsible financial services to the world’s poor and unbanked </span><br/>' +
            '<span>Sounds interesting?<a href="http://mifos.org/take-action/volunteer/"> Get involved!</a></span>';

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
            scope.helpf = function()
            {
                // first, create addresses array
            var addresses = ["https://mifosforge.jira.com/wiki/display/docs/User+Setup","https://mifosforge.jira.com/wiki/display/docs/Organization",
                "https://mifosforge.jira.com/wiki/display/docs/System", "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=products&startIndex=0&where=docs",
                "https://mifosforge.jira.com/wiki/pages/viewpage.action?pageId=67141762","https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=report&startIndex=0&where=docs",
                "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=accounting&startIndex=0&where=docs",  "https://mifosforge.jira.com/wiki/display/docs/Manage+Clients",
                "https://mifosforge.jira.com/wiki/display/docs/Manage+Groups","https://mifosforge.jira.com/wiki/display/docs/Manage+Centers",
                "https://mifosforge.jira.com/wiki/display/docs/Community+App+User+Manual","https://mifosforge.jira.com/wiki/display/docs/Manage+Offices",
                "https://mifosforge.jira.com/wiki/display/docs/Manage+Holidays","https://mifosforge.jira.com/wiki/display/docs/Manage+Employees",
                "https://mifosforge.jira.com/wiki/display/docs/Manage+Funds","https://mifosforge.jira.com/wiki/display/docs/Bulk+Loan+Reassignment",
                "https://mifosforge.jira.com/wiki/display/docs/Currency+Configuration","https://mifosforge.jira.com/wiki/display/docs/Standing+Instructions+History",
                "https://mifosforge.jira.com/wiki/display/docs/Manage+Data+Tables","https://mifosforge.jira.com/wiki/pages/viewpage.action?pageId=67895350",
                "https://mifosforge.jira.com/wiki/display/docs/Manage+Roles+and+Permissions","https://mifosforge.jira.com/wiki/display/docs/Maker-Checker",
                "https://mifosforge.jira.com/wiki/display/docs/Manage+Hooks","https://mifosforge.jira.com/wiki/display/docs/Audit+Trails",
                "https://mifosforge.jira.com/wiki/display/docs/Manage+Reports","https://mifosforge.jira.com/wiki/display/docs/Manage+Scheduler+Jobs",
                "https://mifosforge.jira.com/wiki/display/docs/Global+Configuration","https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=account%20number%20preferences&startIndex=0&where=docs",
                "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=loan%20products&startIndex=0&where=docs","https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=saving%20products&startIndex=0&where=docs",
                "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=charges&startIndex=0&where=docs","https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=products%20mix&startIndex=0&where=docs",
                "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=fixed%20deposit%20products&startIndex=0&where=docs","https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=recurring%20deposit%20products&startIndex=0&where=docs",
                "https://mifosforge.jira.com/wiki/pages/viewpage.action?pageId=67895308","https://mifosforge.jira.com/wiki/display/docs/Add+Journal+Entries",
                "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=search%20journal%20entries&startIndex=0&where=docs",  "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=accounts%20linked&startIndex=0&where=docs",
                "https://mifosforge.jira.com/wiki/display/docs/Chart+of+Accounts+and+General+Ledger+Setup", "https://mifosforge.jira.com/wiki/display/docs/Closing+Entries",
                "https://mifosforge.jira.com/wiki/pages/viewpage.action?pageId=67895308","https://mifosforge.jira.com/wiki/display/docs/Accruals"]; 
            // array is huge, but working good
            // create second array with address models
            var addrmodels = ['/users/','/organization','/system','/products','/templates', '', '/accounting',
                                '/clients', '/groups','/centers','','/offices', '/holidays','/employees','/managefunds/',
                                '/bulkloan','/currconfig','/standinginstructions/history','/datatables','/codes','/admin/roles',
                                '/admin/viewmctasks','/hooks','/audit', '/reports','/jobs','/global','/accountnumberpreferences','/loanproducts',
                                '/savingproducts','/charges','/productmix', '/fixeddepositproducts','/recurringdepositproducts','/freqposting',
                                '/journalentry','/searchtransaction','/financialactivityaccountmappings','/accounting_coa', '/accounts_closure','/accounting_rules','/run_periodic_accrual'];
            // * text-based address-recognize system *
            var actualadr = location.absUrl();  // get full URL     
            var lastchar = 0;
            for( var i = 0; i<actualadr.length;i++)
                {
                    
                    if(actualadr.charAt(i) == '#')
                    {
                        lastchar = i+1;                     
                        break;
                        // found '#' and save position of it
                    }
                }//for
            
            var whereweare = actualadr.substring(lastchar); // cut full URL to after-'#' part
            
            // string after '#' is compared with model
            var addrfound = false;
            if(whereweare == '/reports/all' || whereweare == '/reports/clients' || whereweare == '/reports/loans' || whereweare == '/reports/savings' || whereweare == '/reports/funds' || whereweare == '/reports/accounting' || whereweare == '/xbrl'  )
                     {
                        window.open(addresses[5]);
                        addrfound = true;                   
                     }// '/reports/...' are exception -> link to Search in Documentation word 'report'
                     else{
                            for(var i = 0; i< addrmodels.length; i++)
                            {
                                if(i != 5 && i != 10)
                                    {
                                        if(whereweare == addrmodels[i])
                                        {
                                                addrfound = true;
                                                window.open(addresses[i]);
                                                break;          
                                                // model found -> open address and break
                                        }
                                    }                               
                            }//for
                          }//else
                if(addrfound == false) window.open(addresses[10]); // substring not matching to any model -> open start user manual page
            
            };//helpf
            
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
