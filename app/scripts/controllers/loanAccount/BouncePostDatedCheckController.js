(function (module) {
    mifosX.controllers = _.extend(module, {
        BouncePostDatedCheckController: function (scope, routeParams, resourceFactory,paginatorService, location, route, http, $uibModal, dateFilter, API_VERSION, $sce, $rootScope) {
            scope.formData = {};
            scope.loanId = routeParams.loanId;
            scope.id = routeParams.id;
            scope.postDatedCheck = {};
            scope.checkId;

            resourceFactory.postDatedChecks.get({loanId: scope.loanId, installmentId: scope.id}, function(data) {
                scope.postDatedCheck = data;
                scope.formData = {
                    amount: data.amount,
                    installmentId: data.installmentId,
                    date: new Date(data.installmentDate),
                }
                scope.checkId = data.id;
            });
            
            scope.submit = function () {
                    this.formData.locale = scope.optlang.code;
                    delete this.formData.id;
                    delete this.formData.date;
                    resourceFactory.postDatedCheckById.update({loanId: scope.loanId, id: scope.checkId, editType: "bounced"}, this.formData, function(data) {
                    	location.path('/viewloanaccount/' + scope.loanId);
                    });
            }
        }
    });
    mifosX.ng.application.controller('BouncePostDatedCheckController', ['$scope', '$routeParams', 'ResourceFactory','PaginatorService', '$location', '$route', '$http', '$uibModal', 'dateFilter', 'API_VERSION', '$sce', '$rootScope', mifosX.controllers.BouncePostDatedCheckController]).run(function ($log) {
        $log.info("BouncePostDatedCheckController initialized");
    });
}(mifosX.controllers || {}));
