(function (module) {
    mifosX.controllers = _.extend(module, {
        BusinessOwnerDocumentController: function (scope, location, http, routeParams, API_VERSION, Upload, $rootScope) {
            scope.ownerId = routeParams.ownerId;
            scope.clientId = routeParams.clientId;
            scope.onFileSelect = function (files) {
                scope.formData.file = files[0];
            };

            scope.submit = function () {
                Upload.upload({
                    url: $rootScope.hostUrl + API_VERSION + '/business_owners/' + scope.ownerId + '/documents',
                    data: { name : scope.formData.name, description : scope.formData.description, file: scope.formData.file},
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
    mifosX.ng.application.controller('BusinessOwnerDocumentController', ['$scope', '$location', '$http', '$routeParams', 'API_VERSION', 'Upload', '$rootScope', mifosX.controllers.BusinessOwnerDocumentController]).run(function ($log) {
        $log.info("BusinessOwnerDocumentController initialized");
    });
}(mifosX.controllers || {}));