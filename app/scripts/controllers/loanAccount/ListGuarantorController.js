(function (module) {
    mifosX.controllers = _.extend(module, {
        ListGuarantorController: function (scope, routeParams, resourceFactory, location, route, http, $modal, dateFilter, API_VERSION, $sce, $rootScope) {

            scope.modified = 0;
            resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.id, associations: 'guarantors'}, function (data) {
                scope.loandetails = data;
                scope.guarantorDetails = data.guarantors;
                scope.status = data.status.value;
                scope.decimals = data.currency.decimalPlaces;
                scope.changedDetail = [];
                scope.hideDeletedGuarantors=true;
                scope.hideWithDrawnGuarantors=true;
                scope.isHideDeletedGuarantorsCheckboxChecked = true;
                scope.updateCheckBoxStatus = function (){
                    scope.isHideDeletedGuarantorsCheckboxChecked = !scope.isHideDeletedGuarantorsCheckboxChecked;
                };
            });


            scope.showDetails = function (parentindex, index) {
                scope.guarantorData = scope.guarantorDetails[parentindex];
                if (index == null) {
                    scope.guarantorFundDetail = null;
                } else {
                    scope.guarantorFundDetail = scope.guarantorData.guarantorFundingDetails[index];
                }

                $modal.open({
                    templateUrl: 'viewguarantor.html',
                    controller: GuarantorViewCtrl,
                    resolve: {
                        guarantorFundDetail: function () {
                            return scope.guarantorFundDetail;
                        },
                        guarantorData: function () {
                            return scope.guarantorData;
                        }
                    }
                });
            };


            var GuarantorViewCtrl = function ($scope, $modalInstance, guarantorData, guarantorFundDetail) {
                $scope.guarantorFundDetail = guarantorFundDetail;
                $scope.guarantorData = guarantorData;
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };


            scope.deleteGuarantor = function (id,fundId) {
                scope.guarantorId = id;
                scope.guarantorFundId = fundId;
                $modal.open({
                    templateUrl: 'deleteguarantor.html',
                    controller: GuarantorDeleteCtrl,
                    resolve: {
                        id: function () {
                            return scope.guarantorId;
                        },
                        fundId: function () {
                            return scope.guarantorFundId;
                        }
                    }
                });
            };
            var GuarantorDeleteCtrl = function ($scope, $modalInstance, id, fundId) {
                $scope.delete = function () {
                    resourceFactory.guarantorResource.delete({loanId: routeParams.id, templateResource: id,guarantorFundingId:fundId}, {}, function (data) {
                        $modalInstance.close('delete');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ListGuarantorController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$route', '$http', '$modal', 'dateFilter', 'API_VERSION', '$sce', '$rootScope', mifosX.controllers.ListGuarantorController]).run(function ($log) {
        $log.info("ListGuarantorController initialized");
    });
}(mifosX.controllers || {}));
