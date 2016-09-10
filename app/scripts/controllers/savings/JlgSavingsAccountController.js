(function (module) {
    mifosX.controllers = _.extend(module, {
        JlgSavingsAccountController: function (scope, resourceFactory, location, routeParams, dateFilter, $rootScope) {
            scope.centerId = routeParams.centerId;
            scope.officeId = $rootScope.officeId;
            scope.officeName = $rootScope.officeName;
            scope.centerName = $rootScope.centerName;
            scope.date = {};
            scope.inparams = {};
            scope.date.submittedOnDate = new Date();
            if (scope.centerId) {
                scope.inparams.centerId = scope.centerId

            }
            ;
            resourceFactory.centerClientResource.get({centerId: scope.centerId}, function (data) {
                scope.groups = data.groupMembers;
            });

            scope.inparams.staffInSelectedOfficeOnly = true;

            resourceFactory.savingsTemplateResource.get(scope.inparams, function (data) {
                scope.products = data.productOptions;
            });

            scope.changeProduct = function (productid) {
                resourceFactory.savingsTemplateResource.get({
                    groupId: scope.centerId,
                    productId: productid,
                    staffInSelectedOfficeOnly: 'true'
                }, function (data) {
                    scope.fieldOfficers = data.fieldOfficerOptions;
                });
            }

            scope.checkAll = function (group) {
                for (var i = 0; i < group.activeClientMembers.length; i++) {
                    group.activeClientMembers[i].ischecked = true;
                }
            }

            scope.submit = function () {
                this.batchRequests = [];
                this.formData = {};
                this.formData.clientDetails = [];
                for (var j = 0; j < scope.groups.length; j++) {
                    for (var i = 0; i < scope.groups[j].activeClientMembers.length; i++) {
                        if (scope.groups[j].activeClientMembers[i].ischecked) {

                            var savingsApplication = {};
                            savingsApplication.clientId = scope.groups[j].activeClientMembers[i].id;
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
                }
                resourceFactory.batchResource.post(this.batchRequests, function (data) {

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].statusCode == 200)
                            scope.response.success.push(data[i]);
                        else
                            scope.response.failed.push(data[i]);

                    }

                    if (scope.response.failed.length === 0) {
                        location.path('/viewcenter/' + scope.centerId);
                    }

                });

                location.path('/viewcenter/' + scope.centerId);
            };

            scope.cancel = function () {
                if (scope.centerId) {
                    location.path('/viewcenter/' + scope.centerId);
                }
            };

        }

    });
    mifosX.ng.application.controller('JlgSavingsAccountController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', '$rootScope', mifosX.controllers.JlgSavingsAccountController]).run(function ($log) {
        $log.info("JlgSavingsAccountController initialized");
    });
}(mifosX.controllers || {}));