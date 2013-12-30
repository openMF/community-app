(function(module) {
  mifosX.controllers = _.extend(module, {
    EditClientController: function(scope, routeParams, resourceFactory, location, http, dateFilter, API_VERSION,$upload,$rootScope) {
        scope.offices = [];
        scope.date = {};
        scope.restrictDate = new Date();
        scope.clientId = routeParams.id;
        resourceFactory.clientResource.get({clientId: routeParams.id, template: 'true'} , function(data) {
            scope.offices = data.officeOptions;
            scope.staffs = data.staffOptions; 
            scope.officeId = data.officeId;
            scope.formData = {
              firstname : data.firstname,
              lastname : data.lastname,
              middlename : data.middlename,
              active : data.active,
              accountNo : data.accountNo, 
              staffId : data.staffId,
              mobileNo : data.mobileNo
            };
            var actDate = dateFilter(data.activationDate,scope.df);
            scope.date.activationDate = new Date(actDate);
            if(data.active){
                scope.choice = 1;
            }

        });
        scope.submit = function() {
             this.formData.locale = scope.optlang.code;
             this.formData.dateFormat = scope.df;
             if (scope.choice === 1) {
              if(scope.date.activationDate){this.formData.activationDate = dateFilter(scope.date.activationDate,scope.df);}
             }
             resourceFactory.clientResource.update({'clientId': routeParams.id},this.formData,function(data){
               location.path('/viewclient/' + routeParams.id);
             });
        };
    }
  });
  mifosX.ng.application.controller('EditClientController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$http','dateFilter', 'API_VERSION','$upload','$rootScope', mifosX.controllers.EditClientController]).run(function($log) {
    $log.info("EditClientController initialized");
  });
}(mifosX.controllers || {}));
