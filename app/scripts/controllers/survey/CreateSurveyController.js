(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateSurveyController: function (scope, resourceFactory, location) {
            scope.formData = {};
            resourceFactory.surveyTemplateResource.get({}, function (data) {
                scope.surveyEntityTypes = data.surveyEntityTypes;
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
                resourceFactory.surveyResource.save(scope.reqFormData, function (data) {
                    location.path('/admin/system/surveys');
                });
            }
        }
    });
    mifosX.ng.application.controller('CreateSurveyController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CreateSurveyController]).run(function ($log) {
        $log.info("CreateSurveyController initialized");
    });
}(mifosX.controllers || {}));