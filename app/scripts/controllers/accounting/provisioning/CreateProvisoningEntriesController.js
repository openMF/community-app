(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateProvisoningEntriesController: function (scope, resourceFactory, location, dateFilter, translate) {
            scope.template = [];
            scope.formData = {};
            scope.translate = translate;
            scope.submitteddate = new Date();

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.date = dateFilter(this.submitteddate, scope.df);
                resourceFactory.provisioningentries.post(this.formData, function (data) {
                    location.path('/viewprovisioningentry/' + data.resourceId);

                });
            };
        }
    });
    mifosX.ng.application.controller('CreateProvisoningEntriesController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$translate', mifosX.controllers.CreateProvisoningEntriesController]).run(function ($log) {
        $log.info("CreateProvisoningEntriesController initialized");
    });
}(mifosX.controllers || {}));
