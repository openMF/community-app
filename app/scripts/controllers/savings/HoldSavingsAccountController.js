(function (module) {
    mifosX.controllers = _.extend(module, {
        HoldSavingsAccountController: function (scope, resourceFactory, routeParams, location, dateFilter) {

            scope.loanOfficers = [];
            scope.formData = {};
            scope.staffData = {};
            scope.paramData = {};
            scope.savingsId = routeParams.savingsId;
            scope.showHoldAccount = false;
            scope.showHoldTransaction = false;


            scope.holdChange = function (holdParam) {

                if (holdParam == 'savingsAccountBlock') {
                    scope.showHoldAccount = false;
                    scope.showHoldReasons = true;
                    resourceFactory.codeValueResource.getAllCodeValues({codeId: 35}, function (data) {
                        scope.reasons = data;
                        route.reload();
                    });
                }
                else if(holdParam == 'savingsAccountUnBlock'){
                    scope.showHoldAccount = false;
                    scope.showHoldReasons = false;
                    resourceFactory.codeValueResource.getAllCodeValues({codeId: 35}, function (data) {
                        scope.reasons = data;
                        route.reload();
                    });
                }
                else if (holdParam == 'debitTransactionFreeze' ) {
                    scope.showHoldAccount = false;
                    scope.showHoldReasons = true;
                    resourceFactory.codeValueResource.getAllCodeValues({codeId: 36}, function (data) {
                        scope.reasons = data;
                        route.reload();
                    });
                }
                else if (holdParam == 'debitTransactionUnFreeze'){
                    scope.showHoldAccount = false;
                    scope.showHoldReasons = false;
                    resourceFactory.codeValueResource.getAllCodeValues({codeId: 36}, function (data) {
                        scope.reasons = data;
                        route.reload();
                    });
                }
                else if (holdParam == 'creditTransactionFreeze') {
                    scope.showHoldAccount = false;
                    scope.showHoldReasons = true;
                    resourceFactory.codeValueResource.getAllCodeValues({codeId: 37}, function (data) {
                        scope.reasons = data;
                        route.reload();
                    });
                }
                else if(holdParam == 'creditTransactionUnFreeze'){
                    scope.showHoldAccount = false;
                    scope.showHoldReasons = false;
                    resourceFactory.codeValueResource.getAllCodeValues({codeId: 37}, function (data) {
                        scope.reasons = data;
                        route.reload();
                    });
                }

                else if (holdParam == 'savingsTransactionFreeze') {
                    scope.showHoldAccount = true;
                    scope.showHoldReasons = true;
                    resourceFactory.codeValueResource.getAllCodeValues({codeId: 38}, function (data) {
                        scope.reasons = data;
                        route.reload();
                    });
                }
                else{
                    scope.showHoldAccount = false;
                    scope.showHoldReasons = false;
                }
            }



            scope.cancel = function () {
                location.path('/viewsavingaccount/' + scope.savingsId);
            };

            scope.submit = function () {
                var params = {command: scope.action};
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.lienAllowed = this.formData.lienAllowed || false;
                this.formData.transactionDate = dateFilter(this.formData.transactionDate, scope.df);

                if(scope.holdOption == 'savingsAccountBlock') {
                    params = {savingsId: scope.savingsId, command: 'block'};
                    resourceFactory.savingsAccountBlockResource.save(params, this.formData, function () {
                        location.path('/viewsavingaccount/' + scope.savingsId);
                    });
                }
                else if (scope.holdOption == 'savingsAccountUnBlock') {
                    params = {savingsId: scope.savingsId, command: 'unblock'};
                    resourceFactory.savingsAccountBlockResource.save(params, scope.accountId ,function () {
                        location.path('/viewsavingaccount/' + scope.savingsId);
                    });
                }
                else if (scope.holdOption == 'debitTransactionFreeze') {
                    params = {savingsId: scope.savingsId, command: 'blockDebit'};
                    resourceFactory.savingsAccountBlockResource.save(params,  this.formData, function () {
                        location.path('/viewsavingaccount/' + scope.savingsId);
                    });
                }
                else if (scope.holdOption == 'debitTransactionUnFreeze') {
                    params = {savingsId: scope.savingsId, command: 'unblockDebit'};
                    resourceFactory.savingsAccountBlockResource.save(params,  this.formData, function () {
                        location.path('/viewsavingaccount/' + scope.savingsId);
                    });
                }
                else if (scope.holdOption == 'creditTransactionFreeze') {
                    params = {savingsId: scope.savingsId, command: 'blockCredit'};
                    resourceFactory.savingsAccountBlockResource.save(params, this.formData, function () {
                        location.path('/viewsavingaccount/' + scope.savingsId);
                    });
                }
                else if (scope.holdOption == 'creditTransactionUnFreeze') {
                    params = {savingsId: scope.savingsId, command: 'unblockCredit'};
                    resourceFactory.savingsAccountBlockResource.save(params, this.formData, function () {
                        location.path('/viewsavingaccount/' + scope.savingsId);
                    });
                }

                else if (scope.holdOption == 'savingsTransactionFreeze') {
                    params = {savingsId: scope.savingsId, command: 'holdAmount'};
                    resourceFactory.savingsAccountTransactionBlockResource.save(params, this.formData, function (data) {
                        location.path('/viewsavingaccount/' + scope.savingsId);
                    });
                }
            };

        }
    });
    mifosX.ng.application.controller('HoldSavingsAccountController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.HoldSavingsAccountController]).run(function ($log) {
        $log.info("HoldSavingsAccountController initialized");
    });
}(mifosX.controllers || {}));

