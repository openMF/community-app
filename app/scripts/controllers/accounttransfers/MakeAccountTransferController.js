(function (module) {
    mifosX.controllers = _.extend(module, {
        MakeAccountTransferController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.restrictDate = new Date();
            var params = {fromAccountId: routeParams.accountId};
            var accountType = routeParams.accountType || '';
            if (accountType == 'fromsavings') params.fromAccountType = 2;
            else if (accountType == 'fromloans') params.fromAccountType = 1;
            else params.fromAccountType = 0;

            scope.toOffices = [];
            scope.toClients = [];
            scope.toAccountTypes = [];
            scope.toAccounts = [];

            scope.back = function () {
                window.history.back();
            };

            scope.formData = {fromAccountId: params.fromAccountId, fromAccountType: params.fromAccountType};
            resourceFactory.accountTransfersTemplateResource.get(params, function (data) {
                scope.transfer = data;
                scope.toOffices = data.toOfficeOptions;
                scope.toAccountTypes = data.toAccountTypeOptions;
                scope.formData.transferAmount = data.transferAmount;
            });

            scope.changeClient = function (client) {
                scope.formData.toClientId = client.id;
                scope.changeEvent();
            };

            scope.changeEvent = function () {

                var params = scope.formData;
                delete params.transferAmount;
                delete params.transferDate;
                delete params.transferDescription;

                resourceFactory.accountTransfersTemplateResource.get(params, function (data) {
                    scope.transfer = data;
                    scope.toOffices = data.toOfficeOptions;
                    scope.toAccountTypes = data.toAccountTypeOptions;
                    scope.toClients = data.toClientOptions;
                    scope.toAccounts = data.toAccountOptions;
                    scope.formData.transferAmount = data.transferAmount;
                });
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                if (this.formData.transferDate) this.formData.transferDate = dateFilter(this.formData.transferDate, scope.df);
                this.formData.fromClientId = scope.transfer.fromClient.id;
                this.formData.fromOfficeId = scope.transfer.fromClient.officeId;
                resourceFactory.accountTransferResource.save(this.formData, function (data) {
                    if (params.fromAccountType == 1) {
                        location.path('/viewloanaccount/' + data.loanId);
                    } else if (params.fromAccountType == 2) {
                        location.path('/viewsavingaccount/' + data.savingsId);
                    }
                });
            };
        }
    });
    mifosX.ng.application.controller('MakeAccountTransferController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.MakeAccountTransferController]).run(function ($log) {
        $log.info("MakeAccountTransferController initialized");
    });
}(mifosX.controllers || {}));