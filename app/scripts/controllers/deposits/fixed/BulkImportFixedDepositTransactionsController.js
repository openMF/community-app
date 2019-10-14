(function (module) {
    mifosX.controllers = _.extend(module, {
        BulkImportFixedDepositTransactionsController: function (scope, resourceFactory, location, API_VERSION, $rootScope, Upload) {

            scope.first = {};
            scope.first.templateUrl =  API_VERSION + '/fixeddepositaccounts/transaction/downloadtemplate' + '?tenantIdentifier=' + $rootScope.tenantIdentifier
                + '&locale=' + scope.optlang.code + '&dateFormat=' + scope.df;
            scope.formData = {};

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices=data;
            });

            scope.first.queryParams = '&';
            scope.changeOffice = function () {
                if(scope.formData.officeId) {
                    if(scope.first.queryParams.indexOf("officeId")==-1) {
                        scope.first.queryParams += 'officeId=' + scope.formData.officeId;
                    }else {
                        scope.first.queryParams=scope.first.queryParams.replace(/&officeId=\d+/i,"&officeId="+ scope.formData.officeId);
                    }
                } else {
                    scope.first.queryParams ='&';
                }
            };

            scope.onFileSelect = function (files) {
                scope.formData.file = files[0];
            };

            scope.refreshImportTable=function () {
                resourceFactory.importResource.getImports({entityType: "fixeddeposittransactions"}, function (data) {

                    for (var l in data) {
                        var importdocs = {};
                        importdocs = API_VERSION + '/imports/downloadOutputTemplate?importDocumentId='+ data[l].importId +'&tenantIdentifier=' + $rootScope.tenantIdentifier;
                        data[l].docUrl = importdocs;
                    }
                    scope.imports = data;
                });
            };

            scope.upload = function () {
                Upload.upload({
                    url: $rootScope.hostUrl + API_VERSION + '/fixeddepositaccounts/transaction/uploadtemplate',
                    data: {file: scope.formData.file,locale:scope.optlang.code,dateFormat:scope.df},
                }).then(function (data) {
                    // to fix IE not refreshing the model
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                });
            };
        }
    });
    mifosX.ng.application.controller('BulkImportFixedDepositTransactionsController', ['$scope', 'ResourceFactory', '$location', 'API_VERSION', '$rootScope', 'Upload', mifosX.controllers.BulkImportFixedDepositTransactionsController]).run(function ($log) {
        $log.info("BulkImportFixedDepositTransactionsController initialized");
    });
}(mifosX.controllers || {}));