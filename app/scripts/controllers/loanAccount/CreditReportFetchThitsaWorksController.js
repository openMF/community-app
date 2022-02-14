(function (module) {
    mifosX.controllers = _.extend(module, {

        CreditReportFetchThitsaWorksController: function (scope,rootScope, http,API_VERSION,resourceFactory,dateFilter, routeParams, location) {

            scope.formData = {};
            scope.creditbureaus=[];
            scope.loanproductId=routeParams.lpId;
            scope.creditbureauidvalue=routeParams.cbId;
            scope.cancel={};
            scope.localcountry={};
            scope.nrc = null;
            scope.accountid=rootScope.id;
            scope.map={};
            scope.loanproductId=routeParams.productId;
            scope.thitnrc='';
            var creditReportJson = '';

            scope.getcreditreport=function()
            {   scope.thitsaworknrc=  scope.thitnrc;
                resourceFactory.creditBureauGeneric.post({loanProductID:scope.loanproductId, NRC:scope.thitsaworknrc,creditBureauID:scope.creditbureauidvalue},function (data) {

                    scope.creditchecks=data.creditBureauReportData;
                    creditReportJson = JSON.stringify(scope.creditchecks);
                    scope.creditReportData =angular.fromJson(scope.creditchecks);

                    var borrowerInfo = scope.creditchecks.borrowerInfo;
                    scope.info = borrowerInfo;
                    var Info =angular.fromJson(borrowerInfo);
                    scope.borrowerInfo  = Info;

                    scope.NRC = scope.borrowerInfo.NRC;
                    scope.Name = scope.borrowerInfo.Name;
                    scope.Dob = scope.borrowerInfo.DOB;
                    scope.Gender = scope.borrowerInfo.Gender;
                    scope.Address = scope.borrowerInfo.Address;
                    scope.FatherName = scope.borrowerInfo.FatherName;


                    const creditscore = scope.creditchecks.creditScore;
                    var score =angular.fromJson(creditscore);
                    scope.creditScores  = score;


                    const activeLoans = scope.creditchecks.openAccounts;
                    const active = activeLoans.toString().replace(/^\|\$/,'');
                    const activeLo = '['+ active + ']';
                    scope.openAccounts = angular.fromJson(activeLo);

                    const paidLoans = scope.creditchecks.closedAccounts;
                    const paid = paidLoans.toString().replace(/^\|\$/,'');
                    const paidLo = '['+ paid + ']';
                    scope.closedAccounts  = angular.fromJson(paidLo);
                    resourceFactory.saveCreditReport.post({apiRequestBodyAsJson: creditReportJson, creditBureauId: scope.creditbureauidvalue, nationalId : scope.thitsaworknrc},function (data) {
                    });

                });
            };

            resourceFactory.creditBureauByLoanProductId.get({loanProductId: scope.loanproductId}, function (data) {
                scope.creditBureauByLoanProduct = data;
                scope.cbId = scope.creditBureauByLoanProduct.organisationCreditBureauId;
                scope.lpId = scope.creditBureauByLoanProduct.loanProductId;
            });

            scope.cancel = function () {
                location.path("/creditBureauSummary/"+routeParams.id+"/"+scope.lpId);
            };
            
            }
    });

    mifosX.ng.application.controller('CreditReportFetchThitsaWorksController', ['$scope' ,'$rootScope','$http','API_VERSION', 'ResourceFactory', 'dateFilter','$routeParams', '$location', mifosX.controllers.CreditReportFetchThitsaWorksController]).run(function ($log) {
        $log.info("CreditReportFetchThitsaWorksController initialized");
    });
}(mifosX.controllers || {}));
