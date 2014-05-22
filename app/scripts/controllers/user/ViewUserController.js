(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewUserController: function (scope, routeParams, route, location, resourceFactory, $modal) {
            scope.user = [];
            scope.formData = {};
            resourceFactory.userListResource.get({userId: routeParams.id}, function (data) {
                scope.user = data;
            });
            scope.open = function () {
                $modal.open({
                    templateUrl: 'password.html',
                    controller: ModalInstanceCtrl
                });
            };
            scope.deleteuser = function () {
                $modal.open({
                    templateUrl: 'deleteuser.html',
                    controller: UserDeleteCtrl
                });
            };
            var ModalInstanceCtrl = function ($scope, $modalInstance) {
                $scope.save = function (staffId) {
                    resourceFactory.userListResource.update({'userId': routeParams.id}, this.formData, function (data) {
                        $modalInstance.close('activate');
                        if (data.resourceId == scope.currentSession.user.userId) {
                            scope.logout();
                        } else{
                            route.reload();
                        };
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            var UserDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.userListResource.delete({userId: routeParams.id}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/users');
                        // added dummy request param because Content-Type header gets removed
                        // if the request does not contain any data (a request body)
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_appuser'}, function (data) {
                scope.userdatatables = data;
            });

            scope.dataTableChange = function (userdatatable) {
                resourceFactory.DataTablesResource.getTableDetails({datatablename: userdatatable.registeredTableName,
                    entityId: routeParams.id, genericResultSet: 'true'}, function (data) {
                    scope.datatabledetails = data;
                    scope.datatabledetails.isData = data.data.length > 0 ? true : false;
                    scope.datatabledetails.isMultirow = data.columnHeaders[0].columnName == "id" ? true : false;
                    scope.showDataTableAddButton = !scope.datatabledetails.isData || scope.datatabledetails.isMultirow;
                    scope.showDataTableEditButton = scope.datatabledetails.isData && !scope.datatabledetails.isMultirow;
                    scope.singleRow = [];
                    for (var i in data.columnHeaders) {
                        if (scope.datatabledetails.columnHeaders[i].columnCode) {
                            if (data.columnHeaders[i].columnName.indexOf("_cd_") > 0) {
                                var temp = data.columnHeaders[i].columnName.split("_cd_");
                                data.columnHeaders[i].columnName = temp[1];
                            } else if (data.columnHeaders[i].columnName.indexOf("_cv_") > 0) {
                                var temp = data.columnHeaders[i].columnName.split("_cv_");
                                data.columnHeaders[i].columnName = temp[1];
                            }
                            for (var j in scope.datatabledetails.columnHeaders[i].columnValues) {
                                for (var k in data.data) {
                                    if (data.data[k].row[i] == scope.datatabledetails.columnHeaders[i].columnValues[j].id) {
                                        data.data[k].row[i] = scope.datatabledetails.columnHeaders[i].columnValues[j].value;
                                    }
                                }
                            }
                        }
                    }
                    if (scope.datatabledetails.isData) {
                        for (var i in data.columnHeaders) {
                            if (!scope.datatabledetails.isMultirow) {
                                var row = {};
                                row.key = data.columnHeaders[i].columnName;
                                row.value = data.data[0].row[i];
                                scope.singleRow.push(row);
                            }
                        }
                    }
                });
            };

            scope.viewDataTable = function (registeredTableName,data){
                if (scope.datatabledetails.isMultirow) {
                    location.path("/viewdatatableentry/"+registeredTableName+"/"+scope.user.id+"/"+data.row[0]);
                }else{
                    location.path("/viewsingledatatableentry/"+registeredTableName+"/"+scope.user.id);
                }
            };

            scope.deleteAll = function (apptableName, entityId) {
                resourceFactory.DataTablesResource.delete({datatablename: apptableName, entityId: entityId, genericResultSet: 'true'}, {}, function (data) {
                    route.reload();
                });
            };

        }
    });
    mifosX.ng.application.controller('ViewUserController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$modal', mifosX.controllers.ViewUserController]).run(function ($log) {
        $log.info("ViewUserController initialized");
    });
}(mifosX.controllers || {}));
