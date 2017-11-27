/**
 * Created by 27 on 03-08-2015.
 */
(function (module) {
    mifosX.controllers = _.extend(module, {
        ExternalServicesController: function (scope, resourceFactory, location, route) {
            scope.S3Configs = [];
            scope.SMTPConfigs = [];
            scope.notification = [];
            resourceFactory.externalServicesS3Resource.get(function (data) {
                for (var i in data) {
                    if(data[i] != null && data[i].name != null) {
                        data[i].name.replace(/ /g, '');
                        if (!angular.equals(data[i].name, "")) {
                            data[i].showEditvalue = true;
                            scope.S3Configs.push(data[i])
                        }
                    }
                }
            });
            resourceFactory.externalServicesSMTPResource.get(function (data) {
                for (var i in data) {
                    //console.log(data[0]);
                    if(data[i].name != "") {
                        data[i].showEditvalue = true;
                        scope.SMTPConfigs.push(data[i])
                    }
                }
            });
            resourceFactory.externalServicesNotificationResource.get(function (data) {
                for (var i in data) {
                    if(data[i] != null && data[i].name != null) {
                        data[i].name.replace(/ /g, '');
                        if (!angular.equals(data[i].name, "")) {
                            data[i].showEditvalue = true;
                            scope.notification.push(data[i])
                        }
                    }
                }
            });
        }

    });
    mifosX.ng.application.controller('ExternalServicesController', ['$scope', 'ResourceFactory', '$location', '$route',
        mifosX.controllers.ExternalServicesController]).run(function ($log){
        $log.info("ExternalServicesController initialized");
    });


}(mifosX.controllers || {}));
