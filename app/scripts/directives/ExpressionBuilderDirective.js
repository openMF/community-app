/**
 * Created by dhirendra on 12/09/16.
 */
(function (module) {
    mifosX.directives = _.extend(module, {
        ExpressionBuilderDirective: function ($compile) {
            return {
                restrict: 'E',
                templateUrl: 'views/organization/riskconfig/expressionbuilder.html',
                scope: {
                    expressionnode: "=",
                    filterfields: "="
                },
                compile: function (element, attrs) {
                    var content, directive;
                    content = element.contents().remove();
                    return function (scope, element, attrs) {

                        scope.connectors = [
                            {
                                display: "And",
                                value: "and"
                            },
                            {
                                display: "Or",
                                value: "or"
                            }
                        ];

                        scope.filterfieldsmap = {};

                        scope.comparators = {
                            "STRING": [
                                {display: "==", value: "eq"},
                                {display: "!=", value: "ne"},
                                {display: "contains", value: "contains"},
                                {display: "Starts With", value: "startswith"}
                            ],
                            "NUMBER": [
                                {display: "==", value: "eq"},
                                {display: "!=", value: "ne"},
                                {display: ">", value: "gt"},
                                {display: "<", value: "lt"},
                                {display: ">=", value: "ge"},
                                {display: "<=", value: "le"}
                            ],
                            "BOOLEAN": [
                                {display: "==", value: "eq"},
                                {display: "!=", value: "ne"}
                            ]
                        };

                        scope.populateFilterFieldsMap  = function () {
                            scope.filterfields.forEach(function (item) {
                                if(item.valueType == 'BOOLEAN'){
                                    item.options = [{key:"true",value:"true"},{key:"false",value:"false"}];
                                }
                                if(item.options !== undefined && item.options.length > 0 && item.valueType != 'NUMBER'){
                                    item.comparators = [{display: "==", value: "eq"},
                                        {display: "!=", value: "ne"}];
                                }else{
                                    item.comparators = scope.comparators[item.valueType];
                                }
                                scope.filterfieldsmap[item.uname] = item;
                            });
                        }


                        scope.addNewCondition = function () {
                            var myParameter = scope.filterfields[0].uname;
                            var myParameterObj = scope.filterfieldsmap[myParameter];
                            var myValue = null;

                            if (myParameterObj.options !== undefined && myParameterObj.options.length > 0) {
                                myValue = myParameterObj.options[0].key;
                            }
                            var newCondition = {
                                expression: {
                                    parameter: myParameter,
                                    comparator: "eq",
                                    value: myValue,
                                    valueType: myParameterObj.valueType
                                }
                            };
                            scope.expressionnode.nodes.push(newCondition);
                        };

                        scope.addNestedCondition = function () {
                            var nestedCondition = {connector: "and", nodes: []};
                            scope.expressionnode.nodes.push(nestedCondition);
                        };

                        scope.removeMe = function () {
                            // var node = nodes[0];
                            "expressionnode" in scope.$parent && scope.$parent.expressionnode.nodes.splice(scope.$parent.$index, 1);
                            // scope.$parent.expressionnode.nodes.splice(index, 1);
                        };

                        scope.removeCondition = function (index) {
                            // var node = nodes[0];
                            scope.expressionnode.nodes.splice(index, 1);
                            // scope.$parent.expressionnode.nodes.splice(index, 1);
                        };

                        scope.refreshExpression = function (expression) {
                            var parameter = scope.filterfieldsmap[expression.parameter];
                            expression.valueType = parameter.valueType;
                            if (parameter.options !== undefined && parameter.options.length > 0) {
                                expression.value = parameter.options[0].key;
                            } else {
                                expression.value = null;
                            }
                            expression.comparator = "eq";
                            expression.valueType = parameter.valueType;
                        };

                        scope.$watch('filterfields', function (newValue) {
                            scope.populateFilterFieldsMap();
                        }, true);

                        directive || (directive = $compile(content));

                        element.append(directive(scope, function ($compile) {
                            return $compile;
                        }));

                    }
                }
            }
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("expressionBuilder", ['$compile', mifosX.directives.ExpressionBuilderDirective]).run(function ($log) {
    $log.info("ExpressionBuilderDirective initialized $$$$$$");
});