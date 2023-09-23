(function (module) {
    mifosX.controllers = _.extend(module, {
        MapCreditBureauToLpController: function ($scope, resourceFactory, $routeParams, location) {
            $scope.formData = {skipCreditcheckInFailure:false,isCreditcheckMandatory:false,locale:'en'}; //added default data
            $scope.cb_id={};
            $scope.lps=[];
            $scope.cbdropdowns=[];
            $scope.creditbureaus=[];




            resourceFactory.lpdropdown.get( function (data) {
                $scope.lps=data;
            });

            resourceFactory.creditBureauSummary.get(function (data) {
                $scope.creditbureaus=data;
            });

            $scope.submit = function () {

                    resourceFactory.addCreditBureauLoanProductMapping.post({cb_id: $scope.organisationCreditBureauId}, this.formData, function (data) {
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
