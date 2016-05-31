(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateSmsCampaignController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.formData = {};
            scope.reports = {};
            scope.formData.locale = scope.optlang.code;
            scope.formData.dateFormat = scope.df;
            scope.param = '{"reportName":"';
            scope.smsCampaignTypes = [{'name':'DIRECT','value':1},{'name':'SCHEDULE','value':2}];
            scope.submit = function () {
                for(var i=0;i<scope.reports.length;i++){
                    if(scope.reports[i].report_id == this.formData.runReportId){
                        this.formData.paramValue = scope.param+scope.reports[i].report_name+'"}';
                    }
                };
                this.formData.recurrenceStartDate = dateFilter(this.formData.recurrenceStartDate,scope.formData.dateFormat);
                resourceFactory.smsCampaignResource.save(this.formData, function (data) {
                    location.path('/sms/viewcampaign');
                });
            };

            resourceFactory.runReportsResource.get({reportSource: 'reportCategoryList', R_reportCategory: 'sms', parameterType: true, genericResultSet: false}, function (data) {
                scope.reports = scope.getReports(data);
            });

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
    mifosX.ng.application.controller('CreateSmsCampaignController', ['$scope', 'ResourceFactory', '$location', '$routeParams','dateFilter', mifosX.controllers.CreateSmsCampaignController]).run(function ($log) {
        $log.info("CreateSmsCampaignController initialized");
    });
}(mifosX.controllers || {}));