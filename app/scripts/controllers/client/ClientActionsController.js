(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientActionsController: function (scope, resourceFactory, location, routeParams, dateFilter) {

            scope.action = routeParams.action || "";
            scope.clientId = routeParams.id;
            scope.formData = {};
            scope.entityformData = {};
            scope.entityformData.datatables = {};
            scope.restrictDate = new Date();
            scope.taskPermissionName = 'ALL_FUNCTIONS';
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

            // Transaction UI Related

            switch (scope.action) {
                case "activate":
                    resourceFactory.clientResource.get({clientId: routeParams.id}, function (data) {
                        scope.client = data;
                        if (data.timeline.submittedOnDate) {
                            scope.mindate = new Date(data.timeline.submittedOnDate);
                        }
                    });
                    scope.labelName = 'label.input.activationdate';
                    scope.breadcrumbName = 'label.anchor.activate';
                    scope.modelName = 'activationDate';
                    scope.showActivationDateField = true;
                    scope.showDateField = false;
                    scope.taskPermissionName = 'ACTIVATE_CLIENT';
                    scope.RequestEntities('m_client','ACTIVATE');
                    break;
                case "assignstaff":
                    scope.breadcrumbName = 'label.anchor.assignstaff';
                    scope.labelName = 'label.input.staff';
                    scope.staffField = true;
                    resourceFactory.clientResource.get({clientId: routeParams.id, template: 'true',staffInSelectedOfficeOnly:true}, function (data) {
                        if (data.staffOptions) {
                            scope.staffOptions = data.staffOptions;
                            scope.formData.staffId = scope.staffOptions[0].id;
                        }
                    });
                    scope.taskPermissionName = 'ASSIGNSTAFF_CLIENT';
                    break;
                case "close":
                    scope.labelName = 'label.input.closuredate';
                    scope.labelNamereason = 'label.input.closurereason';
                    scope.breadcrumbName = 'label.anchor.close';
                    scope.modelName = 'closureDate';
                    scope.reasonmodelName = 'closureReasonId';
                    scope.reasonField = true;
                    scope.showDateField = true;
                    resourceFactory.clientResource.get({anotherresource: 'template', commandParam: 'close'}, function (data) {
                        scope.reasons = data.narrations;
                        scope.formData.reasonId = scope.narrations[0].id;
                    });
                    scope.taskPermissionName = 'CLOSE_CLIENT';
                    scope.RequestEntities('m_client','CLOSE');
                    break;
                case "delete":
                    scope.breadcrumbName = 'label.anchor.delete';
                    scope.labelName = 'label.areyousure';
                    scope.showDeleteClient = true;
                    scope.taskPermissionName = 'DELETE_CLIENT';
                    break;
                case "unassignstaff":
                    scope.labelName = 'label.heading.unassignstaff';
                    scope.breadcrumbName = 'label.anchor.activate';
                    scope.showDeleteClient = true;
                    scope.taskPermissionName = 'UNASSIGNSTAFF_CLIENT';
                    break;
                case "updatedefaultaccount":
                    scope.breadcrumbName = 'label.anchor.updatedefaultaccount';
                    scope.labelName = 'label.input.savingsaccount';
                    scope.savingsField = false;
                    resourceFactory.clientResource.get({clientId: routeParams.id, template: 'true'}, function (data) {
                        if (data.savingAccountOptions) {
                            scope.savingsField = true;
                            scope.savingAccountOptions = data.savingAccountOptions;
                            scope.formData.savingsAccountId = scope.savingAccountOptions[0].id;
                            if(data.savingsAccountId){
                                scope.formData.savingsAccountId = data.savingsAccountId;
                            }
                            
                        }
                    });
                    break;
                case "acceptclienttransfer":
                    scope.breadcrumbName = 'label.anchor.acceptclienttransfer';
                    scope.showNoteField = true;
                    scope.taskPermissionName = 'ACCEPTTRANSFER_CLIENT';
                    break;
                case "rejecttransfer":
                    scope.breadcrumbName = 'label.anchor.rejecttransfer';
                    scope.showNoteField = true;
                    scope.taskPermissionName = 'REJECTTRANSFER_CLIENT';
                    break;
                case "undotransfer":
                    scope.breadcrumbName = 'label.anchor.undotransfer';
                    scope.showNoteField = true;
                    scope.taskPermissionName = 'WITHDRAWTRANSFER_CLIENT';
                    break;
                case "reject":
                    scope.labelName = 'label.input.rejectiondate';
                    scope.labelNamereason = 'label.input.rejectionreason';
                    scope.breadcrumbName = 'label.anchor.reject';
                    scope.modelName = 'rejectionDate';
                    scope.reasonmodelName = 'rejectionReasonId';
                    scope.reasonField = true;
                    scope.showDateField = true;
                    resourceFactory.clientResource.get({anotherresource: 'template', commandParam: 'reject'}, function (data) {
                        scope.reasons = data.narrations;
                        if(data.narrations != "") {
                            scope.formData.rejectionReasonId = data.narrations[0].id;
                        }
                    });
                    scope.taskPermissionName = 'REJECT_CLIENT';
                    break;
                case "withdraw":
                    scope.labelName = 'label.input.withdrawaldate';
                    scope.labelNamereason = 'label.input.withdrawalreason';
                    scope.breadcrumbName = 'label.anchor.withdraw';
                    scope.modelName = 'withdrawalDate';
                    scope.reasonmodelName = 'withdrawalReasonId';
                    scope.reasonField = true;
                    scope.showDateField = true;
                    resourceFactory.clientResource.get({anotherresource: 'template', commandParam: 'withdraw'}, function (data) {
                        scope.reasons = data.narrations;
                        if(data.narrations != "") {
                            scope.formData.withdrawalReasonId = data.narrations[0].id;
                        }
                    });
                    scope.taskPermissionName = 'WITHDRAW_CLIENT';
                    break;
                case "reactivate":
                    resourceFactory.clientResource.get({clientId: routeParams.id}, function (data) {
                        scope.client = data;
                        if (data.timeline.submittedOnDate) {
                            scope.mindate = new Date(data.timeline.submittedOnDate);
                        }
                    });
                    scope.labelName = 'label.input.reactivationdate';
                    scope.breadcrumbName = 'label.anchor.reactivate';
                    scope.modelName = 'reactivationDate';
                    scope.showActivationDateField = true;
                    scope.showDateField = false;
                    scope.taskPermissionName = 'REACTIVATE_CLIENT';
                    break;
                case "undoReject":
                    resourceFactory.clientResource.get({clientId: routeParams.id}, function (data) {
                        scope.client = data;
                        if (data.timeline.submittedOnDate) {
                            scope.mindate = new Date(data.timeline.submittedOnDate);
                        }
                    });
                    scope.labelName = 'label.input.reopeneddate';
                    scope.breadcrumbName = 'label.anchor.undoReject';
                    scope.modelName = 'reopenedDate';
                    scope.showActivationDateField = true;
                    scope.showDateField = false;
                    scope.taskPermissionName = 'UNDOREJECT_CLIENT';
                    break;
                case "undoWithdrawn":
                    resourceFactory.clientResource.get({clientId: routeParams.id}, function (data) {
                        scope.client = data;
                        if (data.timeline.submittedOnDate) {
                            scope.mindate = new Date(data.timeline.submittedOnDate);
                        }
                    });
                    scope.labelName = 'label.input.reopeneddate';
                    scope.breadcrumbName = 'label.anchor.undoWithdrawn';
                    scope.modelName = 'reopenedDate';
                    scope.showActivationDateField = true;
                    scope.showDateField = false;
                    scope.taskPermissionName = 'UNDOWITHDRAWAL_CLIENT';
                    break;

            }

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
                        scope.submit();
                    });
                }
                else{
                    scope.submit();
                }
            };

            scope.cancel = function () {
                location.path('/viewclient/' + routeParams.id);
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                if (this.formData[scope.modelName]) {
                    this.formData[scope.modelName] = dateFilter(this.formData[scope.modelName], scope.df);
                }

                if (scope.action == "activate") {
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'activate'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "assignstaff") {
                    delete this.formData.locale;
                    delete this.formData.dateFormat;
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'assignStaff'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "unassignstaff") {
                    delete this.formData.locale;
                    delete this.formData.dateFormat;
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'unassignstaff'}, {staffId: routeParams.staffId}, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "close") {
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'close'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "reject") {

                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'reject'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "withdraw") {
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'withdraw'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "reactivate") {
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'reactivate'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "undoReject") {
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'undoRejection'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "undoWithdrawn") {
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'undoWithdrawal'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "acceptclienttransfer") {
                    delete this.formData.locale;
                    delete this.formData.dateFormat;
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'acceptTransfer'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "rejecttransfer") {
                    delete this.formData.locale;
                    delete this.formData.dateFormat;
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'rejectTransfer'}, this.formData, function (data) {
                        resourceFactory.clientResource.save({clientId: routeParams.id, command: 'withdrawTransfer'}, {} ,function (data) {
                            location.path('/viewclient/' + data.clientId);
                        });
                    });
                    
                }
                if (scope.action == "undotransfer") {
                    delete this.formData.locale;
                    delete this.formData.dateFormat;
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'withdrawTransfer'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "updatedefaultaccount") {
                    delete this.formData.locale;
                    delete this.formData.dateFormat;
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'updateSavingsAccount'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
            };
        }
    });
    mifosX.ng.application.controller('ClientActionsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.ClientActionsController]).run(function ($log) {
        $log.info("ClientActionsController initialized");
    });
}(mifosX.controllers || {}));
