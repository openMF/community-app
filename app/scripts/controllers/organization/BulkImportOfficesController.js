(function (module) {
    mifosX.controllers = _.extend(module, {
        BulkImportOfficesController: function (scope, resourceFactory, location, API_VERSION, $rootScope, Upload) {
        	
        	scope.first = {};
        	scope.first.templateUrl =  API_VERSION + '/offices/downloadtemplate' + '?tenantIdentifier=' + $rootScope.tenantIdentifier
        	+ '&locale=' + scope.optlang.code + '&dateFormat=' + scope.df;
             
        	scope.formData = {};
        	 scope.onFileSelect = function (files) {
                 scope.formData.file = files[0];
             };

             scope.refreshImportTable=function () {
                resourceFactory.importResource.getImports({entityType: "offices"}, function (data) {

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
                     url: $rootScope.hostUrl + API_VERSION + '/offices/uploadtemplate',
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
    mifosX.ng.application.controller('BulkImportOfficesController', ['$scope', 'ResourceFactory', '$location', 'API_VERSION', '$rootScope', 'Upload', mifosX.controllers.BulkImportOfficesController]).run(function ($log) {
        $log.info("BulkImportOfficesController initialized");
    });
}(mifosX.controllers || {}));