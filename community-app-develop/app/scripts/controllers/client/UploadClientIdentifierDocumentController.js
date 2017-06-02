(function (module) {
    mifosX.controllers = _.extend(module, {
        UploadClientIdentifierDocumentController: function (scope, location, routeParams, API_VERSION, $upload, $rootScope) {
            scope.clientId = routeParams.clientId;
            scope.resourceId = routeParams.resourceId;
            scope.onFileSelect = function ($files) {
                scope.file = $files[0];
            };

            scope.submit = function () {
                $upload.upload({
                    url:  $rootScope.hostUrl + API_VERSION + '/client_identifiers/' + scope.resourceId + '/documents',
                    data: scope.formData,
                    file: scope.file
                }).then(function (data) {
                        // to fix IE not refreshing the model
                        if (!scope.$$phase) {
                          scope.$apply();
                        }
                        location.path('/viewclient/' + scope.clientId);
                    });
            };
        }
    });
    mifosX.ng.application.controller('UploadClientIdentifierDocumentController', ['$scope', '$location', '$routeParams', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.UploadClientIdentifierDocumentController]).run(function ($log) {
        $log.info("UploadClientIdentifierDocumentController initialized");
    });
}(mifosX.controllers || {}));
