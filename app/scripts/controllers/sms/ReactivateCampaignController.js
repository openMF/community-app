(function (module) {
    mifosX.controllers = _.extend(module, {
        ReactivateCampaignController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.formData = {};
            scope.formData.locale = scope.optlang.code;
            scope.formData.dateFormat = scope.df;
            scope.submit = function(){
                this.formData.activationDate = dateFilter(this.formData.activationDate,scope.formData.dateFormat);
                resourceFactory.smsCampaignResource.reactivate({resourceId:routeParams.campaignId, command:'reactivate'},this.formData, function (data) {
                    location.path('/sms/viewcampaign');
                });
            };

        }
    });
    mifosX.ng.application.controller('ReactivateCampaignController', ['$scope', 'ResourceFactory', '$location', '$routeParams','dateFilter', mifosX.controllers.ReactivateCampaignController]).run(function ($log) {
        $log.info("ReactivateCampaignController initialized");
    });
}(mifosX.controllers || {}));