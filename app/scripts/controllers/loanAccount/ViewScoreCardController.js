(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewScoreCardController: function (scope, resourceFactory, location, routeParams, localStorageService,$modal) {

            scope.clientId = routeParams.clientId;
            scope.loanApplicationReferenceId = routeParams.loanApplicationReferenceId;
            scope.surveyId = routeParams.surveyId;

            resourceFactory.surveyResourceScorecards.getAll({surveyId: scope.surveyId, clientId: scope.clientId},function(data){
               scope.surveyScoreCards = data;

                for(var i = 0;i <  scope.surveyScoreCards.length; i++){
                    scope.createdOn = scope.surveyScoreCards[i].createdOn;
                    scope.scorecardValues = scope.surveyScoreCards[i].scorecardValues;
                }

            });

        }
    });
    mifosX.ng.application.controller('ViewScoreCardController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'localStorageService','$modal', mifosX.controllers.ViewScoreCardController]).run(function ($log) {
        $log.info("ViewScoreCardController initialized");
    });
}(mifosX.controllers || {}));
