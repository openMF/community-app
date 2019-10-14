(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateShareAccountController: function (scope, resourceFactory, location, routeParams, dateFilter,WizardHandler) {
            scope.products = [];
            scope.fieldOfficers = [];
            scope.formData = {};
            scope.sharedetails = {};
            scope.restrictDate = new Date();
            scope.clientId = routeParams.clientId;
            scope.date = {};
            scope.date.submittedOnDate = new Date();
            scope.charges = [];
            scope.inparams = {};
            if (scope.clientId) {
                scope.inparams.clientId = scope.clientId
            }
            scope.disabled = true;
            resourceFactory.shareAccountTemplateResource.get(scope.inparams, function (data) {
                scope.products = data.productOptions;
                scope.chargeOptions = data.chargeOptions;
                scope.clientName = data.clientName;
            });

            scope.changeProduct = function () {
                scope.inparams.productId = scope.formData.productId;
                resourceFactory.shareAccountTemplateResource.get(scope.inparams, function (data) {
                    scope.data = data;
                    scope.formData.unitPrice = data.currentMarketPrice ;
                    scope.formData.requestedShares = data.defaultShares ;
                    scope.charges = data.charges;
                    scope.sharedetails = angular.copy(scope.formData);
                    scope.sharedetails.productName = scope.formValue(scope.products,scope.formData.productId,'id','name');
                });
                scope.disabled = false;

            };

            scope.goNext = function(form){
                WizardHandler.wizard().checkValid(form);
            }

            scope.$watch('formData',function(newVal){
               scope.sharedetails = angular.extend(scope.sharedetails,newVal);
            });

            scope.formValue = function(array,model,findattr,retAttr){
                findattr = findattr ? findattr : 'id';
                retAttr = retAttr ? retAttr : 'value';
                console.log(findattr,retAttr,model);
                return _.find(array, function (obj) {
                    return obj[findattr] === model;
                })[retAttr];
            };

            scope.addCharge = function (chargeId) {
                scope.errorchargeevent = false;
                if (chargeId) {
                    resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, function (data) {
                        data.chargeId = data.id;
                        scope.charges.push(data);
                        scope.chargeId = undefined;
                    });
                } else {
                    scope.errorchargeevent = true;
                    scope.labelchargeerror = "selectcharge";
                }
            }

            scope.deleteCharge = function (index) {
                scope.charges.splice(index, 1);
            }

            scope.submit = function () {
                this.formData.submittedDate = dateFilter(this.formData.submittedDate, scope.df);
                this.formData.applicationDate = dateFilter(this.formData.applicationDate, scope.df);
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.charges = [];

                if (scope.clientId) this.formData.clientId = scope.clientId;
                if (scope.charges.length > 0) {
                    for (var i in scope.charges) {
                        this.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount});
                    }
                }
                resourceFactory.sharesAccount.save(this.formData, function (data) {
                    location.path('/viewshareaccount/' + data.resourceId);
                });
            };

            scope.cancel = function () {
                location.path('/viewclient/' + scope.clientId);
            }
        }
    });
    mifosX.ng.application.controller('CreateShareAccountController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter','WizardHandler', mifosX.controllers.CreateShareAccountController]).run(function ($log) {
        $log.info("CreateShareAccountController initialized");
    });
}(mifosX.controllers || {}));
