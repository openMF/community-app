(function (module) {
    mifosX.services = _.extend(module, {

        EntityDatatableFactoryProvider: function (resourceFactory) {

            var entityDatatableChecks = [];
            var submitStatus = [];
            var entityformData = {datatables:{}};
            var isEntityDatatables;

            var RequestEntities =  function(entity, status, productId) {
                resourceFactory.entityDatatableChecksResource.getAll({limit: -1}, function (response) {
                    entityDatatableChecks = _.filter(response.pageItems, function (datatable) {
                        var specificProduct = (datatable.entity == entity && datatable.status.value == status && datatable.productId == productId);
                        var AllProducts = (datatable.entity == entity && datatable.status.value == status);
                        return (datatable.productId ? specificProduct : AllProducts);
                    });
                    entityDatatableChecks = _.pluck(entityDatatableChecks, 'datatableName');
                    var datatables = [];
                    var k = 0;
                    _.each(entityDatatableChecks, function (entitytable) {
                        resourceFactory.DataTablesResource.getTableDetails({
                            datatablename: entitytable,
                            entityId: routeParams.id,
                            genericResultSet: 'true'
                        }, function (data) {
                            data.registeredTableName = entitytable;
                            var colName = data.columnHeaders[0].columnName;
                            if (colName == 'id') {
                                data.columnHeaders.splice(0, 1);
                            }

                            colName = data.columnHeaders[0].columnName;
                            if (colName == 'client_id' || colName == 'office_id' || colName == 'group_id' || colName == 'center_id' || colName == 'loan_id' || colName == 'savings_account_id') {
                                data.columnHeaders.splice(0, 1);
                                // .scopeisCenter = (colName == 'center_id') ? true : false;
                            }


                            data.noData = (data.data.length == 0);
                            if (data.noData) {
                                datatables.push(data);
                                entityformData.datatables[k] = {data: {}};
                                submitStatus[k] = "save";
                                _.each(data.columnHeaders, function (Header) {
                                    entityformData.datatables[k].data[Header.columnName] = "";
                                });
                                k++;
                                isEntityDatatables = true;
                            }
                        });


                    });

                    return{
                        entityDatatableChecks:entityDatatableChecks,
                        submitStatus:submitStatus,
                        entityformData:entityformData,
                        isEntityDatatables:isEntityDatatables
                    }

                });
            };

            return{
                RequestEntities: RequestEntities
            }
        }

    });

            mifosX.ng.services.service('EntityDatatableFactory', ['ResourceFactory',mifosX.services.EntityDatatableFactoryProvider]).run(function ($log) {
        $log.info("EntityDatatableFactoryProvider initialized");
    });

}(mifosX.services || {}));