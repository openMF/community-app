(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateLoanPurposeController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            scope.entityType = routeParams.entityType;
            scope.entityId = routeParams.entityId;
            scope.formData = {};
            scope.formData.isActive = true;
            scope.formData.loanPurposeGroupIds = [];
            scope.loanPurposeGroupDatas = [];
            scope.categoryOptions = [];
            scope.classificationOptions = [];
            scope.typeOptions = [];
            scope.loanPurposeGroupTypeOptions = [];

            if(scope.entityId != undefined) {
                resourceFactory.loanPurposeGroupResource.get({
                    loanPurposeGroupsId: scope.entityId,
                    isFetchLoanPurposeDatas: false
                }, function (data) {
                    scope.loanPurposeGroupData = data;
                    if(data.loanPurposeGroupType.name == "Grouping"){
                        scope.categoryId = scope.entityId;
                    } else if(data.loanPurposeGroupType.name == "Consumption"){
                        scope.classificationId = scope.entityId;
                    }
                });
            } else {
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
                });

            }

            scope.submit = function () {
                scope.formData.locale = "en";
                if (scope.categoryId != null) {
                    scope.formData.loanPurposeGroupIds.push(scope.categoryId);
                }
                if (scope.classificationId != null) {
                    scope.formData.loanPurposeGroupIds.push(scope.classificationId);
                }
                if (scope.formData.loanPurposeGroupIds.length) {
                    delete scope.formData.loanPurposeGroupIds;
                }
                resourceFactory.loanPurposeResource.save(scope.formData, function (data) {
                    location.path('/loanpurpose');
                });
            }

        }
    });
    mifosX.ng.application.controller('CreateLoanPurposeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.CreateLoanPurposeController]).run(function ($log) {
        $log.info("CreateLoanPurposeController initialized");
    });

}(mifosX.controllers || {}));