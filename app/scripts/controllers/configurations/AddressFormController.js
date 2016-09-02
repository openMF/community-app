(function (module) {
    mifosX.controllers = _.extend(module, {
        AddressFormController: function ($scope, resourceFactory, routeParams, location) {

            $scope.formData={};
            $scope.addressTypes=[];
            $scope.countryOptions=[];
            $scope.stateOptions=[];
            $scope.addressTypeId={};
            entityname="ADDRESS";
            $scope.editable=false;
            clientId=routeParams.id;
            resourceFactory.clientaddressFields.get(function(data){
                $scope.addressTypes=data.addressTypeIdOptions;
                $scope.countryOptions=data.countryIdOptions;
                $scope.stateOptions=data.stateProvinceIdOptions;
            }
            )


            resourceFactory.addressFieldConfiguration.get({entity:entityname},function(data){
               /* $scope.addresstypId=data[0].is_enabled;
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
                $scope.isActive=data[17].is_enabled;*/


                for(var i=0;i<data.length;i++)
                {
                    data[i].field='$scope.'+data[i].field

                }

                for(var i=0;i<data.length;i++)
                {

                    eval(data[i].field+"="+data[i].is_enabled);

                }


            })
            $scope.routeTo=function()
            {
                location.path('/viewclient/'+clientId);
            }

          

            $scope.isEditRequired=function(addType)
            {
                resourceFactory.clientAddress.get({type:addType,clientId:routeParams.id,status:true},function(data)
                {


                    if(data[0])      // index is added just to sense whether it is empty or contains data    
                    {
                        $scope.editable=true;
                    }
                    else
                    {
                        $scope.editable=false;
                    }
                })
            }

            $scope.updateaddress=function()
            {

                $scope.formData.locale="en";
                resourceFactory.clientAddress.put({'clientId': routeParams.id,'type':$scope.addressTypeId},$scope.formData,function (data) {

                    location.path('/viewclient/'+routeParams.id);
                });
            }

            $scope.submit = function () {

                resourceFactory.clientAddress.save({'clientId': routeParams.id,'type':$scope.addressTypeId},$scope.formData,function (data) {

                    location.path('/viewclient/'+clientId);
                });

            };
        }


    });
    mifosX.ng.application.controller('AddressFormController', ['$scope','ResourceFactory', '$routeParams', '$location', mifosX.controllers.AddressFormController]).run(function ($log) {
        $log.info("AddressFormController initialized");
    });

}
(mifosX.controllers || {}));