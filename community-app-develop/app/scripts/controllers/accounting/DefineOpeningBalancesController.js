(function (module) {
    mifosX.controllers = _.extend(module, {
        DefineOpeningBalancesController: function (scope, resourceFactory, location, translate, routeParams, dateFilter) {
            scope.first = {};
            scope.formData = {};
            scope.first.date = new Date();
            scope.accountClosures = [];
            scope.restrictDate = new Date();
            scope.totalDebitAmount = 0;
            scope.totalCreditAmount = 0;

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
            });

            resourceFactory.currencyConfigResource.get({fields: 'selectedCurrencyOptions'}, function (data) {
                scope.currencyOptions = data.selectedCurrencyOptions;
                scope.formData.currencyCode = scope.currencyOptions[0].code;
            });

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.transactionDate = reqDate;
                this.formData.currencyCode = scope.formData.currencyCode;
                this.formData.credits = [];
                this.formData.debits = [];
                scope.errorDetails = [];
                var noErrors = true;
                for (var i in scope.allGls) {
                    if (scope.allGls[i].credit && scope.allGls[i].credit != "" && scope.allGls[i].debit && scope.allGls[i].debit != "") {
                        if(noErrors){
                            noErrors = false;
                            var errorObj = new Object();
                            errorObj.code = 'error.msg.accounting.defining.openingbalance.both.credit.debits.are.passed';
                            scope.errorDetails.push([errorObj]);
                        }
                    } else if (scope.allGls[i].debit && scope.allGls[i].debit != "") {
                        this.formData.debits.push({"glAccountId":scope.allGls[i].glAccountId, "amount":scope.allGls[i].debit});
                    } else if (scope.allGls[i].credit && scope.allGls[i].credit) {
                        this.formData.credits.push({"glAccountId":scope.allGls[i].glAccountId, "amount":scope.allGls[i].credit});
                    }
                }
                if(noErrors){
                    delete scope.errorDetails;
                    resourceFactory.journalEntriesResource.save({command:"defineOpeningBalance"}, this.formData, function (data) {
                        location.path('/viewtransactions/' + data.transactionId);
                    });
                }
            }

            scope.keyPress = function(){
                this.formData.credits = [];
                this.formData.debits = [];
                scope.totalDebitAmount = 0;
                scope.totalCreditAmount = 0;

                for(var l in scope.allGls) {
                    if (scope.allGls[l].debit != null && scope.allGls[l].debit != "") {
                        scope.totalDebitAmount += parseFloat(scope.allGls[l].debit);
                    }
                    if(scope.allGls[l].credit != null && scope.allGls[l].credit != ""){
                        scope.totalCreditAmount += parseFloat(scope.allGls[l].credit)
                    }
                }

            };

            scope.updateDebitCreditAmounts = function (gl) {
                if (gl.amount) {
                    if (gl.entryType) {
                        if (gl.entryType.value == "DEBIT") {
                            gl.debit = gl.amount;
                        } else if (gl.entryType.value == "CREDIT") {
                            gl.credit = gl.amount;
                        }
                    }
                }
            }

            scope.mergeAllGLs = function () {
                scope.allGls = [];
                scope.debitTotal = 0;

                _.each(scope.data.assetAccountOpeningBalances, function(gl){
                    scope.updateDebitCreditAmounts(gl);
                    scope.allGls.push(gl);
                });

                _.each(scope.data.liabityAccountOpeningBalances, function(gl){
                    scope.updateDebitCreditAmounts(gl);
                    scope.allGls.push(gl);
                });

                _.each(scope.data.equityAccountOpeningBalances, function(gl){
                    scope.updateDebitCreditAmounts(gl);
                    scope.allGls.push(gl);
                });

                _.each(scope.data.incomeAccountOpeningBalances, function(gl){
                    scope.updateDebitCreditAmounts(gl);
                    scope.allGls.push(gl);
                });

                _.each(scope.data.expenseAccountOpeningBalances, function(gl){
                    scope.updateDebitCreditAmounts(gl);
                    scope.allGls.push(gl);
                });

            }

            scope.retrieveOpeningBalances = function (officeId, currencyCode) {
                resourceFactory.officeOpeningResource.get({officeId: officeId, currencyCode: currencyCode}, function (data) {
                    scope.data = data;
                    scope.mergeAllGLs();
                });
            }
        }
    });
    mifosX.ng.application.controller('DefineOpeningBalancesController', ['$scope', 'ResourceFactory', '$location', '$translate', '$routeParams', 'dateFilter', mifosX.controllers.DefineOpeningBalancesController]).run(function ($log) {
        $log.info("DefineOpeningBalancesController initialized");
    });
}(mifosX.controllers || {}));
