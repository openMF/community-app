(function (module) {
    mifosX.directives = _.extend(module, {
        TreeviewDirective: function ($compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var treeId = attrs.treeId;
                    var treeModel = attrs.treeModel;
                    var nodeId = attrs.nodeId || 'id';
                    var nodeLabel = attrs.nodeLabel || 'label';
                    var nodeChildren = attrs.nodeChildren || 'children';
                    var template = "";
                    if (treeId === "holidaytreeview") {
                        template =
                            '<ul>' +
                                '<li data-ng-repeat="node in ' + treeModel + '">' +
                                '<input ng-model="node.selectedCheckBox" ng-true-value="true" ng-false-value="false" type="checkbox" data-ng-change="holidayApplyToOffice(node)"></input>' +
                                '<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                                '<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                                '<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
                                '<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{node.' + nodeLabel + '}}</span>' +
                                '<div data-ng-hide="node.collapsed"  data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id="' + nodeId + '" data-node-label="' + nodeLabel + '" data-node-children="' + nodeChildren + '"></div>' +
                                '</li>' +
                                '</ul>';
                    } else {
                        template =
                            '<ul>' +
                                '<li data-ng-repeat="node in ' + treeModel + '">' +
                                '<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                                '<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                                '<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
                                '<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{node.' + nodeLabel + '}}</span>' +
                                '<div data-ng-hide="node.collapsed"  data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id="' + nodeId + '" data-node-label="' + nodeLabel + '" data-node-children="' + nodeChildren + '"></div>' +
                                '</li>' +
                                '</ul>';
                    }

                    if (treeId && treeModel) {

                        if (attrs.angularTreeview) {

                            scope[treeId] = scope[treeId] || {};

                            scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function (selectedNode) {

                                selectedNode.collapsed = !selectedNode.collapsed;
                            };
                            scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function (selectedNode) {
                                selectedNode.collapsed = !selectedNode.collapsed;
                                if (scope[treeId].currentNode && scope[treeId].currentNode.selected) {
                                    scope[treeId].currentNode.selected = undefined;
                                }
                                selectedNode.selected = 'selected';
                                scope[treeId].currentNode = selectedNode;
                            };
                        }
                        element.html('').append($compile(template)(scope));
                    }
                }
            };

        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("treeModel", ['$compile', mifosX.directives.TreeviewDirective]).run(function ($log) {
    $log.info("TreeviewDirective initialized");
});