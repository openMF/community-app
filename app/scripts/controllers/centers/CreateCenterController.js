(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateCenterController: function (scope, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.staffs = [];
            scope.data = {};
            scope.first = {};
            scope.first.submitondate = new Date ();
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.first.date = new Date();
            scope.addedGroups = [];
            resourceFactory.centerTemplateResource.get({staffInSelectedOfficeOnly:true},function (data) {
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.groups = data.groupMembersOptions;
                scope.formData.officeId = data.officeOptions[0].id;
                scope.getGroups();
            });

            scope.getGroups = function() {
                resourceFactory.groupResource.getAllGroups({officeId: scope.formData.officeId }, function (data) {
                    scope.groups = data;
                });
            }

            scope.changeOffice = function () {
                resourceFactory.centerTemplateResource.get({staffInSelectedOfficeOnly:true, officeId: scope.formData.officeId
                }, function (data) {
                    scope.staffs = data.staffOptions;
                });
                scope.getGroups();

            };
            scope.setChoice = function () {
                if (this.formData.active) {
                    scope.choice = 1;
                }
                else if (!this.formData.active) {
                    scope.choice = 0;
                }
            };

            scope.viewGroup = function (item) {
                scope.group = item;
            };

            scope.add = function () {
                if(scope.available != ""){
                    var temp = {};
                    temp.id = scope.available.id;
                    temp.name = scope.available.name;
                    scope.addedGroups.push(temp);
                }
            };

            scope.sub = function (id) {
                for (var i = 0; i < scope.addedGroups.length; i++) {
                    if (scope.addedGroups[i].id == id) {
                        scope.addedGroups.splice(i, 1);
                        break;
                    }
                }
            };

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.activationDate = reqDate;

                if (scope.first.submitondate) {
                    reqDate = dateFilter(scope.first.submitondate, scope.df);
                    this.formData.submittedOnDate = reqDate;
                }

                scope.formData.groupMembers = [];
                for (var i in scope.addedGroups) {
                    scope.formData.groupMembers[i] = scope.addedGroups[i].id;
                }

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.active = this.formData.active || false;
                resourceFactory.centerResource.save(this.formData, function (data) {
                    location.path('/viewcenter/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateCenterController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateCenterController]).run(function ($log) {
        $log.info("CreateCenterController initialized");
    });
}(mifosX.controllers || {}));
