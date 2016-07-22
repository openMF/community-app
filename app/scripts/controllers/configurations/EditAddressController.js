(function (module) {
    mifosX.controllers = _.extend(module, {
        EditAddressController: function ($scope, resourceFactory, routeParams, location) {

            $scope.formData={};
            $scope.addressTypes=[];
            $scope.countryOptions=[];
            $scope.stateOptions=[];
            $scope.addressTypeId={};
            $scope.clients={};
            //$scope.clientId={};
            $scope.addressType={};
            entityname="client";
            // clientId="";
            $scope.addStatus="";
            $scope.editable=false;
            clientId=routeParams.clientId;
            addresstypid=routeParams.addrType;
            isActive={};
            resourceFactory.clientaddressFields.get(function(data){
                    $scope.addressTypes=data.addressTypeIdOptions;
                    $scope.countryOptions=data.countryIdOptions;
                    $scope.stateOptions=data.stateProvinceIdOptions;
                }
            )
            // clientId=sharedVariables.getClientId();

            resourceFactory.addressFieldConfiguration.get({entity:entityname},function(data){
                $scope.addresstypId=data[0].is_enabled;
                $scope.street=data[1].is_enabled;
                $scope.address_line_1=data[2].is_enabled;
                $scope.address_line_2=data[3].is_enabled;
                $scope.address_line_3=data[4].is_enabled;
                $scope.town_village=data[5].is_enabled;
                $scope.city=data[6].is_enabled;
                $scope.county_district=data[7].is_enabled;
                $scope.state_province=data[8].is_enabled;
                $scope.country=data[9].is_enabled;
                $scope.postal_code=data[10].is_enabled;
                $scope.latitue=data[11].is_enabled;
                $scope.longitude=data[12].is_enabled;
                $scope.isActive=data[13].is_enabled;
            })
            $scope.routeTo=function()
            {
                location.path('/viewclient/'+clientId);
            }

            /*resourceFactory.clientResource.getAllClientsWithoutLimit( function (data) {
             $scope.clients = data.pageItems;
             });*/


                resourceFactory.clientAddress.get({type:addresstypid,clientId:clientId},function(data)
                {



                        $scope.editable=true;
                        $scope.formData.street=data[0].street;
                        $scope.formData.address_line_1=data[0].address_line_1;
                        $scope.formData.address_line_2=data[0].address_line_2;
                        $scope.formData.address_line_3=data[0].address_line_3;
                        $scope.formData.town_village=data[0].town_village;
                        $scope.formData.city=data[0].city;
                        $scope.formData.county_district=data[0].county_district;
                        $scope.formData.state_province_id=data[0].state_province_id;
                        $scope.formData.country_id=data[0].country_id;
                        $scope.formData.postal_code=data[0].postal_code;
                        $scope.formData.latitude=data[0].latitude;
                        $scope.formData.longitude=data[0].longitude;
                    isActive=data[0].is_active;
                        console.log("country id: "+data[0].country_id)

                });


            $scope.updateaddress=function()
            {
                console.log("addresstype id"+addresstypid);
                $scope.formData.locale="en";
                resourceFactory.clientAddress.put({'clientId': clientId,'type':addresstypid,'status':isActive},$scope.formData,function (data) {

                    location.path('/viewclient/'+clientId);
                });
            }

        





        }


    });
    mifosX.ng.application.controller('EditAddressController', ['$scope','ResourceFactory', '$routeParams', '$location', mifosX.controllers.EditAddressController]).run(function ($log) {
        $log.info("EditAddressController initialized");
    });

}
(mifosX.controllers || {}));