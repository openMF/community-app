(function (module) {
    mifosX.controllers = _.extend(module, {
        ManageGroupMembersController: function (scope, resourceFactory, location, routeParams) {

//            if(routeParams.command == 'associateGroups' || routeParams.command == 'disassociateGroups'){
//                scope.command = routeParams.command;
//                scope.taskPermissionName = routeParams.command.toUpperCase()+'_CENTER';
//            }
            scope.centerId = routeParams.id;
            scope.addedGroups = [];
            scope.formData = {};

            resourceFactory.centerResource.get({centerId: routeParams.id, template: 'true', associations: 'groupMembers'}, function (data) {
                scope.data = data;
                scope.groupsOptions = data.groupMembersOptions || [];
                scope.groups = data.groupMembers || [];
            });

            scope.viewGroup = function (item) {
                scope.group = item;
            };

            scope.add = function () {
                if(scope.available != ""){
                    var temp = {};
                    temp.id = scope.available.id;
                    temp.name = scope.available.name;
                    scope.addedGroups.push(temp);
                }
            };

            scope.sub = function (id) {
                for (var i = 0; i < scope.addedGroups.length; i++) {
                    if (scope.addedGroups[i].id == id) {
                        scope.addedGroups.splice(i, 1);
                        break;
                    }
                }
            };
            
            scope.remove = function (id) {
            	scope.disassociate = {};
            	scope.disassociate.groupMembers = [];
            	scope.disassociate.groupMembers.push(id);
            	console.log(scope.disassociate);
            	resourceFactory.centerResource.save({centerId: routeParams.id, command: 'disassociateGroups' }, scope.disassociate, function (data) {
            		scope.addedGroups.splice(i, 1);
            	});
            };

            scope.submit = function () {
                scope.formData.groupMembers = [];
                for (var i in scope.addedGroups) {
                    scope.formData.groupMembers[i] = scope.addedGroups[i].id;
                }

                resourceFactory.centerResource.save({centerId: routeParams.id, command: 'associateGroups' }, scope.formData, function (data) {
                    location.path('/viewcenter/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('ManageGroupMembersController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.ManageGroupMembersController]).run(function ($log) {
        $log.info("ManageGroupMembersController initialized");
    });
}(mifosX.controllers || {}));