(function (module) {
    mifosX.controllers = _.extend(module, {
    	BulkImportClientsController: function (scope, resourceFactory, location, API_VERSION, $rootScope, Upload) {
        	
        	scope.first = {};
        	scope.first.templateUrl =  API_VERSION + '/clients/downloadtemplate' + '?tenantIdentifier=' + $rootScope.tenantIdentifier
        	+ '&locale=' + scope.optlang.code + '&dateFormat=' + scope.df;
        	scope.formData = {};
        	var requestParams = {staffInSelectedOfficeOnly:true};
        	
        	resourceFactory.clientTemplateResource.get(requestParams, function (data) {
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

            scope.changeLegalForm=function () {
            if (scope.formData.legalForm){
                var changedLegalForm;
                if(scope.formData.legalForm=="Person"){
                    changedLegalForm="CLIENTS_PERSON";
                }else if(scope.formData.legalForm=="Entity") {
                    changedLegalForm = "CLIENTS_ENTTTY";
                }
                    if (scope.first.queryParams.indexOf("legalFormType") == -1) {
                        scope.first.queryParams = scope.first.queryParams + '&' + 'legalFormType=' + changedLegalForm;
                    } else {
                        scope.first.queryParams = scope.first.queryParams.replace(/&legalFormType=\w+/i, "&legalFormType=" +changedLegalForm);
                    }
            }
        }
        	
        	 scope.onFileSelect = function (files) {
                 scope.formData.file = files[0];
                 scope.formData.entityType=null;
                 if (scope.formData.file.name.toLowerCase().indexOf("person")!=-1) {
                     scope.formData.entityType = "CLIENTS_PERSON";
                 }else if (scope.formData.file.name.toLowerCase().indexOf("entity")!=-1){
                     scope.formData.entityType="CLIENTS_ENTTTY";
                 }

             };
            scope.refreshImportTable=function () {
                resourceFactory.importResource.getImports({entityType: "client"}, function (data) {

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
                     url: $rootScope.hostUrl + API_VERSION + '/clients/uploadtemplate?legalFormType='+scope.formData.entityType+'',
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
    mifosX.ng.application.controller('BulkImportClientsController', ['$scope', 'ResourceFactory', '$location', 'API_VERSION', '$rootScope', 'Upload', mifosX.controllers.BulkImportClientsController]).run(function ($log) {
        $log.info("BulkImportClientsController initialized");
    });
}(mifosX.controllers || {}));