(function (module) {
    mifosX.controllers = _.extend(module, {
        AccountingClosureController: function (scope, resourceFactory, location, translate, routeParams, dateFilter, $rootScope) {
            scope.first = {};
            scope.formData = {};
            scope.first.date = new Date();
            scope.accountClosures = [];
            scope.restrictDate = new Date();
            scope.isTreeView = false;
            var idToNodeMap = {};
            scope.showclosure = false;
            scope.getFetchData = true;

            var params = {}
            if (routeParams.officeId != undefined) {
                params.officeId = routeParams.officeId;
            }

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                for (var i in data) {
                    data[i].children = [];
                    idToNodeMap[data[i].id] = data[i];
                }
                function sortByParentId(a, b) {
                    return a.parentId - b.parentId;
                }

                data.sort(sortByParentId);

                var root = [];
                for (var i = 0; i < data.length; i++) {
                    var currentObj = data[i];
                    if (currentObj.children) {
                        currentObj.collapsed = "true";
                    }
                    if (typeof currentObj.parentId === "undefined") {
                        root.push(currentObj);
                    } else {
                        parentNode = idToNodeMap[currentObj.parentId];
                        parentNode.children.push(currentObj);
                    }
                }
                scope.treedata = root;
            });

            scope.routeTo = function (id) {
                location.path('/view_close_accounting/' + id);
            };

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.closingDate = reqDate;
                resourceFactory.accountingClosureResource.save(this.formData, function (data) {
                    location.path('/view_close_accounting/' + data.resourceId);
                });
            }

            scope.updateLastClosed = function (officeId) {
                resourceFactory.accountingClosureResource.get({officeId: officeId}, function (data) {
                    scope.accountClosures = data;
                    scope.lastClosed = undefined;
                    if (data.length > 0) {
                        scope.lastClosed = data[0].closingDate;
                    }
                });
            }
            scope.closedAccountingDetails = function (officeId) {
                resourceFactory.accountingClosureResource.get({officeId: officeId}, function (data) {
                    scope.accountClosures = data;
                });
            }
            scope.fetchData = function (officeId) {
                resourceFactory.accountingClosureResource.get({officeId: officeId}, function (data) {
                    scope.accountClosures = data;
                    if(scope.accountClosures.length > 0){
                        scope.showclosure = true;
                    } else {
                        scope.showclosure = false;
                    }
                });
            }

        }
    });
    mifosX.ng.application.controller('AccountingClosureController', ['$scope', 'ResourceFactory', '$location', '$translate', '$routeParams', 'dateFilter','$rootScope', mifosX.controllers.AccountingClosureController]).run(function ($log) {
        $log.info("AccountingClosureController initialized");
    });
}(mifosX.controllers || {}));
