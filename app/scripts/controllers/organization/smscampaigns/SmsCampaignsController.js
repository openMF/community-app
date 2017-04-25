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
            scope.smsCampaignsPerPage = 15;
            scope.smsCampaigns = [];
            scope.formParams = {};
            scope.formParams.offset = 0;
            scope.formParams.limit = scope.smsCampaignsPerPage;

            scope.routeTo = function (id) {
                location.path('/viewsmscampaign/' + id);
            };

            if (!scope.searchCriteria.criterias) {
                scope.searchCriteria.criterias = null;
                scope.saveSC();
            }

            scope.getResultsPage = function (pageNumber) {
                scope.formParams.offset = ((pageNumber - 1) * scope.smsCampaignsPerPage);
                scope.formParams.limit = scope.smsCampaignsPerPage;
                resourceFactory.smsCampaignResource.getAll(scope.formParams, function (data) {
                    scope.smsCampaigns = data.pageItems;
                    scope.totalSMSCampaigns = data.totalFilteredRecords;
                });
            }

            scope.initPage = function () {
                resourceFactory.smsCampaignResource.getAll(scope.formParams, function (data) {
                    scope.smsCampaigns = data.pageItems;
                    scope.totalSMSCampaigns = data.totalFilteredRecords;
                });
            }

            scope.initPage();

            scope.filterText = scope.searchCriteria.criterias || '';

            scope.onFilter = function () {
                scope.searchCriteria.criterias = scope.filterText;
                scope.saveSC();
            };
        }
    });
    mifosX.ng.application.controller('SmsCampaignsController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$translate', mifosX.controllers.SmsCampaignsController]).run(function ($log) {
        $log.info("SmsCampaignsController initialized");
    });
}(mifosX.controllers || {}));
