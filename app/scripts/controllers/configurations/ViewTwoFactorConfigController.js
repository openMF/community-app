(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewTwoFactorConfigController: function (scope, resourceFactory) {
            var smsConfigs = ['otp-delivery-sms-enable', 'otp-delivery-sms-provider', 'otp-delivery-sms-text'];
            var emailConfigs = ['otp-delivery-email-enable', 'otp-delivery-email-subject', 'otp-delivery-email-body'];
            var tokenConfigs = ['otp-token-length', 'access-token-live-time-extended', 'otp-token-live-time', 'access-token-live-time'];
            scope.configurations = [];
            scope.smsConfig = [];
            scope.emailConfig = [];
            scope.tokenConfig = [];
            scope.tabs = {};
            scope.disabledTwoFactor = false;

            resourceFactory.twoFactorConfigResource.getAllConfigs(function (data) {
                for(var i = 0; i < smsConfigs.length; i++) {
                    scope.smsConfig.push({name: smsConfigs[i], value: data[smsConfigs[i]]});
                }
                for(i = 0; i < emailConfigs.length; i++) {
                    scope.emailConfig.push({name: emailConfigs[i], value: data[emailConfigs[i]]});
                }
                for(i = 0; i < tokenConfigs.length; i++) {
                    scope.tokenConfig.push({name: tokenConfigs[i], value: data[tokenConfigs[i]]});
                }

                scope.tabs['sms'] = scope.smsConfig;
                scope.tabs['email'] = scope.emailConfig;
                scope.tabs['token'] = scope.tokenConfig;

                for (var i in data.toJSON()) {
                    scope.configurations.push({name: i, value: data[i]});
                }
            }, function () {
                scope.disabledTwoFactor = true;
            });
        }

    });
    mifosX.ng.application.controller('ViewTwoFactorConfigController', ['$scope', 'ResourceFactory',
        mifosX.controllers.ViewTwoFactorConfigController]).run(function ($log) {
        $log.info("ViewTwoFactorConfigController initialized");
    });

}(mifosX.controllers || {}));
