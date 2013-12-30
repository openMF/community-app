(function(module) {
    mifosX.controllers = _.extend(module, {
        MakeDataTableEntryController: function(scope, location, routeParams, resourceFactory, dateFilter) {
            scope.tableName = routeParams.tableName;
            scope.entityId = routeParams.entityId;
            scope.columnHeaders = [];
            scope.formData = {};
            scope.formDat = {};
            resourceFactory.DataTablesResource.getTableDetails({ datatablename:scope.tableName, entityId:scope.entityId, genericResultSet:'true' },function(data) {

                var colName = data.columnHeaders[0].columnName;
                if(colName == 'id') { data.columnHeaders.splice(0,1); }

                colName = data.columnHeaders[0].columnName;
                if(colName == 'client_id' || colName == 'office_id' || colName == 'group_id' || colName == 'center_id' || colName == 'loan_id' || colName == 'savings_account_id') {
                    data.columnHeaders.splice(0,1);
                    scope.isCenter = colName ==  'center_id' ? true : false;
                }
                scope.columnHeaders = data.columnHeaders;

                //below logic helps if column name contains space then underscore will be  appended.
                for (var i=0; i < scope.columnHeaders.length; i++) {
                    scope.columnHeaders[i].columnName = spaceToUnderscore(scope.columnHeaders[i].columnName);
                }
            });

            //this function removes white space and add underscore
            var spaceToUnderscore = function(str) {
                return str.replace(/ /g, "`")
            }

            scope.cancel = function () {
                location.path('/viewclient/'+ routeParams.entityId);
            };
            scope.submit = function () {
                var params = {datatablename:scope.tableName, entityId:scope.entityId, genericResultSet: 'true'};
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                //below logic, for the input field if data is not entered, this logic will put "", because
                //if no data entered in input field , that field name won't send to server side.
                for (var i=0; i < scope.columnHeaders.length; i++) {
                    if (!_.contains(_.keys(this.formData), scope.columnHeaders[i].columnName)) {
                        this.formData[scope.columnHeaders[i].columnName] = "";
                    }
                    if (scope.columnHeaders[i].columnDisplayType == 'DATE') {
                        this.formData[scope.columnHeaders[i].columnName] = dateFilter(this.formDat[scope.columnHeaders[i].columnName],scope.df);
                    }
                }


                resourceFactory.DataTablesResource.save(params, this.formData, function(data){
                    var destination = "";
                    if ( data.loanId) {
                        destination = '/viewloanaccount/'+data.loanId;
                    } else if ( data.savingsId) {
                        destination = '/viewsavingaccount/' + data.savingsId;
                    } else if ( data.clientId) {
                        destination = '/viewclient/'+data.clientId;
                    } else if ( data.groupId) {
                        if (scope.isCenter) {
                            destination = '/viewcenter/'+data.groupId;
                        } else {
                            destination = '/viewgroup/'+data.groupId;
                        }
                    } else if ( data.officeId) {
                        destination = '/viewoffice/'+data.officeId;
                    }
                    location.path(destination);
                });
            };

        }
    });
    mifosX.ng.application.controller('MakeDataTableEntryController', ['$scope', '$location', '$routeParams', 'ResourceFactory', 'dateFilter', mifosX.controllers.MakeDataTableEntryController]).run(function($log) {
        $log.info("MakeDataTableEntryController initialized");
    });
}(mifosX.controllers || {}));
