(function(module) {
    mifosX.controllers = _.extend(module, {
        ViewAccountingClosureController: function(scope, resourceFactory, location, routeParams) {
            scope.accountClosure = {};
            scope.choice = 0;
            resourceFactory.accountingClosureResource.getView({accId:routeParams.id}, function(data){
                scope.accountClosure = data;
            });
            scope.deleteClosure = function() {
                resourceFactory.accountingClosureResource.delete({accId:routeParams.id},{}, function(data){
                    location.path('/accounts_closure');
                });
            };
        }
    });
    mifosX.ng.application.controller('ViewAccountingClosureController', ['$scope', 'ResourceFactory', '$location','$routeParams', mifosX.controllers.ViewAccountingClosureController]).run(function($log) {
        $log.info("ViewAccountingClosureController initialized");
    });
}(mifosX.controllers || {}));
