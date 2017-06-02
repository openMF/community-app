(function (module) {
    mifosX.controllers = _.extend(module, {
        LoanDocumentController: function (scope, location, http, routeParams, API_VERSION, Upload, $rootScope) {
            scope.loanId = routeParams.loanId;
            scope.onFileSelect = function (files) {
                scope.formData.file = files[0];
            };

            scope.submit = function () {
                Upload.upload({
                    url: $rootScope.hostUrl + API_VERSION + '/loans/' + scope.loanId + '/documents',
                    data: { name : scope.formData.name, description : scope.formData.description, file: scope.formData.file},
                }).then(function (data) {
                        // to fix IE not refreshing the model
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                        location.path('/viewloanaccount/' + scope.loanId);
                    });
            };
        }
    });
    mifosX.ng.application.controller('LoanDocumentController', ['$scope', '$location', '$http', '$routeParams', 'API_VERSION', 'Upload', '$rootScope', mifosX.controllers.LoanDocumentController]).run(function ($log) {
        $log.info("LoanDocumentController initialized");
    });
}(mifosX.controllers || {}));