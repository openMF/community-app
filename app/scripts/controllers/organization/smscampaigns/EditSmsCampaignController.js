(function (module) {
    mifosX.controllers = _.extend(module, {
        EditSmsCampaignController: function (scope, WizardHandler, resourceFactory, location, http, dateFilter, API_VERSION, Upload, $rootScope, routeParams, $uibModal) {

            scope.reportParams = new Array();
            scope.reportDateParams = new Array();
            scope.reqFields = new Array();
            scope.reportTextParams = new Array();
            scope.reportData = {};
            scope.reportData.columnHeaders = [];
            scope.reportData.data = [];

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

            resourceFactory.smsCampaignResource.get({campaignId: routeParams.campaignId}, function (data) {
                //scope.campaignData = data;
                scope.campaignData.id = data.id;
                scope.campaignData.campaignName = data.campaignName;
                scope.campaignData.campaignMessage = data.campaignMessage;
                if(data.providerId){
                    scope.campaignData.smsProvider = data.providerId;
                }else{
                    scope.campaignData.smsProvider = null;
                }                
                scope.campaignData.isNotification = data.isNotification;
                scope.campaignData.triggerType = data.triggerType.id;
                scope.campaignData.campaignType = data.campaignType.id;
                scope.campaignData.report = data.runReportId;
                scope.campaignData.reportName = data.reportName;
                scope.reportSelected(scope.campaignData.reportName);
                scope.paramValues = angular.fromJson(data.paramValue);
                scope.simpleDate = new Date(data.recurrenceStartDate);
                var simpleTime = new Date(scope.simpleDate.getTime());
                scope.campaignData.recurrenceStartDate = dateFilter(scope.simpleDate, scope.df);
                scope.campaignData.time = new Date(0, 0, 0, simpleTime.getHours(), simpleTime.getMinutes(), simpleTime.getSeconds());
                prepopulateReportParams();
            });

            function prepopulateReportParams() {
                if (!_.isUndefined(scope.paramValues)) {
                    var obj = scope.paramValues;
                    for (var key in obj) {
                        console.log(' name=' + key + ' value=' + obj[key]);
                        scope.formData["R_" + key] = String(obj[key]);
                    }
                }
            }

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
                resourceFactory.reportsResource.get({id: scope.campaignData.report, fields: 'reportParameters'}, function (data) {
                    scope.smsReportParameters = data.reportParameters || [];
                    scope.getColumnHeaders();
                });
            };

            scope.getColumnHeaders = function () {
                //scope.formData = scope.reportParams;
                scope.formData.reportSource = scope.campaignData.reportName;
                var inQueryParameters = buildReportParms();
                //scope.formData = inQueryParameters;
                resourceFactory.runReportsResource.getReport(scope.formData, function (data) {
                    // get column headers for the given report
                    scope.reportData.columnHeaders = data.columnHeaders;
                });
            };

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

                resourceFactory.groupResource.get({groupId: routeParams.groupId, template: true}, function (data) {
                    scope.formData.client.staffId = data.staffId;
                    scope.centerId = data.centerId;
                    scope.staffs = data.staffOptions;
                    scope.changeStaff(data.staffId);
                    scope.formData.client.officeId = data.officeId;
                    scope.minActivationDate = data.activationDate;
                });
            });

            scope.changeStaff = function (staffId) {
                resourceFactory.employeeResource.get({staffInSelectedOfficeOnly:true, associations:'all', staffId: staffId}, function (data) {
                    scope.linkedvillages = data.linkedVillages;
                });
            };

            scope.noOfTabs = 3;
            scope.step = '-';

            scope.submit = function () {
                //scope.simpleDate = new Date(scope.campaignData.recurrenceStartDate);
                //var simpleTime = new Date(scope.simpleDate.getTime());
                //scope.campaignData.recurrenceStartDate = dateFilter(scope.simpleDate, scope.df);
                //scope.campaignData.time = new Date(0, 0, 0, simpleTime.getHours(), simpleTime.getMinutes(), simpleTime.getSeconds());
                if (scope.campaignData.triggerType === 2) {
                    scope.scheduledDateTime = new Date(scope.campaignData.recurrenceStartDate);
                    scope.scheduledDateTime.setHours(scope.campaignData.time.getHours());
                    scope.scheduledDateTime.setMinutes(scope.campaignData.time.getMinutes());
                    scope.scheduledDateTime.setSeconds(scope.campaignData.time.getSeconds());
                    scope.scheduledDateTime = dateFilter(scope.scheduledDateTime, scope.dft);
                }
                
                scope.submissionData = {
                    providerId: scope.campaignData.smsProvider,
                    //runReportId: scope.campaignData.report,
                    triggerType: scope.campaignData.triggerType,
                    campaignName: scope.campaignData.campaignName,
                    campaignType: scope.campaignData.campaignType,
                    message: scope.campaignData.campaignMessage,
                    //paramValue: scope.paramValues,
                    dateFormat: scope.df,
                    locale: scope.optlang.code,
                    recurrenceStartDate: scope.scheduledDateTime,
                    dateTimeFormat: scope.dft,
                    runReportId : scope.campaignData.report,
                    paramValue : scope.paramValues,
                    isNotification : scope.campaignData.isNotification
                }

                resourceFactory.smsCampaignResource.update({campaignId: routeParams.campaignId}, scope.submissionData, function(data) {
                    location.path('/viewsmscampaign/' + routeParams.campaignId);
                });

            };



            scope.getcampaignType = function(){
                if(scope.campaignData.isNotification==false){
                    return 1;
                }else{
                    return 2;
                }
            };

            var setDisableTimeout = function() {
                scope.isButtonDisabled = true;
                setTimeout(function(){
                    scope.isButtonDisabled = false;
                }, 5000);
            }
        }
    });
    mifosX.ng.application.controller('EditSmsCampaignController', ['$scope', 'WizardHandler', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', 'Upload', '$rootScope', '$routeParams', '$uibModal', mifosX.controllers.EditSmsCampaignController]).run(function ($log) {
        $log.info("EditSmsCampaignController initialized");
    });
}(mifosX.controllers || {}));
