(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSurveyController: function (scope, resourceFactory,routeParams, location) {
            scope.formData ={};
            scope.showQuestions = true;
            scope.id = routeParams.id;
            resourceFactory.surveyResource.get({surveyId : scope.id},{},function(data){               
                scope.formData = data;
            });
        }
    });

    mifosX.ng.application.controller('ViewSurveyController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.ViewSurveyController]).run(function ($log) {
        $log.info("ViewSurveyController initialized");
    });
}(mifosX.controllers || {}));