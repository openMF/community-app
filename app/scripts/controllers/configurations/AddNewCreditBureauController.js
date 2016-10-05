/**
 * Created by nikpa on 14-06-2016.
 */

(function (module) {
    mifosX.controllers = _.extend(module, {
        AddNewCreditBureauController: function ($scope, http,API_VERSION,$rootScope,resourceFactory,dateFilter, $routeParams, location) {
            $scope.formData = {};
            $scope.creditbureaus=[];

            $scope.cancel={};
            $scope.localcountry={};


            resourceFactory.creditBureauTemplate.get(function (data) {
                $scope.creditbureaus=data;
                // $scope.formData.country=data;

            });


       /*     $scope.changecountry = function (country) {

                localcountry=country;

                resourceFactory.creditBureauByCountry.get({country:country.country
                }, function (data) {
                    $scope.creditbureaus = data;
                });

              /!*  resourceFactory.creditBureauTemplate.get(function (data) {
                    $scope.formData.country=data;

                });*!/

                resourceFactory.creditBureauTemplate.get(function (data) {
                    $scope.countries=data;

                });


            };*/

           
            



            /*$scope.changecreditbureau = function (cb_master_id) {
               // localcb_master_id=cb_master_id;
              //  alert("credit bueau id received "+cb_master_id);
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

              /!*  resourceFactory.creditBureauTemplate.get(function (data) {
                    $scope.formData.countries=data;

                });*!/
            };*/










            


            $scope.cancel = function () {
                location.path("#/externalservicesCB/CreditBureau");
            };


            $scope.submit = function () {

                
             /*   $scope.formData.locale="en";
                $scope.formData.dateFormat= "dd MMMM yyyy";
                $scope.formData.country=localcountry.country;
                var tempdate=dateFilter($scope.start_date, $scope.df);
                $scope.formData.start_date=tempdate;
                console.log("start date is "+$scope.formData.start_date);
                console.log("country is "+$scope.formData.country);*/

                resourceFactory.addOrgCreditBureau.save({ocbId: $scope.creditBureauId},$scope.formData,function (data) {

                    location.path('/externalservicesCB/CreditBureau');
                });

            };

        }
    });
    mifosX.ng.application.controller('AddNewCreditBureauController', ['$scope','$http','API_VERSION','$rootScope', 'ResourceFactory', 'dateFilter','$routeParams', '$location', mifosX.controllers.AddNewCreditBureauController]).run(function ($log) {
        $log.info("AddNewCreditBureauController initialized");
    });
}(mifosX.controllers || {}));
