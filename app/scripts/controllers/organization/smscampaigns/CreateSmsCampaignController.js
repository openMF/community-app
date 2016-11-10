(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateSmsCampaignController: function (scope, WizardHandler, resourceFactory, location, http, dateFilter, API_VERSION, $upload, $rootScope, routeParams) {

            scope.reportParams = new Array();
            scope.reportDateParams = new Array();
            scope.reqFields = new Array();
            scope.reportTextParams = new Array();
            scope.reportData = {};
            scope.reportData.columnHeaders = [];
            scope.reportData.data = [];
            scope.submissionData = {};

            scope.offices = [];
            scope.staffs = [];
            scope.selectedObjects = {};
            scope.formData = {};
            scope.formData.client = {};
            scope.today = new Date();
            scope.isButtonDisabled = false;
            scope.triggerTypeOptions = [] ;
            scope.campaignTypeOptions = [];
            scope.providerOptions = [] ;
            scope.businessRules = [] ;
            scope.campaignData = {};
            scope.campaignData.campaignMessage = "";
            scope.previewData = {};
            scope.triggerTypeSubTypeOptions = [];
            scope.triggerSubTypes = [];

            scope.buildMessageTemplate = function (paramName) {
                scope.campaignData.campaignMessage += " " + "{{" + paramName + "}}";
            }

            scope.reportSelected = function (reportName) {
                scope.reqFields = [] ;
                scope.reportParams = [] ;
                scope.reportDateParams = [] ;
                scope.reportTextParams  = [] ;

                resourceFactory.runReportsResource.getReport({reportSource: 'FullParameterList', parameterType: true, R_reportListing: "'" + reportName + "'"}, function (data) {
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

            } ;

            function intializeParams(paramData, params) {
                scope.errorStatus = undefined;
                scope.errorDetails = [];
                params.reportSource = paramData.name;
                params.parameterType = true;
                var successFunction = getSuccuessFunction(paramData);
                resourceFactory.runReportsResource.getReport(params, successFunction);
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
                resourceFactory.reportsResource.get({id: scope.campaignData.report.reportId, fields: 'reportParameters'}, function (data) {
                    scope.smsReportParameters = data.reportParameters || [];
                });
            };

            scope.getColumnHeaders = function () {
                //scope.formData = scope.reportParams;
                if (scope.campaignData.triggerType.value != 'Triggered') {
                    scope.formData.reportSource = scope.campaignData.report.reportName;
                    var inQueryParameters = buildReportParms();
                    //scope.formData = inQueryParameters;
                    resourceFactory.runReportsResource.getReport(scope.formData, function (data) {
                        // get column headers for the given report
                        scope.reportData.columnHeaders = data.columnHeaders;
                    });
                }
            };

            function buildPreviewParms() {
                var paramCount = 1;
                var reportParams = "{";
                for (var i = 0; i < scope.reqFields.length; i++) {
                    var reqField = scope.reqFields[i];
                    for (var j = 0; j < scope.smsReportParameters.length; j++) {
                        var tempParam = scope.smsReportParameters[j];
                        if (reqField.name == tempParam.parameterName) {
                            var paramName = tempParam.reportParameterName;
                            if (paramCount > 1) reportParams += ","
                            reportParams += '\"' + paramName  + '\"' + ":" + scope.formData[scope.reqFields[i].inputName];
                            paramCount = paramCount + 1;
                        }
                    }
                }
                reportParams += "}"
                return reportParams;
            };

            scope.previewMessage = function() {
                scope.paramValues = {};
                scope.paramValues = angular.fromJson(buildPreviewParms());
                scope.paramValues.reportName = scope.formData.reportSource;
                scope.previewData = {
                    message: scope.campaignData.campaignMessage,
                    paramValue: scope.paramValues
                };
                if (scope.campaignData.triggerType.value === 'Triggered') {
                    scope.previewMessage = scope.campaignData.campaignMessage;
                } else {
                    resourceFactory.smsCampaignResource.preview({additionalParam: 'preview'}, scope.previewData, function (data) {
                        scope.previewMessage = data.campaignMessage;
                        scope.totalNumberOfMessages = data.totalNumberOfMessages;
                    });
                }
            }

            function buildReportParms() {
                var paramCount = 1;
                var reportParams = "";
                for (var i = 0; i < scope.reqFields.length; i++) {
                    var reqField = scope.reqFields[i];
                    for (var j = 0; j < scope.smsReportParameters.length; j++) {
                        var tempParam = scope.smsReportParameters[j];
                        if (reqField.name == tempParam.parameterName) {
                            var paramName = 'R_' + tempParam.reportParameterName;
                            if (paramCount > 1) reportParams += ","
                            reportParams += encodeURIComponent(paramName) + ":" + encodeURIComponent(scope.formData[scope.reqFields[i].inputName]);
                            paramCount = paramCount + 1;
                        }
                    }
                }
                return reportParams;
            };

            resourceFactory.smsCampaignTemplateResource.get(function (data) {
                scope.triggerTypeOptions = data.triggerTypeOptions ;
                scope.campaignTypeOptions = data.campaignTypeOptions;
                scope.providerOptions = data.smsProviderOptions ;
                scope.businessRuleOptions = data.businessRulesOptions ;
                scope.frequencyTypeOptions = data.frequencyTypeOptions;
                scope.weekDays = data.weekDays;
                scope.triggerTypeSubTypeOptions = data.triggerTypeSubTypeOptions;
                //scope.months = data.months;
                //scope.periodFrequencyOptions = data.periodFrequencyOptions;

                resourceFactory.groupResource.get({groupId: routeParams.groupId, template: true}, function (data) {
                    scope.formData.client.staffId = data.staffId;
                    scope.centerId = data.centerId;
                    scope.staffs = data.staffOptions;
                    scope.changeStaff(data.staffId);
                    scope.formData.client.officeId = data.officeId;
                    scope.minActivationDate = data.activationDate;
                });
            });

            scope.updateSubTypes = function() {
                scope.triggerSubTypes = scope.campaignData.actualTriggerType.triggerSubTypes;
            };

            scope.changeStaff = function (staffId) {
                resourceFactory.employeeResource.get({staffInSelectedOfficeOnly:true, associations:'all', staffId: staffId}, function (data) {
                    scope.linkedvillages = data.linkedVillages;
                });
            };

            scope.selectedPeriod = function (period) {
                if (period == 1) {
                    scope.repeatsEveryOptions = ["1", "2", "3"];
                    scope.periodValue = "day(s)"
                }
                if (period == 2) {
                    scope.repeatsEveryOptions = ["1", "2", "3"];
                    scope.periodValue = "week(s)";
                    scope.campaignData.repeatsOnDay = '1';
                    scope.repeatsOnOptions = scope.weekDays;
                }
                if (period == 3) {
                    scope.periodValue = "month(s)";
                    scope.repeatsEveryOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
                }
                if (period == 4) {
                    scope.periodValue = "year(s)";
                    scope.repeatsEveryOptions = ["1", "2", "3", "4", "5"];
                }
            };

            scope.noOfTabs = 3;
            scope.step = '-';

            scope.submit = function () {
                //onclick Disable proceed button to avoid multiple cilent creation
                setDisableTimeout();

                if (WizardHandler.wizard().getCurrentStep() != scope.noOfTabs) {
                    WizardHandler.wizard().next();
                    /*if (WizardHandler.wizard().getCurrentStep() == 2) {
                     if (scope.validateFiles())
                     WizardHandler.wizard().next();
                     } else {
                     WizardHandler.wizard().next();
                     }*/
                    return;
                }

                if (scope.campaignData.triggerType.value === 'Scheduled') {
                    scope.scheduledDateTime = scope.campaignData.recurrenceStartDate;
                    scope.scheduledDateTime.setHours(scope.campaignData.time.getHours());
                    scope.scheduledDateTime.setMinutes(scope.campaignData.time.getMinutes());
                    scope.scheduledDateTime.setSeconds(scope.campaignData.time.getSeconds());
                    scope.scheduledDateTime = dateFilter(scope.scheduledDateTime, scope.dft);
                }
                    //dateFilter(scope.campaignData.recurrenceStartDate, scope.df) + ' ' + scope.campaignData.time.getHours() + ':' + scope.campaignData.time.getMinutes() + ':' + scope.campaignData.time.getSeconds();
                scope.submissionData = {
                    providerId: scope.campaignData.smsProvider.id,
                    //runReportId: scope.campaignData.report.reportId,
                    triggerType: scope.campaignData.triggerType.id,
                    campaignName: scope.campaignData.campaignName,
                    campaignType: scope.campaignData.campaignType.id,
                    message: scope.campaignData.campaignMessage,
                    //paramValue: scope.paramValues,
                    dateFormat: scope.df,
                    locale: scope.optlang.code,
                    submittedOnDate: dateFilter(new Date(), scope.df),
                    recurrenceStartDate: scope.scheduledDateTime,
                    dateTimeFormat: scope.dft,
                    frequency: scope.campaignData.frequency,
                    interval: scope.campaignData.repeatsEvery,
                    repeatsOnDay: scope.campaignData.repeatsOnDay
                }

                if (scope.campaignData.triggerType.value === 'Triggered') {
                    scope.submissionData.triggerEntityType = scope.campaignData.actualTriggerType.actualTriggerType.id;
                    scope.submissionData.triggerActionType = scope.campaignData.triggerSubType.id;
                } else {
                    scope.submissionData.triggerEntityType.runReportId = scope.campaignData.report.reportId;
                    scope.submissionData.triggerEntityType.paramValue = scope.paramValues;
                }

                resourceFactory.smsCampaignResource.save(scope.submissionData, function(data) {
                    location.path('/viewsmscampaign/' + data.resourceId);
                });

            };

            var setDisableTimeout = function(){
                scope.isButtonDisabled = true;
                setTimeout(function(){
                    scope.isButtonDisabled = false;
                }, 5000);
            }
        }
    });
    mifosX.ng.application.controller('CreateSmsCampaignController', ['$scope', 'WizardHandler', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', '$upload', '$rootScope', '$routeParams', mifosX.controllers.CreateSmsCampaignController]).run(function ($log) {
        $log.info("CreateSmsCampaignController initialized");
    });
}(mifosX.controllers || {}));
