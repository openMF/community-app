(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewCheckerinboxController: function (scope, resourceFactory, routeParams, location, $modal) {
            scope.details = {};
            scope.template = 'DEFAULTTEMPLATE';
            scope.client = {};
            scope.datatable = {};
            resourceFactory.auditResource.get({templateResource: routeParams.id}, function (data) {
                scope.details = data;
                scope.commandAsJson = data.commandAsJson;
                var obj = JSON.parse(scope.commandAsJson);
                scope.parsedCommandAsJson = obj;
                scope.jsondata = [];
                _.each(obj, function (value, key) {
                    scope.jsondata.push({name: key, property: value});
                });
                scope.populateEntityDetails(data.entityName, data.resourceGetUrl, data.actionName, scope.parsedCommandAsJson);
            });
            scope.approveOrRejectChecker = function (action) {
                $modal.open({
                    templateUrl: 'approve.html',
                    controller: ApproveCtrl,
                    resolve: {
                        action: function () {
                            return action;
                        }
                    }
                });
            };
            var ApproveCtrl = function ($scope, $modalInstance, action) {
                $scope.approve = function () {
                    resourceFactory.checkerInboxResource.save({templateResource: routeParams.id, command: action}, {}, function (data) {
                        $modalInstance.close('approve');
                        location.path('/checkeractionperformed');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            scope.checkerDelete = function () {
                $modal.open({
                    templateUrl: 'delete.html',
                    controller: DeleteCtrl
                });
            };
            var DeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.checkerInboxResource.delete({templateResource: routeParams.id}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/checkeractionperformed');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            //populate entity template details for pretty view
            scope.populateEntityDetails = function (entityName, resourceGetUrl, action, parsedCommandAsJson) {
                /*alert(entityName);
                alert(resourceGetUrl);
                alert(resourceGetUrl.indexOf("datatables/"));*/
                if (entityName === 'CLIENT' && (action === 'CREATE' || action === 'UPDATE')) {
                    scope.clientDetails(entityName, action, parsedCommandAsJson);
                } else if ((entityName !== 'DATATABLE' && (resourceGetUrl.indexOf("datatables") > 0)) && (action === 'CREATE' || action === 'UPDATE')) {
                    scope.datatableDataDetails(entityName, resourceGetUrl, action, parsedCommandAsJson);
                }
            };

            scope.clientDetails = function (entityName, action, parsedCommandAsJson) {
                scope.template = 'CLIENTTEMPLATE';
                resourceFactory.clientTemplateResource.get(function (clientData) {
                    /*if (data.savingProductOptions.length > 0) {
                     scope.showSavingOptions = true;
                     }*/
                    var gender = _.findWhere(clientData.genderOptions, {id: parsedCommandAsJson.genderId});
                    var staff = _.findWhere(clientData.staffOptions, {id: parsedCommandAsJson.staffId});
                    scope.client = {
                        firstName: parsedCommandAsJson.firstname,
                        middleName: parsedCommandAsJson.middlename,
                        lastName: parsedCommandAsJson.lastname,
                        mobileNo: parsedCommandAsJson.mobileNo,
                        externalId: parsedCommandAsJson.externalId,
                        dateOfBirth: parsedCommandAsJson.dateOfBirth,
                        active: parsedCommandAsJson.active,
                        activationDate: parsedCommandAsJson.activationDate,
                        submittedOnDate: parsedCommandAsJson.submittedOnDate,
                        gender: gender,
                        staff: staff,
                        office: parsedCommandAsJson.officeName
                    };
                });
            };

            scope.datatableDataDetails = function (entityName, resourceGetUrl, action, parsedCommandAsJson) {
                var reqparams = {datatablename: entityName, genericResultSet: 'true'};
                resourceFactory.DataTablesResource.getTableDetails(reqparams, function (data) {
                    //scope.template = 'DATATABLETEMPLATE';
                    scope.dataTableEntry = parsedCommandAsJson;
                    _.each(scope.dataTableEntry, function (v, k) {
                        if (k.indexOf('_cd_') > 0) {
                            //get values of a column
                            var columnData = _.findWhere(data.columnHeaderData, {columnName: k});
                            var replaceVal = _.findWhere(columnData.columnValues, {id: v });
                            scope.dataTableEntry[k] = replaceVal.value;
                        }
                    });
                    scope.jsondata = [];
                    _.each(scope.dataTableEntry, function (value, key) {
                        if (key.indexOf('_cd_') > 0) {
                            key = key.substring(key.indexOf('_cd_') + 4);
                        }
                        scope.jsondata.push({name: key, property: value});
                    });
                });
            };


        }
    });
    mifosX.ng.application.controller('ViewCheckerinboxController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$modal', mifosX.controllers.ViewCheckerinboxController]).run(function ($log) {
        $log.info("ViewCheckerinboxController initialized");
    });
}(mifosX.controllers || {}));


