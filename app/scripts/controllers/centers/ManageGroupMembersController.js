(function (module) {
    mifosX.controllers = _.extend(module, {
        ManageGroupMembersController: function (scope, resourceFactory, $http, $rootScope, API_VERSION, location, routeParams, $modal) {
        	
        	scope.centerId = routeParams.id;
            scope.indexOfClientToBeDeleted = "";
            scope.resultList = [];

            scope.viewGroup = function (item) {
                scope.group = item;
            };

            resourceFactory.centerResource.get({centerId: routeParams.id, template: 'true',associations: 'groupMembers'}, function (data) {
                scope.data = data;
                scope.groups = data.groupMembers;
            });

            scope.groupsOptions = function(value){
                return $http({
                    method: 'GET',
                    url: $rootScope.hostUrl + API_VERSION + '/groups' + '?name=' + value + '&orderBy=' + 'name' + '&orphansOnly=' + 'true'
                    + '&officeId=' + scope.data.officeId + '&sortOrder=' + 'ASC',
                    data: {}
                }).then(function (response) {
                    if(response != ""){
                        scope.resultList = response.data;
                        for(var i in scope.data.groupMembers){
                            for(var j in scope.resultList){
                                if(scope.resultList[j].id == scope.data.groupMembers[i].id){
                                    scope.resultList.splice(j,1);
                                }
                            }
                        }
                    }
                    return scope.resultList;
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
    mifosX.ng.application.controller('ManageGroupMembersController', ['$scope', 'ResourceFactory', '$http','$rootScope','API_VERSION', '$location', '$routeParams', '$modal', mifosX.controllers.ManageGroupMembersController]).run(function ($log) {
        $log.info("ManageGroupMembersController initialized");
    });
}(mifosX.controllers || {}));