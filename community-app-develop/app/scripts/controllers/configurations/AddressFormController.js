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