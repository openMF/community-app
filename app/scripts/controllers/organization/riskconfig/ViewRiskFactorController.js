(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewRiskFactorController: function (scope, routeParams, resourceFactory, location, $modal, route, $http) {

            function computed(node) {
                if (!node) return "";
                for (var str = "(", i = 0; i < node.nodes.length; i++) {
                    i > 0 && (str += " " + node.connector + " ");
                    str += node.nodes[i].expression ?
                    node.nodes[i].expression.parameter + " " + htmlEntities(node.nodes[i].expression.comparator) + " " + node.nodes[i].expression.value
                        : computed(node.nodes[i]) ;
                }
                return str + ")";
            }

            function htmlEntities(str) {
                return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }

            resourceFactory.riskFactor.get({factorId: routeParams.id},
                function (data) {
                    scope.riskFactor = data;
                    scope.riskFactor.buckets.forEach(function (item) {
                        item.filterstr = computed(item.filter);
                    });
                }
            );


        }
    });
    mifosX.ng.application.controller('ViewRiskFactorController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', '$http', mifosX.controllers.ViewRiskFactorController]).run(function ($log) {
        $log.info("ViewRiskFactorController initialized");
    });

}(mifosX.controllers || {}));