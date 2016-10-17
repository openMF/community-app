(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateCenterLoanUtilization: function (scope, routeParams, resourceFactory, location, $modal, route, dateFilter) {

            scope.entityType = routeParams.entityType;
            scope.entityId = routeParams.entityId;

            scope.formData = {};
            scope.formData.loanUtilizationCheckDetails = [];

            if (scope.entityType === "center") {
                resourceFactory.loanUtilizationCheckCenterTemplate.get({centerId: scope.entityId}, function (data) {
                    scope.originalLoanCenterTemplate = data;
                    scope.loanCenterTemplate = data;
                    if (scope.loanCenterTemplate != null && scope.loanCenterTemplate.length > 0) {
                        scope.loanPurposes = data[0].loanPurposeDatas;
                    }
                });
            }
            ;

            if (scope.entityType === "group") {
                resourceFactory.loanUtilizationCheckGroupTemplate.get({groupId: scope.entityId}, function (data) {
                    scope.originalLoanCenterTemplate = data;
                    scope.loanCenterTemplate = data;
                    if (scope.loanCenterTemplate != null && scope.loanCenterTemplate.length > 0) {
                        scope.loanPurposes = data[0].loanPurposeDatas;
                    }
                });
            }

            scope.addLoanPurpose = function (parentIndex) {
                if (scope.loanCenterTemplate[parentIndex] && angular.isUndefined(scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail)) {
                    scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail = {};
                }
                scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.loanId = scope.loanCenterTemplate[parentIndex].loanId;
                if (angular.isUndefined(scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.utilizationDetails)) {
                    scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.utilizationDetails = [];
                }
                scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.utilizationDetails.push({});
            };

            scope.deleteLoanPurpose = function (parentIndex, index) {
                if (scope.loanCenterTemplate[parentIndex] && !angular.isUndefined(scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail)) {
                    if (!angular.isUndefined(scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.utilizationDetails)) {
                        if (!angular.isUndefined(scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.utilizationDetails[index])) {
                            delete scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.utilizationDetails.splice(index, 1);
                            if (!angular.isUndefined(scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.utilizationDetails)) {
                                if (scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.utilizationDetails.length == 0) {
                                    delete scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail;
                                }
                            }
                        }
                    }
                }
            };

            scope.percentail = function (parentIndex, index) {
                if (scope.loanCenterTemplate[parentIndex] && !angular.isUndefined(scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail)) {
                    if (!angular.isUndefined(scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.utilizationDetails)) {
                        if (!angular.isUndefined(scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.utilizationDetails[index].amount)) {
                            var principalAmount = scope.loanCenterTemplate[parentIndex].principalAmount;
                            var uamount = scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.utilizationDetails[index].amount;
                            var percentailOfUsage = parseFloat(parseFloat(uamount) / parseFloat(principalAmount) * 100.00);
                            scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.utilizationDetails[index].percentailOfUsage = percentailOfUsage;
                        }
                    }
                }
            };

            scope.checkLoanPurpose = function (parentIndex, index) {
                if (scope.loanCenterTemplate[parentIndex] && !angular.isUndefined(scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail)) {
                    if (!angular.isUndefined(scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.utilizationDetails)) {
                        if (!angular.isUndefined(scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.utilizationDetails[index].loanPurposeId)) {
                            var loanPurposeId = scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.utilizationDetails[index].loanPurposeId;
                            var isSameAsOriginalPurpose = false;
                            if (loanPurposeId == scope.loanCenterTemplate[parentIndex].loanPurposeId) {
                                isSameAsOriginalPurpose = true;
                            }
                            scope.loanCenterTemplate[parentIndex].loanUtilizationCheckDetail.utilizationDetails[index].isSameAsOriginalPurpose = isSameAsOriginalPurpose;
                        }
                    }
                }
            };

            scope.submit = function () {
                scope.formData.auditDoneById = scope.currentSession.user.userId;
                scope.formData.auditDoneOn = dateFilter(scope.formData.auditDoneOn, scope.df);
                scope.submitData = [];
                angular.copy(scope.loanCenterTemplate, scope.submitData);
                for (var i in scope.submitData) {
                    if (scope.submitData[i].loanUtilizationCheckDetail && scope.submitData[i].loanUtilizationCheckDetail.utilizationDetails) {
                        for (var j in scope.submitData[i].loanUtilizationCheckDetail.utilizationDetails) {
                            if (scope.submitData[i].loanUtilizationCheckDetail.utilizationDetails[j].amount) {
                                delete scope.submitData[i].loanUtilizationCheckDetail.utilizationDetails[j].percentailOfUsage;
                                var loanUtilizationCheckDetail = scope.submitData[i].loanUtilizationCheckDetail;
                                scope.formData.loanUtilizationCheckDetails.push(loanUtilizationCheckDetail);
                                break;
                            }
                        }
                    }
                }
                scope.formData.locale = scope.optlang.code;
                scope.formData.dateFormat = scope.df;
                if (scope.entityType === "center") {
                    resourceFactory.centerLoanUtilizationCheck.save({centerId: scope.entityId}, scope.formData, function (data) {
                        location.path('/viewcenter/' + scope.entityId);
                    });
                }
                if (scope.entityType === "group") {
                    resourceFactory.groupLoanUtilizationCheck.save({groupId: scope.entityId}, scope.formData, function (data) {
                        location.path('/group/' + scope.entityId + '/listgrouploanutillization/');
                    });
                }
            };
        }
    });
    mifosX.ng.application.controller('CreateCenterLoanUtilization', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', 'dateFilter', mifosX.controllers.CreateCenterLoanUtilization]).run(function ($log) {
        $log.info("CreateCenterLoanUtilization initialized");
    });

}(mifosX.controllers || {}));