/**
 * Created by nikpa on 14-06-2016.
 */

(function (module) {
    mifosX.controllers = _.extend(module, {
        AddNewCreditBureauController: function ($scope, http,API_VERSION,$rootScope,resourceFactory, $routeParams, location) {
            $scope.formData = [];
            $scope.countries=[];
            $scope.cbproducts=[];
            $scope.creditbureaus=[];
            $scope.cancel={};
            localcountry={};
           // localcb_master_id={};

            $scope.changecountry = function (country) {
                localcountry=country;
                resourceFactory.creditBureauByCountry.get({country:country.country
                }, function (data) {
                    $scope.creditbureaus = data;
                });

                resourceFactory.creditBureauTemplate.get(function (data) {
                    $scope.countries=data;

                });
            };

           
            



            $scope.changecreditbureau = function (cb_master_id) {
               // localcb_master_id=cb_master_id;
                http({
                    method: 'GET',
                    url: $rootScope.hostUrl + API_VERSION + '/cbconfig/mappings/' + cb_master_id
                }).then(function (data) {
                    $scope.cbproducts = data.data;


                });

                resourceFactory.creditBureauByCountry.get({country:localcountry.country
                }, function (data) {
                    $scope.creditbureaus = data;
                });

              /*  resourceFactory.creditBureauTemplate.get(function (data) {
                    $scope.countries=data;

                });*/
            };





            resourceFactory.creditBureauTemplate.get(function (data) {
                $scope.countries=data;

            });




            


            $scope.cancel = function () {
                location.path("#/externalservicesCB/CreditBureau");
            };


            $scope.submit = function () {
                resourceFactory.configurationResource.update({resourceType: 'configurations', id: $scope.configId}, this.formData, function (data) {
                    location.path("#/externalservicesCB/CreditBureau");
                });
            };

        }
    });
    mifosX.ng.application.controller('AddNewCreditBureauController', ['$scope','$http','API_VERSION','$rootScope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.AddNewCreditBureauController]).run(function ($log) {
        $log.info("AddNewCreditBureauController initialized");
    });
}(mifosX.controllers || {}));
