(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateTaxGroupController: function (scope, resourceFactory, location, dateFilter) {
            scope.taxComponents = [];
            scope.restrictDate = new Date('2025-06-22');
            scope.formData = {};
            scope.tempAccounts = [];
            resourceFactory.taxgrouptemplate.get(function (data) {
                scope.data = data;
            });

            scope.addTaxComponent = function () {
                var taxComponent = {
                    date: new Date()
                };
                scope.taxComponents.push(taxComponent);
            }

            scope.deleteTaxComponent = function (index) {
                scope.taxComponents.splice(index, 1);
            }

            scope.copyForSubmit = function(){
                scope.formData.taxComponents = [];
                    _.each(scope.taxComponents, function (taxcomponent) {
                        var taxComponentDetail = {};
                        taxComponentDetail.taxComponentId = taxcomponent.taxComponentId;
                        taxComponentDetail.startDate =  dateFilter(taxcomponent.date, scope.df);
                        scope.formData.taxComponents.push(taxComponentDetail);
                    });
            }

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                scope.copyForSubmit();
                this.formData.dateFormat = scope.df;
                resourceFactory.taxgroup.save(this.formData, function (data) {
                    location.path('/viewtaxgroup/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateTaxGroupController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateTaxGroupController]).run(function ($log) {
        $log.info("CreateTaxGroupController initialized");
    });
}(mifosX.controllers || {}));
