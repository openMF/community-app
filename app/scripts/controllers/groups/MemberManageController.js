(function (module) {
    mifosX.controllers = _.extend(module, {
        MemberManageController: function ($q, scope, routeParams, route, location, resourceFactory, $uibModal) {
            scope.group = [];
            scope.indexOfClientToBeDeleted = "";
            scope.allMembers = [];

            scope.viewClient = function (item) {
                scope.client = item;
            };

            scope.clientOptions = function(value){
                var deferred = $q.defer();
                resourceFactory.clientResource.getAllClientsWithoutLimit({displayName: value, orderBy : 'displayName', officeId : scope.group.officeId,
                sortOrder : 'ASC', orphansOnly : true}, function (data) {
                    deferred.resolve(data.pageItems);
                });
                return deferred.promise;
            };

            resourceFactory.groupResource.get({groupId: routeParams.id, associations: 'clientMembers', template: 'true'}, function (data) {
                scope.group = data;
                if(data.clientMembers) {
                    scope.allMembers = data.clientMembers;
                }
            });
            
            scope.add = function () {
            	if(scope.available != ""){
	                scope.associate = {};
	            	scope.associate.clientMembers = [];
	                scope.associate.clientMembers[0] = scope.available.id;
	                resourceFactory.groupResource.save({groupId: routeParams.id, command: 'associateClients'}, scope.associate, function (data) {
                        var temp = {};
                        temp.id = scope.available.id;
                        temp.displayName = scope.available.displayName;
                        scope.allMembers.push(temp);
                        scope.available = "";
	                });
            	}
            };

            scope.remove = function (index,id) {
                scope.indexOfClientToBeDeleted = index;
                $uibModal.open({
                    templateUrl: 'delete.html',
                    controller: MemberDeleteCtrl
                });
            	scope.disassociate = {};
            	scope.disassociate.clientMembers = [];
            	scope.disassociate.clientMembers.push(id);
            };
            
            var MemberDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                	resourceFactory.groupResource.save({groupId: routeParams.id, command: 'disassociateClients'}, scope.disassociate, function (data) {
                        scope.allMembers.splice(scope.indexOfClientToBeDeleted, 1);
                        $uibModalInstance.close('activate');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('MemberManageController', ['$q','$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$uibModal', mifosX.controllers.MemberManageController]).run(function ($log) {
        $log.info("MemberManageController initialized");
    });
}(mifosX.controllers || {}));
