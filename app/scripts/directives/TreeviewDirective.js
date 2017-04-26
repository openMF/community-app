(function (module) {
    mifosX.directives = _.extend(module, {
        TreeviewDirective: function ($compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var treeId = attrs.treeId;
                    var treeModel = attrs.treeModel;
                    var nodeId = attrs.nodeId || 'id';
                    var nodeglCode = attrs.glCode || 'glCode';
					var nodeLabel = attrs.nodeLabel || 'label';					
                    var nodeChildren = attrs.nodeChildren || 'children';
                    var parentId = attrs.parentId || 'parentId';					
					var template = "";					
					
                    if (treeId === "holidaytreeview") {
                        template =
                            '<ul>' +
                                '<div data-ng-show="' + treeId + '.showChangeStateAll(' + treeModel + ')">' +
                                '<a data-ng-click="' + treeId + '.setCollapsedRoot(' + treeModel + ', false)">{{\'label.button.expand.all\' | translate}}</a>' +
                                ' / ' +
                                '<a data-ng-click="' + treeId + '.setCollapsedRoot(' + treeModel + ', true)">{{\'label.button.collapse.all\' | translate}}</a>' +
                                '</div>' +
                                '<li data-ng-repeat="node in ' + treeModel + '">' +
                                '<input type="checkbox" data-ng-model="node.selectedCheckBox" data-ng-change="holidayApplyToOffice(node)"></input>' +
                                '<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                                '<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                                '<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
                                '<span ng-show="node.'+ nodeId + ' >= 0" data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node); $root.tempNodeID = node.'+ nodeId +'">({{node.'+ nodeglCode +'}}) {{node.' + nodeLabel + '}} </span>' +								
								'<span ng-show="node.'+ nodeId + ' < 0" data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)" >{{node.' + nodeLabel + '}}</span>' +
                                '<div data-ng-hide="node.collapsed"  data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id="' + nodeId + '" data-node-label="' + nodeLabel + '" data-node-children="' + nodeChildren + '"></div>' +
                                '</li>' +
                                '</ul>';
                    } else {
							template =
							'<ul>' +
                                '<div data-ng-show="' + treeId + '.showChangeStateAll(' + treeModel + ')">' +
                                '<a data-ng-click="' + treeId + '.setCollapsedRoot(' + treeModel + ', false)">{{\'label.button.expand.all\' | translate}}</a>' +
                                ' / ' +
                                '<a data-ng-click="' + treeId + '.setCollapsedRoot(' + treeModel + ', true)">{{\'label.button.collapse.all\' | translate}}</a>' +
                                '</div>' +
                                '<li data-ng-repeat="node in ' + treeModel + '">' +
                                '<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                                '<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                                '<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
                                '<span ng-show="node.'+ nodeId + ' >= 0" data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node); $root.tempNodeID = node.'+ nodeId +'">({{node.'+ nodeglCode +'}}) {{node.' + nodeLabel + '}} </span>' +								
								'<span ng-show="node.'+ nodeId + ' < 0" data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)" >{{node.' + nodeLabel + '}}</span>' +								
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
                            scope[treeId].setCollapsedAll = scope[treeId].setCollapsedAll || function (selectedNode, state) {
                                selectedNode.collapsed = state;
                                for(var i = 0; i < selectedNode[nodeChildren].length; i++) {
                                    if(selectedNode[nodeChildren][i][nodeChildren].length > 0) {
                                        scope[treeId].setCollapsedAll(selectedNode[nodeChildren][i], state);
                                    }
                                }
                            };
                            scope[treeId].setCollapsedRoot = scope[treeId].setCollapsedRoot || function (treeModel, state) {
                                for(var i = 0; i < treeModel.length; i++) {
                                    if(treeModel[i][nodeChildren].length > 0) {
                                        scope[treeId].setCollapsedAll(treeModel[i], state);
                                    }
                                }
                            };
                            scope[treeId].showChangeStateAll = scope[treeId].showChangeStateAll || function (treeModel) {
                                if(!treeModel) {
                                    return false;
                                }
                                for(var i = 0; i < treeModel.length; i++) {
                                    if(treeModel[i][nodeChildren].length > 0 &&
                                        typeof treeModel[i][parentId] === "undefined") {
                                        return true;
                                    }
                                }
                                return false;
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