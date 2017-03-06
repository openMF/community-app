(function (module) {
    mifosX.controllers = _.extend(module, {
        AccOGMController: function (scope, resourceFactory, paginatorService,routeParams, location,$uibModal) {
            scope.routeTo = function (id) {
                location.path('/viewofficeglmapping/' + id);
            };

            var fetchFunction = function () {
                var params = {};
                resourceFactory.officeToGLAccountMappingResource.search(params, callback);
            };

            scope.mappingDatas =  paginatorService.paginate();

        }
    });
    mifosX.ng.application.controller('AccOGMController', ['$scope', 'ResourceFactory',  'PaginatorService', '$routeParams','$location','$uibModal', mifosX.controllers.AccOGMController]).run(function ($log) {
        $log.info("AccOGMController initialized");
    });
}(mifosX.controllers || {}));