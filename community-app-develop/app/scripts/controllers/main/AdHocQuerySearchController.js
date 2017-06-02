(function (module) {
    mifosX.controllers = _.extend(module, {
        AdHocQuerySearchController: function (scope, routeParams, dateFilter, resourceFactory) {
            scope.formData = {};
            scope.showResults = false;
            scope.showClientResults = false;
            scope.totalPrincipalOutstanding = 0;
            scope.totaldisburementAmount = 0;
            scope.totalPrincipalRepaid = 0;
            scope.totalArrearsAmount = 0;
            scope.totalInterestOutstanding = 0;
            scope.totalInterestRepaid = 0;
            scope.csvData = [];
            var adHocQuery;

            resourceFactory.globalSearchTemplateResource.get(function (data) {
                scope.searchTemplate = data;
                scope.formData.loanfromdate = new Date();
                scope.formData.loantodate = new Date();
                scope.formData.loandatetype = "approvalDate";
                scope.showDateFields = true;
                scope.formData.loans = "loans";
                scope.formData.includeOutStandingAmountPercentage = true;
                scope.formData.outStandingAmountPercentageCondition = 'between';
                scope.formData.includeOutstandingAmount = true;
                scope.formData.outstandingAmountCondition = 'between';
            });

            scope.updatePercentageType = function () {
                if (scope.formData.percentagetype == 'between') {
                    scope.formData.percentage = undefined;
                } else {
                    scope.formData.minpercentage = undefined;
                    scope.formData.maxpercentage = undefined;
                }
            };

            scope.updateOutstandingType = function () {
                if (scope.formData.outstandingType == 'between') {
                    scope.formData.outstandingamt = undefined;
                } else {
                    scope.formData.minoutstandingamt = undefined;
                    scope.formData.maxoutstandingamt = undefined;
                }
            };

            scope.updateLoanDateType = function () {
                if (scope.formData.loandatetype == "approvalDate" || scope.formData.loandatetype == "createdDate" || scope.formData.loandatetype == "disbursalDate") {
                    scope.showDateFields = true;
                } else {
                    scope.showDateFields = false;
                }
            };

            scope.submit = function () {
                adHocQuery = { "locale": scope.optlang.code, "dateFormat": "yyyy-MM-dd"};
                if (scope.formData.loans) {
                    adHocQuery.entities = adHocQuery.entities || [];
                    adHocQuery.entities.push(scope.formData.loans);
                }
                ;
                if (scope.formData.allloans) {
                    adHocQuery.loanStatus = adHocQuery.loanStatus || [];
                    adHocQuery.loanStatus.push(scope.formData.allloans);
                }
                ;
                if (scope.formData.activeloans) {
                    adHocQuery.loanStatus = adHocQuery.loanStatus || [];
                    adHocQuery.loanStatus.push(scope.formData.activeloans);
                }
                ;
                if (scope.formData.overpaidloans) {
                    adHocQuery.loanStatus = adHocQuery.loanStatus || [];
                    adHocQuery.loanStatus.push(scope.formData.overpaidloans);
                }
                ;
                if (scope.formData.arrearloans) {
                    adHocQuery.loanStatus = adHocQuery.loanStatus || [];
                    adHocQuery.loanStatus.push(scope.formData.arrearloans);
                }
                ;
                if (scope.formData.closedloans) {
                    adHocQuery.loanStatus = adHocQuery.loanStatus || [];
                    adHocQuery.loanStatus.push(scope.formData.closedloans);
                }
                ;
                if (scope.formData.writeoffloans) {
                    adHocQuery.loanStatus = adHocQuery.loanStatus || [];
                    adHocQuery.loanStatus.push(scope.formData.writeoffloans);
                }
                ;
                if (scope.formData.loanProducts) {
                    adHocQuery.loanProducts = scope.formData.loanProducts;
                }
                ;
                if (scope.formData.offices) {
                    adHocQuery.offices = scope.formData.offices;
                }
                ;
                if (scope.formData.loandatetype) {
                    adHocQuery.loanDateOption = scope.formData.loandatetype;
                    adHocQuery.loanFromDate = dateFilter(scope.formData.loanfromdate, adHocQuery.dateFormat);
                    adHocQuery.loanToDate = dateFilter(scope.formData.loantodate, adHocQuery.dateFormat);
                }
                ;
                if (scope.formData.includeOutStandingAmountPercentage) {
                    adHocQuery.includeOutStandingAmountPercentage = scope.formData.includeOutStandingAmountPercentage;
                    if (scope.formData.outStandingAmountPercentageCondition) {
                        adHocQuery.outStandingAmountPercentageCondition = scope.formData.outStandingAmountPercentageCondition;
                        if (adHocQuery.outStandingAmountPercentageCondition == 'between') {
                            adHocQuery.minOutStandingAmountPercentage = scope.formData.minOutStandingAmountPercentage;
                            adHocQuery.maxOutStandingAmountPercentage = scope.formData.maxOutStandingAmountPercentage;
                        } else {
                            adHocQuery.outStandingAmountPercentage = scope.formData.outStandingAmountPercentage;
                        }
                        ;
                    }
                    ;
                }
                ;

                if (scope.formData.includeOutstandingAmount) {
                    adHocQuery.includeOutstandingAmount = scope.formData.includeOutstandingAmount;
                    if (scope.formData.outstandingAmountCondition) {
                        adHocQuery.outstandingAmountCondition = scope.formData.outstandingAmountCondition;
                        if (adHocQuery.outstandingAmountCondition == 'between') {
                            adHocQuery.minOutstandingAmount = scope.formData.minOutstandingAmount;
                            adHocQuery.maxOutstandingAmount = scope.formData.maxOutstandingAmount;
                        } else {
                            adHocQuery.outstandingAmount = scope.formData.outstandingAmount;
                        }
                        ;
                    }
                    ;
                }
                ;
                resourceFactory.globalAdHocSearchResource.search(adHocQuery, function (data) {
                    scope.searchResults = data;
                    scope.showResults = true;
                });
            };

            scope.routeTo = function(){
               resourceFactory.globalAdHocSearchResource.getClientDetails(adHocQuery,function (data) {
                    scope.clientResults = data;
                    scope.showResults = false;
                    scope.showClientResults = true;
                    scope.csvData = [];
                    scope.formatteddisbursedDate;
                    scope.formattedmaturedDate;
                    scope.csvData.push({"accountNo":"Client AccountNo","client":"Client","productId":"Loan ProductId","product":"Product","disbursedDate":"Disbursed Date","disbursementAmount":"Disbursement Amount","maturedDate":"Matured Date","principalOutstanding":"Principal Outstanding","principalRepaid":"Principal Repaid","arrearsAmount":"Arrears Amount","interestOutstanding":"Interest Outstanding","interestRepaid":"Interest Repaid"});
                    for(var l=0;l<scope.clientResults.length;l++) {
                      if(scope.clientResults[l].disbursedDate != null){
                          scope.formatteddisbursedDate = scope.clientResults[l].disbursedDate;
                          scope.clientResults[l].disbursedDate = dateFilter(new Date(scope.clientResults[l].disbursedDate), 'dd MMM  yyyy');

                       }
                       if(scope.clientResults[l].maturedDate != null){
                           scope.formattedmaturedDate = scope.clientResults[l].maturedDate;
                           scope.clientResults[l].maturedDate = dateFilter(new Date(scope.clientResults[l].maturedDate), 'dd MMM  yyyy');
                       }

                       if (scope.clientResults[l].principalOutstanding != null && scope.clientResults[l].principalOutstanding != "") {
                           scope.totalPrincipalOutstanding = scope.totalPrincipalOutstanding + scope.clientResults[l].principalOutstanding;
                       }
                       if(scope.clientResults[l].disbursementAmount != null && scope.clientResults[l].disbursementAmount != ""){
                           scope.totaldisburementAmount = scope.totaldisburementAmount + scope.clientResults[l].disbursementAmount;
                       }
                       if(scope.clientResults[l].principalRepaid != null && scope.clientResults[l].principalRepaid != ""){
                           scope.totalPrincipalRepaid = scope.totalPrincipalRepaid +scope.clientResults[l].principalRepaid;

                       }
                       if(scope.clientResults[l].arrearsAmount != null && scope.clientResults[l].arrearsAmount != ""){
                           scope.totalArrearsAmount = scope.totalArrearsAmount + scope.clientResults[l].arrearsAmount;
                       }
                       if(scope.clientResults[l].interestOutstanding != null && scope.clientResults[l].interestOutstanding != ""){
                           scope.totalInterestOutstanding = scope.totalInterestOutstanding + scope.clientResults[l].interestOutstanding;
                       }
                       if(scope.clientResults[l].interestRepaid != null && scope.clientResults[l].interestRepaid != ""){
                           scope.totalInterestRepaid = scope.totalInterestRepaid + scope.clientResults[l].interestRepaid;
                       }
                       scope.csvData.push(scope.clientResults[l]);
                   }
                   scope.csvData.push({"total":"Total","client":"","productId":"","product":"","disbursedDate":"","disbursementAmount":scope.totaldisburementAmount,"maturedDate":"","principalOutstanding":scope.totalPrincipalOutstanding,"principalRepaid":scope.totalPrincipalRepaid,"arrearsAmount":scope.totalArrearsAmount,"interestOutstanding":scope.totalInterestOutstanding,"interestRepaid":scope.totalInterestRepaid});

               });
            };

            scope.cancel = function(){
                scope.showResults = true;
                scope.showClientResults = false;
            }

        }
    });
    mifosX.ng.application.controller('AdHocQuerySearchController', ['$scope', '$routeParams', 'dateFilter', 'ResourceFactory', mifosX.controllers.AdHocQuerySearchController]).run(function ($log) {
        $log.info("AdHocQuerySearchController initialized");
    });
}(mifosX.controllers || {}));
