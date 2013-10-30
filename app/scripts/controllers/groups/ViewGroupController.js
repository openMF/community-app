(function(module) {
    mifosX.controllers = _.extend(module, {
        ViewGroupController: function(scope, routeParams , route, location, resourceFactory,dateFilter,$modal) {
            scope.group = [];
            scope.template = [];
            scope.choice = 0;
            scope.staffData = {};
           resourceFactory.groupResource.get({groupId: routeParams.id,associations:'all'} , function(data) {
               scope.group = data;
               scope.staffData.staffId = data.staffId;
            });
            resourceFactory.runReportsResource.get({reportSource: 'GroupSummaryCounts',genericResultSet: 'false',R_groupId: routeParams.id} , function(data) {
                scope.summary = data[0];
            });
            resourceFactory.groupAccountResource.get({groupId: routeParams.id} , function(data) {
                scope.groupAccounts = data;
            });
            resourceFactory.groupNotesResource.getAllNotes({groupId: routeParams.id} , function(data) {
                scope.groupNotes = data;
            });
            scope.deleteGrouppop = function(){
                scope.choice = 3;
            } ;
            scope.delete = function(id){

            };
            scope.delrole = function(id){
                resourceFactory.groupResource.save({groupId: routeParams.id,command: 'unassignRole',roleId:id}, {}, function(data) {
                    resourceFactory.groupResource.get({groupId: routeParams.id}, function(data){
                        route.reload();
                    });
                });
            };
            scope.deleteGroup = function () {
                $modal.open({
                    templateUrl: 'deletegroup.html',
                    controller: GroupDeleteCtrl
                });
            };
            scope.unassignStaffGroup = function () {
                $modal.open({
                    templateUrl: 'groupunassignstaff.html',
                    controller: GroupUnassignCtrl
                });
            };
            var GroupUnassignCtrl = function ($scope, $modalInstance) {
                $scope.unassign = function () {
                    resourceFactory.groupResource.save({groupId: routeParams.id, command : 'unassignstaff'}, scope.staffData,function(data){
                        route.reload();
                    });
                    $modalInstance.close('unassign');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            var GroupDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.groupResource.delete({groupId: routeParams.id}, {}, function(data) {
                        location.path('/groups');
                    });
                    $modalInstance.close('delete');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            scope.cancel = function(id){
                resourceFactory.groupResource.get({groupId: id}, function(data){
                    route.reload();
                });
            };
            scope.saveNote = function() {
                resourceFactory.groupResource.save({groupId: routeParams.id, anotherresource: 'notes'}, this.formData,function(data){
                    var today = new Date();
                    temp = { id: data.resourceId , note : scope.formData.note , createdByUsername : "test" , createdOn : today } ;
                    scope.groupNotes.push(temp);
                    scope.formData.note = "";
                    scope.predicate = '-id';
                });
            };

            resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_group'} , function(data) {
                scope.groupdatatables = data;
            });

            scope.dataTableChange = function(datatable) {
                resourceFactory.DataTablesResource.getTableDetails({datatablename: datatable.registeredTableName, entityId: routeParams.id, genericResultSet: 'true'} , function(data) {
                    scope.datatabledetails = data;
                    scope.datatabledetails.isData = data.data.length > 0 ? true : false;
                    scope.datatabledetails.isMultirow = data.columnHeaders[0].columnName == "id" ? true : false;

                    for(var i in data.columnHeaders) {
                        if (scope.datatabledetails.columnHeaders[i].columnCode) {
                            for (var j in scope.datatabledetails.columnHeaders[i].columnValues){
                                for(var k in data.data) {
                                    if (data.data[k].row[i] == scope.datatabledetails.columnHeaders[i].columnValues[j].id) {
                                        data.data[k].row[i] = scope.datatabledetails.columnHeaders[i].columnValues[j].value;
                                    }
                                }
                            }
                        } 
                    }
                });
            };

            scope.deleteAll = function (apptableName, entityId) {
                resourceFactory.DataTablesResource.delete({datatablename:apptableName, entityId:entityId, genericResultSet:'true'}, {}, function(data){
                    route.reload();
                });
            };

        }
    });
    mifosX.ng.application.controller('ViewGroupController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory','dateFilter','$modal', mifosX.controllers.ViewGroupController]).run(function($log) {
        $log.info("ViewGroupController initialized");
    });
}(mifosX.controllers || {}));
