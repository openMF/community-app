(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateHookController: function (scope, resourceFactory, location) {
            scope.templates = [];
			scope.groupings = [];
			scope.schemaInputs = [];
			scope.events = [];
			
            resourceFactory.hookTemplateResource.get(function (data) {
                scope.templates = data.templates;
				scope.groupings = data.groupings;
				for (var i in data.templates) {
					if(data.templates[i].name === "Web")
						scope.template = data.templates[i];
				}
            });
			
			scope.changeTemplate = function () {
				scope.schemaInputs = [];
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

            scope.submit = function () {
				this.formData.name = scope.template.name;
				this.formData.config = {};
				this.formData.events = scope.events;
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