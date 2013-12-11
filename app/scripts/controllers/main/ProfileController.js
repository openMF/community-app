(function(module) {
    mifosX.controllers = _.extend(module, {
        ProfileController: function(scope,localStorageService) {
           scope.userDetails = localStorageService.get('userData');
            scope.status = 'Not Authenticated';
            if(scope.userDetails.authenticated==true){
                scope.status = 'Authenticated';
            }
        }
    });
    mifosX.ng.application.controller('ProfileController', ['$scope', 'localStorageService', mifosX.controllers.ProfileController]).run(function($log) {
        $log.info("ProfileController initialized");
    });
}(mifosX.controllers || {}));
