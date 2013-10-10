(function(module) {
    mifosX.controllers = _.extend(module, {
        AuditController: function(scope, resourceFactory) {
            scope.formData = [];
            scope.isCollapsed = true;
            resourceFactory.auditResource.get({templateResource: 'searchtemplate'} , function(data) {
                scope.template = data;
            });
            scope.search = function(){
                scope.isCollapsed = true;
                scope.displayResults = true;
                var params = {};
                if (scope.formData.action) { params.actionName = scope.formData.action; };

                if (scope.formData.entity) { params.entityName = scope.formData.entity; };

                if (scope.formData.resourceId) { params.resourceId = scope.formData.resourceId; };

                if (scope.formData.user) { params.makerId = scope.formData.user; };

                if (scope.formData.fromDate) { params.makerDateTimeFrom = scope.formData.fromDate; };

                if (scope.formData.toDate) { params.makerDateTimeto = scope.formData.toDate; };

                if (scope.formData.checkedBy) { params.checkerId = scope.formData.checkedBy; };

                if (scope.formData.checkedFrom) { params.checkerDateTimeFrom = scope.formData.checkedFrom; };

                if (scope.formData.checkedTo) { params.checkerDateTimeTo = scope.formData.checkedTo; };
                resourceFactory.auditResource.search(params , function(data) {
                    scope.searchData = data;
                });

            };
        }
    });
    mifosX.ng.application.controller('AuditController', ['$scope', 'ResourceFactory', mifosX.controllers.AuditController]).run(function($log) {
        $log.info("AuditController initialized");
    });
}(mifosX.controllers || {}));


