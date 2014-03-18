(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientScreenReportController: function (scope, resourceFactory, location, $http, API_VERSION, routeParams, $rootScope, $sce) {
            scope.clientId = routeParams.clientId;
            resourceFactory.templateResource.get({entityId: 0, typeId: 0}, function (data) {
                scope.clientTemplateData = data;
            });
            scope.print = function (template) {
                var templateWindow = window.open('', 'Screen Report', 'height=400,width=600');
                templateWindow.document.write('<html><head>');
                templateWindow.document.write('</head><body>');
                templateWindow.document.write(template);
                templateWindow.document.write('</body></html>');
                templateWindow.print();
                templateWindow.close();
            };
            scope.getClientTemplate = function (templateId) {
                scope.selectedTemplate = templateId;
                $http({
                    method: 'POST',
                    url: $rootScope.hostUrl + API_VERSION + '/templates/' + templateId + '?clientId=' + routeParams.clientId,
                    data: {}
                }).then(function (data) {
                    scope.template = $sce.trustAsHtml(data.data);
                });
            };
        }
    });
    mifosX.ng.application.controller('ClientScreenReportController', ['$scope', 'ResourceFactory', '$location', '$http', 'API_VERSION', '$routeParams', '$rootScope', '$sce', mifosX.controllers.ClientScreenReportController]).run(function ($log) {
        $log.info("ClientScreenReportController initialized");
    });
}(mifosX.controllers || {}));
