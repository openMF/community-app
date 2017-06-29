(function (module) {
    mifosX.controllers = _.extend(module, {
        EditTwoFactorConfigController: function (scope, resourceFactory, $routeParams, location) {
            var configs = [];
            configs['sms'] = ['otp-delivery-sms-enable', 'otp-delivery-sms-provider', 'otp-delivery-sms-text'];
            configs['email'] = ['otp-delivery-email-enable', 'otp-delivery-email-subject', 'otp-delivery-email-body'];
            configs['token'] = ['otp-token-length', 'access-token-live-time-extended', 'otp-token-live-time', 'access-token-live-time'];

            var boolConfigs = ['otp-delivery-sms-enable', 'otp-delivery-email-enable'];
            var multiLineConfigs = ['otp-delivery-sms-text', 'otp-delivery-email-body'];

            scope.configs = [];
            scope.configType = $routeParams.configType;
            scope.disabledTwoFactor = false;

            resourceFactory.twoFactorConfigResource.getAllConfigs(function (data) {
                for (var i in data.toJSON()) {
                    if(configs[scope.configType].indexOf(i) > -1) {
                        scope.configs.push({
                            name: i,
                            value: data[i].toString(),
                            type: getConfigType(i)
                        });
                    }
                }
            }, function () {
                scope.disabledTwoFactor = true;
            });

            scope.cancel = function () {
                location.path('/twofactorconfig');
            };

            scope.submit = function () {
                var formData = {};
                for(var i = 0; i < scope.configs.length; i++) {
                    var config = scope.configs[i];
                    formData[config.name] = config.value;
                }
                resourceFactory.twoFactorConfigResource.put(formData, function (data) {
                    location.path('/twofactorconfig');
                });
            };

            var getConfigType = function (name) {

                if(boolConfigs.indexOf(name) > -1)
                    return 'BOOLEAN';
                if(multiLineConfigs.indexOf(name) > -1) {
                    return 'MULTILINE';
                }
                return 'TEXT';
            };
        }

    });
    mifosX.ng.application.controller('EditTwoFactorConfigController', ['$scope', 'ResourceFactory', '$routeParams', '$location',
        mifosX.controllers.EditTwoFactorConfigController]).run(function ($log) {
        $log.info("EditTwoFactorConfigController initialized");
    });

}(mifosX.controllers || {}));
