(function (module) {
    mifosX.controllers = _.extend(module, {
        AccountingClosureController: function (scope, resourceFactory, location, translate, routeParams, dateFilter, anchorScroll) {
            scope.first = {};
            scope.formData = {};
            scope.first.date = new Date();
            scope.accountClosures = [];
            scope.restrictDate = new Date();
            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
            });

            var params = {}
            if (routeParams.officeId != undefined) {
                params.officeId = routeParams.officeId;
            }

            resourceFactory.accountingClosureResource.get(params, function (data) {
                scope.accountClosures = data;
            });

            scope.routeTo = function (id) {
                location.path('/view_close_accounting/' + id);
            };
            
            scope.scrollto = function (link){
                location.hash(link);
                anchorScroll();

            };

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.closingDate = reqDate;
                resourceFactory.accountingClosureResource.save(this.formData, function (data) {
                    location.path('/view_close_accounting/' + data.resourceId);
                });
            }

            scope.updateLastClosed = function (officeId) {
                resourceFactory.accountingClosureResource.get({officeId: officeId}, function (data) {
                    scope.accountClosures = data;
                    scope.lastClosed = undefined;
                    if (data.length > 0) {
                        scope.lastClosed = data[0].closingDate;
                    }
                });
            }
            scope.closedAccountingDetails = function (officeId) {
                resourceFactory.accountingClosureResource.get({officeId: officeId}, function (data) {
                    scope.accountClosures = data;
                });
            }
        }
    });
    mifosX.ng.application.controller('AccountingClosureController', ['$scope', 'ResourceFactory', '$location', '$translate', '$routeParams', 'dateFilter', '$anchorScroll', mifosX.controllers.AccountingClosureController]).run(function ($log) {
        $log.info("AccountingClosureController initialized");
    });
}(mifosX.controllers || {}));
