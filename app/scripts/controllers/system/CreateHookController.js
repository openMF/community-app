(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateHookController: function (scope, resourceFactory, location) {
            scope.templates = [];
            scope.groupings = [];
            scope.schemaInputs = [];
            scope.events = [];
            scope.ugdTemplateEntities = [];
            scope.ugdTemplates = [];
            scope.ugdTemplate = {};
            scope.showUgdTemplatesDropdown = false;

            resourceFactory.templateResource.get(function (data) {
                scope.allUgdTemplates = data;
            });

            resourceFactory.hookTemplateResource.get(function (data) {
                scope.templates = data.templates;
                scope.groupings = data.groupings;
                for (var i in data.templates) {
                    if(data.templates[i].name === "Web")
                        scope.template = data.templates[i];
                }
            });

            resourceFactory.templateResource.getTemplateDetails({resourceType: 'template'}, function (data) {
                scope.ugdTemplateEntities = data.entities;
            });

            scope.changeTemplate = function () {
                scope.schemaInputs = [];
                scope.changeEntity(scope.entity.name);
            };

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
                resourceFactory.hookResources.save(this.formData, function (data) {
                    location.path('/viewhook/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateHookController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CreateHookController]).run(function ($log) {
        $log.info("CreateHookController initialized");
    });
}(mifosX.controllers || {}));