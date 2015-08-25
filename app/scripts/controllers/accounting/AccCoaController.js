(function (module) {
    mifosX.controllers = _.extend(module, {
        AccCoaController: function (scope,$rootScope, resourceFactory, location, $modal) {
			
			$rootScope.tempNodeID = -100; // variable used to store nodeID (from directive), so it(nodeID) is available for detail-table
			
            scope.coadata = [];


            scope.routeTo = function (id) {
                location.path('/viewglaccount/' + id);
            };

            if (!scope.searchCriteria.acoa) {
                scope.searchCriteria.acoa = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.acoa;

            scope.onFilter = function () {
                scope.searchCriteria.acoa = scope.filterText;
                scope.saveSC();
            };

            scope.deepCopy = function (obj) {
                if (Object.prototype.toString.call(obj) === '[object Array]') {
                    var out = [], i = 0, len = obj.length;
                    for (; i < len; i++) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                if (typeof obj === 'object') {
                    var out = {}, i;
                    for (i in obj) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                return obj;
            }

            resourceFactory.accountCoaResource.getAllAccountCoas(function (data) {
                scope.coadatas = scope.deepCopy(data);
				

                var assetObject = {id: -1, name: "ASSET", parentId: -999, children: []};
                var liabilitiesObject = {id: -2, name: "LIABILITY", parentId: -999, children: []};
                var equitiyObject = {id: -3, name: "EQUITY", parentId: -999, children: []};
                var incomeObject = {id: -4, name: "INCOME", parentId: -999, children: []};
                var expenseObject = {id: -5, name: "EXPENSE", parentId: -999, children: []};
                var rootObject = {id: -999, name: "Accounting", children: []};
                var rootArray = [rootObject, assetObject, liabilitiesObject, equitiyObject, incomeObject, expenseObject];
				
                var idToNodeMap = {};
                for (var i in rootArray) {
                    idToNodeMap[rootArray[i].id] = rootArray[i];
                }

                for (i = 0; i < data.length; i++) {
                    if (data[i].type.value == "ASSET") {
                        if (data[i].parentId == null)  data[i].parentId = -1;
                    } else if (data[i].type.value == "LIABILITY") {
                        if (data[i].parentId == null)  data[i].parentId = -2;
                    } else if (data[i].type.value == "EQUITY") {
                        if (data[i].parentId == null)  data[i].parentId = -3;
                    } else if (data[i].type.value == "INCOME") {
                        if (data[i].parentId == null)  data[i].parentId = -4;
                    } else if (data[i].type.value == "EXPENSE") {
                        if (data[i].parentId == null)  data[i].parentId = -5;
                    }
                    delete data[i].disabled;
                    delete data[i].manualEntriesAllowed;
                    delete data[i].type;
                    delete data[i].usage;
                    delete data[i].description;
                    delete data[i].nameDecorated;
                    delete data[i].tagId;
                    data[i].children = [];
                    idToNodeMap[data[i].id] = data[i];
                }

                function sortByParentId(a, b) {
                    return a.parentId - b.parentId;
                }

                data.sort(sortByParentId);
                var glAccountsArray = rootArray.concat(data);
				
				var root = [];
                for (var i = 0; i < glAccountsArray.length; i++) {
                    var currentObj = glAccountsArray[i];
                    if (typeof currentObj.parentId === "undefined") {
                        root.push(currentObj);
                    } else {
                        parentNode = idToNodeMap[currentObj.parentId];
                        parentNode.children.push(currentObj);
                        currentObj.collapsed = "true";
                    }
                }
                scope.treedata = root;
            });

            scope.getdetails = function(id) {
                scope.coadata = [];
                scope.accountTypes = [];
                scope.usageTypes = [];
                scope.headerTypes = [];
                scope.accountOptions = [];

                resourceFactory.accountCoaResource.get({glAccountId: id, template: 'true'}, function (data) {
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
                        tagId: data.tagId.id,
                        usage: data.usage.id,
                        parentId: data.parentId
                    };

                    //to display tag name on i/p field
                    if (data.type.value == "ASSET") {
                        scope.tags = data.allowedAssetsTagOptions;
                        scope.headerTypes = data.assetHeaderAccountOptions;
                    } else if (data.type.value == "LIABILITY") {
                        scope.tags = data.allowedLiabilitiesTagOptions;
                        scope.headerTypes = data.liabilityHeaderAccountOptions;
                    } else if (data.type.value == "EQUITY") {
                        scope.tags = data.allowedEquityTagOptions;
                        scope.headerTypes = data.equityHeaderAccountOptions;
                    } else if (data.type.value == "INCOME") {
                        scope.tags = data.allowedIncomeTagOptions;
                        scope.headerTypes = data.incomeHeaderAccountOptions;
                    } else if (data.type.value == "EXPENSE") {
                        scope.tags = data.allowedExpensesTagOptions;
                        scope.headerTypes = data.expenseHeaderAccountOptions;
                    }

                    //this function calls when change account types
                    scope.changeType = function (value) {
                        if (value == 1) {
                            scope.tags = data.allowedAssetsTagOptions;
                            scope.headerTypes = data.assetHeaderAccountOptions;
                        } else if (value == 2) {
                            scope.tags = data.allowedLiabilitiesTagOptions;
                            scope.headerTypes = data.liabilityHeaderAccountOptions;
                        } else if (value == 3) {
                            scope.tags = data.allowedEquityTagOptions;
                            scope.headerTypes = data.equityHeaderAccountOptions;
                        } else if (value == 4) {
                            scope.tags = data.allowedIncomeTagOptions;
                            scope.headerTypes = data.incomeHeaderAccountOptions;
                        } else if (value == 5) {
                            scope.tags = data.allowedExpensesTagOptions;
                            scope.headerTypes = data.expenseHeaderAccountOptions;
                        }

                    }
                    scope.glaccount = data;

                });

                scope.submit = function () {
                    resourceFactory.accountCoaResource.update({'glAccountId': id}, this.formData, function (data) {
                        $rootScope.isTreeView = true;
                        location.path('/accounting_coa/');
                    });
                };


                scope.deleteGLAccount = function () {
                    $modal.open({
                        templateUrl: 'deleteglacc.html',
                        controller: GlAccDeleteCtrl
                    });
                };
                var GlAccDeleteCtrl = function ($scope, $modalInstance) {
                    $scope.delete = function () {
                        resourceFactory.accountCoaResource.delete({glAccountId: id}, {}, function (data) {
                            $modalInstance.close('delete');
                            location.path('/accounting_coa/');
                        });
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                };
                scope.changeState = function (disabled) {
                    resourceFactory.accountCoaResource.update({'glAccountId': id}, {disabled: !disabled}, function (data) {
                        if( scope.glaccount.disabled)
                       scope.glaccount.disabled = false;
                        else
                            scope.glaccount.disabled = true;
                    });
                };

            }
			
			
        }
    });
    mifosX.ng.application.controller('AccCoaController', ['$scope','$rootScope', 'ResourceFactory', '$location', '$modal', mifosX.controllers.AccCoaController]).run(function ($log) {
        $log.info("AccCoaController initialized");
    });
}(mifosX.controllers || {}));
