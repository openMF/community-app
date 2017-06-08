(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSmsCampaignController: function (scope, routeParams, location, resourceFactory, $uibModal, dateFilter, route, paginatorService) {
            scope.tabsList = [{id: 'pending', name: 'Pending SMS', status: 100}, {id: 'waiting', name: 'Waiting for Delivery Report', status: 150}, {id: 'sent', name: 'Sent SMS', status: 200}, {id: 'delivered', name: 'Delivered SMS', status: 300}, {id: 'failed', name: 'Failed SMS', status: 400}];
            scope.smsList = [];
            scope.formData = {};
            scope.smsPerPage = 15;
            resourceFactory.smsCampaignResource.get({campaignId: routeParams.campaignId}, function (data) {
                scope.campaignData = data;
            });

            scope.resetSMSList = function() {
                scope.smsList = [];
            }

            scope.activateSmsCampaign = function () {
                $uibModal.open({
                    templateUrl: 'activatesmscampaign.html',
                    controller: SmsCampaignActivationCtrl
                });
            };

            var fetchFunction = function (offset, limit) {
                var params = {};
                params.status = scope.selectedStatus;
                params.offset = offset;
                params.limit = limit;
                params.locale = scope.optlang.code;
                params.dateFormat = scope.df;
                params.campaignId = routeParams.campaignId;

                if (scope.formData.fromDate) {
                    var reqFirstDate = dateFilter(scope.formData.fromDate, scope.df);
                    params.fromDate = reqFirstDate;
                }

                if (scope.formData.toDate) {
                    var reqSecondDate = dateFilter(scope.formData.toDate, scope.df);
                    params.toDate = reqSecondDate;
                }
                scope.formParams = params;

                resourceFactory.smsResource.getByStatus(params, function(data) {
                    scope.smsList = data.pageItems;
                    scope.totalSMS = data.totalFilteredRecords;
                });

            };

            scope.getResultsPage = function (pageNumber) {
                scope.formParams.offset = ((pageNumber - 1) * scope.smsPerPage);
                scope.formParams.limit = scope.smsPerPage;
                resourceFactory.smsResource.getByStatus(scope.formParams, function (data) {
                    scope.smsList = data.pageItems;
                });
            }

            scope.fetchSMSByStatus = function (status) {
                scope.selectedStatus = status;
                paginatorService.paginate(fetchFunction, scope.smsPerPage);
            };

            var SmsCampaignActivationCtrl = function ($scope, $uibModalInstance) {
                //$scope.data = {activationDate: scope.activationDate};
                $scope.activate = function () {
                    //$scope.activationDate = scope.activationDate;
                    $scope.activationData = {activationDate: dateFilter($scope.activationDate, scope.df), dateFormat: scope.df, locale: scope.optlang.code}
                    resourceFactory.smsCampaignResource.withCommand({campaignId: routeParams.campaignId, command: 'activate'}, $scope.activationData, function (data) {
                        $uibModalInstance.close('activate');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.closeSmsCampaign = function () {
                $uibModal.open({
                    templateUrl: 'closesmscampaign.html',
                    controller: SmsCampaignCloseCtrl
                });
            };

            var SmsCampaignCloseCtrl = function ($scope, $uibModalInstance) {
                $scope.closeSms = function () {
                    $scope.closureData = {closureDate: dateFilter($scope.closureDate, scope.df), dateFormat: scope.df, locale: scope.optlang.code}
                    resourceFactory.smsCampaignResource.withCommand({campaignId: routeParams.campaignId, command: 'close'}, $scope.closureData, function (data) {
                        $uibModalInstance.close('close');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.reActivateSmsCampaign = function () {
                $uibModal.open({
                    templateUrl: 'reactivatesmscampaign.html',
                    controller: SmsCampaignReActivateCtrl
                });
            };

            var SmsCampaignReActivateCtrl = function ($scope, $uibModalInstance) {
                $scope.reactivate = function () {
                    $scope.reActivationData = {activationDate: dateFilter($scope.activationDate, scope.df), dateFormat: scope.df, locale: scope.optlang.code}
                    resourceFactory.smsCampaignResource.withCommand({campaignId: routeParams.campaignId, command: 'reactivate'}, $scope.reActivationData, function (data) {
                        $uibModalInstance.close('reactivate');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.deleteSmsCampaign = function () {
                $uibModal.open({
                    templateUrl: 'deletesmscampaign.html',
                    controller: SmsCampaignDeleteCtrl
                });
            };

            var SmsCampaignDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.smsCampaignResource.delete({campaignId: routeParams.campaignId}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/smscampaigns');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ViewSmsCampaignController', ['$scope', '$routeParams', '$location', 'ResourceFactory', '$uibModal', 'dateFilter', '$route', 'PaginatorService', mifosX.controllers.ViewSmsCampaignController]).run(function ($log) {
        $log.info("ViewSmsCampaignController initialized");
    });
}(mifosX.controllers || {}));
