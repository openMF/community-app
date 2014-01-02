(function(module) {
    mifosX.controllers = _.extend(module, {
        AddGroupController: function(scope, resourceFactory, location, routeParams,dateFilter) {
            scope.first = {};
            scope.restrictDate = new Date();
            scope.addedClients = [];
            scope.available = [];
            scope.added = [];
            scope.formData = {};
            scope.formData.clientMembers = [];
            resourceFactory.groupTemplateResource.get({centerId: routeParams.centerId} , function(data) {
                scope.groupTemplate = data;
                scope.clients = data.clientOptions;
            });
            scope.setChoice = function(){
                if(this.formData.active){
                    scope.choice = 1;
                }
                else if(!this.formData.active){
                    scope.choice = 0;
                }
            };
            scope.add = function(){
                for(var i in this.available)
                {
                    for(var j in scope.clients){
                        if(scope.clients[j].id == this.available[i])
                        {
                            var temp = {};
                            temp.id = this.available[i];
                            temp.displayName = scope.clients[j].displayName;
                            scope.addedClients.push(temp);
                            scope.clients.splice(j,1);
                        }
                    }
                }

            };
            scope.sub = function(){
                for(var i in this.added)
                {
                    for(var j in scope.addedClients){
                        if(scope.addedClients[j].id == this.added[i])
                        {
                            var temp = {};
                            temp.id = this.added[i];
                            temp.displayName = scope.addedClients[j].displayName;
                            scope.clients.push(temp);
                            scope.addedClients.splice(j,1);
                        }
                    }
                }
            };
            scope.submit = function(){
                for(var i in scope.addedClients){
                    scope.formData.clientMembers[i] = scope.addedClients[i].id;
                }
                if (this.formData.active) {
                    var reqDate = dateFilter(scope.first.date,scope.df);
                    this.formData.activationDate = reqDate;
                }
                if (scope.first.submitondate) {
                    this.formData.submittedOnDate = dateFilter(scope.first.submitondate,scope.df);
                }
                this.formData.dateFormat = scope.df;
                this.formData.active = this.formData.active || false;
                this.formData.locale = scope.optlang.code;
                this.formData.centerId = routeParams.centerId ;
                this.formData.officeId = routeParams.officeId;
                resourceFactory.groupResource.save(this.formData,function(data) {
                    location.path('/viewcenter/'+routeParams.centerId);
                });
            };

        }
    });
    mifosX.ng.application.controller('AddGroupController', ['$scope', 'ResourceFactory', '$location','$routeParams','dateFilter', mifosX.controllers.AddGroupController]).run(function($log) {
        $log.info("AddGroupController initialized");
    });
}(mifosX.controllers || {}));
