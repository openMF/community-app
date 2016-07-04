(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewBankStatementDetailsController: function (scope, resourceFactory, location, dateFilter, http, routeParams, API_VERSION, $upload, $rootScope) {
            scope.bankStatementDetails  = [];
            scope.offices = [];
            scope.formData = [];
            scope.detailFormDta = [];
            scope.reconcileDatas = {};
            scope.loanTransactionData = [];
            scope.isBankStatementReconciled = false;
            scope.maxPossibleLength = 3;
            scope.index = -1;
            scope.showPossibleMatch  = false;            
            scope.searchIndex = -1;
            scope.isSearch = false;
            scope.bankId = routeParams.bankStatementId;

            scope.isBankStatementReconcile = function(){
                resourceFactory.bankStatementsResource.getBankStatement({bankStatementId : routeParams.bankStatementId}, function (data) {
                    scope.isBankStatementReconciled = data.isReconciled;
                });
            };

            scope.isBankStatementReconcile();

            scope.getBankStatementDetails = function(){
                resourceFactory.bankStatementDetailsResource.getBankStatementDetails({ bankStatementId : routeParams.bankStatementId, command:'payment'},function (data) {
                    scope.bankStatementDetails = data;
                    for(var i=0;i<data.length;i++){
                        scope.bankStatementDetails[i].optionsLength = 0;
                        if(data[i].isReconciled==false){
                            scope.attachPossibleLoanTransactions(scope.bankStatementDetails[i].id,i);
                        }
                    }
                    
                });
            };

            scope.attachPossibleLoanTransactions = function(id,i){
                resourceFactory.bankStatementLoanTransactionResource.getLoanTransactions({ bankStatementId : routeParams.bankStatementId, bankStatementDetailId : id},function (data) {
                    scope.bankStatementDetails[i].bestMatchingLoanTransactions = data;
                    scope.bankStatementDetails[i].optionsLength = data.length;
                });
            };

            scope.possibleMatches = function(index){
                scope.index = index;
                scope.showPossibleMatch  = true;
            };

            scope.searchOptions = function(index){
                scope.searchIndex = index;
                scope.isSearch = true;
            };

            scope.goToShowMore = function(){
                var len = scope.toBulkReconcile.length;
                var loanId = scope.getSelectedLoanIdFromBankDetails(scope.searchIndex);
                if(scope.toBulkReconcile[len-1] != undefined && (loanId != null)){
                    resourceFactory.bankStatementSearchLoanTransactionResource.getLoanTransaction({ loanId : loanId, bankStatementDetailId : scope.bankStatementDetails[scope.searchIndex].id},function (data) {
                        scope.bankStatementDetails[scope.searchIndex].bestMatchingLoanTransactions = data;
                        scope.bankStatementDetails[scope.searchIndex].optionsLength = 1;
                        scope.bankStatementDetails[scope.searchIndex].searched = true;
                        scope.searchIndex = -1;
                        scope.isSearch = false;
                        scope.loanTransactionData = [];
                    });
                }else{
                        scope.searchIndex = -1;
                        scope.isSearch = false;
                        scope.loanTransactionData = [];
                }
                this.formData.min = undefined;
                this.formData.max = undefined;
                this.formData.groupAccountNumber = undefined;
            };

            scope.defaultView = function(index){
                if(!scope.bankStatementDetails[index].isReconciled){
                    var length = scope.bankStatementDetails[index].optionsLength;
                    if(scope.bankStatementDetails[index].hasOwnProperty('searched') || length > scope.maxPossibleLength || length==0){
                        scope.searchIndex = index;
                        scope.isSearch = true;
                    }else{
                        if(scope.showPossibleMatch==false){
                            scope.index = index;
                            scope.showPossibleMatch  = true;
                        }else{
                            scope.index = -1;
                            scope.showPossibleMatch  = false;
                        }
                    }

                }

            };

            scope.getBankStatementDetails();

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                if(scope.offices.length>0){
                    scope.formData.officeId = scope.offices[0].id;
                }
            });

            scope.isMatchSelected = function(bankTransctionId){
                if(scope.toBulkReconcile.length>0){
                    for(var i=0;i<scope.toBulkReconcile.length;i++){
                        if(scope.toBulkReconcile[i].bankTransctionId==bankTransctionId){
                            return true;
                        }
                    }
                }
                return false;
            };

            scope.isBankTransactionSelected = function(bankTransctionId,loanId){
                if(scope.toBulkReconcile.length>0){
                    for(var i=0;i<scope.toBulkReconcile.length;i++){
                        if(scope.toBulkReconcile[i].bankTransctionId==bankTransctionId && scope.toBulkReconcile[i].loanTransactionId==loanId){

                            return true;
                        }
                    }
                }
                return false;
            };

            scope.isSelectedLoan = function(bankDetailIndex){
                var data = scope.bankStatementDetails[bankDetailIndex].bestMatchingLoanTransactions;
                if(data != undefined){
                    for(var i=0;i<data.length;i++){
                        if(scope.isChecked(data[i].id)){
                            return data[i];
                        }
                    }
                }

                return null;
            };

            scope.getLoanIndex = function(bankDetailIndex){
                var data = scope.bankStatementDetails[bankDetailIndex].bestMatchingLoanTransactions;
                if(data != undefined){
                    for(var i=0;i<data.length;i++){
                        if(scope.isChecked(data[i].id)){
                            return i;
                        }
                    }
                }

                return -1;
            };

            scope.toBulkReconcile = [];

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

                scope.trackActualOptions();
            };

            scope.trackActualOptions = function(){
                for(var i=0;i<scope.bankStatementDetails.length;i++){
                    if(!scope.bankStatementDetails[i].isReconciled && scope.bankStatementDetails[i].bestMatchingLoanTransactions != undefined){
                        var actualLength = scope.bankStatementDetails[i].bestMatchingLoanTransactions.length;
                        if(actualLength>0 && actualLength<=scope.maxPossibleLength){
                            var loanTransactionData = scope.bankStatementDetails[i].bestMatchingLoanTransactions;
                            for(var j=0;j<loanTransactionData.length;j++){
                                var id = scope.getSelectedBankDetailsIdFromLoan(loanTransactionData[j].id);
                                if(id != null && id != scope.bankStatementDetails[i].id){
                                    actualLength = actualLength -1;
                                }
                            }
                            scope.bankStatementDetails[i].optionsLength = actualLength;
                        }
                    }
                }
            };

            scope.trackActualIndex = function(index){
                var data = scope.bankStatementDetails[index].bestMatchingLoanTransactions;
                if(scope.bankStatementDetails[index] != undefined && scope.bankStatementDetails[index].bestMatchingLoanTransactions != undefined && data != undefined){
                    for(var i=0;i<data.length;i++){
                        var bool = scope.isChecked(data[i].id);
                        if(bool==false){
                            return i; break;
                        }
                    };
                    for(var i= scope.toBulkReconcile.length-1;i>-1;i--){
                        var loanId = scope.toBulkReconcile[i].loanTransactionId;
                        for(var j=0;i<data.length;j++){
                            if(data[j].id==loanId){
                                return j; break;
                            }
                        };
                    }
                }
                return -1;
            };


            scope.getSelectedLoanIdFromBankDetails = function(index){
                var id = scope.bankStatementDetails[index].id;
                for(var i=0;i<scope.toBulkReconcile.length;i++){
                    if(scope.toBulkReconcile[i].bankTransctionId==id){
                        return scope.toBulkReconcile[i].loanTransactionId;break;
                    }
                }
                return null;
            };

            scope.getSelectedBankDetailsIdFromLoan = function(id){
                for(var i=0;i<scope.toBulkReconcile.length;i++){
                    if(scope.toBulkReconcile[i].loanTransactionId==id){
                        return scope.toBulkReconcile[i].bankTransctionId;break;
                    }
                }
                return null;
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

            scope.makeBankStatementUndoReconcile = function(){
                resourceFactory.bankStatementsResource.reconcileBankStatement({ bankStatementId : routeParams.bankStatementId, command:'reconcile'}, function (data) {
                    scope.isBankStatementReconcile();
                    location.path('/bankstatements');
                });
            };

            scope.submit = function () {
                var criteria = ' and o.id = '+this.formData.officeId+' ';
                if(scope.isValidInput('min')){
                    criteria = criteria+ ' and mlt.amount >= '+(this.formData.min)+' ';
                }
                if(scope.isValidInput('max')){
                    criteria = criteria+ ' and mlt.amount <= '+this.formData.max+' ';
                }
                if(scope.isValidInput('groupExternalId')){
                    criteria = criteria+ ' and grou.external_id =  '+this.formData.groupExternalId;
                }

                if(scope.isValidInput('startDate') && scope.isValidInput('endDate')){
                    var startDate = dateFilter(this.formData.startDate,'yyyy-MM-dd');
                    var endDate = dateFilter(this.formData.endDate,'yyyy-MM-dd');
                    criteria = criteria+ ' and mlt.transaction_date between   \''+startDate+'\' and \''+endDate+'\' ';
                }
                resourceFactory.runReportsResource.get({reportSource: 'LoanTransactionsForPaymentReconciliation', R_searchCriteria: criteria, R_officeId: this.formData.officeId, genericResultSet: false}, function (data) {
                    scope.loanTransactionData = data;
                });
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

            scope.makeBankStatementDetailsReconcile = function(index, bankTransctionId){
                var data = [];
                data.push({'loanTransactionId' : scope.detailFormDta[index].loanTransactionId, 'bankTransctionId' : bankTransctionId});
                var reconcileData = {};
                reconcileData.transactionData = data;
                resourceFactory.bankStatementDetailsResource.reconcileBankStatement({ bankStatementId : routeParams.bankStatementId},reconcileData, function (data) {
                    scope.getBankStatementDetails();
                    scope.detailFormDta[index] = undefined;
                });
            };

            scope.makeBulkBankStatementDetailsReconcile = function(){
                var reconcileData = {};
                reconcileData.transactionData = scope.toBulkReconcile;
                resourceFactory.bankStatementDetailsResource.reconcileBankStatement({ bankStatementId : routeParams.bankStatementId},reconcileData, function (data) {
                    scope.getBankStatementDetails();
                    scope.toBulkReconcile = [];
                });
            };

        }
    });
    mifosX.ng.application.controller('ViewBankStatementDetailsController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.ViewBankStatementDetailsController]).run(function ($log) {
        $log.info("ViewBankStatementDetailsController initialized");
    });
}(mifosX.controllers || {}));