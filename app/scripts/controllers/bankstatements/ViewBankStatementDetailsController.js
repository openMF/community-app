(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewBankStatementDetailsController: function (scope, resourceFactory, location, dateFilter, http, routeParams, API_VERSION, $upload, $rootScope) {
            scope.bankStatementDetails  = [];
            scope.offices = [];
            scope.formData = [];
            scope.loanTransactionData = [];
            scope.maxPossibleLength = 3;
            scope.searchIndex = -1;
            scope.bankId = routeParams.bankStatementId;
            scope.action = "default";
            scope.toBulkReconcile = [];
            scope.isSearchedCriteriaMatched = true;
            scope.selectedAll = false;

            scope.getBankStatementDetails = function(){
                resourceFactory.bankStatementDetailsResource.getBankStatementDetails({ bankStatementId : routeParams.bankStatementId, command:'payment'},function (data) {
                    scope.bankStatementDetails = data;
                });
            };

            scope.getBankStatementDetails();

            scope.goToView = function(index, action){
                scope.searchIndex = index;
                scope.action = action;
            };

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                if(scope.offices.length>0){
                    scope.formData.officeId = scope.offices[0].id;
                }
            });

            scope.isBankTransactionSelected = function(bankTransctionId,loanId){
                var bankStatementDetailId = null;
                var isLoanTransactionAdded = false;
                if(scope.toBulkReconcile.length>0){
                    for(var i=0;i<scope.toBulkReconcile.length;i++){
                        if(scope.toBulkReconcile[i].loanTransactionId==loanId){
                            bankStatementDetailId = scope.toBulkReconcile[i].bankTransctionId;
                            isLoanTransactionAdded = true;
                            break;
                        }
                    }
                }
                return ((bankStatementDetailId == bankTransctionId  && isLoanTransactionAdded)|| !isLoanTransactionAdded);
            };

            scope.selectedSearchTransaction = function(index,loanTransaction, isFromSearch){
                if(scope.isChecked(loanTransaction.id)){
                    var j = -1;
                    if(scope.toBulkReconcile.length>0){
                        for(var i=0;i<scope.toBulkReconcile.length;i++){
                            if(scope.toBulkReconcile[i].loanTransactionId==loanTransaction.id && scope.toBulkReconcile[i].bankTransctionId == scope.bankStatementDetails[index].id){
                                j = i;break;
                            }
                        }
                    }
                    if(j>-1){
                        scope.toBulkReconcile.splice(j, 1);
                    }
                }else{
                    if(isFromSearch){
                        scope.bankStatementDetails[index].loanTransactionData = [];
                        scope.bankStatementDetails[index].loanTransactionData.amount = loanTransaction.AMOUNT;
                        scope.bankStatementDetails[index].loanTransactionData.groupExternalId = loanTransaction.GROUP_EXTERNAL_ID;
                        scope.bankStatementDetails[index].loanTransactionData.officeName = loanTransaction.BRANCH;
                        scope.bankStatementDetails[index].loanTransactionData.date = loanTransaction.TRANSACTION_DATE;
                        scope.bankStatementDetails[index].loanTransactionData.id = loanTransaction.LOAN_TRANSACTION_NO;
                        scope.bankStatementDetails[index].loanTransactionData.loanAccountNumber = loanTransaction.LOAN_ACCOUNT_NO;
                        scope.bankStatementDetails[index].loanTransactionData.type = {};
                        scope.bankStatementDetails[index].loanTransactionData.type.value = loanTransaction.TRANSACTION_TYPE;
                    }else{
                        scope.bankStatementDetails[index].loanTransactionData = loanTransaction;
                    }

                    scope.addBankStatementDetailsForBulkReconcile(scope.bankStatementDetails[index].loanTransactionData.id, scope.bankStatementDetails[index].id);

                }
            };

            scope.addBankStatementDetailsForBulkReconcile = function(loanTxnId, bankTransctionId){
                if(scope.toBulkReconcile.length>0){
                    var index = -1;
                    for(var i=0;i<scope.toBulkReconcile.length;i++){
                        if(scope.toBulkReconcile[i].bankTransctionId==bankTransctionId){
                            index = i;break;
                        }
                    }
                    if(index>-1){
                        scope.toBulkReconcile.splice(index, 1);
                    }

                }
                scope.toBulkReconcile.push({'loanTransactionId' : loanTxnId, 'bankTransctionId' : bankTransctionId});
            };

            scope.isChecked = function(id){
                var bool = false;
                for(var i=0;i<scope.toBulkReconcile.length;i++){
                    if(scope.toBulkReconcile[i].loanTransactionId==id){
                        bool = true;break;
                    }
                }
                return bool;
            };

            scope.submit = function () {
                var criteria = ' tr.is_reconciled = 0 ';
                var amountMinRange = false;
                var amountMaxRange = false;
                var dateRange = false;
                var groupId = false;
                if(scope.isValidInput('min')){
                    criteria = criteria+ ' and tr.amount >= '+(this.formData.min)+' ';
                    amountMinRange = true;
                }
                if(scope.isValidInput('max')){
                    criteria = criteria+ ' and tr.amount <= '+this.formData.max+' ';
                    amountMaxRange = true;
                }
                var amountRange = amountMaxRange && amountMinRange;
                if(scope.isValidInput('groupExternalId')){
                    criteria = criteria+ ' and g.external_id =  \''+this.formData.groupExternalId+'\' ';
                    groupId = true;
                }

                if(scope.isValidInput('startDate') && scope.isValidInput('endDate')){
                    var startDate = dateFilter(this.formData.startDate,'yyyy-MM-dd');
                    var endDate = dateFilter(this.formData.endDate,'yyyy-MM-dd');
                    criteria = criteria+ ' and tr.transaction_date between   \''+startDate+'\' and \''+endDate+'\' ';
                    dateRange = true;
                }
                if(!amountRange && !dateRange && !groupId){
                    scope.isSearchedCriteriaMatched = false;
                    return false;

                }else{
                    scope.isSearchedCriteriaMatched = true;
                    resourceFactory.runReportsResource.get({reportSource: 'LoanTransactionsForPaymentReconciliation', R_searchCriteria: criteria, R_officeId: this.formData.officeId, genericResultSet: false}, function (data) {
                        scope.loanTransactionData = data;
                    });
                }

            };

            scope.checkCriteria = function(){
                if(this.formData.groupExternalId != undefined && this.formData.groupExternalId.length > 0){
                    scope.isSearchedCriteriaMatched = true;
                }else if((this.formData.min != undefined && this.formData.min.length > 0) && (this.formData.max != undefined && this.formData.max.length > 0)){
                    scope.isSearchedCriteriaMatched = true;
                }else if((this.formData.startDate != undefined && this.formData.startDate.length > 0) && (this.formData.endDate != undefined && this.formData.endDate.length > 0)){
                    scope.isSearchedCriteriaMatched = true;
                }
            };

            scope.isValidInput = function(property){
                if(property == 'startDate' || property == 'endDate' ){
                    if(this.formData[property] != undefined){
                        var data = this.formData[property]+'';
                        return (data.length>0);
                    }
                }else{
                    if(this.formData.hasOwnProperty(property)){
                        if(this.formData[property] != undefined){
                            return (this.formData[property].length>0);
                        }
                    }
                }
                return false;
            };

            scope.selectAll = function(){
                scope.selectedAll = !scope.selectedAll;
                if(scope.selectedAll == true){
                    for(var i=0;i<scope.bankStatementDetails.length; i++){
                        if(scope.bankStatementDetails[i].hasOwnProperty('loanTransactionData')){
                            scope.selectedSearchTransaction(i,scope.bankStatementDetails[i].loanTransactionData, false);
                        }
                    }
                }else{
                    scope.toBulkReconcile = [];
                }
            };

            scope.makeBulkBankStatementDetailsReconcile = function(){
                var reconcileData = {};
                reconcileData.transactionData = scope.toBulkReconcile;
                resourceFactory.bankStatementDetailsResource.reconcileBankStatement({ bankStatementId : routeParams.bankStatementId, command:'reconcile'},reconcileData, function (data) {
                    location.path('/bankstatementsdetails/'+routeParams.bankStatementId+'/reconciledtransaction');
                });
            };

        }
    });
    mifosX.ng.application.controller('ViewBankStatementDetailsController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.ViewBankStatementDetailsController]).run(function ($log) {
        $log.info("ViewBankStatementDetailsController initialized");
    });
}(mifosX.controllers || {}));