(function (module) {
    mifosX.controllers = _.extend(module, {
        EditRiskCriteriaController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            scope.ruleData = {
                isActive: true,
                outputConfiguration: {
                    valueType: "NUMBER",
                    options: [{key:"1",value:"1"}, {key:"2",value:"2"}, {key:"3",value:"3"}, {key:"4",value:"4"}, {key:"5",value:"5"}],
                    defaultValue: "3"
                },
                buckets: []
            };

            scope.filterfields = [];

            resourceFactory.riskCriteria.get({criteriaId: routeParams.id},
                function (data) {
                    scope.riskCriteria = data;
                    populateFormData();
                    scope.riskCriteria.buckets.forEach(function (item) {
                        item.filterstr = computed(item.filter);
                    });

                }
            );

            function populateFormData() {
                scope.ruleData = {
                    isActive: scope.riskCriteria.isActive,
                    outputConfiguration: {
                        valueType: scope.riskCriteria.valueType,
                        options: scope.riskCriteria.possibleOutputs,
                        defaultValue: scope.riskCriteria.defaultValue
                    },
                    buckets: scope.riskCriteria.buckets,
                    name: scope.riskCriteria.name,
                    uname: scope.riskCriteria.uname,
                    description: scope.riskCriteria.description
                };
            }
            scope.bucketData = {
                output: scope.ruleData.outputConfiguration.options[0].key
            };

            scope.onSave = function () {
                // this.formData.locale = "en";
                //console.log(JSON.stringify((this.ruleData));
                resourceFactory.riskCriteria.update({criteriaId:routeParams.id},
                    this.ruleData, function (response) {
                    location.path('/risk/criteria')
                });
            };

            scope.addBucket = function () {
                var newBucket = {
                    name: scope.bucketData.name,
                    output: scope.bucketData.output,
                    filter: {connector:"and",
                                nodes:[]
                    }
                }
                scope.ruleData.buckets.push(newBucket);
                scope.bucketData = {output: scope.ruleData.outputConfiguration.options[0].key};
            };

            scope.removeBucket = function (index) {
                scope.ruleData.buckets.splice(index, 1);
            };

            resourceFactory.riskDimension.getAll({}, function (data) {
                var fields = [];
                data.forEach(function (item) {
                    var field = {
                        name: item.name,
                        uname: item.uname,
                        valueType: item.valueType,
                        options: item.possibleOutputs
                    };
                    fields.push(field);
                });
                scope.filterfields = fields;
            });

            function htmlEntities(str) {
                return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }

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


            // scope.expressionstr = function(){
            //     scope.ruleData.buckets.forEach(function (item) {
            //         item.filterstr = computed(item.filter);
            //     });
            //     return JSON.stringify(scope.ruleData.buckets,null,2);
            // };
        }
    });
    mifosX.ng.application.controller('EditRiskCriteriaController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.EditRiskCriteriaController]).run(function ($log) {
        $log.info("EditRiskCriteriaController initialized");
    });

}(mifosX.controllers || {}));