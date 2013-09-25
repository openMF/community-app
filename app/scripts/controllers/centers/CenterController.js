(function(module) {
    mifosX.controllers = _.extend(module, {
        CenterController: function(scope, resourceFactory , paginatorService) {

            scope.centers = [];

            var fetchFunction = function(offset, limit, callback) {
                resourceFactory.centerResource.get({offset: offset, limit: limit} , callback);
            };

            scope.centers = paginatorService.paginate(fetchFunction, 14);
        }
    });
    mifosX.ng.application.controller('CenterController', ['$scope', 'ResourceFactory', 'PaginatorService', mifosX.controllers.CenterController]).run(function($log) {
        $log.info("CenterController initialized");
    });
}(mifosX.controllers || {}));


