(function(module) {
    mifosX.controllers = _.extend(module, {
        GroupController: function(scope, resourceFactory , paginatorService,location) {

            scope.groups = [];
            scope.routeTo = function(id){
                location.path('/viewgroup/' + id);
            };

            var fetchFunction = function(offset, limit, callback) {
                resourceFactory.groupResource.get({offset: offset, limit: limit, paged: 'true', 
                                orderBy: 'name', sortOrder: 'ASC'} , callback);
            };

            scope.groups = paginatorService.paginate(fetchFunction, 14);

        }
    });
    mifosX.ng.application.controller('GroupController', ['$scope', 'ResourceFactory', 'PaginatorService','$location', mifosX.controllers.GroupController]).run(function($log) {
        $log.info("GroupController initialized");
    });
}(mifosX.controllers || {}));

