(function(module) {
    mifosX.controllers = _.extend(module, {
        EditClientLoanAccAppController: function(scope, routeParams, resourceFactory, location) {
            scope.previewRepayment = false;
            resourceFactory.loanResource.get({loanId : routeParams.id, template:true, associations:'charges,collateral,meeting'}, function(data) {
                  scope.clientloanaccountinfo = data;
                  scope.clientId = data.clientId;
                  scope.formData = {loanOfficerId: data.loanOfficerId, loanPurposeId: data.loanPurposeId};
                  scope.previewClientLoanAccInfo();
                  
            });

            scope.loanProductChange = function(loanProductId) {
                resourceFactory.loanResource.get({resourceType : 'template', templateType : 'individual',
                    clientId : scope.clientId, productId : loanProductId}, function(data) {
                        scope.clientloanaccountinfo = data;
                        scope.previewClientLoanAccInfo();
                });
            }

            scope.previewClientLoanAccInfo = function() {
              scope.previewRepayment = false;
              scope.clientId = scope.clientloanaccountinfo.clientId;
              scope.charges = scope.clientloanaccountinfo.charges || [];

              //to display loan officer and loan purpose
              if(this.formData.loanOfficerId) scope.loanOfficerId = this.formData.loanOfficerId;

              if(this.formData.loanPurposeId) scope.loanPurposeId = this.formData.loanPurposeId;

              scope.formData = {
                clientName: scope.clientloanaccountinfo.clientName,
                productId : scope.clientloanaccountinfo.loanProductId,
                fundId : scope.clientloanaccountinfo.fundId,
                principal : scope.clientloanaccountinfo.principal,
                principalCurrencyCode : scope.clientloanaccountinfo.currency.displaySymbol,
                loanTermFrequency : scope.clientloanaccountinfo.termFrequency,
                loanTermFrequencyType : scope.clientloanaccountinfo.termPeriodFrequencyType.id,
                numberOfRepayments : scope.clientloanaccountinfo.numberOfRepayments,
                repaymentEvery : scope.clientloanaccountinfo.repaymentEvery,
                interestRatePerPeriod : scope.clientloanaccountinfo.interestRatePerPeriod,
                interestType : scope.clientloanaccountinfo.interestRateFrequencyType.id,
                repaymentFrequencyType :   scope.clientloanaccountinfo.repaymentFrequencyType.id,
                interestRateFrequencyType : scope.clientloanaccountinfo.interestRateFrequencyType.id,
                amortizationType : scope.clientloanaccountinfo.amortizationType.id,
                interestType : scope.clientloanaccountinfo.interestType.id,
                interestCalculationPeriodType : scope.clientloanaccountinfo.interestCalculationPeriodType.id,
                inArrearsTolerance : scope.clientloanaccountinfo.inArrearsTolerance,
                graceOnPrincipalPayment : scope.clientloanaccountinfo.graceOnPrincipalPayment,
                graceOnInterestPayment : scope.clientloanaccountinfo.graceOnInterestPayment,
                transactionProcessingStrategyId : scope.clientloanaccountinfo.transactionProcessingStrategyId,
                graceOnInterestCharged : scope.clientloanaccountinfo.graceOnInterestCharged
              };

              //to display loan officer and loan purpose
              scope.formData.loanOfficerId = scope.loanOfficerId;
              scope.formData.loanPurposeId = scope.loanPurposeId;
             
            }
            
            scope.chargeSelected = function(chargeId) {
              resourceFactory.chargeResource.get({chargeId: this.formData.chargeId, template: 'true'}, this.formData,function(data){
                  data.chargeId = data.id;
                  scope.charges.push(data);
                  //to charge select box empty
                  scope.formData.chargeId = '';
              });

            }

            scope.deleteCharge = function(chargeId) {
              for (var i = 0; i < scope.charges.length; i++) {
                  if(scope.charges[i].chargeId == chargeId) {
                    scope.charges.splice(i,1);
                  }
                };
            }

            scope.previewRepayments = function() {
              var temp = [];
                for (var i = 0; i < scope.charges.length; i++) {
                  var charge = {
                    chargeId : scope.charges[i].chargeId,
                    amount : scope.charges[i].amount
                  }
                  temp.push(charge);
                };
                delete this.formData.clientName;
                delete this.formData.chargeId;
                delete this.formData.principalCurrencyCode;
                delete this.formData.interestRateFrequencyType;
                this.formData.clientId = scope.clientId;
                this.formData.charges = temp;
                this.formData.locale = 'en';
                this.formData.dateFormat = 'dd MMMM yyyy';
                this.formData.loanType = 'individual';
                this.formData.expectedDisbursementDate = "12 September 2013";

              resourceFactory.loanResource.save({command:'calculateLoanSchedule'}, this.formData,function(data){
                scope.repaymentscheduleinfo = data;
                scope.formData.clientName = scope.clientloanaccountinfo.clientName;
                scope.previewRepayment = true;
              });

            }

            scope.submit = function() {
                var temp = [];
                for (var i = 0; i < scope.charges.length; i++) {
                  var charge = {
                    chargeId : scope.charges[i].chargeId,
                    amount : scope.charges[i].amount
                  }
                  temp.push(charge);
                };

                delete this.formData.clientName;
                delete this.formData.chargeId;
                delete this.formData.principalCurrencyCode;
                delete this.formData.interestRateFrequencyType;
                this.formData.clientId = scope.clientId;
                this.formData.charges = temp;
                this.formData.locale = 'en';
                this.formData.dateFormat = 'dd MMMM yyyy';
                this.formData.loanType = 'individual';
                this.formData.expectedDisbursementDate = "12 September 2013";
                this.formData.submittedOnDate = "12 September 2013";

                resourceFactory.loanResource.put({loanId : routeParams.id},this.formData,function(data){
                  location.path('/viewclient/' + data.clientId);
                });
            };

            scope.cancel = function() {
              location.path('/viewclient/' + routeParams.id);
            }
        }
    });
    mifosX.ng.application.controller('EditClientLoanAccAppController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.EditClientLoanAccAppController]).run(function($log) {
        $log.info("EditClientLoanAccAppController initialized");
    });
}(mifosX.controllers || {}));

