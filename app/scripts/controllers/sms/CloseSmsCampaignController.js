(function (module) {
    mifosX.controllers = _.extend(module, {
        CloseSmsCampaignController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.formData = {};
            scope.formData.locale = scope.optlang.code;
            scope.formData.dateFormat = scope.df;
            scope.submit = function(){
                this.formData.closureDate = dateFilter(this.formData.closureDate,scope.formData.dateFormat);
                resourceFactory.smsCampaignResource.close({resourceId:routeParams.campaignId, command:'close'},this.formData, function (data) {
                    location.path('/sms/viewcampaign');
                });
            };

        }
    });
    mifosX.ng.application.controller('CloseSmsCampaignController', ['$scope', 'ResourceFactory', '$location', '$routeParams','dateFilter', mifosX.controllers.CloseSmsCampaignController]).run(function ($log) {
        $log.info("CloseSmsCampaignController initialized");
    });
}(mifosX.controllers || {}));