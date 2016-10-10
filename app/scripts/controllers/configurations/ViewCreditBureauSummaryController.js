(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewCreditBureauSummaryController: function ($scope, resourceFactory, $routeParams, location, route) {
            $scope.Configs = [];
            $scope.CBConfigs = [];
            $scope.externalServicesType = $routeParams.externalServicesType;

            resourceFactory.creditBureauResource.get(function (data) {
                for (var i in data) {
                    if (data[i] != null && data[i].creditBureauId != null) {
                        $scope.Configs.push(data[i]);
                    }
                }
            });

            $scope.buttonstatus = function (status, id) {
                var biD = document.getElementById(id);
                if (status == true) {
                    biD.innerHTML = "disable";
                }else {
                    biD.innerHTML = "enable";
                }
            }

            $scope.changeCbStatus = function (creditbureau_id, currStatus) {
                if (currStatus) {
                    resourceFactory.creditBureauResource.activate({
                        resourceId: creditbureau_id,
                        command: 'deactivate'
                    }, this.formData, function (data) {
                        route.reload();
                    });
                }else{
                    resourceFactory.creditBureauResource.activate({
                        resourceId: creditbureau_id,
                        command: 'activate'
                    }, this.formData, function (data) {
                        route.reload();
                    });
                }
            }

        }

    });
    mifosX.ng.application.controller('ViewCreditBureauSummaryController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$route', mifosX.controllers.ViewCreditBureauSummaryController]).run(function ($log) {
        $log.info("ViewCreditBureauSummaryController initialized");
    });

}(mifosX.controllers || {}));
