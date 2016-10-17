(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewRiskDimensionController: function (scope, routeParams, resourceFactory, location, $modal, route, $http) {

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

            resourceFactory.riskDimension.get({dimensionId: routeParams.id},
                function (data) {
                    scope.riskDimension = data;
                    scope.riskDimension.buckets.forEach(function (item) {
                        item.filterstr = computed(item.filter);
                    });
                }
            );


        }
    });
    mifosX.ng.application.controller('ViewRiskDimensionController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', '$http', mifosX.controllers.ViewRiskDimensionController]).run(function ($log) {
        $log.info("ViewRiskDimensionController initialized");
    });

}(mifosX.controllers || {}));