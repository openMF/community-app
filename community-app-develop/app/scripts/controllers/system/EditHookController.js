(function (module) {
    mifosX.controllers = _.extend(module, {
        EditHookController: function (scope, routeParams, resourceFactory, location) {

            scope.formData = {};
            scope.template = {};
            scope.ugdTemplateEntities = [];
            scope.ugdTemplates = [];
            scope.ugdTemplate = [];
            scope.groupings = [];
            scope.schemaInputs = [];
            scope.events = [];
            scope.showUgdTemplatesDropdown = false;

            resourceFactory.templateResource.get(function (data) {
                scope.allUgdTemplates = data;
            });

            resourceFactory.hookResources.get({hookId: routeParams.id, template: 'true'}, function (data) {
                scope.formData.name = data.name;
                scope.formData.displayName = data.displayName;
                scope.formData.isActive = data.isActive;
                scope.template = data.templates[0];
                scope.groupings = data.groupings;
                if (data.templateId) {
                    scope.ugdTemplate.push({name: data.templateName, id: data.templateId});
                }
                scope.events = data.events;
                scope.hookId = data.id;
                for (var i in scope.template.schema) {
                    for(var j in data.config) {
                        if(scope.template.schema[i].fieldName == data.config[j].fieldName)
                            scope.schemaInputs[i] = data.config[j].fieldValue;
                    }
                }
            });

            resourceFactory.templateResource.getTemplateDetails({resourceType: 'template'}, function (data) {
                scope.ugdTemplateEntities = data.entities;
            });

            scope.resetActions = function () {
                scope.action = {};
            };

            scope.addEvent = function () {
                scope.events.push({ entityName : scope.entity.name, actionName : scope.action});
            };

            scope.deleteEvent = function (index) {
                scope.events.splice(index, 1);
            }

            scope.changeEntity = function(name) {
                scope.ugdTemplate = [];
                scope.ugdTemplates = [];
                for (var i = 0; i < scope.allUgdTemplates.length; ++i) {
                    if (scope.allUgdTemplates[i].entity === name.toLowerCase() &&
                        scope.allUgdTemplates[i].type === "SMS") {
                        scope.ugdTemplates.push({name: scope.allUgdTemplates[i].name, id: scope.allUgdTemplates[i].id});
                    }
                }
                scope.showUgdTemplatesDropdown = scope.ugdTemplateEntities.filter(function(entity) {
                    return entity.name === name.toLowerCase() &&
                    scope.template.name === "SMS Bridge" &&
                    scope.ugdTemplates.length > 0;
                });
            }

            scope.submit = function () {
                this.formData.name = scope.template.name;
                this.formData.config = {};
                this.formData.events = scope.events;
                if (scope.ugdTemplate !== null) {
                    this.formData.templateId = scope.ugdTemplate.id;
                }
                if (scope.template.schema.length > 0) {
                    for (var i in scope.template.schema) {
                        this.formData.config[scope.template.schema[i].fieldName] = scope.schemaInputs[i];
                    }
                }

                resourceFactory.hookResources.update({'hookId': scope.hookId}, this.formData, function (data) {
                    location.path('/viewhook/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditHookController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.EditHookController]).run(function ($log) {
        $log.info("EditHookController initialized");
    });
}(mifosX.controllers || {}));
