(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateReportController: function (scope, resourceFactory, location) {
            scope.formData = {};
            scope.reportParameters = [];

            resourceFactory.reportsResource.getReportDetails({resourceType: 'template'}, function (data) {
                scope.reportdetail = data;
                scope.formData.reportType = data.allowedReportTypes[0];
            });

            scope.addParameter = function () {
                for (var i = 0; i < scope.reportdetail.allowedParameters.length; i++) {
                    if (scope.reportdetail.allowedParameters[i].id == scope.allowedParameterId) {
                        scope.reportParameters.push({
                            parameterId: scope.allowedParameterId,
                            id: "",
                            parameterName: scope.reportdetail.allowedParameters[i].parameterName
                        });
                        break;
                    }
                }
                scope.allowedParameterId = '';
            }

            scope.deleteParameter = function (index) {
                scope.reportParameters.splice(index, 1);
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

            scope.submit = function () {
                scope.temp = deepCopy(scope.reportParameters);
                for (var i in scope.temp) {
                    delete scope.temp[i].allowedParameterName;
                }
                this.formData.reportParameters = scope.temp;
                resourceFactory.reportsResource.save(this.formData, function (data) {
                    location.path('/system/viewreport/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateReportController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CreateReportController]).run(function ($log) {
        $log.info("CreateReportController initialized");
    });
}(mifosX.controllers || {}));