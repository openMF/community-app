(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewExistingLoanController: function (scope, routeParams, resourceFactory, location, $modal, route, dateFilter) {

            scope.clientId = routeParams.clientId;
            scope.existingloanId = routeParams.existingloanId;
            scope.formData = {};

            resourceFactory.clientExistingLoan.get({
                clientId: scope.clientId,
                existingloanId: scope.existingloanId
            }, function (data) {
                scope.formData.source = data.sourceCvName;
                scope.formData.bureau = data.bureauCvName;
                scope.formData.lenderCvName = data.lenderCvName;
                scope.formData.lenderNotListed = data.lenderNotListed;
                scope.formData.loanTypeName = data.loanTypeName;
                scope.formData.externalLoanPurposeCvName = data.externalLoanPurposeCvName;
                if(!_.isUndefined(data.status.id) && !_.isNull(data.status.id)){
                    scope.formData.loanStatusValue = data.status.value;
                }
                scope.formData.amountBorrowed = data.amountBorrowed;
                scope.formData.currentOutstanding = data.currentOutstanding;
                scope.formData.amtOverdue = data.amountOverdue;
                scope.formData.WrittenOffAmount = data.writtenOffAmount;
                scope.formData.installmentAmount = data.installmentAmount;
                scope.formData.gt0dpd3mths = data.gt0Dpd3Mths;
                scope.formData.dpd30mths12 = data.dpd30Mths12;
                scope.formData.dpd30mths24 = data.dpd30Mths24;
                scope.formData.dpd60mths24 = data.dpd60Mths24;
                scope.formData.loanTenure = data.loanTenaure;
                scope.formData.loanTenurePeriodType = data.loanTenurePeriodType.value;
                scope.formData.repaymentFrequencyMultipleOf = data.repaymentFrequencyMultipleOf;
                scope.formData.repaymentFrequency = data.repaymentFrequency.value;
                scope.formData.archive = data.archive;
                if (!_.isUndefined(data.timeline.disbursedDate)) {
                    scope.formData.disbursedDate = dateFilter(data.timeline.disbursedDate, scope.df);
                };
            });
        }
    });
    mifosX.ng.application.controller('ViewExistingLoanController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', 'dateFilter', mifosX.controllers.ViewExistingLoanController]).run(function ($log) {
        $log.info("ViewExistingLoanController initialized");
    });

}(mifosX.controllers || {}));