(function (module) {
    mifosX.controllers = _.extend(module, {
        AuditController: function (scope, resourceFactory,paginatorService, dateFilter, location) {
            scope.formData = [];
            scope.isCollapsed = true;
            scope.date = {};
            scope.audit = [];
            scope.searchData = [];

            resourceFactory.auditResource.get({templateResource: 'searchtemplate'}, function (data) {
                scope.template = data;
            });
            scope.viewUser = function (item) {
                scope.userTypeahead = true;
                scope.formData.user = item.id;
            };

            scope.routeTo = function (id) {
                location.path('viewaudit/' + id);
            };

            scope.search = function(){
                scope.audit = paginatorService.paginate(fetchFunction, 14);
            };

            var fetchFunction = function (offset, limit,callback) {
                scope.isCollapsed = true;
                scope.displayResults = true;
                var reqFirstDate = dateFilter(scope.date.first, 'yyyy-MM-dd');
                var reqSecondDate = dateFilter(scope.date.second, 'yyyy-MM-dd');
                var reqThirdDate = dateFilter(scope.date.third, 'yyyy-MM-dd');
                var reqFourthDate = dateFilter(scope.date.fourth, 'yyyy-MM-dd');

                var params = {};
                    params.offset = offset;
                    params.limit = limit;
                    params.paged = true;

                if (scope.formData.action) {
                    params.actionName = scope.formData.action;
                }
                ;

                if (scope.formData.entity) {
                    params.entityName = scope.formData.entity;
                }
                ;

                if (scope.formData.status) {
                    params.processingResult = scope.formData.status;
                }
                ;

                if (scope.formData.status == 0) {
                    params.processingResult = scope.formData.status;
                }
                ;

                if (scope.formData.resourceId) {
                    params.resourceId = scope.formData.resourceId;
                }
                ;

                if (scope.formData.user) {
                    params.makerId = scope.formData.user;
                }
                ;

                if (scope.date.first) {
                    params.makerDateTimeFrom = reqFirstDate;
                }
                ;

                if (scope.date.second) {
                    params.makerDateTimeTo = reqSecondDate;
                }
                ;

                if (scope.formData.checkedBy) {
                    params.checkerId = scope.formData.checkedBy;
                }
                ;

                if (scope.date.third) {
                    params.checkerDateTimeFrom = reqThirdDate;
                }
                ;

                if (scope.date.fourth) {
                    params.checkerDateTimeTo = reqFourthDate;
                }
                ;
                resourceFactory.auditResource.search(params,function(data) {
                    scope.searchData.pageItems = data.pageItems;

                    if (scope.searchData.pageItems == '') {
                        scope.flag = false;
                    } else {
                        scope.flag = true;
                    }
                    scope.row = [];
                    scope.csvData = [];
                    if (scope.userTypeahead) {
                        scope.formData.user = '';
                        scope.userTypeahead = false;
                        scope.user = '';
                    }
                    scope.row = ['Id', 'Resource Id', 'Status', 'Office', 'Made on', 'Maker', 'Checked on', 'Checker', 'Entity', 'Action', 'Client'];
                    scope.csvData.push(scope.row);
                    for (var i in scope.searchData.pageItems) {
                        scope.row = [scope.searchData.pageItems[i].id, scope.searchData.pageItems[i].resourceId, scope.searchData.pageItems[i].processingResult, scope.searchData.pageItems[i].officeName,dateFilter(scope.searchData.pageItems[i].madeOnDate, 'yyyy-MM-dd'), scope.searchData.pageItems[i].maker, dateFilter(scope.searchData.pageItems[i].checkedOnDate, 'yyyy-MM-dd hh:mm:ss'), scope.searchData.pageItems[i].checker, scope.searchData.pageItems[i].entityName, scope.searchData.pageItems[i].actionName, scope.searchData.pageItems[i].clientName];
                        scope.csvData.push(scope.row);
                    }
                    callback(data);
                });
            };

            scope.audit = paginatorService.paginate(fetchFunction, 14);

        }
    });
    mifosX.ng.application.controller('AuditController', ['$scope', 'ResourceFactory','PaginatorService', 'dateFilter', '$location', mifosX.controllers.AuditController]).run(function ($log) {
        $log.info("AuditController initialized");
    });
}(mifosX.controllers || {}));


