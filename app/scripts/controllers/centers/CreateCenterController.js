(function(module) {
    mifosX.controllers = _.extend(module, {
        CreateCenterController: function(scope, resourceFactory, location, timeout) {
            scope.offices = [];
            scope.staffs = [];
            scope.data = {};
            resourceFactory.centerTemplateResource.get(function(data) {
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.groups = data.groupMembersOptions;
            });

            scope.changeOffice =function(officeId) {
                resourceFactory.centerTemplateResource.get({staffInSelectedOfficeOnly : false, officeId : officeId
                }, function(data) {
                    scope.staffs = data.staffOptions;
                });
                resourceFactory.centerTemplateResource.get({officeId : officeId }, function(data) {
                    scope.groups = data.groupMembersOptions;
                });
            };
            //Date picker
            scope.today = function() {
                scope.dt = new Date();
            };
            scope.today();

            scope.showWeeks = false;
            scope.toggleWeeks = function () {
                scope.showWeeks = ! scope.showWeeks;
            };

            scope.clear = function () {
                scope.dt = null;
            };

            scope.toggleMin = function() {
                scope.minDate = ( scope.minDate ) ? null : new Date();
            };
            scope.toggleMin();


            scope.$watch('dt', function(v){
                var d = new Date(v);
                var curr_date = d.getDate();
                var temp_month = d.getMonth() + 1;
                var curr_month = 'january';
                switch (temp_month)
                {
                    case 1: curr_month = 'january';
                        break;
                    case 2: curr_month = 'february';
                        break;
                    case 3: curr_month = 'march';
                        break;
                    case 4: curr_month = 'april';
                        break;
                    case 5: curr_month = 'may';
                        break;
                    case 6: curr_month = 'june';
                        break;
                    case 7: curr_month = 'july';
                        break;
                    case 8: curr_month = 'august';
                        break;
                    case 9: curr_month = 'september';
                        break;
                    case 10: curr_month = 'october';
                        break;
                    case 11: curr_month = 'november';
                        break;
                    case 12: curr_mont = 'december';
                        break;
                }
                var curr_year = d.getFullYear();
                scope.formattedDate = curr_date + " " + curr_month + " " + curr_year;
            });
          //Date picker ends

            scope.submit = function() {
                this.formData.locale  = 'en';
                this.formData.dateFormat =  'dd MMMM yyyy';
                this.formData.activationDate = scope.formattedDate;
                this.formData.active = this.formData.active || false;
                resourceFactory.centerResource.save(this.formData,function(data){
                    location.path('/viewcenter/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateCenterController', ['$scope', 'ResourceFactory', '$location','$timeout', mifosX.controllers.CreateCenterController]).run(function($log) {
        $log.info("CreateCenterController initialized");
    });
}(mifosX.controllers || {}));
