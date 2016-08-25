/**
 * Created by jagadeeshakn on 7/20/2016.
 */
(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientAddressController: function (scope, routeParams, location, resourceFactory) {
            scope.clientId = routeParams.clientId;
            scope.addressType = [];
            scope.countrys = [];
            scope.states = [];
            scope.districts = [];
            scope.talukas = [];
            scope.formData = {};
            scope.formDataList = [scope.formData];
            scope.formData.addressTypes = [];
            scope.addressFromVillages = false;

            resourceFactory.addressTemplateResource.get({}, function (data) {
                scope.addressType = data.addressTypeOptions;
                scope.countries = data.countryDatas;
                scope.setDefaultGISConfig();
            });

            resourceFactory.villageResource.getAllVillages({officeId: routeParams.officeId},function (data) {
                scope.villages = data;
            });

            var villageConfig = 'populate_client_address_from_villages';
            resourceFactory.configurationResource.get({configName: villageConfig}, function (response) {
                if (response.enabled == true){
                    scope.addressFromVillages = true;
                }else {
                    scope.addressFromVillages = false;
                }

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
                if (countryId != null) {
                    scope.selectCountry = _.filter(scope.countries, function (country) {
                        return country.countryId == countryId;
                    })
                    if (scope.formData.stateId) {
                        delete scope.formData.stateId;
                    }
                    if (scope.formData.districtId) {
                        delete scope.formData.districtId;
                    }
                    if(scope.formData.talukaId){
                        delete scope.formData.talukaId;
                    }

                    scope.states = scope.selectCountry[0].statesDatas;
                }
            }

            scope.changeState = function (stateId) {
                if (stateId != null) {
                    scope.selectState = _.filter(scope.states, function (state) {
                        return state.stateId == stateId;
                    })
                    if (scope.formData.districtId) {
                        delete scope.formData.districtId;
                    }
                    if(scope.formData.talukaId){
                        delete scope.formData.talukaId;
                    }
                    scope.districts = scope.selectState[0].districtDatas;
                }
            }
            scope.changeDistrict = function (districtId) {
                if (districtId != null) {
                    scope.selectDistrict = _.filter(scope.districts, function (districts) {
                        return districts.districtId == districtId;
                    })

                    if(scope.formData.talukaId){
                        delete scope.formData.talukaId;
                    }
                    scope.talukas = scope.selectDistrict[0].talukaDatas;
                }
            }

            scope.changeVillage = function (villageId) {
                if (villageId != null) {
                    scope.formData.villageTown =null;
                    scope.talukas = null;
                    scope.formData.postalCode = null;
                    scope.districts = null;
                    resourceFactory.villageResource.get({villageId: villageId}, function (response) {
                        if (response.addressData.length > 0) {
                            if(response.villageName){
                                scope.formData.villageTown = response.villageName;
                            }
                            if (response.addressData[0].countryData) {
                                scope.formData.countryId = response.addressData[0].countryData.countryId;
                            }
                            if (response.addressData[0].stateData) {
                               scope.states = response.addressData[0].countryData.statesDatas;
                                scope.formData.stateId = response.addressData[0].stateData.stateId;
                            }
                            if (response.addressData[0].districtData) {
                                scope.districts = response.addressData[0].stateData.districtDatas;
                                scope.formData.districtId = response.addressData[0].districtData.districtId;
                            }
                            if (response.addressData[0].talukaData) {
                                scope.talukas = response.addressData[0].districtData.talukaDatas;
                                scope.formData.talukaId = response.addressData[0].talukaData.talukaId;
                            }
                            if (response.addressData[0].postalCode) {
                                scope.formData.postalCode = response.addressData[0].postalCode;
                            }
                        }

                    });
                }
            }

                scope.submit = function () {

                scope.entityType = "clients";
                scope.formData.locale = scope.optlang.code;
                scope.formData.dateFormat = scope.df;

                if (scope.formData.countryId == null || scope.formData.countryId == ""){
                    delete scope.formData.countryId;
                }
                if (scope.formData.stateId == null || scope.formData.stateId == ""){
                    delete scope.formData.stateId;
                }
                if (scope.formData.districtId == null || scope.formData.districtId == ""){
                    delete scope.formData.districtId;
                }
                    if (scope.formData.talukaId == null || scope.formData.talukaId == ""){
                        delete scope.formData.talukaId;
                    }
                    if (scope.formData.addressTypes == null || scope.formData.addressTypes == "") {
                        delete scope.formData.addressTypes;
                    }
                    if (scope.formData.houseNo == null || scope.formData.houseNo == "") {
                        delete scope.formData.houseNo;
                    }
                    if (scope.formData.addressLineOne == null || scope.formData.addressLineOne == "") {
                        delete scope.formData.addressLineOne;
                    }
                resourceFactory.addressResource.create({entityType:scope.entityType,entityId :scope.clientId }, {addresses: scope.formDataList}, function (data) {

                    location.path('/viewclient/' + scope.clientId);
                });
            };
        }

    });
    mifosX.ng.application.controller('ClientAddressController', ['$scope', '$routeParams', '$location', 'ResourceFactory',mifosX.controllers.ClientAddressController]).run(function ($log) {
        $log.info("ClientAddressController initialized");
    });
}(mifosX.controllers || {}));