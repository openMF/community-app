(function (module) {
    mifosX.controllers = _.extend(module, {
        EditReportController: function (scope, resourceFactory, location, routeParams) {
            scope.formData = {};

            resourceFactory.reportsResource.getReportDetails({id: routeParams.id, template: 'true'}, function (data) {
                scope.reportdetail = data;
                scope.reportdetail.reportParameters = data.reportParameters || [];
                scope.formData.useReport = data.useReport;
                scope.formData.reportType = data.reportType;
                scope.disableFields = false;

                if(scope.reportdetail.coreReport == true){
                    scope.disableFields = true;
                }

            });

            scope.parameterSelected = function (allowedParameterId) {
                for (var i in scope.reportdetail.allowedParameters) {
                    if (scope.reportdetail.allowedParameters[i].id == allowedParameterId) {
                        scope.reportdetail.reportParameters.push({parameterId: allowedParameterId,
                            id: "",
                            parameterName: scope.reportdetail.allowedParameters[i].parameterName
                        });
                    }
                }
                scope.allowedParameterId = '';
            }



            function deepCopy(obj) {
                if (Object.prototype.toString.call(obj) === '[object Array]') {
                    var out = [], i = 0, len = obj.length;
                    for (; i < len; i++) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                if (typeof obj === 'object') {
                    var out = {}, i;
                    for (i in obj) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                return obj;
            }

            scope.deleteParameter = function (index) {
                scope.reportdetail.reportParameters.splice(index, 1);
            }

            scope.submit = function () {
                if (scope.reportdetail.coreReport === true) {
                    this.formData.reportParameters = scope.temp;
                    this.formData.useReport = scope.reportdetail.useReport;
                } else {
                    scope.temp = deepCopy(scope.reportdetail.reportParameters);
                    scope.reportdetail.reportParameters = scope.temp;

                    for (var i in scope.temp) {
                        delete scope.temp[i].parameterName;
                    }

                    this.formData = {
                        reportName: scope.reportdetail.reportName,
                        reportType: scope.reportdetail.reportType,
                        reportSubType: scope.reportdetail.reportSubType,
                        reportCategory: scope.reportdetail.reportCategory,
                        useReport: scope.reportdetail.useReport,
                        description: scope.reportdetail.description,
                        reportSql: scope.reportdetail.reportSql,
                        reportParameters: scope.reportdetail.reportParameters
                    }
                }
                resourceFactory.reportsResource.update({id: routeParams.id}, this.formData, function (data) {
                    location.path('/system/viewreport/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditReportController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.EditReportController]).run(function ($log) {
        $log.info("EditReportController initialized");
    });
}(mifosX.controllers || {}));
