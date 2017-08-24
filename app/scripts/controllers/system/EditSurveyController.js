(function (module) {
    mifosX.controllers = _.extend(module, {
        EditSurveyController: function (scope, resourceFactory,routeParams, location,WizardHandler) {
            scope.formData ={};
            scope.showQuestions = true;
            scope.id = routeParams.id;
            resourceFactory.surveyResource.get({surveyId : routeParams.id},{},function(data){               
                scope.formData = data;
            });

            scope.showQuestionsForm = function(){
                if(scope.formData.key != undefined && scope.formData.key.length>0 &&  
                    scope.formData.name != undefined && scope.formData.name.length>0 && 
                    scope.formData.countryCode != undefined && scope.formData.countryCode.length>0){
                    scope.showQuestions = true; 
                    if(scope.formData.questionDatas == undefined || scope.formData.questionDatas.length==0){
                        scope.showQuestionForm();
                    }
                }
                
            };

            scope.showQuestionForm = function(){
                var question = {};
                question.responseDatas = [];
                question.responseDatas.push({});
                scope.formData.questionDatas.push(question);
            };

            scope.showOptionForm = function(question){
                question.responseDatas.push({});
            }

            scope.deleteOption = function(question,index){
                question.responseDatas.splice(index,1);
            }

            scope.deleteQuestion = function(index){
                scope.formData.questionDatas.splice(index,1);
            }

            scope.updateSequenceNumber = function(){
                if(scope.formData.questionDatas != undefined && scope.formData.questionDatas.length>0){
                    for(var i=0;i<scope.formData.questionDatas.length;i++){
                        scope.formData.questionDatas[i].sequenceNo = i + 1;
                        if(scope.formData.questionDatas[i].responseDatas != undefined && scope.formData.questionDatas[i].responseDatas.length>0){
                            for(var j=0;j<scope.formData.questionDatas[i].responseDatas.length;j++){
                                scope.formData.questionDatas[i].responseDatas[j].sequenceNo = j + 1;
                            }
                        }
                    }
                }   
            };

            scope.updateSurvey = function(){
                scope.updateSequenceNumber();
                resourceFactory.surveyResource.update({surveyId : routeParams.id},scope.formData,function(data){
                    location.path('/viewsurvey/'+data.resourceId);
                });
            }
        }
    });

    mifosX.ng.application.controller('EditSurveyController', ['$scope', 'ResourceFactory', '$routeParams', '$location','WizardHandler', mifosX.controllers.EditSurveyController]).run(function ($log) {
        $log.info("EditSurveyController initialized");
    });
}(mifosX.controllers || {}));