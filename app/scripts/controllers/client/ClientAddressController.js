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

                scope.entityType = "clients";
                scope.formData.locale = scope.optlang.code;
                scope.formData.dateFormat = scope.df;
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