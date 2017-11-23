(function (module) {
    mifosX.controllers = _.extend(module, {
        SurveyController: function (scope, resourceFactory, location, routeParams, localStorageService, $uibModal) {
            
            scope.clientId = routeParams.clientId;
            scope.formData = {};
            scope.surveyData = {};
            scope.survey = {};

            resourceFactory.surveyResource.getAll({isActive: true}, function (data) {
                scope.surveys = data;
            });

            scope.surveySelected = function (surveyData) {
                if(surveyData) {
                    scope.surveyData = surveyData;

                    function groupBy( array , f )
                    {
                      var groups = {};
                      array.forEach( function( o )
                      {
                        var group = JSON.stringify( f(o) );
                        groups[group] = groups[group] || [];
                        groups[group].push( o );  
                      });
                      return Object.keys(groups).map( function( group )
                      {
                        return groups[group]; 
                      })
                    }
                    
                    var result = groupBy(scope.surveyData.questionDatas, function(item)
                    {
                      return [item.componentKey];
                    });

                    scope.componentGroups = result;
                }
                
            }

            scope.submit = function () {
                this.formData.userId = localStorageService.getFromLocalStorage('userData').userId;
                this.formData.clientId = routeParams.clientId;
                this.formData.surveyId = scope.surveyData.id;
                this.formData.scorecardValues = [];
                this.formData.surveyName = '';
                this.formData.username = '';
                this.formData.id = 0;

                for(i=0; i < scope.surveyData.questionDatas.length; i++){
                    if(scope.surveyData.questionDatas[i].answer) {
                        var tmp = {};
                        tmp.questionId = scope.surveyData.questionDatas[i].id;
                        tmp.responseId = scope.surveyData.questionDatas[i].answer.id
                        tmp.value = scope.surveyData.questionDatas[i].answer.value
                        tmp.createdOn = new Date().getTime();
                        this.formData.scorecardValues.push(tmp);
                    }
                }
                resourceFactory.surveyScorecardResource.post({surveyId: scope.surveyData.id}, this.formData, function (data) {
                    location.path('/clients/survey/' + scope.clientId);
                });
            };
            scope.isAnyResponse = function(){
                for(i=0; i < scope.surveyData.questionDatas.length; i++){
                    if(scope.surveyData.questionDatas[i].answer) {
                        return false;
                    }
                }
                return true;
            };

            scope.cancel = function () {
                if (scope.clientId) {
                    location.path('/clients/survey/' + scope.clientId);
                } else {
                    location.path('/clients');
                }
            }

        }
    });
    mifosX.ng.application.controller('SurveyController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'localStorageService','$uibModal', mifosX.controllers.SurveyController]).run(function ($log) {
        $log.info("SurveyController initialized");
    });
}(mifosX.controllers || {}));
