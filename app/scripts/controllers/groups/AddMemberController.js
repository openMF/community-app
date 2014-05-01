(function (module) {
    mifosX.controllers = _.extend(module, {
        AddMemberController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.first = {};
            scope.restrictDate = new Date();
            scope.first.date = new Date();
            scope.formData = {};

            if (routeParams.groupId) {
                scope.groupId = routeParams.groupId;
            }
            resourceFactory.clientTemplateResource.get({officeId: routeParams.officeId}, function (data) {
                scope.clientTemplate = data;
                scope.savingproducts = data.savingProductOptions;
                scope.genderOptions = data.genderOptions;
                if (data.savingProductOptions.length > 0) {
                    scope.showSavingOptions = true;
                }
            });
            scope.setChoice = function () {
                if (this.formData.active) {
                    scope.choice = 1;
                }
                else if (!this.formData.active) {
                    scope.choice = 0;
                }
            };
            scope.submit = function () {
                this.formData.dateFormat = scope.df;
                this.formData.locale = scope.optlang.code;
                if (scope.first.date) {
                    var reqDate = dateFilter(scope.first.date, scope.df);
                    this.formData.activationDate = reqDate;
                }
                if (scope.first.submitondate) {
                    reqDate = dateFilter(scope.first.submitondate, scope.df);
                    this.formData.submittedOnDate = reqDate;
                }
                this.formData.active = this.formData.active || false;
                this.formData.groupId = routeParams.groupId;
                this.formData.officeId = routeParams.officeId;
                resourceFactory.clientResource.save(this.formData, function (data) {
                    location.path('/viewgroup/' + data.groupId);
                });
            };

        }
    });
    mifosX.ng.application.controller('AddMemberController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.AddMemberController]).run(function ($log) {
        $log.info("AddMemberController initialized");
    });
}(mifosX.controllers || {}));
