(function (module) {
    mifosX.controllers = _.extend(module, {
        UploadBankStatementController: function (scope, resourceFactory, location, http, routeParams, API_VERSION, $upload, $rootScope) {
            scope.file = [];
            scope.cifFileSize = null;
            scope.orgFileSize = null;
            scope.orgfile = null;
            scope.ciffile = null;
            scope.banks = [];
            scope.isCPIFNotSlected = false;
            scope.onCIFFileSelect = function ($files) {
                scope.ciffile = $files[0];
                scope.cifFileSize = $files[0].size;
            };

            scope.getAllBanks = function(){
                resourceFactory.bankResource.getAll({}, function (data) {
                    scope.banks = data;
                });
            };
            scope.getAllBanks();

            scope.onFileSelect = function ($files) {
                scope.orgfile = $files[0];
                scope.orgFileSize = $files[0].size;
            };

            scope.submit = function () {
                if(scope.ciffile == null){
                    scope.isCPIFNotSlected = true;
                    return false;
                }
                if(scope.orgfile == null){
                    scope.file = [scope.ciffile];
                }else{
                    scope.file = [scope.ciffile, scope.orgfile];
                    scope.formData.orgFileSize = scope.orgFileSize;
                }
                scope.formData.cifFileSize = scope.cifFileSize;
                $upload.upload({
                    url: $rootScope.hostUrl + API_VERSION + '/bankstatements',
                    data: scope.formData,
                    file: scope.file
                }).then(function (data) {
                    // to fix IE not refreshing the model
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                    location.path('/bankstatements');
                });
            };
        }
    });
    mifosX.ng.application.controller('UploadBankStatementController', ['$scope', 'ResourceFactory', '$location', '$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.UploadBankStatementController]).run(function ($log) {
        $log.info("UploadBankStatementController initialized");
    });
}(mifosX.controllers || {}));