(function (module) {
    mifosX.controllers = _.extend(module, {
        EditGroupController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.first = {};
            scope.managecode = routeParams.managecode;
            scope.restrictDate = new Date();
            scope.entityformData = {};
            scope.entityformData.datatables={};
            scope.submittedDatatables = [];
            var submitStatus = [];

            scope.RequestEntities = function(entity,status){
                resourceFactory.entityDatatableChecksResource.getAll({limit:-1},function (response) {
                    scope.entityDatatableChecks = _.filter(response.pageItems , function(datatable){
                        var AllTables = (datatable.entity == entity && datatable.status.value == status);
                        return AllTables;
                    });
                    scope.entityDatatableChecks = _.pluck(scope.entityDatatableChecks,'datatableName');
                    scope.datatables = [];
                    var k=0;
                    _.each(scope.entityDatatableChecks,function(entitytable) {
                        resourceFactory.DataTablesResource.getTableDetails({datatablename:entitytable,entityId: routeParams.id, genericResultSet: 'true'}, function (data) {
                            data.registeredTableName = entitytable;
                            var colName = data.columnHeaders[0].columnName;
                            if (colName == 'id') {
                                data.columnHeaders.splice(0, 1);
                            }

                            colName = data.columnHeaders[0].columnName;
                            if (colName == 'client_id' || colName == 'office_id' || colName == 'group_id' || colName == 'center_id' || colName == 'loan_id' || colName == 'savings_account_id') {
                                data.columnHeaders.splice(0, 1);
                                scope.isCenter = (colName == 'center_id') ? true : false;
                            }

                            data.noData = (data.data.length == 0);
                            if(data.noData){
                                scope.datatables.push(data);
                                scope.entityformData.datatables[k] = {data:{}};
                                submitStatus[k] = "save";
                                _.each(data.columnHeaders,function(Header){
                                    scope.entityformData.datatables[k].data[Header.columnName] = "";
                                });
                                k++;
                                scope.isEntityDatatables = true;
                            }
                        });
                    });

                });
            };

            function asyncLoop(iterations, func, callback) {
                var index = 0;
                var done = false;
                var loop = {
                    next: function() {
                        if (done) {
                            return;
                        }

                        if (index < iterations) {
                            index++;
                            func(loop);

                        } else {
                            done = true;
                            callback();
                        }
                    },

                    iteration: function() {
                        return index - 1;
                    },

                    break: function() {
                        done = true;
                    }
                };
                loop.next();
                return loop;
            }

            scope.fieldType = function (type) {
                var fieldType = "";
                if (type) {
                    if (type == 'CODELOOKUP' || type == 'CODEVALUE') {
                        fieldType = 'SELECT';
                    } else if (type == 'DATE') {
                        fieldType = 'DATE';
                    } else if (type == 'DATETIME') {
                        fieldType = 'DATETIME';
                    } else if (type == 'BOOLEAN') {
                        fieldType = 'BOOLEAN';
                    } else {
                        fieldType = 'TEXT';
                    }
                }
                return fieldType;
            };

            scope.RequestEntities('m_group','ACTIVATE');

            resourceFactory.groupResource.get({groupId: routeParams.id, associations: 'clientMembers', template: 'true',staffInSelectedOfficeOnly:true}, function (data) {
                scope.editGroup = data;
                scope.formData = {
                    name: data.name,
                    externalId: data.externalId,
                    staffId: data.staffId
                };
                if (data.activationDate) {
                    var actDate = dateFilter(data.activationDate, scope.df);
                    scope.first.date = new Date(actDate);
                }

            });

            resourceFactory.groupResource.get({groupId: routeParams.id}, function (data) {
                if (data.timeline.submittedOnDate) {
                    scope.mindate = new Date(data.timeline.submittedOnDate);
                }
            });

            scope.updateGroup = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.activationDate = reqDate;
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                resourceFactory.groupResource.update({groupId: routeParams.id}, this.formData, function (data) {
                    location.path('/viewgroup/' + routeParams.id);
                });
            };

            scope.submitDatatable = function(){
                if(scope.datatables) {
                    asyncLoop(Object.keys(scope.entityformData.datatables).length,function(loop){
                        var cnt = loop.iteration();
                        var formData = scope.entityformData.datatables[cnt];
                        formData.registeredTableName = scope.datatables[cnt].registeredTableName;

                        var params = {
                            datatablename: formData.registeredTableName,
                            entityId: routeParams.id,
                            genericResultSet: 'true'
                        };

                        angular.extend(formData.data,{dateFormat: scope.df, locale: scope.optlang.code});

                        _.each(formData.data, function (columnHeader) {
                            if (columnHeader.dateType) {
                                columnHeader = dateFilter(columnHeader.dateType.date, params.dateFormat);
                            }
                            else if (columnHeader.dateTimeType) {
                                columnHeader = dateFilter(columnHeader.columnName.date, scope.df) + " " + dateFilter(columnHeader.columnName.time, scope.tf);
                            }
                        });

                        var action = submitStatus[cnt];
                        resourceFactory.DataTablesResource[action](params, formData.data, function (data) {

                            submitStatus[cnt] = "update";
                            scope.submittedDatatables.push(scope.datatables[cnt].registeredTableName);
                            loop.next();

                        },function(){
                            rootScope.errorDetails[0].push({datatable:scope.datatables[cnt].registeredTableName});
                            loop.break();
                        });

                    },function(){
                        scope.activate();
                    });
                }
                else{
                    scope.activate();
                }
            };

            scope.activate = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                var newActivation = new Object();
                newActivation.activationDate = reqDate;
                newActivation.locale = scope.optlang.code;
                newActivation.dateFormat = scope.df;
                resourceFactory.groupResource.save({groupId: routeParams.id, command: 'activate'}, newActivation, function (data) {
                    location.path('/viewgroup/' + routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditGroupController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditGroupController]).run(function ($log) {
        $log.info("EditGroupController initialized");
    });
}(mifosX.controllers || {}));

