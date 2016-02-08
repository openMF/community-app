(function (module) {
    mifosX.controllers = _.extend(module, {
        RichDashboard: function (scope, resourceFactory, location) {

            scope.dashModel = 'dashboard';

            scope.$on("UserAuthenticationSuccessEvent", function (event, data) {
                if (sessionManager.get(data)) {
                    scope.currentSession = sessionManager.get(data);
                }
            });

            scope.client = [];
            scope.offices = [];
            scope.cOfficeName = 'Head Office';
            scope.dOfficeName = 'Head Office';
            scope.bOfficeName = 'Head Office';
            scope.chartType = 'Days';
            scope.collectionPieData = [];
            scope.dashModel = 'rich-dashboard';
            scope.branchOfficeName = 'Head Office';
            scope.loanOfficeName = 'Head Office';
            scope.defaultOfficeId = 1;
            scope.branchViewData=[];
            scope.loanPortfolioData=[];

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


            resourceFactory.groupTemplateResource.get(function (data) {
                scope.defaultOfficeId = data.officeOptions[0].id;
                scope.offices = data.officeOptions;

                resourceFactory.runReportsResource.get({reportSource: 'ClientTrendsByDay', R_officeId: scope.defaultOfficeId, genericResultSet: false}, function (clientData) {
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
                    resourceFactory.runReportsResource.get({reportSource: 'LoanTrendsByDay', R_officeId: scope.defaultOfficeId, genericResultSet: false}, function (loanData) {
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

                resourceFactory.runReportsResource.get({reportSource: 'Demand_Vs_Collection', R_officeId: scope.defaultOfficeId, genericResultSet: false}, function (data) {
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
                resourceFactory.runReportsResource.get({reportSource: 'Disbursal_Vs_Awaitingdisbursal', R_officeId: scope.defaultOfficeId, genericResultSet: false}, function (data) {
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
                scope.getDailyData();
                scope.getWeeklyData();
                scope.getMonthlyData();
                scope.getCollectionOffice();
                scope.loanPortfolioView();
                scope.branchOverView();
                scope.getDisbursementOffice();

            });

            scope.getDailyData = function () {
                scope.chartType = 'Days';
                this.officeId = scope.getOfficeId(this.officeId);
                var id = this.officeId;
                resourceFactory.runReportsResource.get({reportSource: 'ClientTrendsByDay', R_officeId: id, genericResultSet: false}, function (data) {
                    scope.client = data;
                    scope.days = [];
                    scope.tempDate = [];
                    scope.fcount = [];
                    for (var i in scope.offices) {
                        if (scope.offices[i].id == id) {
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
                    resourceFactory.runReportsResource.get({reportSource: 'LoanTrendsByDay', R_officeId: id, genericResultSet: false}, function (data) {
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
                this.officeId = scope.getOfficeId(this.officeId);
                scope.id = this.officeId;
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
                this.officeId = scope.getOfficeId(this.officeId);
                scope.id = this.officeId;
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
                this.officeIdCollection = scope.getOfficeId(this.officeIdCollection);
                var id = this.officeIdCollection;
                for (var i in scope.offices) {
                    if (scope.offices[i].id == id) {
                        scope.cOfficeName = scope.offices[i].name;
                    }
                }
                resourceFactory.runReportsResource.get({reportSource: 'Demand_Vs_Collection', R_officeId: id, genericResultSet: false}, function (data) {
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

            scope.loanPortfolioView = function () {
                this.loanPortfolioOfficeId = scope.getOfficeId(this.loanPortfolioOfficeId);
                scope.id = this.loanPortfolioOfficeId;
                for (var i in scope.offices) {
                    if (scope.offices[i].id == scope.id) {
                        scope.branchOfficeName = scope.offices[i].name;
                    }
                }
                scope.loanData = resourceFactory.runReportsResource.get({reportSource: 'LoanPortFolio', R_officeId: scope.id, genericResultSet: false}, function (data) {
                    scope.showLoanPortfolioError =false;
                    scope.loanPortfolioData=[];
                    if(data && data.length>0){
                        for(var i=0;i<data.length;i++){
                            scope.loanPortfolioData.push(data[i]);

                        }
                        return data;
                    }else{
                        scope.showLoanPortfolioError =true;
                    }

                });
            };

            scope.branchOverView = function () {
                this.branchOverviewOfficeId = scope.getOfficeId(this.branchOverviewOfficeId);
                scope.id = this.branchOverviewOfficeId;
                for (var i in scope.offices) {
                    if (scope.offices[i].id == scope.id) {
                        scope.branchOfficeName = scope.offices[i].name;
                    }
                }
                resourceFactory.runReportsResource.get({reportSource: 'BranchOverView', R_officeId: scope.id, genericResultSet: false}, function (data) {
                    scope.showBranchOverviewError =false;
                    scope.branchViewData=[];
                    if(data && data.length>0) {
                        for (var i = 0; i < data.length; i++) {
                            scope.branchViewData.push({
                                name: data[i].is_loan_officer,
                                count: data[i]['count(stf.office_id)']
                            });

                        }
                        return data;
                    }else{
                        scope.showBranchOverviewError =true;
                    }
                });

            };

            scope.getDisbursementOffice = function () {
                this.officeIdDisbursed = scope.getOfficeId(this.officeIdDisbursed);
                var id = this.officeIdDisbursed;
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
                        {key: "Disbursed", y: scope.disbursedPieData.disbursedAmount},
                        {key: "Pending", y: scope.disbursedPieData.amountToBeDisburse}
                    ];
                });
            };

            scope.getOfficeId = function(id){
                return (angular.isUndefined(id) || !angular.isNumber(id))?scope.defaultOfficeId:id;
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
    mifosX.ng.application.controller('RichDashboard', ['$scope', 'ResourceFactory','$location', mifosX.controllers.RichDashboard]).run(function ($log) {
        $log.info("RichDashboard initialized");
    });
}(mifosX.controllers || {}));