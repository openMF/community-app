/**
 * Created by nikpa on 13-06-2016.
 */


(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewCreditBureauSummaryController: function ($scope, resourceFactory, $routeParams, location) {
            $scope.Configs = [];
            $scope.CBConfigs=[];
            $scope.externalServicesType = $routeParams.externalServicesType;
            //$scope.name = $routeParams.name;

            resourceFactory.creditBureauSummary.get( function (data) {
                for (var i in data) {

                    if(data[i] != null && data[i].cbID != null) {
                        $scope.Configs.push(data[i]);
                     
                    }
                }
            });

            resourceFactory.creditBureauMapping.get( function (data) {
                for (var i in data) {

                    if(data[i] != null && data[i].mapping_id != null) {
                        $scope.CBConfigs.push(data[i]);

                    }
                }
            });
            
            $scope.buttonstatus=function(status,id)
            {   
                    var biD=document.getElementById(id);
                alert(status);
               // $scope.button=status;
                if(status==true)
                {
                   // $scope.button="disable"
                    biD.settext("disable");

                }
                else
                {
                   // $scope.button="enable"
                    biD.settext("enable");
                }
            }

            $scope.cancel = function () {
                location.path('/externalservices');
        };

        }

    });
    mifosX.ng.application.controller('ViewCreditBureauSummaryController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.ViewCreditBureauSummaryController]).run(function ($log) {
        $log.info("ViewCreditBureauSummaryController initialized");
    });

}(mifosX.controllers || {}));
