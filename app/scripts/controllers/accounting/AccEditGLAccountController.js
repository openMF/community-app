(function (module) {
    mifosX.controllers = _.extend(module, {
        AccEditGLAccountController: function (scope, routeParams, resourceFactory, location) {
            scope.coadata = [];
            scope.accountTypes = [];
            scope.usageTypes = [];
            scope.headerTypes = [];
            scope.accountOptions = [];
            scope.formData = {};
            scope.tags = [];
            scope.tag = [];
            resourceFactory.accountCoaResource.get({glAccountId: routeParams.id, template: 'true'}, function (data) {
                scope.coadata = data;
                scope.glAccountId = data.id;
                scope.accountTypes = data.accountTypeOptions;
                scope.usageTypes = data.usageOptions;
                scope.formData = {
                    name: data.name,
                    glCode: data.glCode,
                    manualEntriesAllowed: data.manualEntriesAllowed,
                    description: data.description,
                    type: data.type.id,
                    usage: data.usage.id,
                    parentId: data.parentId
                };

                scope.tags = data.tagId;

                //to display tag name on i/p field
                if (data.type.value == "ASSET") {
                    scope.availableTags = data.allowedAssetsTagOptions;
                    scope.headerTypes = data.assetHeaderAccountOptions;
                } else if (data.type.value == "LIABILITY") {
                    scope.availableTags = data.allowedLiabilitiesTagOptions;
                    scope.headerTypes = data.liabilityHeaderAccountOptions;
                } else if (data.type.value == "EQUITY") {
                    scope.availableTags = data.allowedEquityTagOptions;
                    scope.headerTypes = data.equityHeaderAccountOptions;
                } else if (data.type.value == "INCOME") {
                    scope.availableTags = data.allowedIncomeTagOptions;
                    scope.headerTypes = data.incomeHeaderAccountOptions;
                } else if (data.type.value == "EXPENSE") {
                    scope.availableTags = data.allowedExpensesTagOptions;
                    scope.headerTypes = data.expenseHeaderAccountOptions;
                }

                //this function calls when change account types
                scope.changeType = function (value) {
                    if (value == 1) {
                        scope.tag = data.allowedAssetsTagOptions;
                        scope.headerTypes = data.assetHeaderAccountOptions;
                    } else if (value == 2) {
                        scope.tag = data.allowedLiabilitiesTagOptions;
                        scope.headerTypes = data.liabilityHeaderAccountOptions;
                    } else if (value == 3) {
                        scope.tag = data.allowedEquityTagOptions;
                        scope.headerTypes = data.equityHeaderAccountOptions;
                    } else if (value == 4) {
                        scope.tag = data.allowedIncomeTagOptions;
                        scope.headerTypes = data.incomeHeaderAccountOptions;
                    } else if (value == 5) {
                        scope.tag = data.allowedExpensesTagOptions;
                        scope.headerTypes = data.expenseHeaderAccountOptions;
                    }

                }


                // this will take only remaining tags from available list
                for(var i=0; i<scope.availableTags.length; i++) {
                    var count = 0;
                    for (var j = 0; j < scope.tags.length; j++) {
                        if (scope.availableTags[i].id == scope.tags[j].id) {
                            count ++;
                        }
                    }
                    if(count == 0){

                        var temp = {};
                        temp.id = scope.availableTags[i].id;
                        temp.name = scope.availableTags[i].name;
                        scope.tag.push(temp);

                    }
                };

            });

            // this will add the tags
            scope.addTag = function () {
                for (var i in this.availableTag) {
                    for (var j in scope.tag) {
                        if (scope.tag[j].id == this.availableTag[i]) {
                            var temp = {};
                            temp.id = scope.tag[j].id;
                            temp.name = scope.tag[j].name;
                            scope.tags.push(temp);
                            scope.tag.splice(j, 1);
                        }
                    }
                }
                this.availableTag = this.availableTag - 1;
            };

         // this will remove the tags from selected tag list
            scope.removeTag = function () {
                for (var i in this.selectedTag) {
                    for (var j in scope.tags) {
                        if (scope.tags[j].id == this.selectedTag[i]) {
                            var temp = {};
                            temp.id = scope.tags[j].id;
                            temp.name = scope.tags[j].name;
                            scope.tag.push(temp);
                            scope.tags.splice(j, 1);
                        }
                    }
                }
                this.selectedTag = this.selectedTag - 1;
            };


            scope.submit = function () {

                scope.formData.tagId = [];
                for(var i=0 ; i< scope.tags.length; i++)
                {
                    scope.formData.tagId.push(scope.tags[i].id);
                }

                resourceFactory.accountCoaResource.update({'glAccountId': routeParams.id}, this.formData, function (data) {
                    location.path('/viewglaccount/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('AccEditGLAccountController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.AccEditGLAccountController]).run(function ($log) {
        $log.info("AccEditGLAccountController initialized");
    });
}(mifosX.controllers || {}));
