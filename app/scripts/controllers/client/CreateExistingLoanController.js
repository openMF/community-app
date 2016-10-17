(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateExistingLoanController: function (scope, routeParams, resourceFactory, location, $modal, route, dateFilter) {

            scope.clientId = routeParams.clientId;
            scope.formData = {};
            scope.sourceCvOptions = [];
            scope.bureauCvOptions = [];
            scope.lenderCvOptions = [];
            scope.loanTypeCvOptions = [];
            scope.externalLoanPurposeOptions = [];
            scope.loanTenaureOptions = [];
            scope.termPeriodFrequencyType = [];
            scope.loanStatusOptions = [];

            resourceFactory.clientExistingLoanTemplate.get({clientId: scope.clientId}, function (data) {
                scope.existingLoanSourceOption = data.existingLoanSourceOption;
                scope.creditBureauProductsOption = data.creditBureauProductsOption;
                scope.lenderOption = data.lenderOption;
                scope.loanTypeOption = data.loanTypeOption;
                scope.externalLoanPurposeOption = data.externalLoanPurposeOption;
                scope.loanTenaureOption = data.loanTenaureOption;
                scope.termPeriodFrequencyType = data.termPeriodFrequencyType;
                scope.loanStatusOption = data.loanStatusOption;
            });

            scope.submit = function () {
                scope.formData.archive = "1";
                if (!_.isUndefined(scope.formData.disbursedDate)) {
                    this.formData.disbursedDate = dateFilter(scope.formData.disbursedDate, scope.df);
                }
                this.formData.dateFormat = scope.df;
                this.formData.locale = scope.optlang.code;
                resourceFactory.clientExistingLoan.save({clientId: scope.clientId}, this.formData, function (data) {
                    location.path('/viewclient/' + scope.clientId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateExistingLoanController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', 'dateFilter', mifosX.controllers.CreateExistingLoanController]).run(function ($log) {
        $log.info("CreateExistingLoanController initialized");
    });

}(mifosX.controllers || {}));