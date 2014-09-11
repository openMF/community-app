(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewCenterController: function (scope, routeParams, route, location, resourceFactory, $modal) {
            scope.center = [];
            scope.staffData = {};
            scope.formData = {};
			scope.showDetails = true;
			scope.showSummaryDetails = true;
            resourceFactory.centerResource.get({centerId: routeParams.id, associations: 'groupMembers,collectionMeetingCalendar'}, function (data) {
                scope.center = data;
                scope.isClosedCenter = scope.center.status.value == 'Closed';
                scope.staffData.staffId = data.staffId;
                scope.meeting = data.collectionMeetingCalendar;
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
                $modal.open({
                    templateUrl: 'delete.html',
                    controller: CenterDeleteCtrl
                });
            };
            scope.unassignStaffCenter = function () {
                $modal.open({
                    templateUrl: 'unassignstaff.html',
                    controller: CenterUnassignCtrl
                });
            };
            var CenterDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.centerResource.delete({centerId: routeParams.id}, {}, function (data) {
                        $modalInstance.close('activate');
                        location.path('/centers');
                    });

                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            var CenterUnassignCtrl = function ($scope, $modalInstance) {
                $scope.unassign = function () {
                    resourceFactory.groupResource.save({groupId: routeParams.id, command: 'unassignStaff'}, scope.staffData, function (data) {
                        $modalInstance.close('activate');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
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

			scope.deleteAll = function (apptableName, entityId){
				scope.apptableName = apptableName;
                $modal.open({
                    templateUrl: 'deleteCenter.html',
                    controller: DeleteDataTCtrl
                });
            };
			
            var DeleteDataTCtrl = function ($scope, $modalInstance) {
			$scope.delete = function () {
				resourceFactory.DataTablesResource.delete({datatablename: scope.apptableName, entityId: routeParams.id, genericResultSet: 'true'}, {}, function (data) {
					$modalInstance.close('delete');
					route.reload();
				});
			};
				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
			};
        }
    });
    mifosX.ng.application.controller('ViewCenterController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$modal', mifosX.controllers.ViewCenterController]).run(function ($log) {
        $log.info("ViewCenterController initialized");
    });
}(mifosX.controllers || {}));
