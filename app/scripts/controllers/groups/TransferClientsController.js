(function(module) {
    mifosX.controllers = _.extend(module, {
        TransferClientsController: function(scope, routeParams , route, location, resourceFactory) {
            scope.group = [];
            scope.tempData = [];
            resourceFactory.groupResource.get({} , function(data) {
                scope.groups = data.pageItems;
            });
            resourceFactory.groupResource.get({groupId: routeParams.id,associations:'all'} , function(data) {
                scope.group = data;
                scope.allMembers = data.clientMembers;
            });

            scope.viewgroup = function(id){
                resourceFactory.groupResource.get({groupId: id,associations:'all'} , function(data) {
                    scope.groupdata = data;
                });
                scope.view = 1;
            };
            scope.transfer = function(){
                this.formData.locale = 'en';
                this.formData.clients=[];
                var temp = new Object();
                for(var i=0; i<scope.tempData.length;i++)
                {
                    temp ={id:this.tempData[i]};
                    this.formData.clients.push(temp);
                }
                this.formData.inheritDestinationGroupLoanOfficer = this.formData.inheritDestinationGroupLoanOfficer || false;
                resourceFactory.groupResource.save({groupId: routeParams.id,command:'transferClients'} ,this.formData, function(data) {
                    location.path('/viewgroup/' + data.resourceId);
                });
            };


        }
    });
    mifosX.ng.application.controller('TransferClientsController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.TransferClientsController]).run(function($log) {
        $log.info("TransferClientsController initialized");
    });
}(mifosX.controllers || {}));
