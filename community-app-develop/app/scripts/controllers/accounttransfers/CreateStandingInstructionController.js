(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateStandingInstructionController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.restrictDate = new Date();
            var params = {clientId: routeParams.clientId,officeId:routeParams.officeId};
            var accountType = routeParams.accountType || '';
            if (accountType == 'fromsavings') params.fromAccountType = 2;
            else if (accountType == 'fromloans') params.fromAccountType = 1;
            else params.fromAccountType = 0;

            scope.toOffices = [];
            scope.toClients = [];
            scope.toAccountTypes = [];
            scope.toAccounts = [];
            scope.destinationOptions = [{id:1,name:'own account'},{id:2,name:'with in bank'}];
            scope.showselctclient = 'false';
            scope.allowclientedit = 'true';

            scope.formData = {fromOfficeId: Number(params.officeId), fromClientId: Number(params.clientId),fromAccountType:params.fromAccountType};
            resourceFactory.standingInstructionTemplateResource.get(scope.formData, function (data) {
                scope.standinginstruction = data;
                scope.toOffices = data.toOfficeOptions;
                scope.toAccountTypes = data.toAccountTypeOptions;
            });

            scope.changeEvent = function () {

                var params = scope.formData;

                resourceFactory.standingInstructionTemplateResource.get(params, function (data) {
                    scope.standinginstruction = data;
                    scope.toOffices = data.toOfficeOptions;
                    scope.toAccountTypes = data.toAccountTypeOptions;
                    scope.toClients = data.toClientOptions;
                    scope.toAccounts = data.toAccountOptions;
                    scope.formData.transferAmount = data.transferAmount;
                });
            };

            scope.changedestination = function () {
                if(scope.destination == 1){
                    scope.allowclientedit = 'false';
                    scope.formData.toOfficeId = scope.formData.fromOfficeId;
                    scope.formData.toClientId = scope.formData.fromClientId;
                    console.log(scope.formData);
                    scope.changeEvent();
                }else{
                    scope.allowclientedit = 'true';
                    scope.formData.toOfficeId = null;
                    scope.formData.toClientId = null;
                }
            }

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                if (this.formData.validFrom) this.formData.validFrom = dateFilter(this.formData.validFrom, scope.df);
                if (this.formData.validTill) this.formData.validTill = dateFilter(this.formData.validTill, scope.df);
                if(this.recurrenceOnMonthDay){
                 var reqDate = dateFilter(this.recurrenceOnMonthDay, 'dd MMMM');
                 this.formData.recurrenceOnMonthDay = reqDate;
                 this.formData.monthDayFormat = 'dd MMMM';
                }
                this.formData.fromClientId = scope.standinginstruction.fromClient.id;
                this.formData.fromOfficeId = scope.standinginstruction.fromClient.officeId;
                resourceFactory.standingInstructionResource.save(this.formData, function (data) {
                    location.path('/viewclient/' + data.clientId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateStandingInstructionController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.CreateStandingInstructionController]).run(function ($log) {
        $log.info("CreateStandingInstructionController initialized");
    });
}(mifosX.controllers || {}));