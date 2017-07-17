(function (module) {
    mifosX.controllers = _.extend(module, {

        RunReportsController: function (scope, routeParams, resourceFactory, location, dateFilter, http, API_VERSION, $rootScope, $sce) {
            scope.isCollapsed = false; //displays options div on startup
            scope.hideTable = true; //hides the results div on startup
            scope.hidePentahoReport = true; //hides the results div on startup
            scope.hideChart = true;
            scope.piechart = false;
            scope.barchart = false;
            scope.formData = {};
            scope.reportParams = new Array();
            scope.reportDateParams = new Array();
            scope.reqFields = new Array();
            scope.reportTextParams = new Array();
            scope.reportData = {};
            scope.reportData.columnHeaders = [];
            scope.reportData.data = [];
            scope.baseURL = "";
            scope.csvData = [];
            scope.row = [];
            scope.reportName = routeParams.name;
            scope.reportType = routeParams.type;
            scope.reportId = routeParams.reportId;
            scope.pentahoReportParameters = [];
            scope.type = "pie";

            scope.highlight = function (id) {
                var i = document.getElementById(id);
                if (i.className == 'selected-row') {
                    i.className = 'text-pointer';
                } else {
                    i.className = 'selected-row';
                }
            };
            if (scope.reportType == 'Pentaho') {
                scope.formData.outputType = 'HTML';
            };

            resourceFactory.runReportsResource.getReport({reportSource: 'FullParameterList', parameterType: true, R_reportListing: "'" + routeParams.name + "'"}, function (data) {

                for (var i in data.data) {
                    var temp = {
                        name: data.data[i].row[0],
                        variable: data.data[i].row[1],
                        label: data.data[i].row[2],
                        displayType: data.data[i].row[3],
                        formatType: data.data[i].row[4],
                        defaultVal: data.data[i].row[5],
                        selectOne: data.data[i].row[6],
                        selectAll: data.data[i].row[7],
                        parentParameterName: data.data[i].row[8],
                        inputName: "R_" + data.data[i].row[1] //model name
                    };
                    scope.reqFields.push(temp);
                    if (temp.displayType == 'select' && temp.parentParameterName == null) {
                        intializeParams(temp, {});
                    } else if (temp.displayType == 'date') {
                        scope.reportDateParams.push(temp);
                    } else if (temp.displayType == 'text') {
                        scope.reportTextParams.push(temp);
                    }
                }
            });

            if (scope.reportType == 'Pentaho') {
                resourceFactory.reportsResource.get({id: scope.reportId, fields: 'reportParameters'}, function (data) {
                    scope.pentahoReportParameters = data.reportParameters || [];
                });
            }

            function getSuccuessFunction(paramData) {
                var tempDataObj = new Object();
                var successFunction = function (data) {
                    var selectData = [];
                    var isExistedRecord = false;
                    for (var i in data.data) {
                        selectData.push({id: data.data[i].row[0], name: data.data[i].row[1]});
                    }
                    for (var j in scope.reportParams) {
                        if (scope.reportParams[j].name == paramData.name) {
                            scope.reportParams[j].selectOptions = selectData;
                            isExistedRecord = true;
                        }
                    }
                    if (!isExistedRecord) {
                        if(paramData.selectAll == 'Y'){
                            selectData.push({id: "-1", name: "All"});
                        }
                        paramData.selectOptions = selectData;
                        scope.reportParams.push(paramData);
                    }
                };
                return successFunction;
            }

            function intializeParams(paramData, params) {
                scope.errorStatus = undefined;
                scope.errorDetails = [];
                params.reportSource = paramData.name;
                params.parameterType = true;
                var successFunction = getSuccuessFunction(paramData);
                resourceFactory.runReportsResource.getReport(params, successFunction);
            }

            scope.getDependencies = function (paramData) {
                for (var i = 0; i < scope.reqFields.length; i++) {
                    var temp = scope.reqFields[i];
                    if (temp.parentParameterName == paramData.name) {
                        if (temp.displayType == 'select') {
                            var parentParamValue = this.formData[paramData.inputName];
                            if (parentParamValue != undefined) {
                                eval("var params={};params." + paramData.inputName + "='" + parentParamValue + "';");
                                intializeParams(temp, params);
                            }
                        } else if (temp.displayType == 'date') {
                            scope.reportDateParams.push(temp);
                        }
                    }
                }
            };

            scope.checkStatus = function () {
                var collapsed = false;
                if (scope.isCollapsed) {
                    collapsed = true;
                }
                return collapsed;
            };

            function invalidDate(checkDate) {
                // validates for yyyy-mm-dd returns true if invalid, false is valid
                var dateformat = /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/;

                if (!(dateformat.test(checkDate))) {
                    return true;
                } else {
                    var dyear = checkDate.substring(0, 4);
                    var dmonth = checkDate.substring(5, 7) - 1;
                    var dday = checkDate.substring(8);

                    var newDate = new Date(dyear, dmonth, dday);
                    return !((dday == newDate.getDate()) && (dmonth == newDate.getMonth()) && (dyear == newDate.getFullYear()));
                }
            }

            function removeErrors() {
                var $inputs = $(':input');
                $inputs.each(function () {
                    $(this).removeClass("validationerror");
                });
            }

            function parameterValidationErrors() {
                var tmpStartDate = "";
                var tmpEndDate = "";
                scope.errorDetails = [];
                for (var i in scope.reqFields) {
                    var paramDetails = scope.reqFields[i];
                    switch (paramDetails.displayType) {
                        case "select":
                            var selectedVal = scope.formData[paramDetails.inputName];
                            if (selectedVal == undefined || selectedVal == 0) {
                                var fieldId = '#' + paramDetails.inputName;
                                $(fieldId).addClass("validationerror");
                                var errorObj = new Object();
                                errorObj.field = paramDetails.inputName;
                                errorObj.code = 'error.message.report.parameter.required';
                                errorObj.args = {params: []};
                                errorObj.args.params.push({value: paramDetails.label});
                                scope.errorDetails.push(errorObj);
                            }
                            break;
                        case "date":
                            var tmpDate = scope.formData[paramDetails.inputName];
                            if (tmpDate == undefined || !(tmpDate > "")) {
                                var fieldId = '#' + paramDetails.inputName;
                                $(fieldId).addClass("validationerror");
                                var errorObj = new Object();
                                errorObj.field = paramDetails.inputName;
                                errorObj.code = 'error.message.report.parameter.required';
                                errorObj.args = {params: []};
                                errorObj.args.params.push({value: paramDetails.label});
                                scope.errorDetails.push(errorObj);
                            }
                            if (tmpDate && invalidDate(tmpDate) == true) {
                                var fieldId = '#' + paramDetails.inputName;
                                $(fieldId).addClass("validationerror");
                                var errorObj = new Object();
                                errorObj.field = paramDetails.inputName;
                                errorObj.code = 'error.message.report.invalid.value.for.parameter';
                                errorObj.args = {params: []};
                                errorObj.args.params.push({value: paramDetails.label});
                                scope.errorDetails.push(errorObj);
                            }

                            if (paramDetails.variable == "startDate") tmpStartDate = tmpDate;
                            if (paramDetails.variable == "endDate") tmpEndDate = tmpDate;
                            break;
                        case "text":
                            var selectedVal = scope.formData[paramDetails.inputName];
                            if (selectedVal == undefined || selectedVal == 0) {
                                var fieldId = '#' + paramDetails.inputName;
                                $(fieldId).addClass("validationerror");
                                var errorObj = new Object();
                                errorObj.field = paramDetails.inputName;
                                errorObj.code = 'error.message.report.parameter.required';
                                errorObj.args = {params: []};
                                errorObj.args.params.push({value: paramDetails.label});
                                scope.errorDetails.push(errorObj);
                            }
                            break;
                        default:
                            var errorObj = new Object();
                            errorObj.field = paramDetails.inputName;
                            errorObj.code = 'error.message.report.parameter.invalid';
                            errorObj.args = {params: []};
                            errorObj.args.params.push({value: paramDetails.label});
                            scope.errorDetails.push(errorObj);
                            break;
                    }
                }

                if (tmpStartDate > "" && tmpEndDate > "") {
                    if (tmpStartDate > tmpEndDate) {
                        var errorObj = new Object();
                        errorObj.field = paramDetails.inputName;
                        errorObj.code = 'error.message.report.incorrect.values.for.date.fields';
                        errorObj.args = {params: []};
                        errorObj.args.params.push({value: paramDetails.label});
                        scope.errorDetails.push(errorObj);
                    }
                }
            }

            function buildReportParms() {
                var paramCount = 1;
                var reportParams = "";
                for (var i = 0; i < scope.reqFields.length; i++) {
                    var reqField = scope.reqFields[i];
                    for (var j = 0; j < scope.pentahoReportParameters.length; j++) {
                        var tempParam = scope.pentahoReportParameters[j];
                        if (reqField.name == tempParam.parameterName) {
                            var paramName = "R_" + tempParam.reportParameterName;
                            if (paramCount > 1) reportParams += "&"
                            reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(scope.formData[scope.reqFields[i].inputName]);
                            paramCount = paramCount + 1;
                        }
                    }
                }
                return reportParams;
            }

            scope.xFunction = function () {
                return function (d) {
                    return d.key;
                };
            };
            scope.yFunction = function () {
                return function (d) {
                    return d.values;
                };
            };
            scope.setTypePie = function () {
                if (scope.type == 'bar') {
                    scope.type = 'pie';
                }
            };
            scope.setTypeBar = function () {
                if (scope.type == 'pie') {
                    scope.type = 'bar';
                }
            };
            scope.colorFunctionPie = function () {
                return function (d, i) {
                    return colorArrayPie[i];
                };
            };
            scope.isDecimal = function(index){
                if(scope.reportData.columnHeaders && scope.reportData.columnHeaders.length > 0){
                    for(var i=0; i<scope.reportData.columnHeaders.length; i++){
                        if(scope.reportData.columnHeaders[index].columnType == 'DECIMAL'){
                            return true;
                        }
                    }
                }
                return false;
            };
            scope.runReport = function () {
                //clear the previous errors
                scope.errorDetails = [];
                removeErrors();

                //update date fields with proper dateformat
                for (var i in scope.reportDateParams) {
                    if (scope.formData[scope.reportDateParams[i].inputName]) {
                        scope.formData[scope.reportDateParams[i].inputName] = dateFilter(scope.formData[scope.reportDateParams[i].inputName], 'yyyy-MM-dd');
                    }
                }

                //Custom validation for report parameters
                parameterValidationErrors();

                if (scope.errorDetails.length == 0) {
                    scope.isCollapsed = true;
                    switch (scope.reportType) {
                        case "Table":
                        case "SMS":
                            scope.hideTable = false;
                            scope.hidePentahoReport = true;
                            scope.hideChart = true;
                            scope.formData.reportSource = scope.reportName;
                            resourceFactory.runReportsResource.getReport(scope.formData, function (data) {
                                //clear the csvData array for each request
                                scope.csvData = [];
                                scope.reportData.columnHeaders = data.columnHeaders;
                                scope.reportData.data = data.data;
                                for (var i in data.columnHeaders) {
                                    scope.row.push(data.columnHeaders[i].columnName);
                                }
                                scope.csvData.push(scope.row);
                                for (var k in data.data) {
                                    scope.csvData.push(data.data[k].row);
                                }
                            });
                            break;

                        case "Pentaho":
                            scope.hideTable = true;
                            scope.hidePentahoReport = false;
                            scope.hideChart = true;

                            var reportURL = $rootScope.hostUrl + API_VERSION + "/runreports/" + encodeURIComponent(scope.reportName);
                            reportURL += "?output-type=" + encodeURIComponent(scope.formData.outputType) + "&tenantIdentifier=" + $rootScope.tenantIdentifier + "&locale=" + scope.optlang.code + "&dateFormat=" + scope.df;

                            var inQueryParameters = buildReportParms();
                            if (inQueryParameters > "") reportURL += "&" + inQueryParameters;

                            // Allow untrusted urls for the ajax request.
                            // http://docs.angularjs.org/error/$sce/insecurl
                            reportURL = $sce.trustAsResourceUrl(reportURL);
                            reportURL = $sce.valueOf(reportURL);
                            http.get(reportURL, {responseType: 'arraybuffer'}).
                              success(function(data, status, headers, config) {
                                var contentType = headers('Content-Type');
                                var file = new Blob([data], {type: contentType});
                                var fileContent = URL.createObjectURL(file);

                                // Pass the form data to the iframe as a data url.
                                scope.baseURL = $sce.trustAsResourceUrl(fileContent);
                              });
                            break;
                        case "Chart":
                            scope.hideTable = true;
                            scope.hidePentahoReport = true;
                            scope.hideChart = false;
                            scope.formData.reportSource = scope.reportName;
                            resourceFactory.runReportsResource.getReport(scope.formData, function (data) {
                                scope.reportData.columnHeaders = data.columnHeaders;
                                scope.reportData.data = data.data;
                                scope.chartData = [];
                                scope.barData = [];
                                var l = data.data.length;
                                for (var i = 0; i < l; i++) {
                                    scope.row = {};
                                    scope.row.key = data.data[i].row[0];
                                    scope.row.values = data.data[i].row[1];
                                    scope.chartData.push(scope.row);
                                }
                                var x = {};
                                x.key = "summary";
                                x.values = [];
                                for (var m = 0; m < l; m++) {
                                    var inner = [data.data[m].row[0], data.data[m].row[1]];
                                    x.values.push(inner);
                                }
                                scope.barData.push(x);
                            });
                            break;
                        default:
                            var errorObj = new Object();
                            errorObj.field = scope.reportType;
                            errorObj.code = 'error.message.report.type.is.invalid';
                            errorObj.args = {params: []};
                            errorObj.args.params.push({value: scope.reportType});
                            scope.errorDetails.push(errorObj);
                            break;
                    }
                }
            };
        }
    });
    mifosX.ng.application.controller('RunReportsController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', '$http', 'API_VERSION', '$rootScope', '$sce', mifosX.controllers.RunReportsController]).run(function ($log) {
        $log.info("RunReportsController initialized");
    });
}(mifosX.controllers || {}));
