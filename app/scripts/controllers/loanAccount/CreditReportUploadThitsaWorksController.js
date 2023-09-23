(function (module) {
    mifosX.controllers = _.extend(module, {

        CreditReportUploadThitsaWorksController: function (scope, $rootScope, http, API_VERSION, resourceFactory, dateFilter, routeParams, location, Upload) {
            scope.formData = {};
            scope.clientId = routeParams.clientId;
            scope.displayName = '';
            scope.clientLastName = '';

            scope.onFileSelect = function (files) {
                scope.formData.file = files[0];
            };

            scope.upload = function () {
                Upload.upload({
                    url: $rootScope.hostUrl + API_VERSION + '/creditBureauIntegration/addCreditReport?creditBureauId=1', //CreditBureauId 1 is assigned for THITSAWORKS
                    data: {file: scope.formData.file},
                }).then(function (data) {
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                });
            };

            resourceFactory.clientResource.getAllClients({clientId : scope.clientId}, function (data) {
                scope.displayName = data.displayName;
            });

        }
    });
    mifosX.ng.application.controller('CreditReportUploadThitsaWorksController', ['$scope', '$rootScope','$http','API_VERSION', 'ResourceFactory', 'dateFilter','$routeParams', '$location', 'Upload', mifosX.controllers.CreditReportUploadThitsaWorksController]).run(function ($log) {
        $log.info("CreditReportUploadThitsaWorksController initialized");
    });
}(mifosX.controllers || {}));
