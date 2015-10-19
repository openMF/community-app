(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewProvisioningEntryController: function (scope, routeParams, resourceFactory, location, $modal) {
            scope.charge = [];
            scope.choice = 0;
            var i = 0 ;
            var temp = 0 ;
            scope.totalReservedAmount;
            resourceFactory.provisioningentries.get({entryId: routeParams.entryId}, function (data) {
                scope.data = data ;
                scope.createdby = data.createdUser ;
                scope.createdDate = data.createdDate ;
                scope.entries = data.provisioningEntries ;
                scope.isjournalEntriesCreated = !data.journalEntry ;
                var length = data.provisioningEntries.length;
                for(i = 0 ; i < length; i++) {
                    temp = temp + data.provisioningEntries[i].amountreserved ;
                }
                scope.totalReservedAmount = temp.toFixed(2) ;
            });

            scope.submit = function () {
                resourceFactory.provisioningentries.createJournals({entryId: routeParams.entryId}, this.formData, function (data) {
                    location.path('/viewprovisioningentries/');
                });
            };
        }
    });
    mifosX.ng.application.controller('ViewProvisioningEntryController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', mifosX.controllers.ViewProvisioningEntryController]).run(function ($log) {
        $log.info("ViewProvisioningEntryController initialized");
    });
}(mifosX.controllers || {}));
