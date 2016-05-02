(function (module) {
    mifosX.controllers = _.extend(module, {
        ShareProductActionsController: function (scope, resourceFactory, location, routeParams, dateFilter) {

            scope.action = routeParams.action || "";
            scope.accountId = routeParams.accountId;
            scope.shareproductId = routeParams.productId;
            if(routeParams.dividendId) {
                scope.dividendId = routeParams.dividendId ;
            }
            scope.formData = {};
            scope.restrictDate = new Date();
            // Transaction UI Related
            scope.createdividend = false ;
            scope.paymentTypes = [];

            switch (scope.action) {
                case "createdividend":
                    resourceFactory.shareProduct.get({shareProductId: routeParams.productId}, function (data) {
                        scope.shareproductDetails = data;
                    }) ;
                    scope.title = 'label.heading.initiatedividend';
                    scope.fromDatelabelName = 'label.input.dividendperiodstartdate';
                    scope.endDatelabelName = 'label.input.dividendperiodenddate';
                    scope.createdividend = true;
                    scope.taskPermissionName = 'CREATE_SHAREDIVIDEND';
                    break;
            }

            scope.cancel = function () {
                location.path('/dividends/' + routeParams.productId);
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                var params = {command: scope.action};
                if(scope.action == 'createdividend') {
                        this.formData.dividendPeriodStartDate = dateFilter(this.formData.dividendPeriodStartDate, scope.df);
                        this.formData.dividendPeriodEndDate = dateFilter(this.formData.dividendPeriodEndDate, scope.df);
                    }
                    resourceFactory.shareproductdividendresource.save({productId: routeParams.productId},this.formData, function (data) {
                        location.path('/dividends/' + routeParams.productId);
                    });
            };
        }
    });
    mifosX.ng.application.controller('ShareProductActionsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.ShareProductActionsController]).run(function ($log) {
        $log.info("ShareProductActionsController initialized");
    });
}(mifosX.controllers || {}));
