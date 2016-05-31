(function (module) {
    mifosX.controllers = _.extend(module, {
        EditSmsCampaignController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.formData = {};
            scope.param = '{"reportName":"';
            scope.smsCampaignTypes = [{'name':'DIRECT','value':1},{'name':'SCHEDULE','value':2}];
            resourceFactory.smsCampaignResource.get({resourceId:routeParams.campaignId}, function (data) {
                resourceFactory.runReportsResource.get({reportSource: 'reportCategoryList', R_reportCategory: 'sms', parameterType: true, genericResultSet: false}, function (reportData) {
                    scope.reports = reportData;
                    data.campaignStatus = undefined;
                    data.smsCampaignTimeLine = undefined;
                    data.id = undefined;
                    for(var i=0;i<scope.reports.length;i++){
                        if(scope.reports[i].report_id == data.runReportId){
                            scope.formData.report = scope.reports[i];
                        }
                    }
                    scope.formData = data;
                    scope.campaignType = scope.smsCampaignTypes[parseInt(scope.formData.campaignType)-1];
                });
            });
            scope.submit = function () {
                for(var i=0;i<scope.reports.length;i++){
                    if(scope.reports[i].report_id == this.formData.runReportId){
                        this.formData.paramValue = scope.param+scope.reports[i].report_name+'"}';
                    }
                }
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat =  scope.df;
                this.formData.campaignType =  scope.campaignType.value;
                this.formData.recurrenceStartDate = dateFilter(this.formData.recurrenceStartDate,scope.formData.dateFormat);
                resourceFactory.smsCampaignResource.edit({resourceId:routeParams.campaignId},this.formData, function (data) {
                    location.path('/sms/viewcampaign');
                });
            };

            // Remove the duplicate entries from the array. The reports api returns same report multiple times if it have more than one parameter.
            scope.getReports = function (data) {
                var prevId = -1;
                var currId;
                var reports = [];
                for (var i = 0; i < data.length; i++) {
                    currId = data[i].report_id;
                    if (currId != prevId)
                        reports.push(data[i]);
                    prevId = currId;
                }
                return reports;
            };
        }
    });
    mifosX.ng.application.controller('EditSmsCampaignController', ['$scope', 'ResourceFactory', '$location', '$routeParams','dateFilter', mifosX.controllers.EditSmsCampaignController]).run(function ($log) {
        $log.info("EditSmsCampaignController initialized");
    });
}(mifosX.controllers || {}));