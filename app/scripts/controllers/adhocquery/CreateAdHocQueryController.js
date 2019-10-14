(function (module) {
    mifosX.controllers = _.extend(module, {
    	CreateAdHocQueryController: function (scope, location, resourceFactory) {
            scope.formData = {};
            scope.template = {};
            scope.customReportRunFrequencyFieldShow = false;

            resourceFactory.adHocQueryTemplateResource.get(function(data) {
              scope.template = data;
            });

            scope.reportRunFrequencySelected = function(id) {
              scope.customReportRunFrequencyFieldShow = id === 5;
            };

            scope.submit = function () {
                resourceFactory.adHocQueryResource.save(this.formData, function (data) {
                	//alert(this.formData.isActive);
                	//this.formData.isActive=this.formData.isActive ? 1 : 0;
                    location.path("/viewadhocquery/" + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateAdHocQueryController', ['$scope', '$location', 'ResourceFactory', mifosX.controllers.CreateAdHocQueryController]).run(function ($log) {
        $log.info("CreateAdHocQueryController initialized");
    });
}(mifosX.controllers || {}));


