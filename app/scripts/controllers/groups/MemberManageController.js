(function (module) {
    mifosX.controllers = _.extend(module, {
        MemberManageController: function (scope, routeParams, route, location, resourceFactory) {
            scope.group = [];
            scope.addedClients = [];
            scope.formData = {};

            scope.viewClient = function (item) {
                scope.client = item;
            };
            
            resourceFactory.groupResource.get({groupId: routeParams.id, associations: 'all'}, function (data) {
                scope.group = data;
            });

            resourceFactory.groupResource.get({groupId: routeParams.id, associations: 'clientMembers', template: 'true'}, function (data) {
                scope.allClients = data.clientOptions;
                scope.allMembers = data.clientMembers;
            });

            
            scope.add = function () {
                if(scope.available != ""){
                    var temp = {};
                    temp.id = scope.available.id;
                    temp.displayName = scope.available.displayName;
                    scope.addedClients.push(temp);
                }
            };

            scope.sub = function (id) {
                for (var i = 0; i < scope.addedClients.length; i++) {
                    if (scope.addedClients[i].id == id) {
                        scope.addedClients.splice(i, 1);
                        break;
                    }
                }
            };
            
            scope.remove = function (id) {
            	scope.disassociate = {};
            	scope.disassociate.clientMembers = [];
            	scope.disassociate.clientMembers.push(id);
            	console.log(scope.disassociate);
            	resourceFactory.groupResource.save({groupId: routeParams.id, command: 'disassociateClients'}, scope.disassociate, function (data) {
                    scope.allMembers.splice(0, 1);
                });
            };
            
            scope.submit = function () {
                scope.formData.clientMembers = [];
                if(scope.addedClients.length > 0){
                	for (var i in scope.addedClients) {
                        scope.formData.clientMembers[i] = scope.addedClients[i].id;
                    }
                    resourceFactory.groupResource.save({groupId: routeParams.id, command: 'associateClients'}, scope.formData, function (data) {
                        location.path('/viewgroup/' + scope.group.id);
                    });
                } else {
                	location.path('/viewgroup/' + scope.group.id);
				}
            };
            
        }
    });
    mifosX.ng.application.controller('MemberManageController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.MemberManageController]).run(function ($log) {
        $log.info("MemberManageController initialized");
    });
}(mifosX.controllers || {}));
