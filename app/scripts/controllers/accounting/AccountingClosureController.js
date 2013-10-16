(function(module) {
  mifosX.controllers = _.extend(module, {
    AccountingClosureController: function(scope, resourceFactory, location, translate, routeParams,dateFilter) {
            scope.first = {};
            scope.first.date = new Date();
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
                  var reqDate = dateFilter(scope.first.date,'dd MMMM yyyy');
                  this.formData.locale = 'en';
                  this.formData.dateFormat = 'dd MMMM yyyy';
                  this.formData.closingDate = reqDate;
                  resourceFactory.accountingClosureResource.save(this.formData,function(data){
                    location.path('/view_close_accounting/'+data.resourceId);
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
  mifosX.ng.application.controller('AccountingClosureController', ['$scope', 'ResourceFactory', '$location', '$translate', '$routeParams','dateFilter', mifosX.controllers.AccountingClosureController]).run(function($log) {
    $log.info("AccountingClosureController initialized");
  });
}(mifosX.controllers || {}));
