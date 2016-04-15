(function (module) {
    mifosX.controllers = _.extend(module, {
        EditTaxGroupController: function (scope, resourceFactory, routeParams, location, dateFilter) {

            scope.taxComponents = [];
            scope.restrictDate = new Date('2025-06-22');
            scope.formData = {};

            resourceFactory.taxgroup.get({taxGroupId: routeParams.taxGroupId, template: 'true'}, function (data) {
                scope.data = data;
                scope.createTaxComponents();
                scope.formData = {
                    name: scope.data.name
                }
            });

            scope.createTaxComponents = function () {
                _.each(scope.data.taxAssociations, function (taxMapping) {
                    var taxComponentDetail = {};
                    taxComponentDetail.id = taxMapping.id;
                    taxComponentDetail.name = taxMapping.taxComponent.name;
                    taxComponentDetail.taxComponentId = taxMapping.taxComponent.id;
                    taxComponentDetail.date = new Date(taxMapping.startDate);
                    if (taxMapping.endDate) {
                        taxComponentDetail.endDate = new Date(taxMapping.endDate);
                        taxComponentDetail.canModify = false;
                    } else {
                        taxComponentDetail.canModify = true;
                    }
                    taxComponentDetail.new = false;

                    scope.taxComponents.push(taxComponentDetail);
                });
            }

            scope.addTaxComponent = function () {
                var taxComponent = {
                    date: new Date(),
                    new: true
                };
                scope.taxComponents.push(taxComponent);
            }

            scope.deleteTaxComponent = function (index) {
                scope.taxComponents.splice(index, 1);
            }

            scope.copyForSubmit = function () {
                scope.formData.taxComponents = [];
                _.each(scope.taxComponents, function (taxcomponent) {
                    var taxComponentDetail = {};
                    taxComponentDetail.id = taxcomponent.id;
                    taxComponentDetail.taxComponentId = taxcomponent.taxComponentId;
                    if (taxcomponent.new) {
                        taxComponentDetail.startDate = dateFilter(taxcomponent.date, scope.df);
                    } else {
                        taxComponentDetail.endDate = dateFilter(taxcomponent.endDate, scope.df);
                    }

                    scope.formData.taxComponents.push(taxComponentDetail);
                });
            }


            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                scope.copyForSubmit();
                this.formData.dateFormat = scope.df;
                resourceFactory.taxgroup.put({taxGroupId: routeParams.taxGroupId}, this.formData, function (data) {
                    location.path('/viewtaxgroup/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditTaxGroupController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.EditTaxGroupController]).run(function ($log) {
        $log.info("EditTaxGroupController initialized");
    });
}(mifosX.controllers || {}));
