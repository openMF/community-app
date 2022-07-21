(function (module) {
    mifosX.filters = _.extend(module, {
        AddUpTotalFor: function () {
            return function (data, key, conditionfield, conditionvalue) {
                if (typeof (data) === 'undefined' && typeof (key) === 'undefined') {
                    return 0;
                }
                if (data) {
                    var sum = 0;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i][key]) {
                            if (conditionfield) {
                                condFields = conditionfield.split(".");
                                if (condFields.length == 1) {
                                    if (data[i][condFields[0]] == conditionvalue) {
                                        sum = sum + data[i][key];    
                                    }
                                } else if (condFields.length == 2) {
                                    if (data[i][condFields[0]][condFields[1]] == conditionvalue) {
                                        sum = sum + data[i][key];
                                    }
                                } else  if (condFields.length == 3) {
                                    if (data[i][condFields[0]][condFields[1]][condFields[2]] == conditionvalue) {
                                        sum = sum + data[i][key];    
                                    }
                                }
                            } else {
                                sum = sum + data[i][key];
                            }
                        }
                    }
                    return sum;
                } else {
                    return 0;
                }
            }
        }
    });
    mifosX.ng.application.filter('AddUpTotalFor', [mifosX.filters.AddUpTotalFor]).run(function ($log) {
        $log.info("AddUpTotalFor filter initialized");
    });
}(mifosX.filters || {}));
;(function (module) {
    mifosX.filters = _.extend(module, {
        DateFormat: function (dateFilter, localStorageService) {
            return function (input) {
                if (input) {
                    var tDate = new Date(input);
                    return dateFilter(tDate, localStorageService.getFromLocalStorage('dateformat'));
                }
                return '';
            }
        }
    });
    mifosX.ng.application.filter('DateFormat', ['dateFilter', 'localStorageService', mifosX.filters.DateFormat]).run(function ($log) {
        $log.info("DateFormat filter initialized");
    });
}(mifosX.filters || {}));
;(function (module) {
    mifosX.filters = _.extend(module, {
        DayMonthFormat: function () {
            return function (input) {
                if (input) {
                    var MM;
                    var day = input[1];
                    var month = input[0];
                    switch (month) {
                        case 1:
                            MM = 'January';
                            break;
                        case 2:
                            MM = 'Febraury';
                            break;
                        case 3:
                            MM = 'March';
                            break
                        case 4:
                            MM = 'April';
                            break;
                        case 5:
                            MM = 'May';
                            break;
                        case 6:
                            MM = 'June';
                            break;
                        case 7:
                            MM = 'July';
                            break;
                        case 8:
                            MM = 'August';
                            break;
                        case 9:
                            MM = 'September';
                            break;
                        case 10:
                            MM = 'October';
                            break;
                        case 11:
                            MM = 'November';
                            break;
                        case 12:
                            MM = 'December';
                            break
                    }
                    return day + ' ' + MM;
                }

            }
        }
    });
    mifosX.ng.application.filter('DayMonthFormat', ['dateFilter', mifosX.filters.DayMonthFormat]).run(function ($log) {
        $log.info("DayMonthFormat filter initialized");
    });
}(mifosX.filters || {}));
;(function (module) {
    mifosX.filters = _.extend(module, {
        DotRemove: function () {
            return function (input) {
                if (input) {
                    var exp = input;
                    var alpha = '';
                    for (var i = 0; i < exp.length; i++) {
                        if (exp[i] != '.') {
                            alpha = alpha + exp[i];
                        }
                    }
                    return alpha;
                }
            }
        }
    });
    mifosX.ng.application.filter('DotRemove', ['dateFilter', mifosX.filters.DotRemove]).run(function ($log) {
        $log.info("DotRemove filter initialized");
    });
}(mifosX.filters || {}));
;(function (module) {
    mifosX.filters = _.extend(module, {
        FormatNumber: function ($filter) {
            return function (input, fractionSize) {
                if (isNaN(input)) {
                    return input;
                } else {
                    //TODO- Add number formatting also
                    if (input != "" && input != undefined) {
                        return $filter('number')(input, fractionSize);
                    };
                };
            }
        }
    });
    mifosX.ng.application.filter('FormatNumber', ['$filter', mifosX.filters.FormatNumber]).run(function ($log) {
        $log.info("FormatNumber filter initialized");
    });
}(mifosX.filters || {}));
;(function (module) {
    mifosX.filters = _.extend(module, {
        SearchFilter: function () {
            return function (list, searchText) {
            	var searchRegx = new RegExp(searchText, "i");
                if (searchText == undefined) {
                    return list;
                }
                var result = [];
                for (i = 0; i < list.length; i++) {
                    if (list[i].name.search(searchRegx) != -1 || 
                        list[i].glCode.toString().search(searchRegx) != -1 || list[i].type.value.search(searchRegx) != -1 ) {
                        result.push(list[i]);
                    }
                }
                return result;
            }
        }
    });
    mifosX.ng.application.filter('SearchFilter', [mifosX.filters.SearchFilter]).run(function ($log) {
        $log.info("SearchFilter filter initialized");
    });
}(mifosX.filters || {}));
;(function (module) {
    mifosX.filters = _.extend(module, {
        StatusLookup: function () {
            return function (input) {

                var cssClassNameLookup = {
                    "true": "statusactive",
                    "false": "statusdeleted",
                    "Active": "statusactive",
                    "loanStatusType.submitted.and.pending.approval": "statuspending",
                    "loanStatusType.approved": "statusApproved",
                    "loanStatusType.active": "statusactive",
                    "loanStatusType.overpaid": "statusoverpaid",
                    "savingsAccountStatusType.submitted.and.pending.approval": "statuspending",
                    "savingsAccountStatusType.approved": "statusApproved",
                    "savingsAccountStatusType.active": "statusactive",
                    "savingsAccountStatusType.activeInactive": "statusactiveoverdue",
                    "savingsAccountStatusType.activeDormant": "statusactiveoverdue",
                    "savingsAccountStatusType.matured": "statusmatured",
                    "loanProduct.active": "statusactive",
                    "clientStatusType.pending": "statuspending",
                    "clientStatusType.closed":"statusclosed",
                    "clientStatusType.rejected":"statusrejected",
                    "clientStatusType.withdraw":"statuswithdraw",
                    "clientStatusType.active": "statusactive",
                    "clientStatusType.submitted.and.pending.approval": "statuspending",
                    "clientStatusTYpe.approved": "statusApproved",
                    "clientStatusType.transfer.in.progress": "statustransferprogress",
                    "clientStatusType.transfer.on.hold": "statustransferonhold",
                    "groupingStatusType.active": "statusactive",
                    "groupingStatusType.pending": "statuspending",
                    "groupingStatusType.submitted.and.pending.approval": "statuspending",
                    "groupingStatusType.approved": "statusApproved",
                    "shareAccountStatusType.submitted.and.pending.approval": "statuspending",
                    "shareAccountStatusType.approved": "statusApproved",
                    "shareAccountStatusType.active": "statusactive",
                    "shareAccountStatusType.rejected": "statusrejected",
                    "purchasedSharesStatusType.applied": "statuspending",
                    "purchasedSharesStatusType.approved": "statusApproved",
                    "purchasedSharesStatusType.rejected": "statusrejected",
                    "charges.StatusType.active.true": "statusactive",
                    "employees.StatusType.active.true": "statusactive"
                }

                return cssClassNameLookup[input];
            }
        }
    });
    mifosX.ng.application.filter('StatusLookup', [mifosX.filters.StatusLookup]).run(function ($log) {
        $log.info("StatusLookup filter initialized");
    });
}(mifosX.filters || {}));
;(function (module) {
    mifosX.filters = _.extend(module, {
        prettifyDataTableColumn: function () {
            var prettifyColumnName = function (input, split) {
                var temp = input.split(split);
                if (temp[1] && temp[1] != "") {
                    return temp[1];
                } else {
                    return temp[0];
                }
            }

            return function (input) {
                var retVal;
                if (input.indexOf("_cd_") > 0) {
                    retVal = prettifyColumnName(input, "_cd_");
                } else if (input.indexOf("_cv_") > 0) {
                    retVal = prettifyColumnName(input, "_cv_");
                } else if (input.indexOf("_cd") > 0) {
                    retVal = prettifyColumnName(input, "_cd");
                } else if (input.indexOf("_cv") > 0) {
                    retVal = prettifyColumnName(input, "_cv");
                } else {
                    retVal = input;
                }
                return retVal;
            }
        }
    });
    mifosX.ng.application.filter('prettifyDataTableColumn', ['dateFilter', mifosX.filters.prettifyDataTableColumn]).run(function ($log) {
        $log.info("PrettifyDataTableColumn filter initialized");
    });
}(mifosX.filters || {}));
;(function (module) {
    mifosX.filters = _.extend(module, {
        UrlToString: function () {
            return function (input) {
                var exp = input;
                var alpha = '';
                for (var i = 0; i < exp.length; i++) {
                    if (exp[i] >= 'A' && exp[i] <= 'z') {
                        alpha = alpha + exp[i];
                    }
                }
                return alpha;
            }
        }
    });
    mifosX.ng.application.filter('UrlToString', ['dateFilter', mifosX.filters.UrlToString]).run(function ($log) {
        $log.info("UrlToString filter initialized");
    });
}(mifosX.filters || {}));
;(function (module) {
    mifosX.filters = _.extend(module, {
        YesOrNo: function () {
            return function (input) {
                var status = 'No';
                if (input == true) {
                    status = 'Yes';
                } else if (input == false) {
                    status = 'No';
                }
                return status;
            }
        }
    });
    mifosX.ng.application.filter('YesOrNo', ['dateFilter', mifosX.filters.YesOrNo]).run(function ($log) {
        $log.info("YesOrNo filter initialized");
    });
}(mifosX.filters || {}));
;(function (module) {
    mifosX.filters = _.extend(module, {
        sort: function () {
            return function (input) {
                return input.sort();
            }
        }
    });
    mifosX.ng.application.filter('sort', ['dateFilter', mifosX.filters.sort]).run(function ($log) {
        $log.info("sort filter initialized");
    });
}(mifosX.filters || {}));
