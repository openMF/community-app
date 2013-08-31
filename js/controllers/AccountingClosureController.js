(function(module) {
  mifosX.controllers = _.extend(module, {
    AccountingClosureController: function(scope, resourceFactory, location, translate, routeParams) {

            scope.accountClosures=[];
            resourceFactory.officeResource.getAllOffices(function(data){
              scope.offices = data;  
            });
            
            var params = {}
            if (routeParams.officeId != undefined) {
              params.officeId = routeParams.officeId;
            }

            resourceFactory.accountingClosureResource.get(params, function(data){
              scope.accountClosures = data;
            });

            scope.submit = function() {
                  this.formData.locale = 'en';
                  this.formData.dateFormat = 'dd MMMM yyyy';

                  resourceFactory.accountingClosureResource.save(this.formData,function(data){
                    location.path('/closedaccountingDetails/'+scope.formData.officeId);
                  });
            }

            scope.updateLastClosed = function (officeId) {
              resourceFactory.accountingClosureResource.get({officeId: officeId}, function(data){
                scope.accountClosures = data;
                scope.lastClosed = undefined;
                if (data.length > 0) {
                  scope.lastClosed = data[0].closingDate;
                }
              });
            }
            scope.closedAccountingDetails = function (officeId) {
              resourceFactory.accountingClosureResource.get({officeId:officeId}, function(data){
                scope.accountClosures = data;
              });
            }
    }
  });
  mifosX.ng.application.controller('AccountingClosureController', ['$scope', 'ResourceFactory', '$location', '$translate', '$routeParams', mifosX.controllers.AccountingClosureController]).run(function($log) {
    $log.info("AccountingClosureController initialized");
  });
}(mifosX.controllers || {}));
