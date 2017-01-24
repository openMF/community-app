(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewAllProvisoningEntriesController: function (scope, routeParams, paginatorService, resourceFactory, location, $uibModal) {

            scope.routeTo = function (id) {
                location.path('/viewprovisioningentry/' + id);
            };

            scope.viewJournals = function (id) {
                location.path('/viewprovisioningjournalentry/' + id);
            };

            scope.recreate = function (id) {
                resourceFactory.provisioningentries.reCreateProvisioningEntries({entryId: id}, this.formData, function (data) {
                    location.path('/viewprovisioningentry/'+id);
                });
            };

            scope.searchTransaction = function () {
                scope.entries = paginatorService.paginate(fetchFunction, 10);
            };

            var fetchFunction = function (offset, limit, callback) {
                var params = {};
                params.offset = offset;
                params.limit = limit;
                params.locale = scope.optlang.code;
                params.dateFormat = scope.df;
                scope.saveSC();
                resourceFactory.provisioningentries.getAll(params, callback) ;
            };

            paginatorService.currentOffset = 0 ;
            scope.entries = paginatorService.paginate(fetchFunction, 10);
        }
    });
    mifosX.ng.application.controller('ViewAllProvisoningEntriesController', ['$scope', '$routeParams', 'PaginatorService', 'ResourceFactory', '$location', '$uibModal', mifosX.controllers.ViewAllProvisoningEntriesController]).run(function ($log) {
        $log.info("ViewAllProvisoningEntriesController initialized");
    });
}(mifosX.controllers || {}));
