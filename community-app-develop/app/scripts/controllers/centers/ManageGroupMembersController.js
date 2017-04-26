(function (module) {
    mifosX.controllers = _.extend(module, {
        ManageGroupMembersController: function ($q, scope, resourceFactory, location, routeParams, $modal) {
        	
        	scope.centerId = routeParams.id;
            scope.indexOfClientToBeDeleted = "";

            scope.viewGroup = function (item) {
                scope.group = item;
            };

            resourceFactory.centerResource.get({centerId: routeParams.id, template: 'true', associations: 'groupMembers'}, function (data) {
                scope.data = data;
                scope.groups = data.groupMembers;
            });

            scope.groupsOptions = function(value){
                var deferred = $q.defer();
                resourceFactory.groupResource.getAllGroups({name: value ,orderBy: 'name', sortOrder: 'ASC',orphansOnly: true,
                    officeId : scope.data.officeId},function(data){
                    deferred.resolve(data);
                });
                return deferred.promise;
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
            	$modal.open({
                    templateUrl: 'delete.html',
                    controller: GroupDeleteCtrl
                });
            	scope.disassociate = {};
            	scope.disassociate.groupMembers = [];
            	scope.disassociate.groupMembers.push(id);
            };
            
            var GroupDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                	resourceFactory.centerResource.save({centerId: routeParams.id, command: 'disassociateGroups' }, scope.disassociate, function (data) {
                        scope.groups.splice(scope.indexOfClientToBeDeleted, 1);
                        scope.available = "";
                        $modalInstance.close('activate');
                	});
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ManageGroupMembersController', ['$q','$scope', 'ResourceFactory', '$location', '$routeParams', '$modal', mifosX.controllers.ManageGroupMembersController]).run(function ($log) {
        $log.info("ManageGroupMembersController initialized");
    });
}(mifosX.controllers || {}));