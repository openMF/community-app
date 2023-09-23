(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewCreditBureauSummaryController: function ($scope, resourceFactory, $routeParams, location,route) {
            $scope.Configs = [];
            $scope.CBConfigs=[];
            $scope.externalServicesType = $routeParams.externalServicesType;


            resourceFactory.creditBureauSummary.get( function (data) {
                for (var i in data) {

                    if(data[i] != null && data[i].organisationCreditBureauId != null) {
                        $scope.Configs.push(data[i]);

                    }
                }
            });

            resourceFactory.creditBureauMapping.get( function (data) {
                for (var i in data) {

                    if(data[i] != null && data[i].creditbureauLoanProductMappingId != null) {
                        $scope.CBConfigs.push(data[i]);

                    }
                }
            });

            $scope.buttonstatus=function(status,id)
            {


                var biD=document.getElementById(id);


                if(status==true)
                {

                    biD.innerHTML="disable";

                }
                else
                {

                    biD.innerHTML="enable";
                }
            }

            $scope.changeCbStatus=function(cb_id,status)
            {

                var formData={};
                formData.creditBureauId=cb_id;
                formData.isActive=!status;

                resourceFactory.creditBureauSummary.put(formData, function (data) {
                    route.reload();

                });
            }

            $scope.changeMappingStatus=function (mappingid,status) {
                var mappingUpdate={};
                mappingUpdate.creditbureauLoanProductMappingId=mappingid;
                mappingUpdate.isActive=!status;
                resourceFactory.creditBureauMapping.put(mappingUpdate,function (data) {

                    route.reload();

                });
            }
        }

    });
    mifosX.ng.application.controller('ViewCreditBureauSummaryController', ['$scope', 'ResourceFactory', '$routeParams', '$location','$route', mifosX.controllers.ViewCreditBureauSummaryController]).run(function ($log) {
        $log.info("ViewCreditBureauSummaryController initialized");
    });

}(mifosX.controllers || {}));
