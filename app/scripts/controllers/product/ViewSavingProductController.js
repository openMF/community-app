(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSavingProductController: function (scope, routeParams, location, anchorScroll, resourceFactory) {
            resourceFactory.savingProductResource.get({savingProductId: routeParams.id, template: 'true'}, function (data) {
                scope.savingproduct = data;
                scope.hasAccounting = data.accountingRule.id == 2 || data.accountingRule.id == 3 ? true : false;
            });

            scope.scrollto = function (link) {
                location.hash(link);
                anchorScroll();

            };
        }
    });
    mifosX.ng.application.controller('ViewSavingProductController', ['$scope', '$routeParams', '$location', '$anchorScroll' , 'ResourceFactory', mifosX.controllers.ViewSavingProductController]).run(function ($log) {
        $log.info("ViewSavingProductController initialized");
    });
}(mifosX.controllers || {}));
