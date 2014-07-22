(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateClientController: function (scope, resourceFactory, location, http, dateFilter, API_VERSION, $upload, $rootScope, routeParams) {
            scope.offices = [];
            scope.staffs = [];
            scope.savingproducts = [];
            scope.first = {};
            scope.first.date = new Date();
			scope.first.submitondate = new Date ();
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.showSavingOptions = false;
            scope.opensavingsproduct = false;

            var requestParams = {staffInSelectedOfficeOnly:true};
            if (routeParams.groupId) {
                requestParams.groupId = routeParams.groupId;
            }
            if (routeParams.officeId) {
                requestParams.officeId = routeParams.officeId;
            }
            resourceFactory.clientTemplateResource.get(requestParams, function (data) {
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.formData.officeId = scope.offices[0].id;
                scope.savingproducts = data.savingProductOptions;
                scope.genderOptions = data.genderOptions;
                scope.clienttypeOptions = data.clientTypeOptions;
                scope.clientClassificationOptions = data.clientClassificationOptions;
                if (data.savingProductOptions.length > 0) {
                    scope.showSavingOptions = true;
                }
            });

            scope.changeOffice = function (officeId) {
                resourceFactory.clientTemplateResource.get({staffInSelectedOfficeOnly:true, officeId: officeId
                }, function (data) {
                    scope.staffs = data.staffOptions;
                    scope.savingproducts = data.savingProductOptions;
                });
            };

            scope.setChoice = function () {
                if (this.formData.active) {
                    scope.choice = 1;
                }
                else if (!this.formData.active) {
                    scope.choice = 0;
                }
            };
            if(routeParams.groupId) {
            	scope.cancel = '#/viewgroup/' + routeParams.groupId
            	scope.groupid = routeParams.groupId;
            }else {
            	scope.cancel = "#/clients"
            }

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);

                this.formData.locale = scope.optlang.code;
                this.formData.active = this.formData.active || false;
                this.formData.dateFormat = scope.df;
                this.formData.activationDate = reqDate;

                if (routeParams.groupId) {
                    this.formData.groupId = routeParams.groupId;
                }

                if (routeParams.officeId) {
                    this.formData.officeId = routeParams.officeId;
                }

                if (scope.first.submitondate) {
                    reqDate = dateFilter(scope.first.submitondate, scope.df);
                    this.formData.submittedOnDate = reqDate;
                }

                if (scope.first.dateOfBirth) {
                    this.formData.dateOfBirth = dateFilter(scope.first.dateOfBirth, scope.df);
                }

                if (!scope.opensavingsproduct) {
                    this.formData.savingsProductId = null;
                }

                resourceFactory.clientResource.save(this.formData, function (data) {
                    location.path('/viewclient/' + data.clientId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateClientController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', '$upload', '$rootScope', '$routeParams', mifosX.controllers.CreateClientController]).run(function ($log) {
        $log.info("CreateClientController initialized");
    });
}(mifosX.controllers || {}));
