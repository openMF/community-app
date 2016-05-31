(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSmsCampaignController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.campaigns = [];
            scope.campaignType = {1:'DIRECT',2:'SCHEDULE'};
            scope.getCampaigns = function(){
                resourceFactory.smsCampaignResource.getAll({}, function (data) {
                    scope.campaigns = data;
                    for(var i=0;i< scope.campaigns.length;i++){
                        scope.getReportName(scope.campaigns[i].runReportId,i);
                    }
                });
            };

            scope.getCampaigns();

            scope.getReportName = function(id, index){
                resourceFactory.reportsResource.getReportDetails({id: id}, function (data) {
                    scope.campaigns[index].event = data.reportName;
                });
            };

            scope.deleteCampaign = function(id){
                resourceFactory.smsCampaignResource.delete({resourceId:id}, function (data) {
                    scope.getCampaigns();
                });
            };

        }
    });
    mifosX.ng.application.controller('ViewSmsCampaignController', ['$scope', 'ResourceFactory', '$location', '$routeParams','dateFilter', mifosX.controllers.ViewSmsCampaignController]).run(function ($log) {
        $log.info("ViewSmsCampaignController initialized");
    });
}(mifosX.controllers || {}));