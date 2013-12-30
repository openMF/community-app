(function(module) {
    mifosX.controllers = _.extend(module, {
        AuditController: function(scope, resourceFactory,dateFilter,location) {
            scope.formData = [];
            scope.isCollapsed = true;
            scope.date = {};

            resourceFactory.auditResource.get({templateResource: 'searchtemplate'} , function(data) {
                scope.template = data;
            });
            scope.viewUser = function(item){
                scope.userTypeahead = true;
                scope.formData.user = item.id;
            };

            scope.routeTo = function(id){
                location.path('viewaudit/'+id);
            };

            scope.search = function(){
                scope.isCollapsed = true;
                scope.displayResults = true;
                var reqFirstDate = dateFilter(scope.date.first,scope.df);
                var reqSecondDate = dateFilter(scope.date.second,scope.df);
                var reqThirdDate = dateFilter(scope.date.third,scope.df);
                var reqFourthDate = dateFilter(scope.date.fourth,scope.df);
                var params = {};
                if (scope.formData.action) { params.actionName = scope.formData.action; };

                if (scope.formData.entity) { params.entityName = scope.formData.entity; };

                if(scope.formData.status) {params.processingResult = scope.formData.status;};

                if(scope.formData.status==0) {params.processingResult = scope.formData.status;};

                if (scope.formData.resourceId) { params.resourceId = scope.formData.resourceId; };

                if (scope.formData.user) { params.makerId = scope.formData.user; };

                if (scope.date.first) { params.makerDateTimeFrom = reqFirstDate; };

                if (scope.date.second) { params.makerDateTimeto = reqSecondDate; };

                if (scope.formData.checkedBy) { params.checkerId = scope.formData.checkedBy; };

                if (scope.date.third) { params.checkerDateTimeFrom = reqThirdDate; };

                if (scope.date.fourth) { params.checkerDateTimeTo = reqFourthDate; };
                resourceFactory.auditResource.search(params , function(data) {
                    scope.searchData = data;
                    if(scope.searchData==''){
                        scope.flag = false;
                    }else{scope.flag = true;}
                    scope.row = [];
                    scope.csvData = [];
                    if(scope.userTypeahead){
                        scope.formData.user = '';
                        scope.userTypeahead = false;
                        scope.user = '';
                    }
                    scope.row = ['Id','Resource Id','Status','Office','Made on','Maker','Checked on','Checker','Entity','Action','Client'];
                    scope.csvData.push(scope.row);
                    for(var i in scope.searchData){
                        scope.row = [scope.searchData[i].id,scope.searchData[i].resourceId,scope.searchData[i].processingResult,scope.searchData[i].officeName,dateFilter(scope.searchData[i].madeOnDate,'d MMMM y h:mm:ss'),scope.searchData[i].maker,dateFilter(scope.searchData[i].checkedOnDate,'d MMMM y h:mm:ss'),scope.searchData[i].checker,scope.searchData[i].entityName,scope.searchData[i].actionName,scope.searchData[i].clientName];
                        scope.csvData.push(scope.row);
                    }
                });

            };

        }
    });
    mifosX.ng.application.controller('AuditController', ['$scope', 'ResourceFactory','dateFilter','$location', mifosX.controllers.AuditController]).run(function($log) {
        $log.info("AuditController initialized");
    });
}(mifosX.controllers || {}));


