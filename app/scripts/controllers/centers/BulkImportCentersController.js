(function (module) {
    mifosX.controllers = _.extend(module, {
        BulkImportCentersController: function (scope, resourceFactory, location, API_VERSION, $rootScope, Upload) {

            scope.first = {};
            scope.first.templateUrl =  API_VERSION + '/centers/downloadtemplate' + '?tenantIdentifier=' + $rootScope.tenantIdentifier
                + '&locale=' + scope.optlang.code + '&dateFormat=' + scope.df;
            scope.formData = {};
            var requestParams = {staffInSelectedOfficeOnly:true};

            resourceFactory.centerTemplateResource.get(requestParams, function (data) {
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
            });

            scope.first.queryParams = '&';
            scope.changeOffice = function () {
                if(scope.formData.officeId) {
                    if(scope.first.queryParams.indexOf("officeId")==-1) {
                        resourceFactory.centerTemplateResource.get({
                            staffInSelectedOfficeOnly: true, officeId: scope.formData.officeId
                        }, function (data) {
                            scope.staffs = data.staffOptions;
                        });
                        scope.first.queryParams += '&officeId=' + scope.formData.officeId;
                    }else {
                        resourceFactory.centerTemplateResource.get({
                            staffInSelectedOfficeOnly: true, officeId: scope.formData.officeId
                        }, function (data) {
                            scope.staffs = data.staffOptions;
                        });
                        scope.first.queryParams=scope.first.queryParams.replace(/&officeId=\d+/i,"&officeId="+ scope.formData.officeId);
                    }
                } else {
                    scope.first.queryParams ='&';
                }

            };

            scope.changeStaff = function() {
                if(scope.formData.staffId) {
                    if (scope.first.queryParams.indexOf("staffId")==-1) {
                        scope.first.queryParams = scope.first.queryParams + '&staffId=' + scope.formData.staffId;
                    }else {
                        scope.first.queryParams=scope.first.queryParams.replace(/&staffId=\d+/i,"&staffId="+ scope.formData.staffId);
                    }
                } else {
                    if(scope.formData.officeId)
                        scope.first.queryParams = '&' + 'officeId=' + scope.formData.officeId;
                    else
                        scope.first.queryParams = '&';
                }
            };

            scope.onFileSelect = function (files) {
                scope.formData.file = files[0];
            };

            scope.refreshImportTable=function () {
                resourceFactory.importResource.getImports({entityType: "centers"}, function (data) {

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
                    url: $rootScope.hostUrl + API_VERSION + '/centers/uploadtemplate',
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
    mifosX.ng.application.controller('BulkImportCentersController', ['$scope', 'ResourceFactory', '$location', 'API_VERSION', '$rootScope', 'Upload', mifosX.controllers.BulkImportCentersController]).run(function ($log) {
        $log.info("BulkImportCentersController initialized");
    });
}(mifosX.controllers || {}));