(function (module) {
    mifosX.controllers = _.extend(module, {
        EntityDatatableChecksController: function (scope, resourceFactory, location, dateFilter, translate, $uibModal, route) {
            scope.template = [];
            scope.formData = {};
            scope.first = {};
            scope.isCollapsed = true;
            scope.showdatefield = false;
            scope.repeatEvery = false;
            scope.first.date = new Date();
            scope.translate = translate;
            scope.criterias = [];
            scope.entityDatatableChecksPerPage = 15;
            scope.entityDatatableChecks = [];
            scope.formParams = {};
            scope.formParams.offset = 0;
            scope.formParams.limit = scope.entityDatatableChecksPerPage;

            scope.routeTo = function (id) {
                location.path('/viewentitydatatablecheck/' + id);
            };

            if (!scope.searchCriteria.criterias) {
                scope.searchCriteria.criterias = null;
                scope.saveSC();
            }

            scope.getResultsPage = function (pageNumber) {
                scope.formParams.offset = ((pageNumber - 1) * scope.entityDatatableChecksPerPage);
                scope.formParams.limit = scope.entityDatatableChecksPerPage;
                resourceFactory.entityDatatableChecksResource.getAll(scope.formParams, function (data) {
                    scope.entityDatatableChecks = data.pageItems;
                    scope.totalEntityDatatableChecks = data.totalFilteredRecords;
                });
            }

            scope.initPage = function () {
                resourceFactory.entityDatatableChecksResource.getAll(scope.formParams, function (data) {
                    scope.entityDatatableChecks = data.pageItems;
                    scope.totalEntityDatatableChecks = data.totalFilteredRecords;
                });
            }

            scope.initPage();

            scope.filterText = scope.searchCriteria.criterias || '';

            scope.onFilter = function () {
                scope.searchCriteria.criterias = scope.filterText;
                scope.saveSC();
            };

            scope.createDatatableCheck = function () {
                $uibModal.open({
                    templateUrl: 'createentitydatatablecheck.html',
                    controller: CreateDataTableCheckCtrl
                });
            };

            var CreateDataTableCheckCtrl = function ($scope, $uibModalInstance) {
                $scope.checkForm = {};
                $scope.templateData = {};
                $scope.entities = [];
                $scope.statusList = [];
                $scope.statusClient = [];
                $scope.statusGroup = [];
                $scope.statusSavings = [];
                $scope.statusLoans = [];
                $scope.datatables = [];
                $scope.products = [];
                $scope.loanProductDatas = [];
                $scope.savingsProductDatas = [];
                $scope.filteredDatatables = [];

                resourceFactory.entityDatatableChecksResource.get({additionalParam: 'template'}, function (data) {
                    $scope.templateData = data;
                    $scope.entities = data.entities;
                    $scope.statusClient = data.statusClient;
                    $scope.statusGroup = data.statusGroup;
                    $scope.statusSavings = data.statusSavings;
                    $scope.statusLoans = data.statusLoans;
                    $scope.datatables = data.datatables;
                    $scope.loanProductDatas = data.loanProductDatas;
                    $scope.savingsProductDatas = data.savingsProductDatas;
                });

                $scope.create = function () {
                    //$scope.formData = {};
                    resourceFactory.entityDatatableChecksResource.save($scope.checkForm, function (data) {
                        $uibModalInstance.close('create');
                        route.reload();
                    });
                };

                $scope.filterByEntity = function() {
                    $scope.filteredDatatables = [];
                    angular.forEach($scope.datatables, function (datatable) {
                        if (!_.isNull(datatable.entity) && !_.isUndefined(datatable.entity) && datatable.entity === $scope.checkForm.entity) {
                            $scope.filteredDatatables.push(datatable);
                        }
                    });
                };

                $scope.updateDependencies = function () {
                    $scope.filterByEntity();
                    if ($scope.checkForm.entity === 'm_client') {
                        $scope.statusList = $scope.statusClient;
                        $scope.products = [];
                    } else if ($scope.checkForm.entity === 'm_loan') {
                        $scope.statusList = $scope.statusLoans;
                        $scope.products = $scope.loanProductDatas;
                    } else if ($scope.checkForm.entity === 'm_group') {
                        $scope.statusList = $scope.statusGroup;
                        $scope.products = [];
                    } else if ($scope.checkForm.entity === 'm_savings_account') {
                        $scope.statusList = $scope.statusSavings;
                        $scope.products = $scope.savingsProductDatas;
                    } else {
                        $scope.statusList = [];
                        $scope.products = [];
                    }
                }

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.deleteDataTableCheck = function (id) {
                $uibModal.open({
                    templateUrl: 'deleteentitydatatablecheck.html',
                    controller: DeleteDataTableCheckCtrl,
                    resolve: {
                        entityDatatableCheckId: function () {
                            return id;
                        }
                    }
                });
            };

            var DeleteDataTableCheckCtrl = function ($scope, $uibModalInstance, entityDatatableCheckId) {
                $scope.delete = function () {
                    resourceFactory.entityDatatableChecksResource.delete({entityDatatableCheckId: entityDatatableCheckId}, function (data) {
                        $uibModalInstance.close('delete');
                        route.reload();
                    });
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }
        }
    });
    mifosX.ng.application.controller('EntityDatatableChecksController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$translate', '$uibModal', '$route', mifosX.controllers.EntityDatatableChecksController]).run(function ($log) {
        $log.info("EntityDatatableChecksController initialized");
    });
}(mifosX.controllers || {}));
