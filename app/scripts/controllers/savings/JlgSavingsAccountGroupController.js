(function (module) {
    mifosX.controllers = _.extend(module, {
        JlgSavingsAccountGroupController: function (scope, resourceFactory, location, routeParams, dateFilter, $rootScope) {
            scope.products = [];
            scope.restrictDate = new Date();
            scope.groupId = routeParams.groupId;
            scope.groupOfficeId = $rootScope.groupOfficeId;
            scope.groupOfficeName = $rootScope.groupOfficeName;
            scope.groupName = $rootScope.groupName;
            scope.date = {};

            scope.date.submittedOnDate = new Date();

            scope.inparams = {};

            if (scope.groupId) {
                scope.inparams.groupId = scope.groupId
            }
            ;

            resourceFactory.groupResource.get({
                groupId: scope.groupId,
                associations: 'activeClientMembers'
            }, function (data) {
                scope.groups = data.activeClientMembers;
                scope.groupname = data.name;
            });

            scope.inparams.staffInSelectedOfficeOnly = true;

            resourceFactory.savingsTemplateResource.get(scope.inparams, function (data) {
                scope.products = data.productOptions;

            });

            scope.changeProduct = function (productid) {
                resourceFactory.savingsTemplateResource.get({
                    groupId: scope.groupId,
                    productId: productid,
                    staffInSelectedOfficeOnly: 'true'
                }, function (data) {
                    scope.fieldOfficers = data.fieldOfficerOptions;
                });
            }
            scope.selectAll = function () {
                for (var i = 0; i < scope.groups.length; i++) {
                    scope.groups[i].ischecked = true;
                }
            };

            scope.submit = function () {
                this.batchRequests = [];
                this.formData = {};
                this.formData.clientDetails = [];
                for (var i = 0; i < scope.groups.length; i++) {
                    if (scope.groups[i].ischecked) {
                        var savingsApplication = {};
                        savingsApplication.clientId = scope.groups[i].id;
                        savingsApplication.date = dateFilter(scope.date.submittedOnDate, scope.df);
                        if (scope.isactivate) {
                            savingsApplication.active = true;
                        } else {
                            savingsApplication.active = false;
                        }
                        savingsApplication.fieldOfficerId = scope.fieldOfficer;
                        savingsApplication.locale = scope.optlang.code;
                        savingsApplication.dateFormat = scope.df;
                        savingsApplication.productId = scope.productId;
                        this.batchRequests.push({
                            requestId: i, relativeUrl: "savingsaccounts?command=defaultValues",
                            method: "POST", body: JSON.stringify(savingsApplication)
                        });
                    }

                }
                resourceFactory.batchResource.post(this.batchRequests, function (data) {

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].statusCode == 200)
                            scope.response.success.push(data[i]);
                        else
                            scope.response.failed.push(data[i]);

                    }

                    if (scope.response.failed.length === 0) {
                        location.path('/viewgroup/' + scope.groupId);
                    }

                });

                location.path('/viewgroup/' + scope.groupId);
            };
            scope.cancel = function () {
                if (scope.centerId) {
                    location.path('/viewgroup/' + scope.groupId);
                }
            };
        }
    });
    mifosX.ng.application.controller('JlgSavingsAccountGroupController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', '$rootScope', mifosX.controllers.JlgSavingsAccountGroupController]).run(function ($log) {
        $log.info("JlgSavingsAccountGroupController initialized");
    });
}(mifosX.controllers || {}));