(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateNewClientController: function (scope, resourceFactory, location, routeParams, http, dateFilter, API_VERSION, $upload, $rootScope, routeParams) {
            scope.offices = [];
            scope.staffs = [];
            scope.savingproducts = [];
            scope.first = {};
            scope.first.date = new Date();
            scope.first.submitondate = new Date ();
            scope.formData = {};
            scope.clientNonPersonDetails = {};
            scope.restrictDate = new Date();
            scope.showSavingOptions = false;
            scope.opensavingsproduct = false;
            scope.forceOffice = null;
            scope.showNonPersonOptions = false;
            scope.clientPersonId = 1;
            scope.addressType = [];
            scope.countrys = [];
            scope.states = [];
            scope.districts = [];
            scope.talukas = [];
            scope.formAddressData = {};
            scope.formDataList = [scope.formAddressData];
            scope.formAddressData.addressTypes = [];
            scope.configurations = [];
            scope.enableClientAddress = false;
            scope.addressFromVillages = false;
            scope.villages = [];
            scope.village = {};
            scope.formAddressData.districtId ;

            var requestParams = {staffInSelectedOfficeOnly:true};
            if (routeParams.groupId) {
                requestParams.groupId = routeParams.groupId;
            }
            if (routeParams.officeId) {
                requestParams.officeId = routeParams.officeId;
            }
            resourceFactory.clientTemplateResource.get(requestParams, function (data) {
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.formData.officeId = scope.offices[0].id;
                scope.savingproducts = data.savingProductOptions;
                scope.genderOptions = data.genderOptions;
                scope.clienttypeOptions = data.clientTypeOptions;
                scope.clientClassificationOptions = data.clientClassificationOptions;
                scope.clientNonPersonConstitutionOptions = data.clientNonPersonConstitutionOptions;
                scope.clientNonPersonMainBusinessLineOptions = data.clientNonPersonMainBusinessLineOptions;
                scope.clientLegalFormOptions = data.clientLegalFormOptions;
                if (data.savingProductOptions.length > 0) {
                    scope.showSavingOptions = true;
                }
                if(routeParams.officeId) {
                    scope.formData.officeId = routeParams.officeId;
                    for(var i in data.officeOptions) {
                        if(data.officeOptions[i].id == routeParams.officeId) {
                            scope.forceOffice = data.officeOptions[i];
                            break;
                        }
                    }
                }
                if(routeParams.groupId) {
                    if(typeof data.staffId !== "undefined") {
                        scope.formData.staffId = data.staffId;
                    }
                }
                if(routeParams.staffId) {
                    for(var i in scope.staffs) {
                        if (scope.staffs[i].id == routeParams.staffId) {
                            scope.formData.staffId = scope.staffs[i].id;
                            break;
                        }
                    }
                }
                var addressConfig = 'enable-clients-address';
                resourceFactory.configurationResource.get({configName: addressConfig}, function (response) {
                    if (response.enabled == true) {
                        scope.enableClientAddress = true;
                        resourceFactory.villageResource.getAllVillages({officeId:scope.formData.officeId},function (data) {
                            scope.villages = data;
                        });
                        resourceFactory.addressTemplateResource.get({}, function (data) {
                            scope.addressType = data.addressTypeOptions;
                            scope.countries = data.countryDatas;
                            scope.setDefaultGISConfig();
                        });

                    } else {
                        scope.enableClientAddress = false;
                    }

                });
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
                        scope.formAddressData.countryId = scope.defaultCountry[0].countryId;
                        scope.states = scope.defaultCountry[0].statesDatas;
                    }

                    if(scope.states && scope.states.length > 0 && scope.responseDefaultGisData.uiDisplayConfigurations.defaultGISConfig.address.stateName) {
                        var stateName = scope.responseDefaultGisData.uiDisplayConfigurations.defaultGISConfig.address.stateName;
                        scope.defaultState = _.filter(scope.states, function (state) {
                            return state.stateName === stateName;

                        });
                        scope.formAddressData.stateId =  scope.defaultState[0].stateId;
                        scope.districts = scope.defaultState[0].districtDatas;
                    }

                }

            };
            
            scope.displayPersonOrNonPersonOptions = function (legalFormId) {
                if(legalFormId == scope.clientPersonId || legalFormId == null) {
                    scope.showNonPersonOptions = false;
                }else {
                    scope.showNonPersonOptions = true;
                }
            };
            
            scope.changeOffice = function (officeId) {
                resourceFactory.clientTemplateResource.get({staffInSelectedOfficeOnly:true, officeId: officeId
                }, function (data) {
                    scope.staffs = data.staffOptions;
                    scope.savingproducts = data.savingProductOptions;
                });
                if(scope.addressFromVillages ) {
                    resourceFactory.villageResource.getAllVillages({officeId: officeId}, function (data) {
                        scope.villages = data;
                    });
                }
            };

            scope.setChoice = function () {
                if (this.formData.active) {
                    scope.choice = 1;
                }
                else if (!this.formData.active) {
                    scope.choice = 0;
                }
            };
            if(routeParams.groupId) {
            	scope.cancel = '#/viewgroup/' + routeParams.groupId
            	scope.groupid = routeParams.groupId;
            }else {
            	scope.cancel = "#/clients"
            }

            scope.changeVillage = function (villageId) {
                if(villageId != null){
                    scope.formAddressData.villageTown = null
                    scope.talukas = null;
                    scope.formAddressData.postalCode = null;
                    scope.districts = null;
                    resourceFactory.villageResource.get({villageId:villageId},function (response) {
                        if (response.addressData.length > 0) {
                            if(response.villageName){
                                scope.formAddressData.villageTown = response.villageName;
                            }
                            
                            if (response.addressData[0].countryData) {
                                scope.formAddressData.countryId = response.addressData[0].countryData.countryId;
                            }
                            if (response.addressData[0].stateData) {
                                scope.states = response.addressData[0].countryData.statesDatas;
                                scope.formAddressData.stateId = response.addressData[0].stateData.stateId;
                            }
                            if (response.addressData[0].districtData) {
                                scope.districts = response.addressData[0].stateData.districtDatas;
                                scope.formAddressData.districtId = response.addressData[0].districtData.districtId;
                            }
                            if (response.addressData[0].talukaData) {
                                scope.talukas = response.addressData[0].districtData.talukaDatas;
                                scope.formAddressData.talukaId = response.addressData[0].talukaData.talukaId;
                            }

                            if (response.addressData[0].postalCode) {
                                scope.formAddressData.postalCode = response.addressData[0].postalCode;
                            }
                        }
                    });

                }


            }

            scope.changeCountry = function (countryId) {
                if (countryId != null) {
                    scope.selectCountry = _.filter(scope.countries, function (country) {
                        return country.countryId == countryId;
                    })
                    if(scope.formAddressData.stateId){
                        delete scope.formAddressData.stateId;
                    }
                    if(scope.formAddressData.districtId){
                        delete scope.formAddressData.districtId;
                    }
                    if(scope.formAddressData.talukaId){
                        delete scope.formAddressData.talukaId;
                    }
                    scope.states = scope.selectCountry[0].statesDatas;
                    scope.districts = null;
                    scope.talukas = null;
                }
            }

            scope.changeState = function (stateId) {
                if (stateId != null) {
                    scope.selectState = _.filter(scope.states, function (state) {
                        return state.stateId == stateId;
                    })
                    if(scope.formAddressData.districtId){
                        delete scope.formAddressData.districtId;
                    }
                    if(scope.formAddressData.talukaId){
                        delete scope.formAddressData.talukaId;
                    }

                    scope.districts = scope.selectState[0].districtDatas;
                    scope.talukas = null;
                }
            }

            scope.changeDistrict = function (districtId) {
                if (districtId != null) {
                    scope.selectDistrict = _.filter(scope.districts, function (districts) {
                        return districts.districtId == districtId;
                    })

                    if(scope.formAddressData.talukaId){
                        delete scope.formAddressData.talukaId;
                    }
                    scope.talukas = scope.selectDistrict[0].talukaDatas;
                }
            }

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);

                this.formData.locale = scope.optlang.code;
                this.formData.active = this.formData.active || false;
                this.formData.dateFormat = scope.df;
                this.formData.activationDate = reqDate;

                if (routeParams.groupId) {
                    this.formData.groupId = routeParams.groupId;
                }

                if (routeParams.officeId) {
                    this.formData.officeId = routeParams.officeId;
                }

                if (scope.first.submitondate) {
                    reqDate = dateFilter(scope.first.submitondate, scope.df);
                    this.formData.submittedOnDate = reqDate;
                }

                if (scope.first.dateOfBirth) {
                    this.formData.dateOfBirth = dateFilter(scope.first.dateOfBirth, scope.df);
                }

                if(scope.first.incorpValidityTillDate) {
                    this.formData.clientNonPersonDetails.locale = scope.optlang.code;
                    this.formData.clientNonPersonDetails.dateFormat = scope.df;
                    this.formData.clientNonPersonDetails.incorpValidityTillDate = dateFilter(scope.first.incorpValidityTillDate, scope.df);
                }

                if (!scope.opensavingsproduct) {
                    this.formData.savingsProductId = null;
                }
                if (scope.formAddressData.countryId == null || scope.formAddressData.countryId == ""){
                    delete scope.formAddressData.countryId;
                }
                if (scope.formAddressData.stateId == null || scope.formAddressData.stateId == ""){
                    delete scope.formAddressData.stateId;
                }
                if (scope.formAddressData.districtId == null || scope.formAddressData.districtId == ""){
                    delete scope.formAddressData.districtId;
                }
                if (scope.formAddressData.talukaId == null || scope.formAddressData.talukaId == ""){
                    delete scope.formAddressData.talukaId;
                }
                if (scope.formAddressData.addressTypes == null || scope.formAddressData.addressTypes == "") {
                    delete scope.formAddressData.addressTypes;
                }
                if (scope.formAddressData.houseNo == null || scope.formAddressData.houseNo == "") {
                    delete scope.formAddressData.houseNo;
                }
                if (scope.formAddressData.addressLineOne == null || scope.formAddressData.addressLineOne == "") {
                    delete scope.formAddressData.addressLineOne;
                }
                if(scope.enableClientAddress){
                    this.formData.addresses=scope.formDataList;
                }
                resourceFactory.clientResource.save(this.formData, function (data) {
                    if(routeParams.pledgeId){
                        var updatedData = {};
                        updatedData.clientId = data.clientId;
                        resourceFactory.pledgeResource.update({ pledgeId : routeParams.pledgeId}, updatedData, function(pledgeData){

                        });
                    }
                    location.path('/viewclient/' + data.clientId);
                });

            };
        }
    });
    mifosX.ng.application.controller('CreateNewClientController', ['$scope', 'ResourceFactory', '$location', '$routeParams', '$http', 'dateFilter', 'API_VERSION', '$upload', '$rootScope', '$routeParams', mifosX.controllers.CreateNewClientController]).run(function ($log) {
        $log.info("CreateNewClientController initialized");
    });
}(mifosX.controllers || {}));
