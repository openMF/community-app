(function (module) {
    mifosX.controllers = _.extend(module, {
        ManageSurveysController: function (scope, resourceFactory, location,WizardHandler) {
            scope.surveys = [];
            scope.step = 1;
            scope.noOfTabs = 2;
            scope.showQForm = false;
            scope.showOptForm = false;
            scope.showQBtn = true;
            scope.showOptBtn = false;
            //this will cause the step to be hidden
            scope.disabled = 'true';
            scope.question = {
                responseDatas: []
            };
            scope.option = {};
            scope.formData = {
                questionDatas: []
            };
            resourceFactory.surveyResource.get(function(data){
                scope.surveys = data;
            });

            scope.submitDetails = function () {
                if (WizardHandler.wizard().getCurrentStep() != scope.noOfTabs) {
                    WizardHandler.wizard().next();
                }
            }
            scope.checkBasicDetails = function(){
                return false;
            }
            scope.showQuestionForm = function(){
                scope.showQForm = true;
                scope.showQBtn = false;
                scope.showOptBtn = true;
            }
            scope.showOptionForm = function(){
                scope.showOptForm = true;
                scope.showOptBtn = false;
            }
            scope.discardOpt = function(){
                scope.option = {};
                scope.showOptForm = false;
                scope.showOptBtn = true;
            }
            scope.deleteOption = function(index){
                scope.question.responseDatas.splice(index,1);
                for (var i = 0; i < scope.question.responseDatas.length; i++) {
                    scope.question.responseDatas[i].sequenceNo = i + 1;
                }
            }
            scope.deleteQuestion = function(index){
                scope.formData.questionDatas.splice(index,1);
                for (var i = 0; i < scope.formData.questionDatas.length; i++) {
                    scope.formData.questionDatas[i].sequenceNo = i + 1;
                }
            }
            scope.discardQuestion = function(){
                scope.option = {};
                scope.showOptForm = false;
                scope.showOptBtn = false;
                scope.question = {
                    responseDatas: []
                };
                scope.showQBtn =true;
                scope.showQForm = false;

            }
            scope.addOpt = function(){
                scope.option.sequenceNo = scope.question.responseDatas.length + 1;
                scope.question.responseDatas.push(scope.option);
                scope.option = {};
                scope.showOptForm = false;
                scope.showOptBtn = true;
            }
            scope.addQuestion = function(){
                if(scope.question.responseDatas.length == 0){
                    alert("Cannot add question without options");
                    return;
                }
                scope.question.sequenceNo = scope.formData.questionDatas.length + 1;
                scope.formData.questionDatas.push(scope.question);
                scope.discardQuestion();
            }
            scope.createSurvey = function(){
                resourceFactory.surveyResource.save(scope.formData,function(data){
                    location.path('/surveys');
                });
            }
        }
    });

    mifosX.ng.application.controller('ManageSurveysController', ['$scope', 'ResourceFactory', '$location','WizardHandler', mifosX.controllers.ManageSurveysController]).run(function ($log) {
        $log.info("ManageSurveysController initialized");
    });
}(mifosX.controllers || {}));