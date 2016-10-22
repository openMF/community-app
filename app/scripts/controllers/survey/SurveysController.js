(function (module) {
    mifosX.controllers = _.extend(module, {
        SurveysController: function (scope, resourceFactory, location) {
            scope.products = [];

            scope.routeTo = function (id) {
                location.path('/admin/system/surveys/view/' + id);
            };

            if (!scope.searchCriteria.loanP) {
                scope.searchCriteria.loanP = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.loanP;

            scope.onFilter = function () {
                scope.searchCriteria.loanP = scope.filterText;
                scope.saveSC();
            };

            resourceFactory.surveyResource.get({}, function (data) {
                scope.surveys = data;
            });
        }
    });
    mifosX.ng.application.controller('SurveysController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.SurveysController]).run(function ($log) {
        $log.info("SurveysController initialized");
    });
}(mifosX.controllers || {}));