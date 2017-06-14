(function (module) {
    mifosX.controllers = _.extend(module, {
        EditAdHocQueryController: function (scope, routeParams, resourceFactory, location) {

            scope.formData = {};
            scope.adhocquery = [];
          
            resourceFactory.adHocQueryResource.get({adHocId: routeParams.id, template: 'true'}, function (data) {
                scope.formData.name = data.name;
                scope.formData.query = data.query;
                scope.formData.tableFields = data.tableFields;
                scope.formData.tableName = data.tableName;
                scope.adHocId = data.id;
                scope.formData.isActive=data.isActive;
                scope.formData.email=data.email;
            });
           
           scope.submit = function () {
        	   
        	   //this.formData.isActive=this.formData.isActive ? 1 : 0;
        	  // alert(this.formData.email); 
        	   resourceFactory.adHocQueryResource.update({'adHocId': scope.adHocId}, this.formData, function (data) {
                    
                	location.path('/viewadhocquery/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditAdHocQueryController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.EditAdHocQueryController]).run(function ($log) {
        $log.info("EditAdHocQueryController initialized");
    });
}(mifosX.controllers || {}));
