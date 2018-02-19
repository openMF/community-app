(function (module) {
    mifosX.controllers = _.extend(module, {
        ManageGroupMembersController: function ($q, scope, resourceFactory, location, routeParams, $uibModal) {
        	
        	scope.centerId = routeParams.id;
            scope.indexOfClientToBeDeleted = "";

            scope.viewGroup = function (item) {
                scope.group = item;
            };

            resourceFactory.centerResource.get({centerId: routeParams.id, template: 'true', associations: 'groupMembers'}, function (data) {
                scope.data = data;
                scope.groups = data.groupMembers;

                resourceFactory.groupResource.getAllGroups({orderBy: 'name', sortOrder: 'ASC',orphansOnly: true,
                    officeId : scope.data.officeId},function(data){
                    scope.allGroups = data;
                });
            });
            
            scope.groupsOptions = function(value){
                return _.filter(scope.allGroups,function(group){
                        return group.name.indexOf(value) != -1
                });
            };

            scope.add = function () {
            	if(scope.available != ""){
	                scope.associate = {};
	            	scope.associate.groupMembers = [];
	                scope.associate.groupMembers[0] = scope.available.id;
	                var temp = {};
                    temp.id = scope.available.id;
                    temp.name = scope.available.name;
                    resourceFactory.centerResource.save({centerId: routeParams.id, command: 'associateGroups' }, scope.associate, function (data) {
	                	scope.groups.push(temp);
                        scope.available = "";
	                });
            	}
            };

            scope.remove = function (index,id) {
                scope.indexOfClientToBeDeleted = index;
            	$uibModal.open({
                    templateUrl: 'delete.html',
                    controller: GroupDeleteCtrl
                });
            	scope.disassociate = {};
            	scope.disassociate.groupMembers = [];
            	scope.disassociate.groupMembers.push(id);
            };
            
            var GroupDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                	resourceFactory.centerResource.save({centerId: routeParams.id, command: 'disassociateGroups' }, scope.disassociate, function (data) {
                        scope.groups.splice(scope.indexOfClientToBeDeleted, 1);
                        scope.available = "";
                        $uibModalInstance.close('activate');
                	});
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ManageGroupMembersController', ['$q','$scope', 'ResourceFactory', '$location', '$routeParams', '$uibModal', mifosX.controllers.ManageGroupMembersController]).run(function ($log) {
        $log.info("ManageGroupMembersController initialized");
    });
}(mifosX.controllers || {}));