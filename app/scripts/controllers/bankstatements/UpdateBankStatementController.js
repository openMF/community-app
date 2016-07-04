(function (module) {
    mifosX.controllers = _.extend(module, {
        UpdateBankStatementController: function (scope, location, http, routeParams, resourceFactory, API_VERSION, $upload, $rootScope) {
            scope.formData = {};
            scope.file = [];
            scope.orgfile = null;
            scope.baseUri = $rootScope.hostUrl+API_VERSION+'/bankstatement/1/documents/';
            scope.appendedUri = '/attachment?tenantIdentifier='+$rootScope.tenantIdentifier;
            scope.cpifFileName = null;
            scope.orgFileName = null;
            scope.cpifFile = null;
            scope.orgFile = null;
            scope.banks = [];
            scope.onCpifFileSelect = function ($files) {
                scope.cpifFile = $files[0];
                scope.cifFileSize = $files[0].size;
            };

            scope.onOrgFileSelect = function ($files) {
                scope.orgFile = $files[0];
                scope.orgFileSize = $files[0].size;
            };

            resourceFactory.bankStatementsResource.getBankStatement({'bankStatementId': routeParams.bankStatementId}, function (data) {
                scope.isOrgFilePresent = data.orgStatementKeyDocumentId > 0;
                scope.formData.id = data.id;
                scope.formData.name = data.name;
                scope.formData.description = data.description;
                scope.cpifFileURI = scope.baseUri+ data.cpifKeyDocumentId+ scope.appendedUri;
                resourceFactory.bankResource.getAll({}, function (allBank) {
                    scope.banks = allBank;
                     scope.formData.bank =  data.bankData.id;
                });
                resourceFactory.bankStatementDocumentResource.getBankStatementDocument({'documentId': data.cpifKeyDocumentId}, function (cpifData) {
                    scope.cpifFileName = cpifData.fileName;
                });
                if(data.orgStatementKeyDocumentId > 0){
                    scope.orgFileURI = scope.baseUri+ data.orgStatementKeyDocumentId+ scope.appendedUri;
                    resourceFactory.bankStatementDocumentResource.getBankStatementDocument({'documentId': data.orgStatementKeyDocumentId}, function (orgData) {
                        scope.orgFileName = orgData.fileName;
                    });
                }
            });

            scope.submit = function () {
                scope.formData.orgFileSize = scope.orgFileSize;
                scope.formData.cifFileSize = scope.cifFileSize;
                if(scope.formData.orgFileSize != undefined && scope.formData.cifFileSize != undefined){
                    scope.file = [scope.cpifFile, scope.orgFile];
                }else if(scope.formData.cifFileSize != undefined){
                    scope.file = [scope.cpifFile];
                }else if(scope.formData.orgFileSize != undefined){
                    scope.file = [scope.orgFile];
                }else{
                    scope.file = [];
                }
                if(scope.formData.description==undefined || scope.formData.description=='undefined'){
                    scope.formData.description = '';
                }
                var url = $rootScope.hostUrl + API_VERSION + '/bankstatements/'+scope.formData.id;
                $upload.upload({
                    method: 'PUT',
                    url: url,
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
    mifosX.ng.application.controller('UpdateBankStatementController', ['$scope', '$location', '$http', '$routeParams', 'ResourceFactory', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.UpdateBankStatementController]).run(function ($log) {
        $log.info("UpdateBankStatementController initialized");
    });
}(mifosX.controllers || {}));