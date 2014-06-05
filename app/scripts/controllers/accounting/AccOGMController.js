(function (module) {
    mifosX.controllers = _.extend(module, {
        AccOGMController: function (scope, resourceFactory, paginatorService,routeParams, location,$modal) {
            scope.routeTo = function (id) {
                location.path('/viewofficeglmapping/' + id);
            };

            var fetchFunction = function (offset, limit, callback) {
                var params = {};
                params.offset = offset;
                params.limit = limit;
                params.locale = "en";
                params.dateFormat = "dd MMMM yyyy";
                params.orderBy = "office.id";

                resourceFactory.officeToGLAccountMappingResource.search(params, callback);
            };

            scope.mappingDatas =  paginatorService.paginate(fetchFunction, 14);

        }
    });
    mifosX.ng.application.controller('AccOGMController', ['$scope', 'ResourceFactory',  'PaginatorService', '$routeParams','$location','$modal', mifosX.controllers.AccOGMController]).run(function ($log) {
        $log.info("AccOGMController initialized");
    });
}(mifosX.controllers || {}));