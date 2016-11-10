(function (module) {
    mifosX.controllers = _.extend(module, {
        SmsCampaignsController: function (scope, resourceFactory, location, dateFilter, translate) {
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
                location.path('/viewsmscampaign/' + id);
            };

            if (!scope.searchCriteria.criterias) {
                scope.searchCriteria.criterias = null;
                scope.saveSC();
            }

            scope.filterText = scope.searchCriteria.criterias;

            scope.onFilter = function () {
                scope.searchCriteria.criterias = scope.filterText;
                scope.saveSC();
            };
            resourceFactory.smsCampaignResource.getAll(function (data) {
                scope.smsCampaigns = data;
            });
        }
    });
    mifosX.ng.application.controller('SmsCampaignsController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$translate', mifosX.controllers.SmsCampaignsController]).run(function ($log) {
        $log.info("SmsCampaignsController initialized");
    });
}(mifosX.controllers || {}));
