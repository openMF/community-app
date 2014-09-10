(function (module) {
    mifosX.controllers = _.extend(module, {
        EditHookController: function (scope, routeParams, resourceFactory, location) {

        	scope.formData = {};
            scope.template = {};
			scope.groupings = [];
			scope.schemaInputs = [];
			scope.events = [];
			
            resourceFactory.hookResources.get({hookId: routeParams.id, template: 'true'}, function (data) {
            	scope.formData.name = data.name;
            	scope.formData.displayName = data.displayName;
                scope.formData.isActive = data.isActive;
                scope.template = data.templates[0];
				scope.groupings = data.groupings;
				scope.events = data.events;
				scope.hookId = data.id;
				for (var i in scope.template.schema) {
					for(var j in data.config) {
						if(scope.template.schema[i].fieldName == data.config[j].fieldName)
							scope.schemaInputs[i] = data.config[j].fieldValue;
					}
				}
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

            scope.submit = function () {
				this.formData.name = scope.template.name;
				this.formData.config = {};
				this.formData.events = scope.events;
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
