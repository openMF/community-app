/**
 * Created by nikpa on 26-06-2017.
 */

(function (module) {
    mifosX.controllers = _.extend(module, {
        EditBusinessOwnersController: function (scope, resourceFactory, routeParams,dateFilter, location) {

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

            resourceFactory.businessOwner.get({clientId:clientId,businessOwnerId:businessOwnerId},function(data)
            {
                scope.formData=data;
                if (data.dateOfBirth) {
                    var dobDate = dateFilter(data.dateOfBirth, scope.df);
                    scope.date.dateOfBirth = new Date(dobDate);
                }
                if(data.titleId){
                    scope.formData.titleId = data.titleId;
                }
                if(data.typeId){
                    scope.formData.typeId = data.typeId;
                }
                if(data.cityId){
                    scope.formData.cityId = data.cityId;
                }
                if(data.stateProvinceId){
                    scope.formData.stateProvinceId = data.stateProvinceId;
                }
                if(data.countryId){
                    scope.formData.countryId = data.countryId;
                }
            });

            scope.routeTo=function()
            {
                location.path('/viewclient/'+clientId);
            }

            scope.editClientBusinessOwner=function()
            {
                delete scope.formData.createdBy;
                delete scope.formData.createdOn;
                delete scope.formData.updatedBy;
                delete scope.formData.updatedOn;
                delete scope.formData.stateName;
                delete scope.formData.countryName;
                delete scope.formData.titleName;
                delete scope.formData.cityName;
                delete scope.formData.typeName;
                delete scope.formData.imageId;
                delete scope.formData.imagePresent;
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;

                if(scope.date.dateOfBirth){
                    this.formData.dateOfBirth = dateFilter(scope.date.dateOfBirth,  scope.df);
                }
                resourceFactory.businessOwner.put({clientId:clientId,businessOwnerId:businessOwnerId},scope.formData,function(data)
                {
                    location.path('/viewclient/'+clientId);
                })
            }

        }


    });
    mifosX.ng.application.controller('EditBusinessOwnersController', ['$scope','ResourceFactory', '$routeParams','dateFilter', '$location', mifosX.controllers.EditBusinessOwnersController]).run(function ($log) {
        $log.info("EditBusinessOwnersController initialized");
    });

}
(mifosX.controllers || {}));
