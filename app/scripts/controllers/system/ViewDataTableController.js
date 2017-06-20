(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewDataTableController: function (scope, routeParams, resourceFactory, location, $uibModal) {

            resourceFactory.DataTablesResource.getTableDetails({datatablename: routeParams.tableName}, function (data) {

                var temp = [];
                var colName = data.columnHeaderData[0].columnName;
                if (colName == 'id') {
                    data.columnHeaderData.splice(0, 1);
                }
                colName = data.columnHeaderData[0].columnName;
                if (colName == 'client_id' || colName == 'office_id' || colName == 'group_id' || colName == 'center_id' || colName == 'loan_id' || colName == 'savings_account_id') {
                    data.columnHeaderData.splice(0, 1);
                }

                for (var i = 0; i < data.columnHeaderData.length; i++) {
                    if (data.columnHeaderData[i].columnName.indexOf("_cd_") > 0) {
                        temp = data.columnHeaderData[i].columnName.split("_cd_");
                        data.columnHeaderData[i].columnName = temp[1];
                        data.columnHeaderData[i].code = temp[0];
                    }
                }
                scope.datatable = data;
            });
            scope.deleteTable = function () {
                $uibModal.open({
                    templateUrl: 'deletetable.html',
                    controller: TableDeleteCtrl
                });
            };
            var TableDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.DataTablesResource.delete({datatablename: routeParams.tableName}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/datatables');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ViewDataTableController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', mifosX.controllers.ViewDataTableController]).run(function ($log) {
        $log.info("ViewDataTableController initialized");
    });
}(mifosX.controllers || {}));
