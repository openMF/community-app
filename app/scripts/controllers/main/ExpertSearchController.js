(function (module) {
    mifosX.controllers = _.extend(module, {
        ExpertSearchController: function (scope, resourceFactory, location) {
        	
        	scope.dashModel = 'dashboard';
            scope.switch = function() {
	        	location.path('/richdashboard');
			}
        }

    });
    mifosX.ng.application.controller('ExpertSearchController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.ExpertSearchController]).run(function ($log) {
        $log.info("ExpertSearchController initialized");
    });
}(mifosX.controllers || {}));

