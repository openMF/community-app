(function (module) {
    mifosX.controllers = _.extend(module, {
        EditPostDatedCheckController: function (scope, routeParams, resourceFactory,paginatorService, location, route, http, $uibModal, dateFilter, API_VERSION, $sce, $rootScope) {
            scope.formData = {};
            scope.loanId = routeParams.loanId;
            scope.id = routeParams.id;
            scope.postDatedCheck = {};

            resourceFactory.postDatedChecks.get({loanId: scope.loanId, installmentId: scope.id}, function(data) {
                scope.postDatedCheck = data;
                scope.formData = {
                    name: data.name,
                    accountNo: data.accountNo,
                    amount: data.amount,
                    installmentId: data.installmentId,
                    date: new Date(data.installmentDate),
                    checkNo: data.checkNo,
                    id: data.id
                }
            });
            
            scope.submit = function () {
                    console.log("EDIT");
                    scope.id = this.formData.id;
                    delete this.formData.checkNo;
                    delete this.formData.date;
                    delete this.formData.id;
                    delete this.formData.installmentId;
                    
                    this.formData.locale = scope.optlang.code;

                    resourceFactory.postDatedCheckById.update({loanId: scope.loanId, id: scope.id, editType: "update"}, this.formData, function(data) {
                    	location.path('/viewloanaccount/' + scope.loanId);
                    });
            }
        }
    });
    mifosX.ng.application.controller('EditPostDatedCheckController', ['$scope', '$routeParams', 'ResourceFactory','PaginatorService', '$location', '$route', '$http', '$uibModal', 'dateFilter', 'API_VERSION', '$sce', '$rootScope', mifosX.controllers.EditPostDatedCheckController]).run(function ($log) {
        $log.info("EditPostDatedCheckController initialized");
    });
}(mifosX.controllers || {}));
