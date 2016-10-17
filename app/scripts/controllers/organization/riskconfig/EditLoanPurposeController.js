(function (module) {
    mifosX.controllers = _.extend(module, {
        EditLoanPurposeController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            scope.entityType = routeParams.entityType;
            scope.formData = {};
            scope.loanPurposeGroupDatas = [];
            scope.categoryOptions = [];
            scope.classificationOptions = [];

            resourceFactory.loanPurposesTemplate.get(function (data) {
                scope.loanPurposeGroupDatas = data.loanPurposeGroupDatas;
                for (var i = 0; i < scope.loanPurposeGroupDatas.length; i++) {
                    if (scope.loanPurposeGroupDatas[i].loanPurposeGroupType.name === "Grouping") {
                        scope.categoryOptions.push(scope.loanPurposeGroupDatas[i]);
                    }
                    if (scope.loanPurposeGroupDatas[i].loanPurposeGroupType.name === "Consumption") {
                        scope.classificationOptions.push(scope.loanPurposeGroupDatas[i]);
                    }
                }

                resourceFactory.loanPurposeResource.get({loanPurposeId: routeParams.id, isFetchLoanPurposeGroupDatas: true},
                    function (data) {
                        scope.formData = data;
                        for (var i = 0; i < scope.loanPurposeGroupDatas.length; i++) {
                            if (scope.loanPurposeGroupDatas[i].loanPurposeGroupType.name === "Grouping") {
                                scope.categoryId = scope.loanPurposeGroupDatas[i].id;
                            }
                            if (scope.loanPurposeGroupDatas[i].loanPurposeGroupType.name === "Consumption") {
                                scope.classificationId = scope.loanPurposeGroupDatas[i].id;
                            }
                        }
                        delete scope.formData.loanPurposeGroupDatas;

                    });
            });

            scope.submit = function () {
                scope.formData.locale = "en";
                scope.formData.loanPurposeGroupIds = [];

                if (scope.formData) {
                    delete scope.formData.id;
                }
                if (scope.categoryId != null && !angular.isUndefined(scope.categoryId)) {
                    scope.formData.loanPurposeGroupIds.push(scope.categoryId);
                }
                if (scope.classificationId != null && !angular.isUndefined(scope.classificationId)) {
                    scope.formData.loanPurposeGroupIds.push(scope.classificationId);
                }

                if (scope.formData.loanPurposeGroupIds.length == 0) {
                    delete scope.formData.loanPurposeGroupIds;
                }
                if (scope.formData.shortName != "") {
                    delete scope.formData.shortName;
                }

                resourceFactory.loanPurposeResource.update({loanPurposeId: routeParams.id},
                    scope.formData, function (data) {
                        location.path('/loanpurpose/');
                    });
            };
        }
    });
    mifosX.ng.application.controller('EditLoanPurposeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.EditLoanPurposeController]).run(function ($log) {
        $log.info("EditLoanPurposeController initialized");
    });
}(mifosX.controllers || {}));
