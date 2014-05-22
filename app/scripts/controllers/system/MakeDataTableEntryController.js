(function (module) {
    mifosX.controllers = _.extend(module, {
        MakeDataTableEntryController: function (scope, location, routeParams, resourceFactory, dateFilter) {
            scope.tableName = routeParams.tableName;
            scope.entityId = routeParams.entityId;
            scope.fromEntity = routeParams.fromEntity;
            scope.columnHeaders = [];
            scope.formData = {};
            scope.formDat = {};
            resourceFactory.DataTablesResource.getTableDetails({ datatablename: scope.tableName, entityId: scope.entityId, genericResultSet: 'true' }, function (data) {

                var colName = data.columnHeaders[0].columnName;
                if (colName == 'id') {
                    data.columnHeaders.splice(0, 1);
                }

                colName = data.columnHeaders[0].columnName;
                if (colName == 'client_id' || colName == 'office_id' || colName == 'group_id' || colName == 'center_id' || colName == 'loan_id' || colName == 'savings_account_id' || colName == 'appuser_id') {
                    data.columnHeaders.splice(0, 1);
                    scope.isCenter = colName == 'center_id' ? true : false;
                }

                for (var i = 0; i < data.columnHeaders.length; i++) {
                    if (data.columnHeaders[i].columnName.indexOf("_cd_") > 0) {
                        var temp = data.columnHeaders[i].columnName.split("_cd_");
                        data.columnHeaders[i].code = temp[0];
                        data.columnHeaders[i].columnName = temp[1];
                        data.columnHeaders[i].codeType = "_cd_";
                    } else if (data.columnHeaders[i].columnName.indexOf("_cv_") > 0) {
                        var temp = data.columnHeaders[i].columnName.split("_cv_");
                        data.columnHeaders[i].code = temp[0];
                        data.columnHeaders[i].columnName = temp[1];
                        data.columnHeaders[i].codeType = "_cv_";
                    }
                }
                scope.columnHeaders = data.columnHeaders;

            });

            //return input type
            scope.fieldType = function (type) {
                var fieldType = "";
                if (type) {
                    if (type == 'STRING' || type == 'INTEGER' || type == 'TEXT' || type == 'DECIMAL') {
                        fieldType = 'TEXT';
                    } else if (type == 'CODELOOKUP' || type == 'CODEVALUE') {
                        fieldType = 'SELECT';
                    } else if (type == 'DATE') {
                        fieldType = 'DATE';
                    }
                }
                return fieldType;
            };

            scope.cancel = function () {
                if (scope.fromEntity == 'client') {
                    location.path('/viewclient/' + routeParams.entityId).search({});
                } else if (scope.fromEntity == 'group') {                    
                    location.path('/viewgroup/' + routeParams.entityId).search({});
                } else if (scope.fromEntity == 'center') {                    
                    location.path('/viewcenter/' + routeParams.entityId).search({});
                } else if (scope.fromEntity == 'loan') {                    
                    location.path('/viewloanaccount/' + routeParams.entityId).search({});
                } else if (scope.fromEntity == 'user') {
                    location.path('/viewuser/' + routeParams.entityId).search({});
                } else if (scope.fromEntity == 'savings') {
                    location.path('/viewsavingaccount/' + routeParams.entityId).search({});
                };
            };
            scope.submit = function () {
                var params = {datatablename: scope.tableName, entityId: scope.entityId, genericResultSet: 'true'};
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                //below logic, for the input field if data is not entered, this logic will put "", because
                //if no data entered in input field , that field name won't send to server side.
                for (var i = 0; i < scope.columnHeaders.length; i++) {
                    if (!_.contains(_.keys(this.formData), scope.columnHeaders[i].columnName)) {
                        this.formData[scope.columnHeaders[i].columnName] = "";
                    }
                    if (scope.columnHeaders[i].columnDisplayType == 'DATE') {
                        this.formData[scope.columnHeaders[i].columnName] = dateFilter(this.formDat[scope.columnHeaders[i].columnName], scope.df);
                    } else if (scope.columnHeaders[i].columnDisplayType == 'CODELOOKUP' || scope.columnHeaders[i].columnDisplayType == 'CODEVALUE') {
                        this.formData[scope.columnHeaders[i].code+scope.columnHeaders[i].codeType+scope.columnHeaders[i].columnName]=this.formData[scope.columnHeaders[i].columnName];
                        delete scope.formData[scope.columnHeaders[i].columnName];
                    }
                }


                resourceFactory.DataTablesResource.save(params, this.formData, function (data) {
                    var destination = "";
                    if (data.loanId) {
                        destination = '/viewloanaccount/' + data.loanId;
                    } else if (data.savingsId) {
                        destination = '/viewsavingaccount/' + data.savingsId;
                    } else if (data.clientId) {
                        destination = '/viewclient/' + data.clientId;
                    } else if (data.groupId) {
                        if (scope.isCenter) {
                            destination = '/viewcenter/' + data.groupId;
                        } else {
                            destination = '/viewgroup/' + data.groupId;
                        }
                    } else if (data.userId) {
                        destination = '/viewuser/' + data.userId;
                    } else if (data.officeId) {
                        destination = '/viewoffice/' + data.officeId;
                    }
                    location.path(destination);
                });
            };
        }
    });
    mifosX.ng.application.controller('MakeDataTableEntryController', ['$scope', '$location', '$routeParams', 'ResourceFactory', 'dateFilter', mifosX.controllers.MakeDataTableEntryController]).run(function ($log) {
        $log.info("MakeDataTableEntryController initialized");
    });
}(mifosX.controllers || {}));
