(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateCenterController: function (scope, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.staffs = [];
            scope.villages = [];
            scope.data = {};
            scope.first = {};
            scope.first.submitondate = new Date ();
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.first.date = new Date();
            scope.addedGroups = [];
            scope.isHiddenVillageOption = true;
            scope.villageCount = {};
            scope.count = "";

            resourceFactory.centerTemplateResource.get({staffInSelectedOfficeOnly:true},function (data) {
                scope.offices = data.officeOptions;
                scope.villageCount = data.villageCounter;
                scope.staffs = data.staffOptions;
                scope.groups = data.groupMembersOptions;
                scope.formData.officeId = data.officeOptions[0].id;

                if(scope.response != undefined && scope.response.uiDisplayConfigurations.createCenter.isReadOnlyField.active){
                    scope.choice = 1;
                }else{
                    scope.choice = 0;
                }

            });

            if(scope.response != undefined){
                scope.isHiddenVillageOption = scope.response.uiDisplayConfigurations.createCenter.isHiddenField.villageOptions;
            }

            scope.$watch(scope.formData.officeId, function() {
                scope.changeOffice();
            });

            scope.changeOffice = function () {
                scope.formData.villageId = null;
                scope.villageCount = null;
                resourceFactory.centerTemplateResource.get({staffInSelectedOfficeOnly:true, officeId: scope.formData.officeId
                }, function (data) {
                    scope.staffs = data.staffOptions;
                });
                resourceFactory.centerTemplateResource.get({officeId: scope.formData.officeId, villagesInSelectedOfficeOnly:true}, function (data) {
                    scope.villages = data.villageOptions;
                });
                resourceFactory.centerTemplateResource.get({officeId: scope.formData.officeId }, function (data) {
                    scope.groups = data.groupMembersOptions;
                });
            };

            scope.changeVillage = function () {
                resourceFactory.centerTemplateResource.get({officeId: scope.formData.officeId, villagesInSelectedOfficeOnly:true,
                    villageId: scope.formData.villageId}, function (data) {
                    scope.villageCount = data.villageCounter;
                    scope.count = scope.villageCount.counter+1;
                });
            }

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
                if(scope.response != undefined && !scope.response.uiDisplayConfigurations.createCenter.isHiddenField.villageOptions){
                    this.formData.name = scope.villageCount.villageName +" "+ (scope.villageCount.counter+1);
                }


                if (scope.first.submitondate) {
                    reqDate = dateFilter(scope.first.submitondate, scope.df);
                    this.formData.submittedOnDate = reqDate;
                }

                scope.formData.groupMembers = [];
                for (var i in scope.addedGroups) {
                    scope.formData.groupMembers[i] = scope.addedGroups[i].id;
                }

                if(scope.response != undefined && scope.response.uiDisplayConfigurations.createCenter.isReadOnlyField.active){
                    scope.formData.active = true;
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
