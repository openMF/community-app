(function (module) {
    mifosX.controllers = _.extend(module, {
        NewJLGLoanAccAppController: function (scope, rootScope, routeParams, resourceFactory, location, dateFilter) {

            scope.response = {success:[],failed:[]};
            scope.group = {};
            scope.group.selectedclients = [];
            scope.group.id = routeParams.groupId;
            scope.staffInSelectedOfficeOnly = true;
            scope.requestIdentifier = "clientId";
            scope.inparams = { resourceType: 'template', templateType: 'jlgbulk', lendingStrategy: 300 };
            scope.selectedProduct = {};
            scope.loanApplicationCommonData = {};  // user set common data for all the loan applications
            scope.loanApplicationCommonData.submittedOnDate = new Date();
            scope.loanApplicationCommonData.expectedDisbursementDate = new Date();
            scope.loanApplicationCommonData.syncDisbursementWithMeeting = true;

            if (scope.group.id) {
                scope.inparams.groupId = scope.group.id;
            }

            // Fetch loan products for initital product drop-down
            resourceFactory.loanResource.get(scope.inparams, function (data) {
                scope.products = data.productOptions;
                if (data.group) {
                    scope.group.name = data.group.name;
                }
            });


            scope.loanProductChange = function (loanProductId) {

                scope.inparams.productId = loanProductId;
                resourceFactory.loanResource.get(scope.inparams, function (data) {

                    scope.productDetails = data.product;
                    
                    scope.group.clients = data.group.clientMembers.map(function(client) {
                        client.principal = data.product.principal;
                        client.charges = data.product.charges.map(function(charge){
                            charge.isDeleted = false; 
                            return _.clone(charge);});
                        // return was returing the reference, instead the value, so added _.clone
                        return client; 
                    });

                    scope.loanOfficers = data.loanOfficerOptions;
                    scope.funds = data.fundOptions;
                    scope.caledars = data.calendarOptions;
                    scope.loanPurposes = data.loanPurposeOptions;
                    scope.termFrequency = data.termFrequency;
                    scope.termPeriodFrequencyType = data.termPeriodFrequencyType;

                });
            };

            scope.toggleCharge = function (clientIndex, chargeIndex) {

                // scope.group.clients[clientIndex].charges.splice(chargeIndex,1);
                if(scope.group.clients[clientIndex].charges[chargeIndex].isDeleted){
                    scope.group.clients[clientIndex].charges[chargeIndex].isDeleted = false;
                }
                else{
                    scope.group.clients[clientIndex].charges[chargeIndex].isDeleted = true;
                }

            };


            /* Submit button action */
            scope.submit = function () {  

                this.batchRequests = [];
                for (var i in scope.group.clients) {
                        if( scope.group.clients[i].isSelected ){

                                var loanApplication = {};

                                loanApplication.locale = scope.optlang.code;
                                loanApplication.dateFormat =  scope.df;
                                loanApplication.groupId = scope.group.id;
                                loanApplication.clientId = scope.group.clients[i].id;
                                loanApplication.calendarId = scope.caledars[0].id;
                                loanApplication.loanType = 'jlg';
                                loanApplication.productId = scope.productDetails.id;
                                loanApplication.fundId = scope.loanApplicationCommonData.fundId;
                                loanApplication.numberOfRepayments = scope.productDetails.numberOfRepayments;
                                loanApplication.repaymentEvery = scope.productDetails.repaymentEvery;
                                loanApplication.repaymentFrequencyType = scope.productDetails.repaymentFrequencyType.id;
                                loanApplication.interestRatePerPeriod = scope.productDetails.interestRatePerPeriod;
                                loanApplication.amortizationType = scope.productDetails.amortizationType.id;
                                loanApplication.interestType = scope.productDetails.interestType.id;
                                loanApplication.interestCalculationPeriodType = scope.productDetails.interestCalculationPeriodType.id;
                                loanApplication.inArrearsTolerance = scope.productDetails.inArrearsTolerance;
                                loanApplication.graceOnPrincipalPayment = scope.productDetails.graceOnPrincipalPayment;
                                loanApplication.graceOnInterestPayment = scope.productDetails.graceOnInterestPayment;
                                loanApplication.transactionProcessingStrategyId = scope.productDetails.transactionProcessingStrategyId;
                                loanApplication.loanTermFrequency = scope.termFrequency;
                                loanApplication.loanTermFrequencyType = scope.termPeriodFrequencyType.id;
                                loanApplication.loanPurposeId = scope.group.clients[i].loanPurposeId;

                                loanApplication.loanOfficerId = scope.loanApplicationCommonData.loanOfficerId;
                                loanApplication.principal = scope.group.clients[i].principal;
                                loanApplication.expectedDisbursementDate = dateFilter(scope.loanApplicationCommonData.expectedDisbursementDate, scope.df);
                                loanApplication.submittedOnDate =  dateFilter(scope.loanApplicationCommonData.submittedOnDate, scope.df);
                                loanApplication.syncDisbursementWithMeeting = scope.loanApplicationCommonData.syncDisbursementWithMeeting;


                                loanApplication.charges = []; 

                                for (var j in scope.group.clients[i].charges) {

                                    if(!scope.group.clients[i].charges[j].isDeleted){
                                        var charge = {};
                                        charge.amount = scope.group.clients[i].charges[j].amount;
                                        charge.chargeId = scope.group.clients[i].charges[j].id;
                                        loanApplication.charges.push(charge);                                        
                                    }

                                }

                                this.batchRequests.push({requestId: i, relativeUrl: "loans", 
                                method: "POST", body: JSON.stringify(loanApplication)});                        

                        }

                }  

                resourceFactory.batchResource.post(this.batchRequests, function (data) {

                        for (var i = 0; i < data.length; i++) {
                                if(data[i].statusCode == 200 ) 
                                    scope.response.success.push(data[i]);
                                else
                                    scope.response.failed.push(data[i]);

                            }   

                        if(scope.response.failed.length === 0 ){
                            location.path('/viewgroup/' + scope.group.id);    
                        }

                });

                
            }; 

            /* Cancel button action */
            scope.cancel = function () {
                if (scope.group.id) {
                    location.path('/viewgroup/' + scope.group.id);
                }
            };             


        } // End of NewJLGLoanAccAppController

    });
    mifosX.ng.application.controller('NewJLGLoanAccAppController', ['$scope', '$rootScope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.NewJLGLoanAccAppController]).run(function ($log) {
        $log.info("NewJLGLoanAccAppController initialized");
    });
}(mifosX.controllers || {}));