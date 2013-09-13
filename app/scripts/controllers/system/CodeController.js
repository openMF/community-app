(function(module) {
    mifosX.controllers = _.extend(module, {
        CodeController: function(scope, resourceFactory) {
            scope.codes = [];
            resourceFactory.codeResources.getAllCodes(function(data){
                scope.codes = data;
        });
       }
     });
    mifosX.ng.application.controller('CodeController', ['$scope', 'ResourceFactory', mifosX.controllers.CodeController]).run(function($log) {
        $log.info("CodeController initialized");
    });
}(mifosX.controllers || {}));
