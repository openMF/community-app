(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewAllProvisoningCriteriaController: function (scope, resourceFactory, location, dateFilter, translate) {
            scope.template = [];
            scope.formData = {};
            scope.first = {};
            scope.isCollapsed = true;
            scope.showdatefield = false;
            scope.repeatEvery = false;
            scope.first.date = new Date();
            scope.translate = translate;
            scope.criterias = [];

            scope.routeTo = function (id) {
                location.path('/viewprovisioningcriteria/' + id);
            };

            if (!scope.searchCriteria.criterias) {
                scope.searchCriteria.criterias = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.criterias || '';

            scope.onFilter = function () {
                scope.searchCriteria.criterias = scope.filterText;
                scope.saveSC();
            };

            scope.ProvisioningPerPage = 15;
            resourceFactory.provisioningcriteria.getAll(function (data) {
                scope.criterias = data;
            });
        }
    });
    mifosX.ng.application.controller('ViewAllProvisoningCriteriaController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$translate', mifosX.controllers.ViewAllProvisoningCriteriaController]).run(function ($log) {
        $log.info("ViewAllProvisoningCriteriaController initialized");
    });
}(mifosX.controllers || {}));
