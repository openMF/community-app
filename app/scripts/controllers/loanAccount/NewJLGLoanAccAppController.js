(function(module) {
    mifosX.controllers = _.extend(module, {
        NewJLGLoanAccAppController: function(scope, routeParams, resourceFactory, location, dateFilter) {

            scope.previewRepayment = false;
            scope.groupId = routeParams.groupId;
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.chargeFormData = {}; //For charges
            scope.collateralFormData = {}; //For collaterals
            scope.inparams = { resourceType:'template', templateType:'jlgbulk', lendingStrategy:300 };

            if (scope.groupId) {
              scope.inparams.groupId = scope.groupId;
              scope.formData.groupId = scope.groupId;
            }

            resourceFactory.loanResource.get(scope.inparams, function(data) {
              scope.products = data.productOptions;
              if (data.group) {scope.groupName = data.group.name;} 
            });

            scope.loanProductChange = function(loanProductId) {
              scope.clients = [];
              scope.inparams.productId = loanProductId;
              resourceFactory.loanResource.get(scope.inparams, function(data) {
                scope.loanaccountinfo = data;
                if(data.group.clientMembers) {
                  for (var i in data.group.clientMembers) {
                    scope.clients.push({selected:true, clientId:data.group.clientMembers[i].id,  name:data.group.clientMembers[i].displayName, amount:data.principal});
                  }
                }
                scope.previewClientLoanAccInfo();
              });

              resourceFactory.loanResource.get({resourceType : 'template', templateType:'collateral', productId:loanProductId, fields:'id,loanCollateralOptions'}, function(data) {
                scope.collateralOptions = data.loanCollateralOptions || [];
              });
            }

            scope.previewClientLoanAccInfo = function() {
              scope.previewRepayment = false;
              scope.charges = scope.loanaccountinfo.charges || [];
              scope.collaterals = [];

              if (scope.loanaccountinfo.calendarOptions) {
                scope.formData.syncRepaymentsWithMeeting = true;
                scope.formData.syncDisbursementWithMeeting = true;
              }

              scope.formData.productId = scope.loanaccountinfo.loanProductId;
              scope.formData.fundId = scope.loanaccountinfo.fundId;
              scope.formData.loanTermFrequency = scope.loanaccountinfo.termFrequency;
              scope.formData.loanTermFrequencyType = scope.loanaccountinfo.termPeriodFrequencyType.id;
              scope.formData.numberOfRepayments = scope.loanaccountinfo.numberOfRepayments;
              scope.formData.repaymentEvery = scope.loanaccountinfo.repaymentEvery;
              scope.formData.repaymentFrequencyType =   scope.loanaccountinfo.repaymentFrequencyType.id;
              scope.formData.interestRatePerPeriod = scope.loanaccountinfo.interestRatePerPeriod;
              scope.formData.interestRateFrequencyType = scope.loanaccountinfo.interestRateFrequencyType.id;
              scope.formData.amortizationType = scope.loanaccountinfo.amortizationType.id;
              scope.formData.interestType = scope.loanaccountinfo.interestType.id;
              scope.formData.interestCalculationPeriodType = scope.loanaccountinfo.interestCalculationPeriodType.id;
              scope.formData.inArrearsTolerance = scope.loanaccountinfo.inArrearsTolerance;
              scope.formData.graceOnPrincipalPayment = scope.loanaccountinfo.graceOnPrincipalPayment;
              scope.formData.graceOnInterestPayment = scope.loanaccountinfo.graceOnInterestPayment;
              scope.formData.transactionProcessingStrategyId = scope.loanaccountinfo.transactionProcessingStrategyId;
              scope.formData.graceOnInterestCharged = scope.loanaccountinfo.graceOnInterestCharged;
             
            }

            scope.viewLoanSchedule = function (index) {
              scope.formData.clientId= scope.clients[index].clientId;
              scope.formData.principal = scope.clients[index].amount;
              scope.previewRepayments();
            }
            
            scope.addCharge = function() {
              if (scope.chargeFormData.chargeId) {
                resourceFactory.chargeResource.get({chargeId: this.chargeFormData.chargeId, template: 'true'}, function(data){
                    data.chargeId = data.id;
                    scope.charges.push(data);
                    scope.chargeFormData.chargeId = undefined;
                });
              }
            }

            scope.deleteCharge = function(index) {
              scope.charges.splice(index,1);
            }

            scope.syncRepaymentsWithMeetingchange = function() {
              if (!scope.formData.syncRepaymentsWithMeeting) {
                scope.formData.syncDisbursementWithMeeting=false;
              }
            };

            scope.syncDisbursementWithMeetingchange = function() {
              if (scope.formData.syncDisbursementWithMeeting) {
                scope.formData.syncRepaymentsWithMeeting=true;
              }
            };

            scope.addCollateral = function () {
              if (scope.collateralFormData.collateralIdTemplate && scope.collateralFormData.collateralValueTemplate) {
                scope.collaterals.push({type:scope.collateralFormData.collateralIdTemplate.id, name:scope.collateralFormData.collateralIdTemplate.name, value:scope.collateralFormData.collateralValueTemplate, description:scope.collateralFormData.collateralDescriptionTemplate});
                scope.collateralFormData.collateralIdTemplate = undefined;
                scope.collateralFormData.collateralValueTemplate = undefined;
                scope.collateralFormData.collateralDescriptionTemplate = undefined;
              }
            };

            scope.deleteCollateral = function (index) {
              scope.collaterals.splice(index,1);
            };

            scope.previewRepayments = function() {
                // Make sure charges and collaterals are empty before initializing.
                delete scope.formData.charges;
                delete scope.formData.collateral;

                if (scope.charges.length > 0) {
                  scope.formData.charges = [];
                  for (var i in scope.charges) {
                    scope.formData.charges.push({ chargeId:scope.charges[i].chargeId, amount:scope.charges[i].amount, dueDate:dateFilter(scope.charges[i].dueDate,scope.df) });
                  }
                }

                if (scope.collaterals.length > 0) {
                  scope.formData.collateral = [];
                  for (var i in scope.collaterals) {
                    scope.formData.collateral.push({type:scope.collaterals[i].type,value:scope.collaterals[i].value, description:scope.collaterals[i].description});
                  };
                }

                if (this.formData.syncRepaymentsWithMeeting) {
                  this.formData.calendarId = scope.loanaccountinfo.calendarOptions[0].id;
                  scope.syncRepaymentsWithMeeting = this.formData.syncRepaymentsWithMeeting;
                }
                delete this.formData.syncRepaymentsWithMeeting;

                if (this.formData.submittedOnDate){this.formData.submittedOnDate = dateFilter(this.formData.submittedOnDate,scope.df);}
                if (this.formData.expectedDisbursementDate){this.formData.expectedDisbursementDate = dateFilter(this.formData.expectedDisbursementDate,scope.df);}
                if (this.formData.interestChargedFromDate){this.formData.interestChargedFromDate = dateFilter(this.formData.interestChargedFromDate,scope.df);}
                if (this.formData.repaymentsStartingFromDate){this.formData.repaymentsStartingFromDate = dateFilter(this.formData.repaymentsStartingFromDate,scope.df);}

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.loanType = 'jlg';

              resourceFactory.loanResource.save({command:'calculateLoanSchedule'}, this.formData,function(data){
                scope.repaymentscheduleinfo = data;
                scope.previewRepayment = true;
                scope.formData.syncRepaymentsWithMeeting = scope.syncRepaymentsWithMeeting;
                scope.formData.clientId= undefined;
                scope.formData.principal = undefined;
              });

            }

            scope.submit = function() {
                // Make sure charges and collaterals are empty before initializing.
                delete scope.formData.charges;
                delete scope.formData.collateral;

                if (scope.charges.length > 0) {
                  scope.formData.charges = [];
                  for (var i in scope.charges) {
                    scope.formData.charges.push({ chargeId:scope.charges[i].chargeId, amount:scope.charges[i].amount, dueDate:dateFilter(scope.charges[i].dueDate,scope.df) });
                  }
                }

                if (scope.collaterals.length > 0) {
                  scope.formData.collateral = [];
                  for (var i in scope.collaterals) {
                    scope.formData.collateral.push({type:scope.collaterals[i].type,value:scope.collaterals[i].value, description:scope.collaterals[i].description});
                  };
                }

                if (this.formData.syncRepaymentsWithMeeting) {
                  this.formData.calendarId = scope.loanaccountinfo.calendarOptions[0].id;
                }
                delete this.formData.syncRepaymentsWithMeeting;
                delete this.formData.interestRateFrequencyType;

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.loanType = 'jlg';
                if (this.formData.submittedOnDate){this.formData.submittedOnDate = dateFilter(this.formData.submittedOnDate,scope.df);}
                if (this.formData.expectedDisbursementDate){this.formData.expectedDisbursementDate = dateFilter(this.formData.expectedDisbursementDate,scope.df);}
                if (this.formData.interestChargedFromDate){this.formData.interestChargedFromDate = dateFilter(this.formData.interestChargedFromDate,scope.df);}
                if (this.formData.repaymentsStartingFromDate){this.formData.repaymentsStartingFromDate = dateFilter(this.formData.repaymentsStartingFromDate,scope.df);}

                //logic for proper redirecting
                var selectedClients = 0;
                var successfullyCreated = 0;

                for (var i in scope.clients) {
                  if (scope.clients[i].selected) {
                    selectedClients = selectedClients + 1;
                  }
                }

                for (var i in scope.clients) {
                  if (scope.clients[i].selected) {
                    this.formData.clientId= scope.clients[i].clientId;
                    this.formData.principal = scope.clients[i].amount;
                    resourceFactory.loanResource.save({_:new Date().getTime()},this.formData,function(data){
                      successfullyCreated = successfullyCreated + 1;
                      if (successfullyCreated == selectedClients) {
                        location.path('/viewgroup/' + scope.groupId);
                      }else {
                        for (var x in scope.clients) {
                          if(scope.clients[x].clientId == data.clientId){
                            scope.clients[x]['status'] = 'Created';
                          }
                        }
                      }
                    });
                  }
                }
            };

            scope.cancel = function() {
              if (scope.groupId) {
                location.path('/viewgroup/' + scope.groupId);
              }
            };
        }
    });
    mifosX.ng.application.controller('NewJLGLoanAccAppController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.NewJLGLoanAccAppController]).run(function($log) {
        $log.info("NewJLGLoanAccAppController initialized");
    });
}(mifosX.controllers || {}));