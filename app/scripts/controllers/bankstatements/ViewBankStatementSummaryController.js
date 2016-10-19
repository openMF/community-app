(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewBankStatementSummaryController: function (scope, resourceFactory, location, http, routeParams, $rootScope) {
            scope.bankStatement  = [];
            resourceFactory.bankStatementSummaryResource.get({ bankStatementId : routeParams.bankStatementId},function (data) {
                scope.bankStatement = data;
            });
            scope.printDiv = function(print) {
                var printContents = document.getElementById(print).innerHTML;
                var popupWin = window.open('', '_blank', 'width=300,height=300');
                popupWin.document.open();
                popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/repaymentscheduleprintstyle.css" />' +
                '</head><body onload="window.print()">' + printContents + '</body></html>');
                popupWin.document.close();
            }
        }
    });
    mifosX.ng.application.controller('ViewBankStatementSummaryController', ['$scope', 'ResourceFactory', '$location', '$http', '$routeParams', '$rootScope', mifosX.controllers.ViewBankStatementSummaryController]).run(function ($log) {
        $log.info("ViewBankStatementSummaryController initialized");
    });
}(mifosX.controllers || {}));
