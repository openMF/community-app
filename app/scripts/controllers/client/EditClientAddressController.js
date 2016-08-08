/**
 * Created by jagadeeshakn on 7/29/2016.
 */
(function (module) {
    mifosX.controllers = _.extend(module, {
        EditClientAddressController: function (scope, routeParams, location, resourceFactory) {
            scope.addressId = routeParams.addressId;
            scope.clientId = routeParams.clientId;
            scope.addressType = [];
            scope.countries = [];
            scope.states = [];
            scope.districts = [];
            scope.formData = {};
            scope.formData.addressTypes = [];
            scope.entityType="clients";

            resourceFactory.entityAddressResource.getAddress({entityType: scope.entityType, entityId: scope.clientId, addressId: scope.addressId}, function (data) {
                scope.addressTypeId = data.addressEntityData[0].addressType.id;
                
                if(data.houseNo){
                    scope.formData.houseNo =  data.houseNo;
                }
                if(data.addressLineOne){
                   scope.formData.addressLineOne =  data.addressLineOne;
                }
                if(data.villageTown){
                    scope.formData.villageTown =  data.villageTown;
                }
                if(data.taluka){
                    scope.formData.taluka =  data.taluka;
                }
                if(data.postalCode){
                    scope.formData.postalCode =  data.postalCode;
                }
                if(data.districtData.districtId){
                    scope.formData.districtId =  data.districtData.districtId;
                }
                if(data.stateData.stateId){
                    scope.formData.stateId =  data.stateData.stateId;
                }
                if(data.countryData.countryId){
                    scope.formData.countryId =  data.countryData.countryId;
                }
            });



            resourceFactory.addressTemplateResource.get({},function (data) {
                scope.addressType = data.addressTypeOptions;
                scope.countries = data.countryDatas;
                scope.setDefaultGISConfig();
            });
            scope.setDefaultGISConfig = function () {
                if(scope.responseDefaultGisData && scope.responseDefaultGisData.uiDisplayConfigurations.defaultGISConfig && scope.responseDefaultGisData.uiDisplayConfigurations.defaultGISConfig.address){
                    if(scope.responseDefaultGisData.uiDisplayConfigurations.defaultGISConfig.address.countryName) {

                        var countryName = scope.responseDefaultGisData.uiDisplayConfigurations.defaultGISConfig.address.countryName;
                        scope.defaultCountry = _.filter(scope.countries, function (country) {
                            return country.countryName === countryName;

                        });
                        scope.formData.countryId = scope.defaultCountry[0].countryId;
                        scope.states = scope.defaultCountry[0].statesDatas;
                    }

                    if(scope.states && scope.states.length > 0 && scope.responseDefaultGisData.uiDisplayConfigurations.defaultGISConfig.address.stateName) {
                        var stateName = scope.responseDefaultGisData.uiDisplayConfigurations.defaultGISConfig.address.stateName;
                        scope.defaultState = _.filter(scope.states, function (state) {
                            return state.stateName === stateName;

                        });
                        scope.formData.stateId =  scope.defaultState[0].stateId;
                        scope.districts = scope.defaultState[0].districtDatas;
                    }
                }
            };

            scope.changeCountry = function (countryId) {
                scope.selectCountry = _.filter(scope.countries, function (country) {
                    return country.countryId == countryId;
                })
                scope.states = scope.selectCountry[0].statesDatas;
            }

            scope.changeState = function (stateId) {
                scope.selectState = _.filter(scope.states, function (state) {
                    return state.stateId == stateId;
                })
                scope.districts = scope.selectState[0].districtDatas;
            }
            
            scope.submit = function () {

                scope.formData.entityId = scope.clientId;
                scope.formData.locale = scope.optlang.code;
                scope.formData.dateFormat = scope.df;
                scope.formData.addressId = scope.addressId;
                scope.formData.addressTypes = [scope.addressTypeId];
                resourceFactory.entityAddressResource.update({entityType:scope.entityType,entityId :scope.clientId,addressId :scope.addressId }, scope.formData, function (data) {

                    location.path('/viewclient/' + scope.clientId);
                });
            };
        }

    });
    mifosX.ng.application.controller('EditClientAddressController', ['$scope', '$routeParams', '$location', 'ResourceFactory',mifosX.controllers.EditClientAddressController]).run(function ($log) {
        $log.info("EditClientAddressController initialized");
    });
}(mifosX.controllers || {}));