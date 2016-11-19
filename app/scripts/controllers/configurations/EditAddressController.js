(function (module) {
    mifosX.controllers = _.extend(module, {
        EditAddressController: function ($scope, resourceFactory, routeParams, location) {

            $scope.formData={};
            $scope.addressTypes=[];
            $scope.countryOptions=[];
            $scope.stateOptions=[];
            $scope.addressTypeId={};
            $scope.clients={};
            $scope.addressType={};
            entityname="ADDRESS";
            $scope.addStatus="";
            $scope.editable=false;
            clientId=routeParams.clientId;
            addresstypid=routeParams.addrType;


            isActive={};
            var addressId=routeParams.addrId;

            
            resourceFactory.clientaddressFields.get(function(data){
                    $scope.addressTypes=data.addressTypeIdOptions;
                    $scope.countryOptions=data.countryIdOptions;
                    $scope.stateOptions=data.stateProvinceIdOptions;
                }
            )


            resourceFactory.addressFieldConfiguration.get({entity:entityname},function(data){




                for(var i=0;i<data.length;i++)
                {
                    data[i].field='$scope.'+data[i].field;
                    eval(data[i].field+"="+data[i].is_enabled);

                }



            })
            $scope.routeTo=function()
            {
                location.path('/viewclient/'+clientId);
            }




                resourceFactory.clientAddress.get({type:addresstypid,clientId:clientId},function(data)
                {



                        $scope.editable=true;
                    for(var i=0;i<data.length;i++)
                    {
                        if(data[i].addressId==addressId)
                        {
                            if(data[i].street&&$scope.street)
                            {
                                $scope.formData.street=data[i].street;
                            }
                            if(data[i].addressLine1&&$scope.addressLine1)
                            {
                                $scope.formData.addressLine1=data[i].addressLine1;
                            }
                            if(data[i].addressLine2&&$scope.addressLine2)
                            {
                                $scope.formData.addressLine2=data[i].addressLine2;
                            }
                            if(data[i].addressLine3&&$scope.addressLine3)
                            {
                                $scope.formData.addressLine3=data[i].addressLine3;
                            }
                            if(data[i].townVillage&&$scope.townVillage)
                            {
                                $scope.formData.townVillage=data[i].townVillage;
                            }
                            if(data[i].city&&$scope.city)
                            {
                                $scope.formData.city=data[i].city;
                            }
                            if(data[i].countyDistrict&&$scope.countyDistrict)
                            {
                                $scope.formData.countyDistrict=data[i].countyDistrict;
                            }
                            if(data[i].stateProvinceId&&$scope.stateProvinceId)
                            {
                                $scope.formData.stateProvinceId=data[i].stateProvinceId;
                            }
                            if(data[i].countryId&&$scope.countryId)
                            {
                                $scope.formData.countryId=data[i].countryId;
                            }
                            if(data[i].postalCode&&$scope.postalCode)
                            {
                                $scope.formData.postalCode=data[i].postalCode;
                            }
                            if(data[i].latitude&&$scope.latitue)
                            {
                                $scope.formData.latitude=data[i].latitude;
                            }
                            if(data[i].longitude&&$scope.longitude)
                            {
                                $scope.formData.longitude=data[i].longitude;
                            }
                            if(data[i].isActive&&$scope.isActive)
                            {
                                isActive=data[i].isActive;
                            }
                        }
                    }

                    


                });


            $scope.updateaddress=function()
            {
                
               $scope.formData.locale="en";
                $scope.formData.addressId=addressId;
                resourceFactory.clientAddress.put({'clientId': clientId},$scope.formData,function (data) {

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