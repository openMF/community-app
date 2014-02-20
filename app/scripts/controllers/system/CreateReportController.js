(function(module) {
  mifosX.controllers = _.extend(module, {
    CreateReportController: function(scope, resourceFactory, location) {
        scope.formData =  {};
        scope.reportParameters = [];
        scope.flag = false;
        resourceFactory.reportsResource.getReportDetails({resourceType : 'template'}, function(data) {
            scope.reportdetail = data;
            scope.formData.reportType = data.allowedReportTypes[0];
        });

        scope.parameterSelected = function(allowedParameterId) {
            scope.flag=true;
          for(var i in scope.reportdetail.allowedParameters) {
            if (scope.reportdetail.allowedParameters[i].id == allowedParameterId) {
              scope.reportParameters.push({parameterId : allowedParameterId, 
                id : "", 
                allowedParameterName : scope.reportdetail.allowedParameters[i].parameterName
              });
            }
          }
          scope.allowedParameterId = '';
        }

        //getting deep clone object to call the getDeepCopyObject
        var deepCloneObject = new mifosX.models.DeepClone();

        scope.deleteParameter = function(index) {
          scope.reportParameters.splice(index,1);
        }

        scope.submit = function() {
          scope.temp = deepCloneObject.getDeepCopyObject(scope.reportParameters);
          for(var i in scope.temp) {
            delete scope.temp[i].allowedParameterName;
          }
            this.formData.reportParameters = scope.temp;
            resourceFactory.reportsResource.save(this.formData,function(data){
            location.path('/system/viewreport/' + data.resourceId);
          });
        };
    }
  });
  mifosX.ng.application.controller('CreateReportController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CreateReportController]).run(function($log) {
    $log.info("CreateReportController initialized");
  });
}(mifosX.controllers || {}));
