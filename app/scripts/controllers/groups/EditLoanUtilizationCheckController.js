(function (module) {
    mifosX.controllers = _.extend(module, {
        EditLoanUtilizationCheckController: function (scope, routeParams, resourceFactory, location, $modal, route, dateFilter) {

            scope.entityType = routeParams.entityType;
            scope.entityId = routeParams.entityId;
            scope.loanId = routeParams.loanId;
            scope.utilizationCheckId = routeParams.utilizationCheckId;
            scope.utilizationData = {};
            scope.utilizationData.utilizationDetails = [];
            scope.loanUtilizationCheckDetails = [];

            scope.formData = {};
            scope.formData.loanUtilizationCheckDetails = {};
            scope.formData.loanUtilizationCheckDetails.utilizationDetails = [];

            if (scope.entityType === "center") {
                resourceFactory.loanPurposeResource.getAll(function (data) {
                    scope.loanPurposes = data;
                    if (scope.loanPurposes) {
                        resourceFactory.loanUtilizationCheck.get({
                            loanId: scope.loanId,
                            utilizationCheckId: scope.utilizationCheckId
                        }, function (data) {
                            scope.loanCenterTemplate = data;
                            scope.loanUtilizationCheckDatas = data.loanUtilizationCheckDetailData;
                            scope.formData.auditDoneOn = dateFilter(new Date(data.auditDoneOn), scope.df);
                        });
                    }
                });
            }
            ;
            if (scope.entityType === "group") {
                resourceFactory.loanPurposeResource.getAll(function (data) {
                    scope.loanPurposes = data;
                    if (scope.loanPurposes) {
                        resourceFactory.loanUtilizationCheck.get({
                            loanId: scope.loanId,
                            utilizationCheckId: scope.utilizationCheckId
                        }, function (data) {
                            scope.loanCenterTemplate = data;
                            scope.loanUtilizationCheckDatas = data.loanUtilizationCheckDetailData;
                            scope.formData.auditDoneOn = dateFilter(new Date(data.auditDoneOn), "dd MMMM yyyy");
                        });
                    }
                });
            }

            scope.addLoanPurpose = function (parentIndex) {
                if (scope.loanUtilizationCheckDatas[parentIndex] && angular.isUndefined(scope.loanUtilizationCheckDatas[parentIndex])) {
                    scope.loanUtilizationCheckDetail[parentIndex] = {};
                }
                scope.loanUtilizationCheckDatas[parentIndex].loanId = scope.loanUtilizationCheckDatas[parentIndex].loanId;
                if (angular.isUndefined(scope.loanUtilizationCheckDatas[parentIndex].utilizationDetailsDatas)) {
                    scope.loanUtilizationCheckDatas[parentIndex].utilizationDetailsDatas = [];
                }
                scope.loanUtilizationCheckDatas[parentIndex].utilizationDetailsDatas.push({});
            };

            scope.deleteLoanPurpose = function (parentIndex, index) {
                if (scope.loanUtilizationCheckDatas[parentIndex] && !angular.isUndefined(scope.loanUtilizationCheckDatas[parentIndex])) {
                    if (!angular.isUndefined(scope.loanUtilizationCheckDatas[parentIndex].utilizationDetailsDatas)) {
                        if (!angular.isUndefined(scope.loanUtilizationCheckDatas[parentIndex].utilizationDetailsDatas[index])) {
                            scope.loanUtilizationCheckDatas[parentIndex].utilizationDetailsDatas.splice(index, 1);
                            if (!angular.isUndefined(scope.loanUtilizationCheckDatas[parentIndex].utilizationDetailsDatas)) {
                                if (scope.loanUtilizationCheckDatas[parentIndex].length == 0) {
                                    delete scope.loanUtilizationCheckDatas[parentIndex];
                                }
                            }
                        }
                    }
                }
            };

            scope.percentail = function (parentIndex, index) {
                if (scope.loanUtilizationCheckDatas[parentIndex] && !angular.isUndefined(scope.loanUtilizationCheckDatas[parentIndex])) {
                    if (!angular.isUndefined(scope.loanUtilizationCheckDatas[parentIndex].utilizationDetailsDatas)) {
                        if (!angular.isUndefined(scope.loanUtilizationCheckDatas[parentIndex].utilizationDetailsDatas[index].amount)) {
                            var principalAmount = scope.loanUtilizationCheckDatas[parentIndex].principalAmount;
                            var uamount = scope.loanUtilizationCheckDatas[parentIndex].utilizationDetailsDatas[index].amount;
                            var percentailOfUsage = parseFloat(parseFloat(uamount) / parseFloat(principalAmount) * 100.00);
                            scope.loanUtilizationCheckDatas[parentIndex].utilizationDetailsDatas[index].percentailOfUsage = percentailOfUsage;
                        }
                    }
                }
            };

            scope.checkLoanPurpose = function (parentIndex, index) {
                if (scope.loanUtilizationCheckDatas[parentIndex] && !angular.isUndefined(scope.loanUtilizationCheckDatas[parentIndex])) {
                    if (!angular.isUndefined(scope.loanUtilizationCheckDatas[parentIndex].utilizationDetailsDatas)) {
                        if (!angular.isUndefined(scope.loanUtilizationCheckDatas[parentIndex].utilizationDetailsDatas[index].loanPurposeData)) {
                            var loanPurposeId = scope.loanUtilizationCheckDatas[parentIndex].utilizationDetailsDatas[index].loanPurposeData.id;
                            var isSameAsOriginalPurpose = false;
                            if (loanPurposeId == scope.loanUtilizationCheckDatas[parentIndex].utilizationDetailsDatas[index].loanPurposeData.id) {
                                isSameAsOriginalPurpose = true;
                            }
                            scope.loanUtilizationCheckDatas[parentIndex].utilizationDetailsDatas[index].loanPurposeData.isSameAsOriginalPurpose = isSameAsOriginalPurpose;
                        }
                    }
                }
            };

            scope.submit = function () {
                scope.formData.auditDoneById = scope.currentSession.user.userId;
                scope.formData.auditDoneOn = dateFilter(new Date(scope.formData.auditDoneOn), scope.df);
                scope.formData.loanUtilizationCheckDetails = [];
                for(var i = 0; i < scope.loanUtilizationCheckDatas.length; i++){
                    if(scope.loanUtilizationCheckDatas[i]){
                        var loanUtilizationCheckDataObj = scope.loanUtilizationCheckDatas[i];
                        var loanUtilizationCheckData = {};
                        loanUtilizationCheckData.loanId = loanUtilizationCheckDataObj.loanId;
                        if(loanUtilizationCheckDataObj.utilizationDetailsDatas != undefined && loanUtilizationCheckDataObj.utilizationDetailsDatas.length > 0){
                            loanUtilizationCheckData.utilizationDetails = [];
                            for(var j = 0; j < loanUtilizationCheckDataObj.utilizationDetailsDatas.length; j++){
                                var utilizationDetailsData = {};
                                var utilizationDetailsDataObj = loanUtilizationCheckDataObj.utilizationDetailsDatas[j];
                                utilizationDetailsData.loanPurposeId = utilizationDetailsDataObj.loanPurposeData.id;
                                utilizationDetailsData.isSameAsOriginalPurpose = utilizationDetailsDataObj.isSameAsOroginalPurpose;
                                if(utilizationDetailsDataObj.amount){
                                    utilizationDetailsData.amount = utilizationDetailsDataObj.amount;
                                    delete utilizationDetailsDataObj.percentailOfUsage;
                                }
                                utilizationDetailsData.comment = utilizationDetailsDataObj.comment;
                                loanUtilizationCheckData.utilizationDetails.push(utilizationDetailsData);
                            }
                        }
                        scope.formData.loanUtilizationCheckDetails.push(loanUtilizationCheckData);
                    }
                }
                scope.formData.locale = scope.optlang.code;
                scope.formData.dateFormat = scope.df;

                if (scope.entityType === "center") {
                    resourceFactory.loanUtilizationCheck.update({
                        loanId: scope.loanId,
                        utilizationCheckId: scope.utilizationCheckId
                    }, scope.formData, function (data) {
                        location.path('/viewcenter/' + scope.entityId);
                    });
                }
                if (scope.entityType === "group") {
                    resourceFactory.loanUtilizationCheck.update({
                        loanId: scope.loanId,
                        utilizationCheckId: scope.utilizationCheckId
                    }, scope.formData, function (data) {
                        location.path('/group/' + scope.entityId + '/listgrouploanutillization/');
                    });
                }
            };
        }
    });
    mifosX.ng.application.controller('EditLoanUtilizationCheckController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', 'dateFilter', mifosX.controllers.EditLoanUtilizationCheckController]).run(function ($log) {
        $log.info("EditLoanUtilizationCheckController initialized");
    });

}(mifosX.controllers || {}));