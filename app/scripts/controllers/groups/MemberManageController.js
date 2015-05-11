(function (module) {
    mifosX.controllers = _.extend(module, {
        MemberManageController: function (scope, routeParams, route, $http, API_VERSION,location, resourceFactory, $modal, $rootScope) {
            scope.group = [];
            scope.indexOfClientToBeDeleted = "";
            scope.allMembers = [];
            scope.resultList = [];

            scope.viewClient = function (item) {
                scope.client = item;
            };

            scope.clientOptions = function(value){
                return $http({
                    method: 'GET',
                    url: $rootScope.hostUrl + API_VERSION + '/clients' + '?displayName=' + value + '&orderBy=' + 'displayName'
                         + '&officeId=' + scope.group.officeId + '&sortOrder=' + 'ASC',
                    data: {}
                }).then(function (response) {
                    if(response != ""){
                        scope.resultList = response.data.pageItems;
                        for(var i in scope.allMembers){
                            for(var j in scope.resultList){
                                if(scope.resultList[j].id == scope.allMembers[i].id){
                                    scope.resultList.splice(j,1);
                                }
                            }
                        }
                    }
                    return scope.resultList;
                });
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
                $modal.open({
                    templateUrl: 'delete.html',
                    controller: MemberDeleteCtrl
                });
            	scope.disassociate = {};
            	scope.disassociate.clientMembers = [];
            	scope.disassociate.clientMembers.push(id);
            };
            
            var MemberDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                	resourceFactory.groupResource.save({groupId: routeParams.id, command: 'disassociateClients'}, scope.disassociate, function (data) {
                        scope.allMembers.splice(scope.indexOfClientToBeDeleted, 1);
                        $modalInstance.close('activate');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('MemberManageController', ['$scope', '$routeParams', '$route', '$http', 'API_VERSION', '$location', 'ResourceFactory', '$modal', '$rootScope',  mifosX.controllers.MemberManageController]).run(function ($log) {
        $log.info("MemberManageController initialized");
    });
}(mifosX.controllers || {}));
