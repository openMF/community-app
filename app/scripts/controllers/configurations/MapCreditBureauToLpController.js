(function (module) {
    mifosX.controllers = _.extend(module, {
        MapCreditBureauToLpController: function ($scope, resourceFactory, $routeParams, location) {
            $scope.formData = {};
            $scope.cb_id={};
            $scope.lps=[];
            $scope.cbdropdowns=[];
            $scope.creditbureaus=[];




            resourceFactory.lpdropdown.get( function (data) {
                $scope.lps=data;
            });

            resourceFactory.creditBureauTemplate.get(function (data) {
                $scope.creditbureaus=data;
            });

            $scope.submit = function () {

                $scope.formData.locale='en';

                resourceFactory.addCreditBureauLoanProductMapping.save({cb_id: $scope.creditBureauId},this.formData, function (data) {
                    location.path('/externalservicesCB/CreditBureau');
                });

            };


        }

    });
    mifosX.ng.application.controller('MapCreditBureauToLpController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.MapCreditBureauToLpController]).run(function ($log) {
        $log.info("MapCreditBureauToLpController initialized");
    });

}
(mifosX.controllers || {}));