(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewReportsController: function (scope, routeParams, resourceFactory, location, route) {
            scope.reports = [];
            scope.type = routeParams.type;
            //to display type of report on breadcrumb
            var typeReport = routeParams.type.replace(routeParams.type[0], routeParams.type[0].toUpperCase()) + " " + "Reports";
            scope.type = typeReport;

            scope.routeTo = function (report) {
                location.path('/run_report/' + report.report_name).search({reportId: report.report_id, type: report.report_type});
            };

            if (!scope.searchCriteria.reports) {
                scope.searchCriteria.reports = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.reports || '';

            scope.addLocaleReportName = function (){
                if(document.getElementsByName("locale_name") != undefined && scope.reports){
                    if(scope.reports[0].report_locale_name == undefined){
                        var result = document.getElementsByName("locale_name");
                        for(var i=0; i<result.length; i++) {
                            scope.reports[i].report_locale_name = result[i].value;
                        }
                        //console.log(JSON.stringify(scope.reports));
                    }
                    scope.onFilter();
                }
            };

            scope.filterByReportSubType = function(report) {
                return !(report.report_subtype === 'Triggered');
            }

            scope.onFilter = function () {
                scope.searchCriteria.reports = scope.filterText;
                scope.saveSC();
            };

            if (routeParams.type == 'all') {
                resourceFactory.runReportsResource.get({reportSource: 'FullReportList', parameterType: true, genericResultSet: false}, function (data) {
                    scope.reports = scope.getReports(data);
                });
            } else if (routeParams.type == 'clients') {
                resourceFactory.runReportsResource.get({reportSource: 'reportCategoryList', R_reportCategory: 'Client', parameterType: true, genericResultSet: false}, function (data) {
                    scope.reports = scope.getReports(data);
                });
            } else if (routeParams.type == 'loans') {
                resourceFactory.runReportsResource.get({reportSource: 'reportCategoryList', R_reportCategory: 'Loan', parameterType: true, genericResultSet: false}, function (data) {
                    scope.reports = scope.getReports(data);
                });
            } else if (routeParams.type == 'savings') {
                resourceFactory.runReportsResource.get({reportSource: 'reportCategoryList', R_reportCategory: 'Savings', parameterType: true, genericResultSet: false}, function (data) {
                    scope.reports = scope.getReports(data);
                });
            } else if (routeParams.type == 'funds') {
                resourceFactory.runReportsResource.get({reportSource: 'reportCategoryList', R_reportCategory: 'Fund', parameterType: true, genericResultSet: false}, function (data) {
                    scope.reports = scope.getReports(data);
                });
            } else if (routeParams.type == 'accounting') {
                resourceFactory.runReportsResource.get({reportSource: 'reportCategoryList', R_reportCategory: 'Accounting', parameterType: true, genericResultSet: false}, function (data) {
                    scope.reports = scope.getReports(data);
                });
            }

            scope.ReportsPerPage = 15;

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
    mifosX.ng.application.controller('ViewReportsController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$route', mifosX.controllers.ViewReportsController]).run(function ($log) {
        $log.info("ViewReportsController initialized");
    });
}(mifosX.controllers || {}));