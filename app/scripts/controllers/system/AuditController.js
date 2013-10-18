(function(module) {
    mifosX.controllers = _.extend(module, {
        AuditController: function(scope, resourceFactory,dateFilter) {
            scope.formData = [];
            scope.isCollapsed = true;
            scope.date = {};
            resourceFactory.auditResource.get({templateResource: 'searchtemplate'} , function(data) {
                scope.template = data;
            });
            scope.search = function(){
                scope.isCollapsed = true;
                scope.displayResults = true;
                var reqFirstDate = dateFilter(scope.date.first,'dd MMMM yyyy');
                var reqSecondDate = dateFilter(scope.date.second,'dd MMMM yyyy');
                var reqThirdDate = dateFilter(scope.date.third,'dd MMMM yyyy');
                var reqFourthDate = dateFilter(scope.date.fourth,'dd MMMM yyyy');
                var params = {};
                if (scope.formData.action) { params.actionName = scope.formData.action; };

                if (scope.formData.entity) { params.entityName = scope.formData.entity; };

                if (scope.formData.resourceId) { params.resourceId = scope.formData.resourceId; };

                if (scope.formData.user) { params.makerId = scope.formData.user; };

                if (scope.date.first) { params.makerDateTimeFrom = reqFirstDate; };

                if (scope.date.second) { params.makerDateTimeto = reqSecondDate; };

                if (scope.formData.checkedBy) { params.checkerId = scope.formData.checkedBy; };

                if (scope.date.third) { params.checkerDateTimeFrom = reqThirdDate; };

                if (scope.date.fourth) { params.checkerDateTimeTo = reqFourthDate; };
                resourceFactory.auditResource.search(params , function(data) {
                    scope.searchData = data;
                });

            };
        }
    });
    mifosX.ng.application.controller('AuditController', ['$scope', 'ResourceFactory','dateFilter', mifosX.controllers.AuditController]).run(function($log) {
        $log.info("AuditController initialized");
    });
}(mifosX.controllers || {}));


