(function(module) {
    mifosX.controllers = _.extend(module, {
        CenterController: function(scope, resourceFactory , paginatorService,location) {

            scope.centers = [];
            scope.routeTo = function(id){
               location.path('/viewcenter/' + id);
            };

            var fetchFunction = function(offset, limit, callback) {
                resourceFactory.centerResource.get({offset: offset, limit: limit, paged: 'true', 
                                orderBy: 'name', sortOrder: 'ASC'} , callback);
            };

            scope.centers = paginatorService.paginate(fetchFunction, 14);
        }
    });
    mifosX.ng.application.controller('CenterController', ['$scope', 'ResourceFactory', 'PaginatorService','$location', mifosX.controllers.CenterController]).run(function($log) {
        $log.info("CenterController initialized");
    });
}(mifosX.controllers || {}));


