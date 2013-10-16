(function(module) {
    mifosX.controllers = _.extend(module, {
        BulkLoanReassignmentController: function(scope, resourceFactory,route,dateFilter) {
            scope.offices = [];
            scope.accounts = {};
            scope.officeIdTemp = {};
            scope.first = {};
            scope.first.date = new Date();
            resourceFactory.officeResource.getAllOffices(function(data) {
                scope.offices = data;
            });
            scope.getOfficers = function(){
                scope.officerChoice = true;
                resourceFactory.loanReassignmentResource.get({templateSource:'template',officeId:scope.officeIdTemp},function(data) {
                    scope.officers = data.loanOfficerOptions;
                });
            };
            scope.getOfficerClients = function(){
                resourceFactory.loanReassignmentResource.get({templateSource:'template',officeId:scope.officeIdTemp,fromLoanOfficerId:scope.formData.fromLoanOfficerId},function(data) {
                    scope.clients = data.accountSummaryCollection.clients;
                    scope.groups = data.accountSummaryCollection.groups;
                });
            };

            scope.submit = function() {
                var reqDate = dateFilter(scope.first.date,'dd MMMM yyyy');
                var loans = [];
                _.each(scope.accounts,function(value,key){
                    if(value==true)
                    {
                        loans.push(key)
                    }
                });
                this.formData.assignmentDate = reqDate;
                this.formData.dateFormat = "dd MMMM yyyy";
                this.formData.locale = "en";
                this.formData.loans = loans;
                resourceFactory.loanReassignmentResource.save(this.formData,function(data) {
                    route.reload();
                });

            };
        }
    });
    mifosX.ng.application.controller('BulkLoanReassignmentController', ['$scope', 'ResourceFactory', '$route','dateFilter', mifosX.controllers.BulkLoanReassignmentController]).run(function($log) {
        $log.info("BulkLoanReassignmentController initialized");
    });
}(mifosX.controllers || {}));
