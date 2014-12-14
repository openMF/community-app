(function (module) {
    mifosX.controllers = _.extend(module, {
        AuditController: function (scope, resourceFactory, paginatorService, dateFilter, location) {
            scope.formData = [];
            scope.isCollapsed = true;
            scope.date = {};
            scope.audit = [];
            scope.searchData = [];

            scope.routeTo = function (id) {
                location.path('viewaudit/' + id);
            };

            resourceFactory.auditResource.get({templateResource: 'searchtemplate'}, function (data) {
                scope.template = data;
            });

            scope.viewUser = function (item) {
                scope.formData.user = item.id;
            };

            if (!scope.searchCriteria.audit) {
                scope.searchCriteria.audit = [null, null, null, null, null, null, null, null, null, null];
                scope.saveSC();
            }
            scope.formData.user = scope.searchCriteria.audit[0];
            scope.date.first = scope.searchCriteria.audit[1];
            scope.date.third = scope.searchCriteria.audit[2];
            scope.formData.status = scope.searchCriteria.audit[3];
            if (scope.searchCriteria.audit[4])
                scope.formData.action = scope.searchCriteria.audit[4];
            scope.formData.resourceId = scope.searchCriteria.audit[5];
            scope.date.second = scope.searchCriteria.audit[6];
            scope.date.fourth = scope.searchCriteria.audit[7];
            if (scope.searchCriteria.audit[8])
                scope.formData.entity = scope.searchCriteria.audit[8];
            if (scope.searchCriteria.audit[9])
                scope.formData.checkedBy = scope.searchCriteria.audit[9];

            var fetchFunction = function (offset, limit, callback) {
                scope.isCollapsed = true;
                scope.displayResults = true;
                //date format not used here since the underlying api does not support localization of dates
                var reqFirstDate = dateFilter(scope.date.first, 'yyyy-MM-dd');
                var reqSecondDate = dateFilter(scope.date.second, 'yyyy-MM-dd');
                var reqThirdDate = dateFilter(scope.date.third, 'yyyy-MM-dd');
                var reqFourthDate = dateFilter(scope.date.fourth, 'yyyy-MM-dd');

                var params = {};
                params.offset = offset;
                params.limit = limit;
                params.paged = true;

                if (scope.formData.user) {
                    if (scope.formData.user != parseInt(scope.formData.user)) {
                        for (var i = 0; i < scope.template.appUsers.length; i++) {
                            if (scope.formData.user == scope.template.appUsers[i].username)
                                scope.formData.user = scope.template.appUsers[i].id;
                        }
                    }
                    params.makerId = scope.formData.user;
                    scope.searchCriteria.audit[0] = params.makerId;
                } else
                    scope.searchCriteria.audit[0] = null;

                if (scope.date.first) {
                    params.makerDateTimeFrom = reqFirstDate;
                    scope.searchCriteria.audit[1] = params.makerDateTimeFrom;
                } else
                    scope.searchCriteria.audit[1] = null;

                if (scope.date.third) {
                    params.checkerDateTimeFrom = reqThirdDate;
                    scope.searchCriteria.audit[2] = params.checkerDateTimeFrom;
                } else
                    scope.searchCriteria.audit[2] = null;

                if (scope.formData.status) {
                    params.processingResult = scope.formData.status;
                    scope.searchCriteria.audit[3] = params.processingResult;
                } else
                    scope.searchCriteria.audit[3] = null;

                if (scope.formData.action) {
                    params.actionName = scope.formData.action;
                    scope.searchCriteria.audit[4] = params.actionName;
                } else
                    scope.searchCriteria.audit[4] = null;

                if (scope.formData.resourceId) {
                    params.resourceId = scope.formData.resourceId;
                    scope.searchCriteria.audit[5] = params.resourceId;
                } else
                    scope.searchCriteria.audit[5] = null;

                if (scope.date.second) {
                    params.makerDateTimeTo = reqSecondDate;
                    scope.searchCriteria.audit[6] = params.makerDateTimeTo;
                } else
                    scope.searchCriteria.audit[6] = null;

                if (scope.date.fourth) {
                    params.checkerDateTimeTo = reqFourthDate;
                    scope.searchCriteria.audit[7] = params.checkerDateTimeTo;
                } else
                    scope.searchCriteria.audit[7] = null;

                if (scope.formData.entity) {
                    params.entityName = scope.formData.entity;
                    scope.searchCriteria.audit[8] = params.entityName;
                } else
                    scope.searchCriteria.audit[8] = null;

                if (scope.formData.checkedBy) {
                    params.checkerId = scope.formData.checkedBy;
                    scope.searchCriteria.audit[9] = params.checkerId;
                } else
                    scope.searchCriteria.audit[9] = null;

                scope.saveSC();
                resourceFactory.auditResource.search(params, function (data) {
                    scope.searchData.pageItems = data.pageItems;

                    if (scope.searchData.pageItems == '')
                        scope.flag = false;
                    else
                        scope.flag = true;

                    scope.row = [];
                    scope.csvData = [];

                    scope.row = ['Id', 'Resource Id', 'Status', 'Office', 'Made on', 'Maker', 'Checked on', 'Checker', 'Entity', 'Action', 'Client'];
                    scope.csvData.push(scope.row);
                    for (var i in scope.searchData.pageItems) {
                        scope.row = [scope.searchData.pageItems[i].id, scope.searchData.pageItems[i].resourceId, scope.searchData.pageItems[i].processingResult, scope.searchData.pageItems[i].officeName, dateFilter(scope.searchData.pageItems[i].madeOnDate, 'yyyy-MM-dd'), scope.searchData.pageItems[i].maker, dateFilter(scope.searchData.pageItems[i].checkedOnDate, 'yyyy-MM-dd hh:mm:ss'), scope.searchData.pageItems[i].checker, scope.searchData.pageItems[i].entityName, scope.searchData.pageItems[i].actionName, scope.searchData.pageItems[i].clientName];
                        scope.csvData.push(scope.row);
                    }
                    callback(data);
                });
            };

            scope.clearFilters = function () {
                scope.formData.user = null;
                scope.date.first = null;
                scope.date.third = null;
                scope.formData.status = null;
                scope.formData.action = "";
                scope.formData.resourceId = null;
                scope.date.second = null;
                scope.date.fourth = null;
                scope.formData.entity = "";
                scope.formData.checkedBy = "";
            };

            scope.searchAudit = function () {
                scope.audit = paginatorService.paginate(fetchFunction, 14);
            };
            scope.searchAudit();
        }
    });
    mifosX.ng.application.controller('AuditController', ['$scope', 'ResourceFactory', 'PaginatorService', 'dateFilter', '$location', mifosX.controllers.AuditController]).run(function ($log) {
        $log.info("AuditController initialized");
    });
}(mifosX.controllers || {}));