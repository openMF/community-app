(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateVillageController: function (scope, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.data = {};
            scope.first = {};
            scope.first.submitondate = new Date ();
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.first.date = new Date();

            resourceFactory.villageTemplateResource.get(function (data) {
                scope.offices = data.officeOptions;
                scope.formData.officeId = data.officeOptions[0].id;

                if(scope.response && scope.response.uiDisplayConfigurations.createVillage.isReadOnlyField.active == true){
                    scope.choice = 1;
                }else{
                    scope.choice = 0;
                }
            });


            scope.setChoice = function () {
                if (this.formData.active) {
                    scope.choice = 1;
                }
                else if (!this.formData.active) {
                    scope.choice = 0;
                }
            };

            scope.submit = function () {

                if(scope.response && scope.response.uiDisplayConfigurations.createVillage.isReadOnlyField.active == true){
                    scope.formData.active = true;
                }

                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.activatedOnDate = reqDate;

                if (scope.first.submitondate) {
                    reqDate = dateFilter(scope.first.submitondate, scope.df);
                    this.formData.submittedOnDate = reqDate;
                }

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.active = this.formData.active || false;
                resourceFactory.villageResource.save(this.formData, function (data) {
                    location.path('/viewvillage/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateVillageController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateVillageController]).run(function ($log) {
        $log.info("CreateVillageController initialized");
    });
}(mifosX.controllers || {}));
