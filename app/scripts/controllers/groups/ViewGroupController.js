(function(module) {
    mifosX.controllers = _.extend(module, {
        ViewGroupController: function(scope, routeParams , route, location, resourceFactory) {
            scope.group = [];
            scope.template = [];
            scope.choice = 0;
            resourceFactory.groupResource.get({groupId: routeParams.id,associations:'all'} , function(data) {
                scope.group = data;
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
                resourceFactory.groupResource.delete({groupId: routeParams.id}, {}, function(data) {
                    location.path('/groups');
                });
            };
            scope.delrole = function(id){
                resourceFactory.groupResource.save({groupId: routeParams.id,command: 'unassignRole',roleId:id}, {}, function(data) {
                    resourceFactory.groupResource.get({groupId: routeParams.id}, function(data){
                        route.reload();
                    });
                });
            };
            scope.unassignStaffpop = function()
            {
                scope.choice = 4;
            };
            scope.unassignStaff = function(id){
                var staffData = new Object();
                staffData.staffId = id;
                resourceFactory.groupResource.save({groupId: routeParams.id,command: 'unassignStaff'}, staffData, function(data) {
                    resourceFactory.groupResource.get({groupId: routeParams.id}, function(data){
                        route.reload();
                    });
                });
            };
            scope.resetNote = function() {
                this.formData = '';
            };
            scope.cancel = function(id){
                resourceFactory.groupResource.get({groupId: id}, function(data){
                    route.reload();
                });
            };
            scope.cancelDelete = function(){
                scope.choice = 0;
            };

            scope.saveNote = function() {
                resourceFactory.groupResource.save({groupId: routeParams.id, anotherresource: 'notes'}, this.formData,function(data){
                    route.reload();
                });
            }

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
    mifosX.ng.application.controller('ViewGroupController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewGroupController]).run(function($log) {
        $log.info("ViewGroupController initialized");
    });
}(mifosX.controllers || {}));
