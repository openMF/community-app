/**
 * Created by nikpa on 14-07-2016.
 */
(function (module) {
    mifosX.controllers = _.extend(module, {
        AddressController: function ($scope, resourceFactory, $routeParams, location,route) {
          //  $scope.editable=false;
           // $scope.formData={};
            $scope.addresses=[];
            $scope.view={};
            entityname="client";
            $scope.addressTypeId={};
            formdata={};

            $scope.routeTo=function()
            {
                location.path('/address/'+ $scope.client.id);
            }



            resourceFactory.addressFieldConfiguration.get({entity:entityname},function(data){
                $scope.view.addresstypId=data[0].is_enabled;
                $scope.view.street=data[1].is_enabled;
                $scope.view.address_line_1=data[2].is_enabled;
                $scope.view.address_line_2=data[3].is_enabled;
                $scope.view.address_line_3=data[4].is_enabled;
                $scope.view.town_village=data[5].is_enabled;
                $scope.view.city=data[6].is_enabled;
                $scope.view.county_district=data[7].is_enabled;
                $scope.view.state_province=data[8].is_enabled;
                $scope.view.country=data[9].is_enabled;
                $scope.view.postal_code=data[10].is_enabled;
                $scope.view.latitue=data[11].is_enabled;
                $scope.view.longitude=data[12].is_enabled;
                $scope.view.isActive=data[13].is_enabled;
            })

            resourceFactory.clientAddress.get({clientId:$scope.client.id},function(data)
            {
                    
                $scope.addresses=data;
                $scope.addressTypeId=data[0].addressTypeId;

            
            })
            
            $scope.ChangeAddressStatus=function(id,status,addtyp)
            {

                formdata.is_active=!status
                resourceFactory.clientAddress.put({clientId:id,type:addtyp},formdata,function(data)
                {
                    console.log("client id received: "+id)
                    route.reload();
                })
            }

            $scope.routeToEdit=function(id)
            {
                location.path('/editAddress/'+id+'/'+ $scope.client.id);

                console.log("address type"+$scope.addressTypeId)
            }


        }


    });
    mifosX.ng.application.controller('AddressController', ['$scope','ResourceFactory', '$routeParams', '$location','$route', mifosX.controllers.AddressController]).run(function ($log) {
        $log.info("AddressController initialized");
    });

}
(mifosX.controllers || {}));