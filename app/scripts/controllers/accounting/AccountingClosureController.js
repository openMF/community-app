(function (module) {
    mifosX.controllers = _.extend(module, {
        AccountingClosureController: function (scope, resourceFactory, location, translate, routeParams, dateFilter, $rootScope, paginatorService) {
            scope.first = {};
            scope.formData = {};
            scope.first.date = new Date();
            scope.accountClosures = [];
            scope.restrictDate = new Date();
            scope.isTreeView = false;
            var idToNodeMap = {};
            scope.showclosure = true;
            scope.getFetchData = true;
            scope.tempOfficeId = 1;
            var params = {}
            scope.showClosure = false;
            scope.accountClosurePerPage = 10;
            scope.limitToOne = false;

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
                resourceFactory.accountingClosureResource.get({officeId: officeId, limitToOne: false}, function (data) {
                    scope.accountClosures = data;
                    scope.lastClosed = undefined;
                    if (data.length > 0) {
                        scope.lastClosed = data[0].closingDate;
                    }
                });
            }

            scope.fetchFunction = function (offset, limit, callback) {
                var params = {};
                params.offset = offset;
                params.limit = limit;
                params.paged ='true';
                params.orderBy = 'name';
                params.officeId = scope.tempOfficeId;
                params.limitToOne = scope.limitToOne;
                params.sortOrder = 'ASC';
                resourceFactory.accountingClosureResource.getView(params, callback);
            }


            scope.closedAccountingDetails = function (officeId, limitToOne) {
                scope.tempOfficeId = officeId;
                scope.limitToOne = limitToOne;
                scope.accountClosures = paginatorService.paginate(scope.fetchFunction, scope.accountClosurePerPage);
            }
            scope.fetchData = function (officeId) {
                scope.tempOfficeId = officeId;
                scope.limitToOne = false;
                scope.accountClosures = paginatorService.paginate(scope.fetchFunction, scope.accountClosurePerPage);
                if( scope.accountClosures) {
                    scope.showClosure = true;
                }else{
                        scope.showClosure = false;
                }
                }
        }
    });
    mifosX.ng.application.controller('AccountingClosureController', ['$scope', 'ResourceFactory', '$location', '$translate', '$routeParams', 'dateFilter', '$rootScope', 'PaginatorService', mifosX.controllers.AccountingClosureController]).run(function ($log) {
        $log.info("AccountingClosureController initialized");
    });
}(mifosX.controllers || {}));
