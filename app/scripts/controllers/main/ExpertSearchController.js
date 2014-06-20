(function (module) {
    mifosX.controllers = _.extend(module, {
        ExpertSearchController: function (scope, resourceFactory, localStorageService, $rootScope, location) {

            scope.recent = [];
            scope.recent = localStorageService.get('Location');
            scope.recentEight = [];
            scope.frequent = [];
            scope.recentArray = [];
            scope.uniqueArray = [];
            scope.searchParams = [];
            scope.recents = [];

            //to retrieve last 8 recent activities
            for (var rev = scope.recent.length - 1; rev > 0; rev--) {
                scope.recentArray.push(scope.recent[rev]);
            }
            scope.unique = function (array) {
                array.forEach(function (value) {
                    if (scope.uniqueArray.indexOf(value) === -1) {
                        scope.uniqueArray.push(value);
                    }
                });
            }
            scope.unique(scope.recentArray);
            //recent activities retrieved

            //retrieve last 8 recent activities
            for (var l = 0; l < 11; l++) {
                if (scope.uniqueArray[l]) {
                    if (scope.uniqueArray[l] != '/') {
                        if (scope.uniqueArray[l] != '/home') {
                            scope.recents.push(scope.uniqueArray[l]);
                        }
                    }
                }
            }
            // 8 recent activities retrieved

            //count duplicates
            var i = scope.recent.length;
            var obj = {};
            while (i) {
                obj[scope.recent[--i]] = (obj[scope.recent[i]] || 0) + 1;
            }
            //count ends here

            //to sort based on counts
            var sortable = [];
            for (var i in obj) {
                sortable.push([i, obj[i]]);
            }
            sortable.sort(function (a, b) {
                return a[1] - b[1]
            });
            //sort end here

            //to retrieve the locations from sorted array
            var sortedArray = [];
            for (var key in sortable) {
                sortedArray.push(sortable[key][0]);
            }
            //retrieving ends here

            //retrieve last 8 frequent actions
            for (var freq = sortedArray.length - 1; freq > sortedArray.length - 11; freq--) {
                if (sortedArray[freq]) {
                    if (sortedArray[freq] != '/') {
                        if (sortedArray[freq] != '/home') {
                            scope.frequent.push(sortedArray[freq]);
                        }
                    }
                }
            }
            // retrieved 8 frequent actions

            scope.searchParams = ['create client', 'clients', 'create group', 'groups', 'centers', 'create center', 'configuration', 'tasks', 'templates', 'system users',
                'create template', 'create loan product', 'create saving product', 'roles', 'add role', 'configure maker checker tasks',
                'users', 'loan products', 'charges', 'saving products', 'offices', 'create office', 'currency configurations', 'user settings',
                'create user', 'employees', 'create employee', 'manage funds', 'offices', 'chart of accounts', 'frequent postings', 'Journal entry',
                'search transaction', 'account closure', 'accounting rules', 'add accounting rule', 'data tables', 'create data table', 'add code',
                'jobs', 'codes', 'reports', 'create report', 'holidays', 'create holiday', 'create charge', 'product mix', 'add member', 'add product mix',
                'bulk loan reassignment', 'audit', 'create accounting closure', 'enter collection sheet', 'navigation', 'accounting', 'organization', 'system'
            ];
            scope.search = function () {
                switch (this.formData.search) {
                    case 'create client':
                        location.path('/createclient');
                        break;
                    case 'clients':
                        location.path('/clients');
                        break;
                    case 'create group':
                        location.path('/creategroup');
                        break;
                    case 'groups':
                        location.path('/groups');
                        break;
                    case 'create center':
                        location.path('/createcenter');
                        break;
                    case 'centers':
                        location.path('/centers');
                        break;
                    case 'configuration':
                        location.path('/global');
                        break;
                    case 'tasks':
                        location.path('/tasks');
                        break;
                    case 'templates':
                        location.path('/templates');
                        break;
                    case 'create template':
                        location.path('/createtemplate');
                        break;
                    case 'create loan product':
                        location.path('/createloanproduct');
                        break;
                    case 'create saving product':
                        location.path('/createsavingproduct');
                        break;
                    case 'roles':
                        location.path('/admin/roles');
                        break;
                    case 'add role':
                        location.path('/admin/addrole');
                        break;
                    case 'configure maker checker tasks':
                        location.path('/admin/viewmctasks');
                        break;
                    case 'loan products':
                        location.path('/loanproducts');
                        break;
                    case 'charges':
                        location.path('/charges');
                        break;
                    case 'saving products':
                        location.path('/savingproducts');
                        break;
                    case 'offices':
                        location.path('/offices');
                        break;
                    case 'create office':
                        location.path('/createoffice');
                        break;
                    case 'currency configurations':
                        location.path('/currconfig');
                        break;
                    case 'user settings':
                        location.path('/usersetting');
                        break;
                    case 'employees':
                        location.path('/employees');
                        break;
                    case 'create employee':
                        location.path('/createemployee');
                        break;
                    case 'manage funds':
                        location.path('/managefunds');
                        break;
                    case 'chart of accounts':
                        location.path('/accounting_coa');
                        break;
                    case 'frequent postings':
                        location.path('/freqposting');
                        break;
                    case 'journal entry':
                        location.path('/journalentry');
                        break;
                    case 'search transaction':
                        location.path('/searchtransaction');
                        break;
                    case 'account closure':
                        location.path('/accounts_closure');
                        break;
                    case 'accounting rules':
                        location.path('/accounting_rules');
                        break;
                    case 'add accounting rule':
                        location.path('/add_accrule');
                        break;
                    case 'data tables':
                        location.path('/datatables');
                        break;
                    case 'create data table':
                        location.path('/createdatatable');
                        break;
                    case 'add code':
                        location.path('/addcode');
                        break;
                    case 'jobs':
                        location.path('/jobs');
                        break;
                    case 'codes':
                        location.path('/codes');
                        break;
                    case 'reports':
                        location.path('/reports');
                        break;
                    case 'create report':
                        location.path('/createreport');
                        break;
                    case 'holidays':
                        location.path('/holidays');
                        break;
                    case 'create holiday':
                        location.path('/createholiday');
                        break;
                    case 'add member':
                        location.path('/addmember');
                        break;
                    case 'create charge':
                        location.path('/createcharge');
                        break;
                    case 'enter collection sheet':
                        location.path('/entercollectionsheet');
                        break;
                    case 'product mix':
                        location.path('/productmix');
                        break;
                    case 'add product mix':
                        location.path('/addproductmix');
                        break;
                    case 'bulk loan reassignment':
                        location.path('/bulkloan');
                        break;
                    case 'audit':
                        location.path('/audit');
                        break;
                    case 'create accounting closure':
                        location.path('/createclosure');
                        break;
                    case 'navigation':
                        location.path('/nav/offices');
                        break;
                    case 'accounting':
                        location.path('/accounting');
                        break;
                    case 'organization':
                        location.path('/organization');
                        break;
                    case 'system':
                        location.path('/system');
                        break;
                    case 'system users':
                        location.path('/admin/users');
                        break;
                    default:
                        location.path('/home');
                }
            }
            scope.client = [];
            scope.offices = [];
            scope.cOfficeName = 'Head Office';
            scope.dOfficeName = 'Head Office';
            scope.bOfficeName = 'Head Office';
            scope.chartType = 'Days';
            scope.collectionPieData = [];
            scope.formatdate = function () {
                var bardate = new Date();
                scope.formattedDate = [];
                for (var i = 0; i < 12; i++) {
                    var temp_date = bardate.getDate();
                    bardate.setDate(temp_date - 1);
                    var curr_date = bardate.getDate();
                    var curr_month = bardate.getMonth() + 1;
                    scope.formattedDate[i] = curr_date + "/" + curr_month;
                }
            };
            scope.formatdate();

            scope.getWeek = function () {
                scope.formattedWeek = [];
                var checkDate = new Date();
                checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
                var time = checkDate.getTime();
                checkDate.setMonth(0);
                checkDate.setDate(1);
                var week = Math.floor(Math.round((time - checkDate) / 86400000) / 7);
                for (var i = 0; i < 12; i++) {
                    if (week == 0) {
                        week = 52;
                    }
                    scope.formattedWeek[i] = week - i;

                }
            };
            scope.getWeek();

            scope.getMonth = function () {
                var today = new Date();
                var aMonth = today.getMonth();
                scope.formattedMonth = [];
                var month = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
                for (var i = 0; i < 12; i++) {
                    scope.formattedMonth.push(month[aMonth]);
                    aMonth--;
                    if (aMonth < 0) {
                        aMonth = 11;
                    }
                }
            };
            scope.getMonth();

            scope.getBarData = function (firstData, secondClientData, secondLoanData) {
                scope.BarData = [

                    {
                        "key": "New Client Joining",
                        "values": [
                            [ firstData[11] , secondClientData[11]] ,
                            [ firstData[10] , secondClientData[10]] ,
                            [ firstData[9] , secondClientData[9]] ,
                            [ firstData[8] , secondClientData[8]] ,
                            [ firstData[7] , secondClientData[7]] ,
                            [ firstData[6] , secondClientData[6]] ,
                            [ firstData[5] , secondClientData[5]] ,
                            [ firstData[4] , secondClientData[4]] ,
                            [ firstData[3] , secondClientData[3]] ,
                            [ firstData[2] , secondClientData[2]] ,
                            [ firstData[1] , secondClientData[1]] ,
                            [ firstData[0] , secondClientData[0]]
                        ]
                    },
                    {
                        "key": "Loans Disbursed",
                        "values": [
                            [ firstData[11] , secondLoanData[11]] ,
                            [ firstData[10] , secondLoanData[10]] ,
                            [ firstData[9] , secondLoanData[9]] ,
                            [ firstData[8] , secondLoanData[8]] ,
                            [ firstData[7] , secondLoanData[7]] ,
                            [ firstData[6] , secondLoanData[6]] ,
                            [ firstData[5] , secondLoanData[5]] ,
                            [ firstData[4] , secondLoanData[4]] ,
                            [ firstData[3] , secondLoanData[3]] ,
                            [ firstData[2] , secondLoanData[2]] ,
                            [ firstData[1] , secondLoanData[1]] ,
                            [ firstData[0] , secondLoanData[0]]
                        ]
                    }
                ];
            };

            scope.getFcount = function (dateData, retrievedDateData, responseData) {
                for (var i in dateData) {
                    scope.fcount[i] = 0;
                    for (var j in retrievedDateData) {
                        if (dateData[i] == retrievedDateData[j]) {
                            scope.fcount[i] = responseData[j].count;

                        }
                    }
                }
            };
            scope.getLcount = function (dateData, retrievedDateData, responseData) {
                for (var i in dateData) {
                    scope.lcount[i] = 0;
                    for (var j in retrievedDateData) {
                        if (dateData[i] == retrievedDateData[j]) {
                            scope.lcount[i] = responseData[j].lcount;

                        }
                    }
                }
            };

            resourceFactory.runReportsResource.get({reportSource: 'ClientTrendsByDay', R_officeId: 1, genericResultSet: false}, function (clientData) {
                scope.client = clientData;
                scope.days = [];
                scope.tempDate = [];
                scope.fcount = [];
                for (var i in scope.client) {
                    scope.days[i] = scope.client[i].days;
                }
                for (var i in scope.days) {
                    if (scope.days[i] && scope.days[i].length > 2) {
                        var tday = scope.days[i][2];
                        var tmonth = scope.days[i][1];
                        var tyear = scope.days[i][0];
                        scope.tempDate[i] = tday + "/" + tmonth;
                    }
                }
                scope.getFcount(scope.formattedDate, scope.tempDate, scope.client);
                resourceFactory.runReportsResource.get({reportSource: 'LoanTrendsByDay', R_officeId: 1, genericResultSet: false}, function (loanData) {
                    scope.ldays = [];
                    scope.ltempDate = [];
                    scope.lcount = [];
                    for (var i in loanData) {
                        scope.ldays[i] = loanData[i].days;
                    }
                    for (var i in scope.ldays) {
                        if (scope.ldays[i] && scope.ldays[i].length > 2) {
                            var tday = scope.ldays[i][2];
                            var tmonth = scope.ldays[i][1];
                            var tyear = scope.ldays[i][0];
                            scope.ltempDate[i] = tday + "/" + tmonth;
                        }
                    };
                    scope.getLcount(scope.formattedDate, scope.ltempDate, loanData);
                    scope.getBarData(scope.formattedDate, scope.fcount, scope.lcount);
                });
            });

            resourceFactory.groupTemplateResource.get(function (data) {
                scope.offices = data.officeOptions;
            });

            resourceFactory.runReportsResource.get({reportSource: 'Demand_Vs_Collection', R_officeId: 1, genericResultSet: false}, function (data) {
                if (data && data.length > 0) {
                    scope.collectionPieData = data[0];
                    scope.showCollectionerror = false;
                    if (data[0].AmountPaid == 0 && data[0].AmountDue == 0) {
                        scope.showCollectionerror = true;
                    }
                    scope.collectedData = [
                        {key: "Collected", y: scope.collectionPieData.AmountPaid},
                        {key: "Pending", y: scope.collectionPieData.AmountDue}
                    ];
                } else{
                    scope.showCollectionerror = true;
                };
            });
            resourceFactory.runReportsResource.get({reportSource: 'Disbursal_Vs_Awaitingdisbursal', R_officeId: 1, genericResultSet: false}, function (data) {
                if (data && data.length > 0) {
                    scope.disbursedPieData = data[0];
                    scope.showDisbursementerror = false;
                    if (data[0].disbursedAmount == 0 && data[0].amountToBeDisburse == 0) {
                        scope.showDisbursementerror = true;
                    }
                    scope.disbursedData = [
                        {key: "Disbursed", y: scope.disbursedPieData.disbursedAmount},
                        {key: "Pending", y: scope.disbursedPieData.amountToBeDisburse}
                    ];
                } else{
                    scope.showDisbursementerror = true;
                };
            });

            scope.getDailyData = function () {
                scope.chartType = 'Days';
                scope.id = this.officeId || 1;
                resourceFactory.runReportsResource.get({reportSource: 'ClientTrendsByDay', R_officeId: scope.id, genericResultSet: false}, function (data) {
                    scope.client = data;
                    scope.days = [];
                    scope.tempDate = [];
                    scope.fcount = [];
                    for (var i in scope.offices) {
                        if (scope.offices[i].id == scope.id) {
                            scope.bOfficeName = scope.offices[i].name;
                        }
                    }
                    for (var i in scope.client) {
                        scope.days[i] = scope.client[i].days;
                    }
                    for (var i in scope.days) {
                        if (scope.days[i] && scope.days[i].length > 2) {
                            var tday = scope.days[i][2];
                            var tmonth = scope.days[i][1];
                            var tyear = scope.days[i][0];
                            scope.tempDate[i] = tday + "/" + tmonth;
                        }
                    }
                    scope.getFcount(scope.formattedDate, scope.tempDate, scope.client);
                    resourceFactory.runReportsResource.get({reportSource: 'LoanTrendsByDay', R_officeId: scope.id, genericResultSet: false}, function (data) {
                        scope.ldays = [];
                        scope.ltempDate = [];
                        scope.lcount = [];
                        for (var i in data) {
                            scope.ldays[i] = data[i].days;
                        }
                        for (var i in scope.ldays) {
                            if (scope.ldays[i] && scope.ldays[i].length > 2) {
                                var tday = scope.ldays[i][2];
                                var tmonth = scope.ldays[i][1];
                                var tyear = scope.ldays[i][0];
                                scope.ltempDate[i] = tday + "/" + tmonth;
                            }
                        }
                        scope.getLcount(scope.formattedDate, scope.ltempDate, data);
                        scope.getBarData(scope.formattedDate, scope.fcount, scope.lcount);
                    });
                });
            };

            scope.getWeeklyData = function () {
                scope.chartType = 'Weeks';
                scope.id = this.officeId || 1;
                resourceFactory.runReportsResource.get({reportSource: 'ClientTrendsByWeek', R_officeId: scope.id, genericResultSet: false}, function (data) {
                    scope.client = data;
                    scope.weeks = [];
                    scope.fcount = [];

                    for (var i in scope.offices) {
                        if (scope.offices[i].id == scope.id) {
                            scope.bOfficeName = scope.offices[i].name;
                        }
                    }
                    for (var i in scope.client) {
                        scope.weeks[i] = scope.client[i].Weeks;
                    }

                    scope.getFcount(scope.formattedWeek, scope.weeks, scope.client);
                    resourceFactory.runReportsResource.get({reportSource: 'LoanTrendsByWeek', R_officeId: scope.id, genericResultSet: false}, function (data) {
                        scope.lweeks = [];
                        scope.lcount = [];
                        for (var i in data) {
                            scope.lweeks[i] = data[i].Weeks;
                        }
                        scope.getLcount(scope.formattedWeek, scope.lweeks, data);
                        scope.getBarData(scope.formattedWeek, scope.fcount, scope.lcount);
                    });
                });
            };

            scope.getMonthlyData = function () {
                scope.chartType = 'Months';
                scope.id = this.officeId || 1;
                scope.formattedSMonth = [];
                var monthArray = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
                var today = new Date();
                var aMonth = today.getMonth();
                for (var i = 0; i < 12; i++) {
                    scope.formattedSMonth.push(monthArray[aMonth]);
                    aMonth--;
                    if (aMonth < 0) {
                        aMonth = 11;
                    }
                }
                resourceFactory.runReportsResource.get({reportSource: 'ClientTrendsByMonth', R_officeId: scope.id, genericResultSet: false}, function (data) {
                    scope.client = data;
                    scope.months = [];
                    scope.fcount = [];

                    for (var i in scope.offices) {
                        if (scope.offices[i].id == scope.id) {
                            scope.bOfficeName = scope.offices[i].name;
                        }
                    }
                    for (var i in scope.client) {
                        scope.months[i] = scope.client[i].Months;
                    }
                    scope.getFcount(scope.formattedMonth, scope.months, scope.client);
                    resourceFactory.runReportsResource.get({reportSource: 'LoanTrendsByMonth', R_officeId: scope.id, genericResultSet: false}, function (data) {
                        scope.lmonths = [];
                        scope.lcount = [];

                        for (var i in data) {
                            scope.lmonths[i] = data[i].Months;
                        }
                        scope.getLcount(scope.formattedMonth, scope.lmonths, data);
                        scope.getBarData(scope.formattedSMonth, scope.fcount, scope.lcount);
                    });
                });
            };
            scope.getCollectionOffice = function () {
                var id = this.officeIdCollection || 1;
                for (var i in scope.offices) {
                    if (scope.offices[i].id == id) {
                        scope.cOfficeName = scope.offices[i].name;
                    }
                }
                resourceFactory.runReportsResource.get({reportSource: 'Demand_Vs_Collection', R_officeId: this.officeIdCollection, genericResultSet: false}, function (data) {
                    scope.showCollectionerror = false;
                    scope.collectionPieData = data[0];
                    if (data[0].AmountPaid == 0 && data[0].AmountDue == 0) {
                        scope.showCollectionerror = true;
                    }
                    scope.collectedData = [
                        {key: "Collected", y: scope.collectionPieData.AmountPaid},
                        {key: "Pending", y: scope.collectionPieData.AmountDue}
                    ];

                });

            };
            scope.getDisbursementOffice = function () {
                var id = this.officeIdDisbursed || 1;
                for (var i in scope.offices) {
                    if (scope.offices[i].id == id) {
                        scope.dOfficeName = scope.offices[i].name;
                    }
                }

                resourceFactory.runReportsResource.get({reportSource: 'Disbursal_Vs_Awaitingdisbursal', R_officeId: this.officeIdDisbursed, genericResultSet: false}, function (data) {
                    scope.disbursedPieData = data[0];
                    scope.showDisbursementerror = false;
                    if (data[0].disbursedAmount == 0 && data[0].amountToBeDisburse == 0) {
                        scope.showDisbursementerror = true;
                    }
                    scope.disbursedData = [
                        {key: "Collected", y: scope.disbursedPieData.disbursedAmount},
                        {key: "Pending", y: scope.disbursedPieData.amountToBeDisburse}
                    ];
                });
            };

            scope.xFunction = function () {
                return function (d) {
                    return d.key;
                };
            };
            scope.yFunction = function () {
                return function (d) {
                    return d.y;
                };
            };
            var colorArray = ['#0f82f5', '#008000', '#808080', '#000000', '#FFE6E6'];
            var colorArrayPie = ['#008000', '#ff4500'];
            scope.colorFunction = function () {
                return function (d, i) {
                    return colorArray[i];
                };
            };
            scope.colorFunctionPie = function () {
                return function (d, i) {
                    return colorArrayPie[i];
                };
            };
        }
    });
    mifosX.ng.application.controller('ExpertSearchController', ['$scope', 'ResourceFactory', 'localStorageService', '$rootScope', '$location', mifosX.controllers.ExpertSearchController]).run(function ($log) {
        $log.info("ExpertSearchController initialized");
    });
}(mifosX.controllers || {}));

