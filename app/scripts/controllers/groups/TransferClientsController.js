(function (module) {
    mifosX.controllers = _.extend(module, {
        TransferClientsController: function (scope, routeParams, route, location, resourceFactory) {
            scope.group = [];
            scope.tempData = [];
            scope.selectedClients = [];
            scope.selectedMembers = [];
            scope.formData = {};
            scope.destinationGroup = "";

            scope.groups = function(value){
                var jsonList = [];
                resourceFactory.groupResource.getAllGroups({sqlSearch: value ,orderBy: 'name', sortOrder: 'ASC'}, function (data) {
                    scope.data = data;
                    scope.group = _.reject(scope.data, function (group) {
                        return group.id == routeParams.id;
                    });
                });
                for(var i in scope.group){
                    jsonList.push({
                        id : scope.group[i].id,
                        name: scope.group[i].name
                    });
                }

                return jsonList;
            };

            resourceFactory.groupResource.get({groupId: routeParams.id, associations: 'all'}, function (data) {
                scope.group = data;
                scope.allMembers = data.clientMembers;
            });

            scope.addClient = function () {
                for (var i in this.availableClients) {
                    for (var j in scope.allMembers) {
                        if (scope.allMembers[j].id == this.availableClients) {
                            var temp = {};
                            temp.id = this.allMembers[j].id;
                            temp.displayName = this.allMembers[j].displayName;
                            temp.accountNo = this.allMembers[j].accountNo;
                            scope.selectedMembers.push(temp);
                            scope.allMembers.splice(j, 1);
                        }
                    }
                }
            };
            scope.removeClient = function () {
                for (var i in this.selectedClients) {
                    for (var j in scope.selectedMembers) {
                        if (scope.selectedMembers[j].id == this.selectedClients) {
                            var temp = {};
                            temp.id = this.selectedMembers[j].id;
                            temp.displayName = this.selectedMembers[j].displayName;
                            temp.accountNo = this.selectedMembers[j].accountNo;
                            scope.allMembers.push(temp);
                            scope.selectedMembers.splice(j, 1);
                        }
                    }
                }
            };
            
            scope.viewgroup = function (group) {
                resourceFactory.groupResource.get({groupId: group.id, associations: 'all'}, function (data) {
                    scope.groupdata = data;
                });
                scope.view = 1;
            };
            scope.transfer = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.clients = [];
                this.formData.destinationGroupId = scope.destinationGroup.id;
                var temp = new Object();
                for (var i = 0; i < scope.selectedMembers.length; i++) {
                    temp = {id: this.selectedMembers[i].id};
                    this.formData.clients.push(temp);
                }
                this.formData.inheritDestinationGroupLoanOfficer = this.formData.inheritDestinationGroupLoanOfficer || false;
                resourceFactory.groupResource.save({groupId: routeParams.id, command: 'transferClients'}, this.formData, function (data) {
                    location.path('/viewgroup/' + data.resourceId);
                });
            };

            scope.displayNameAndId = function (member){
                 return ( member.accountNo + " " + member.displayName );
            };


        }
    });
    mifosX.ng.application.controller('TransferClientsController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.TransferClientsController]).run(function ($log) {
        $log.info("TransferClientsController initialized");
    });
}(mifosX.controllers || {}));
