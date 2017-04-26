(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewProvisioningJournalEntriesController: function (scope, routeParams, paginatorService, resourceFactory, location, $uibModal) {
            scope.charge = [];
            scope.choice = 0;
            scope.transactions = [];
            var fetchFunction = function (offset, limit, callback) {
                var params = {};
                params.entryId = routeParams.entryId ;
                params.offset = offset;
                params.limit = limit;
                scope.saveSC();
                resourceFactory.provisioningjournals.get(params, callback);
            };

            paginatorService.currentOffset = 0 ;
            scope.transactions = paginatorService.paginate(fetchFunction, 10);
            scope.displayResults = true;

            scope.submit = function () {
                resourceFactory.provisioningentries.createJournals({entryId: routeParams.entryId}, this.formData, function (data) {
                    location.path('/viewprovisioningentries/');
                });
            };
        }
    });
    mifosX.ng.application.controller('ViewProvisioningJournalEntriesController', ['$scope', '$routeParams', 'PaginatorService', 'ResourceFactory', '$location', '$uibModal', mifosX.controllers.ViewProvisioningJournalEntriesController]).run(function ($log) {
        $log.info("ViewProvisioningJournalEntriesController initialized");
    });
}(mifosX.controllers || {}));
