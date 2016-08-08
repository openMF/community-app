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
            scope.formData = {};
            scope.formDataList = [scope.formData];
            scope.formData.addressTypes = [];

            resourceFactory.addressTemplateResource.get({}, function (data) {
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
                    scope.districts = scope.selectState[0].districtDatas;
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