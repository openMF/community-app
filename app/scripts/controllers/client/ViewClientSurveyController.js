(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewClientSurveyController: function (scope, resourceFactory, location, routeParams) {
            
            scope.clientId = routeParams.clientId;
            scope.surveys = [];
            resourceFactory.clientSurveyScorecardResource.get({clientId: scope.clientId}, function (data) {
                scope.constructSurvey(data);
            });

            scope.constructSurvey = function(data){
            	for(var i in data){
            		for(var j in data[i].scorecardValues){
            			var survey = {'surveyName':data[i].surveyName,'createdby':data[i].username,'date':data[i].scorecardValues[j].createdOn,'score':data[i].scorecardValues[j].value};
            			scope.surveys.push(survey);
            		}
            	}
            };

            scope.routeTo = function(){
            	location.path('/survey/'+scope.clientId);
            };

        }
    });
    mifosX.ng.application.controller('ViewClientSurveyController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.ViewClientSurveyController]).run(function ($log) {
        $log.info("ViewClientSurveyController initialized");
    });
}(mifosX.controllers || {}));
