(function(module) {
    mifosX.controllers = _.extend(module, {
        ViewCenterController: function(scope, routeParams , route, location, resourceFactory) {
            scope.center = [];

            resourceFactory.centerResource.get({centerId: routeParams.id,associations:'groupMembers,collectionMeetingCalendar'} , function(data) {
                scope.center = data;
                scope.meeting = data.collectionMeetingCalendar;
            });
            resourceFactory.runReportsResource.get({reportSource: 'GroupSummaryCounts',genericResultSet: 'false',R_groupId: routeParams.id} , function(data) {
                scope.summary = data[0];
            });
            resourceFactory.centerAccountResource.get({centerId: routeParams.id} , function(data) {
                scope.accounts = data;
            });
            resourceFactory.groupNotesResource.getAllNotes({groupId: routeParams.id} , function(data) {
                scope.notes = data;
            });
            scope.deletecenterpop = function(){
                scope.choice = 3;
            } ;
            scope.delete = function(id){
                resourceFactory.centerResource.delete({centerId: id}, {}, function(data) {
                    location.path('/centers');
                });
            };
            scope.unassignStaffpop = function()
            {
                scope.choice = 4;
            };
            scope.unassignStaff = function(id){
                var staffData = new Object();
                staffData.staffId = id;
                resourceFactory.groupResource.save({centerId: routeParams.id,anotherresource: 'unassignStaff'}, staffData, function(data) {
                    resourceFactory.centerResource.get({centerId: routeParams.id}, function(data){
                        route.reload();
                    });
                });
            };
            scope.cancelDelete = function(){
                scope.choice = 0;
            };
            scope.saveNote = function() {
                resourceFactory.groupNotesResource.save({groupId: routeParams.id}, this.formData,function(data){
                    var today = new Date();
                    temp = { id: data.resourceId , note : scope.formData.note , createdByUsername : "test" , createdOn : today } ;
                    scope.notes.push(temp);
                    scope.formData.note = "";
                    scope.predicate = '-id';
                });
            }

            resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_center'} , function(data) {
                scope.centerdatatables = data;
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
    mifosX.ng.application.controller('ViewCenterController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewCenterController]).run(function($log) {
        $log.info("ViewCenterController initialized");
    });
}(mifosX.controllers || {}));

