(function (module) {
    mifosX.controllers = _.extend(module, {
        ActivateSmsCampaignController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.formData = {};
            scope.formData.locale = scope.optlang.code;
            scope.formData.dateFormat = scope.df;
            scope.submit = function(){
                this.formData.activationDate = dateFilter(this.formData.activationDate,scope.formData.dateFormat);
                resourceFactory.smsCampaignResource.activate({resourceId:routeParams.campaignId, command:'activate'},this.formData, function (data) {
                    location.path('/sms/viewcampaign');
                });
            };

        }
    });
    mifosX.ng.application.controller('ActivateSmsCampaignController', ['$scope', 'ResourceFactory', '$location', '$routeParams','dateFilter', mifosX.controllers.ActivateSmsCampaignController]).run(function ($log) {
        $log.info("ActivateSmsCampaignController initialized");
    });
}(mifosX.controllers || {}));