(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewEntityTypeSurveys: function (scope, routeParams, resourceFactory, location) {
            scope.entityType = routeParams.entityType;
            scope.entityId = routeParams.entityId;
            scope.isValidEntityType = false;
            resourceFactory.surveyTemplateResource.get({}, function (data) {
                scope.surveyEntityTypes = data.surveyEntityTypes;
                for(var i in scope.surveyEntityTypes){
                    if(scope.surveyEntityTypes[i].value === scope.entityType.toUpperCase()){
                        scope.isValidEntityType = true;
                        scope.entityTypeId = scope.surveyEntityTypes[i].id;
                        if(scope.surveyEntityTypes[i].value === 'CLIENTS'){
                            scope.entityTypeName = 'label.anchor.clients';
                            scope.entityTypeUrl = 'clients';
                            scope.backUrl = "viewclient/"+scope.entityId;
                            resourceFactory.clientResource.get({clientId: scope.entityId}, function (data) {
                                scope.entityDisplayName = data.displayName;
                            });
                        }else if(scope.surveyEntityTypes[i].value === 'CENTERS'){
                            scope.entityTypeName = 'label.anchor.centers';
                            scope.entityTypeUrl = 'centers';
                            scope.backUrl = "viewcenter/"+scope.entityId;
                            resourceFactory.centerResource.get({centerId: scope.entityId}, function (data) {
                                scope.entityDisplayName = data.name;
                            });
                        }
                        break;
                    }
                }
                if(scope.isValidEntityType){
                    resourceFactory.takeSurveysResource.getAll({entityType : scope.entityTypeId,entityId:scope.entityId}, function (surveys) {
                        scope.surveys = surveys;
                    });
                }
            });
        }
    });
    mifosX.ng.application.controller('ViewEntityTypeSurveys', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.ViewEntityTypeSurveys]).run(function ($log) {
        $log.info("ViewEntityTypeSurveys initialized");
    });
}(mifosX.controllers || {}));