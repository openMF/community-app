/**
 * Created by nikpa on 26-06-2017.
 */

(function (module) {
    mifosX.controllers = _.extend(module, {
        AddBusinessOwnersController: function (scope, resourceFactory, routeParams,dateFilter, location) {

            scope.formData={};
            scope.date = {};
            scope.countryOptions=[];
            scope.stateOptions=[];
            scope.cityOptions=[];
            scope.titleOptions=[];
            scope.typeIdOptions=[];
            clientId=routeParams.clientId;
            businessOwnerId=routeParams.businessOwnerId;

            resourceFactory.businessOwnersTemplate.get({clientId:clientId},function(data)
            {
                scope.stateOptions=data.stateProvinceIdOptions;
                scope.countryOptions=data.countryIdOptions;
                scope.cityOptions=data.cityIdOptions;
                scope.titleOptions=data.titleIdOptions;
                scope.typeOptions=data.typeIdOptions;
            });

            scope.routeTo=function()
            {
                location.path('/viewclient/'+clientId);
            }

            scope.addClientBusinessOwner=function()
            {


                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;

                if(scope.date.dateOfBirth){
                    this.formData.dateOfBirth = dateFilter(scope.date.dateOfBirth,  scope.df);
                }
                resourceFactory.businessOwners.post({clientId:clientId},scope.formData,function(data)
                {

                    location.path('/viewclient/'+clientId);


                })
            }

        }


    });
    mifosX.ng.application.controller('AddBusinessOwnersController', ['$scope','ResourceFactory', '$routeParams','dateFilter', '$location', mifosX.controllers.AddBusinessOwnersController]).run(function ($log) {
        $log.info("AddBusinessOwnersController initialized");
    });

}
(mifosX.controllers || {}));
