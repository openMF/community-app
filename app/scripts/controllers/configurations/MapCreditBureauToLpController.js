/**
 * Created by nikpa on 21-06-2016.
 */
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
                // $scope.formData.country=data;

            });
/*
            resourceFactory.creditBureauSummary.get( function (data) {
                $scope.cbdropdowns=data;
            });


            $scope.refreshcb=function(data)
            {
                resourceFactory.creditBureauSummary.get( function (data) {
                    $scope.cbdropdowns=data;
                });
            }*/

            $scope.submit = function () {

               $scope.formData.locale="en";

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