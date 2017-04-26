(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewCenterController: function (scope, routeParams, resourceFactory, location, route, http, $uibModal, dateFilter, API_VERSION, $sce, $rootScope) {

            scope.center = [];
            scope.staffData = {};
            scope.formData = {};
            scope.report = false;
            scope.hidePentahoReport = true;
            resourceFactory.centerResource.get({centerId: routeParams.id, associations: 'groupMembers,collectionMeetingCalendar'}, function (data) {
                scope.center = data;
                scope.isClosedCenter = scope.center.status.value == 'Closed';
                scope.staffData.staffId = data.staffId;
                if(data.collectionMeetingCalendar) {
                    scope.meeting = data.collectionMeetingCalendar;
                }
            });
            scope.routeTo = function (id) {
                location.path('/viewsavingaccount/' + id);
            };
            resourceFactory.runReportsResource.get({reportSource: 'GroupSummaryCounts', genericResultSet: 'false', R_groupId: routeParams.id}, function (data) {
                scope.summary = data[0];
            });

            resourceFactory.centerAccountResource.get({centerId: routeParams.id}, function (data) {
                scope.accounts = data;
            });
            resourceFactory.groupNotesResource.getAllNotes({groupId: routeParams.id}, function (data) {
                scope.notes = data;
            });
            scope.deleteCenter = function () {
                $uibModal.open({
                    templateUrl: 'delete.html',
                    controller: CenterDeleteCtrl
                });
            };
            scope.unassignStaffCenter = function () {
                $uibModal.open({
                    templateUrl: 'unassignstaff.html',
                    controller: CenterUnassignCtrl
                });
            };
            var CenterDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.centerResource.delete({centerId: routeParams.id}, {}, function (data) {
                        $uibModalInstance.close('activate');
                        location.path('/centers');
                    });

                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            var CenterUnassignCtrl = function ($scope, $uibModalInstance) {
                $scope.unassign = function () {
                    resourceFactory.groupResource.save({groupId: routeParams.id, command: 'unassignStaff'}, scope.staffData, function (data) {
                        $uibModalInstance.close('activate');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            scope.saveNote = function () {
                resourceFactory.groupNotesResource.save({groupId: routeParams.id}, this.formData, function (data) {
                    var today = new Date();
                    temp = { id: data.resourceId, note: scope.formData.note, createdByUsername: "test", createdOn: today };
                    scope.notes.push(temp);
                    scope.formData.note = "";
                    scope.predicate = '-id';
                });
            }

            resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_center'}, function (data) {
                scope.centerdatatables = data;
            });
            scope.viewDataTable = function (registeredTableName,data){
                if (scope.datatabledetails.isMultirow) {
                    location.path("/viewdatatableentry/"+registeredTableName+"/"+scope.center.id+"/"+data.row[0]);
                }else{
                    location.path("/viewsingledatatableentry/"+registeredTableName+"/"+scope.center.id);
                }
            };

            scope.dataTableChange = function (datatable) {
                resourceFactory.DataTablesResource.getTableDetails({datatablename: datatable.registeredTableName, entityId: routeParams.id, genericResultSet: 'true'}, function (data) {
                    scope.datatabledetails = data;
                    scope.datatabledetails.isData = data.data.length > 0 ? true : false;
                    scope.datatabledetails.isMultirow = data.columnHeaders[0].columnName == "id" ? true : false;
                    scope.showDataTableAddButton = !scope.datatabledetails.isData || scope.datatabledetails.isMultirow;
                    scope.showDataTableEditButton = scope.datatabledetails.isData && !scope.datatabledetails.isMultirow;
                    scope.singleRow = [];
                    for (var i in data.columnHeaders) {
                        if (scope.datatabledetails.columnHeaders[i].columnCode) {
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
            //viewStaffAssignmentHistory [Report]
            scope.viewStaffAssignmentHistory = function () {
                //alert("center id : "+ scope.center.id);
                scope.hidePentahoReport = true;
                scope.formData.outputType = 'HTML';
                scope.baseURL = $rootScope.hostUrl + API_VERSION + "/runreports/" + encodeURIComponent("Staff Assignment History");
                scope.baseURL += "?output-type=" + encodeURIComponent(scope.formData.outputType) + "&tenantIdentifier=" + $rootScope.tenantIdentifier+"&locale="+scope.optlang.code;
                //alert("url: "+ scope.baseURL);
                var reportParams = "";
                var paramName = "R_centerId";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(scope.center.id);
                if (reportParams > "") {
                    scope.baseURL += "&" + reportParams;
                }
                // allow untrusted urls for iframe http://docs.angularjs.org/error/$sce/insecurl
                scope.baseURL = $sce.trustAsResourceUrl(scope.baseURL);

            };

            scope.deleteAll = function (apptableName, entityId) {
                resourceFactory.DataTablesResource.delete({datatablename: apptableName, entityId: entityId, genericResultSet: 'true'}, {}, function (data) {
                    route.reload();
                });
            };
        }
    });

    mifosX.ng.application.controller('ViewCenterController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$route', '$http', '$uibModal', 'dateFilter', 'API_VERSION', '$sce', '$rootScope', mifosX.controllers.ViewCenterController]).run(function ($log) {
        $log.info("ViewCenterController initialized");
    });
}(mifosX.controllers || {}));
