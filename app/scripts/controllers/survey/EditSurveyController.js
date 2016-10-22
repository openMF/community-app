(function (module) {
    mifosX.controllers = _.extend(module, {
        EditSurveyController: function (scope, routeParams, resourceFactory, location) {
            scope.surveyId = routeParams.surveyId;
            scope.formData = {};
            resourceFactory.surveyTemplateResource.get({}, function (data) {
                scope.surveyEntityTypes = data.surveyEntityTypes;
                resourceFactory.surveyResource.getBySurveyId({surveyId: scope.surveyId}, function (data) {
                    scope.surveyData =  {};
                    angular.copy(data,scope.surveyData);
                    scope.formData.key = scope.surveyData.key;
                    scope.formData.name = scope.surveyData.name;
                    scope.formData.entityTypeId = scope.surveyData.entityTypeId;
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
            });

            scope.addNewComponent = function () {
                if (_.isUndefined(scope.formData.componentDatas)){
                    scope.formData.componentDatas = [];
                }
                scope.formData.componentDatas.push({});
            };
            scope.addNewQuestion = function (index) {
                var questionData = {};
                if (_.isUndefined(scope.formData.componentDatas[index].questionDatas)) {
                    scope.formData.componentDatas[index].questionDatas = [];
                }
                questionData.componentKey = scope.formData.componentDatas[index].key;
                scope.formData.componentDatas[index].questionDatas.push(questionData);
            };
            scope.addNewQuestionOptions = function (componentIndex, questionIndex) {
                if (_.isUndefined(scope.formData.componentDatas[componentIndex].questionDatas[questionIndex].responseDatas)) {
                    scope.formData.componentDatas[componentIndex].questionDatas[questionIndex].responseDatas = [];
                }
                scope.formData.componentDatas[componentIndex].questionDatas[questionIndex].responseDatas.push({});
            };

            var componentDataSequenceNo = 0;
            var questionSequenceNo = 0;
            var questionResponseSequenceNo = 0;
            scope.submit = function () {
                scope.reqFormData = {};
                angular.copy(scope.formData,scope.reqFormData);
                for (var i in scope.reqFormData.componentDatas) {
                    if (!_.isUndefined(scope.reqFormData.componentDatas[i]) && (_.isUndefined(scope.reqFormData.componentDatas[i].key) || _.isUndefined(scope.reqFormData.componentDatas[i].text))) {
                        delete scope.reqFormData.componentDatas[i];
                    } else {
                        componentDataSequenceNo++;
                        scope.reqFormData.componentDatas[i].sequenceNo = componentDataSequenceNo;
                        scope.reqFormData.componentDatas[i].description = null;
                        for (var j in scope.reqFormData.componentDatas[i].questionDatas) {
                            if( _.isUndefined(scope.reqFormData.questionDatas)){
                                scope.reqFormData.questionDatas = [];
                            }
                            if (!_.isUndefined(scope.reqFormData.componentDatas[i].questionDatas[j]) && ( _.isUndefined(scope.reqFormData.componentDatas[i].questionDatas[j].key) || _.isUndefined(scope.reqFormData.componentDatas[i].questionDatas[j].text))) {
                                delete scope.reqFormData.componentDatas[i].questionDatas[j];
                            } else {
                                questionSequenceNo++;
                                scope.reqFormData.componentDatas[i].questionDatas[j].sequenceNo = questionSequenceNo;
                                for (var k in scope.reqFormData.componentDatas[i].questionDatas[j].responseDatas) {
                                    if (!_.isUndefined(scope.reqFormData.componentDatas[i].questionDatas[j].responseDatas[k]) && (_.isUndefined(scope.reqFormData.componentDatas[i].questionDatas[j].responseDatas[k].text) || _.isUndefined(scope.reqFormData.componentDatas[i].questionDatas[j].responseDatas[k].value))) {
                                        delete scope.reqFormData.componentDatas[i].questionDatas[j].responseDatas[k];
                                    }else{
                                        questionResponseSequenceNo++;
                                        scope.reqFormData.componentDatas[i].questionDatas[j].responseDatas[k].sequenceNo = questionResponseSequenceNo;
                                    }
                                }
                            }
                        }
                        if( !_.isUndefined(scope.reqFormData.componentDatas[i].questionDatas)){
                            var questionDatas = [];
                            angular.copy(scope.reqFormData.componentDatas[i].questionDatas,questionDatas);
                            for(var z in questionDatas){
                                scope.reqFormData.questionDatas.push(questionDatas[z]);
                            }
                        }
                    }
                }
                for (var jj in scope.reqFormData.componentDatas) {
                    delete scope.reqFormData.componentDatas[jj].questionDatas;
                }
                //console.log(JSON.stringify(scope.reqFormData));
                resourceFactory.surveyResource.update({surveyId: scope.surveyId},scope.reqFormData, function (data) {
                    location.path('/admin/system/surveys/view/'+scope.surveyId);
                });
            }
        }
    });
    mifosX.ng.application.controller('EditSurveyController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.EditSurveyController]).run(function ($log) {
        $log.info("EditSurveyController initialized");
    });
}(mifosX.controllers || {}));