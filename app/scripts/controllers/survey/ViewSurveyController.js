(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSurveyController: function (scope, routeParams, resourceFactory, location) {
            scope.surveyId = routeParams.surveyId;
            scope.formData = {};
            resourceFactory.surveyResource.getBySurveyId({surveyId: scope.surveyId}, function (data) {
                scope.surveyData =  {};
                angular.copy(data,scope.surveyData);
                scope.formData.id = scope.surveyData.id;
                scope.formData.key = scope.surveyData.key;
                scope.formData.name = scope.surveyData.name;
                scope.formData.entityTypeId = scope.surveyData.entityTypeId;
                scope.formData.entityTypeValue = scope.surveyData.entityTypeValue;
                if(!_.isUndefined(data.componentDatas)){
                    if(data.componentDatas.length > 0){
                        scope.formData.componentDatas = scope.surveyData.componentDatas || [];
                    }
                }
                if(!_.isUndefined(data.questionDatas)){
                    for(var i in scope.formData.componentDatas){
                        var componentKey = scope.formData.componentDatas[i].key;
                        for(var j in data.questionDatas){
                            if(componentKey === data.questionDatas[j].componentKey){
                                if(_.isUndefined(scope.formData.componentDatas[i].questionDatas)){
                                    scope.formData.componentDatas[i].questionDatas = [];
                                }
                                scope.formData.componentDatas[i].questionDatas.push(data.questionDatas[j]);
                            }
                        }
                    }
                }
                scope.formData.active = scope.surveyData.active;
            });
        }
    });
    mifosX.ng.application.controller('ViewSurveyController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.ViewSurveyController]).run(function ($log) {
        $log.info("ViewSurveyController initialized");
    });
}(mifosX.controllers || {}));