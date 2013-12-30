(function(module) {
    mifosX.controllers = _.extend(module, {
        CreateGroupController: function(scope, resourceFactory, location,dateFilter) {
            scope.offices = [];
            scope.staffs = [];
            scope.data = {};
            scope.choice = 0;
            scope.first = {};
            scope.first.date = new Date();
            scope.restrictDate = new Date();
            scope.addedClients = [];
            scope.available = [];
            scope.added = [];
            scope.formData = {};
            scope.formData.clientMembers = [];
            resourceFactory.groupTemplateResource.get({orderBy: 'name', sortOrder: 'ASC'}, function(data) {
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.clients = data.clientOptions;
            });
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
            scope.changeOffice =function(officeId) {
                scope.addedClients = [];
                resourceFactory.groupTemplateResource.get({staffInSelectedOfficeOnly : false, officeId : officeId
                }, function(data) {
                    scope.staffs = data.staffOptions;
                });
                resourceFactory.groupTemplateResource.get({officeId : officeId }, function(data) {
                    scope.clients = data.clientOptions;
                });
            };
            scope.setChoice = function(){
                if(this.formData.active){
                    scope.choice = 1;
                }
                else if(!this.formData.active){
                    scope.choice = 0;
                }
            };
            scope.submit = function() {
                for(var i in scope.addedClients){
                    scope.formData.clientMembers[i] = scope.addedClients[i].id;
                }
                if(this.formData.active){
                    var reqDate = dateFilter(scope.first.date,scope.df);
                    this.formData.activationDate = reqDate;
                }
                if (scope.first.submitondate) {
                    reqDat = dateFilter(scope.first.submitondate,scope.df);
                    this.formData.submittedOnDate = reqDat;
                }

                this.formData.locale  = scope.optlang.code;
                this.formData.dateFormat =  scope.df;
                this.formData.active = this.formData.active || false;
                resourceFactory.groupResource.save(this.formData,function(data){
                    location.path('/viewgroup/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateGroupController', ['$scope', 'ResourceFactory', '$location','dateFilter', mifosX.controllers.CreateGroupController]).run(function($log) {
        $log.info("CreateGroupController initialized");
    });
}(mifosX.controllers || {}));
