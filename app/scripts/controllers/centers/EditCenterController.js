(function(module) {
    mifosX.controllers = _.extend(module, {
        EditCenterController: function(scope, resourceFactory,location, routeParams,dateFilter ) {
            scope.managecode = routeParams.managecode;
            scope.first = {};
            scope.first.date = new Date();
            scope.centerId = routeParams.id;
            resourceFactory.centerResource.get({centerId: routeParams.id,template: 'true'} , function(data) {
                scope.edit = data;
                scope.staffs = data.staffOptions;
                scope.formData = {
                    name:data.name,
                    externalId:data.externalId,
                    staffId:data.staffId
                };

                if (data.activationDate) {
                    var newDate = dateFilter(data.activationDate,'dd MMMM yyyy');
                    scope.first.date = new Date(newDate);
                }
            });

            scope.updateGroup = function(){
                var reqDate = dateFilter(scope.first.date,'dd MMMM yyyy');
                this.formData.activationDate = reqDate;
                this.formData.locale = "en";
                this.formData.dateFormat = 'dd MMMM yyyy';
                resourceFactory.centerResource.update({centerId:routeParams.id},this.formData , function(data) {
                    location.path('/viewcenter/'+routeParams.id);
                });
            };
            scope.activate = function(){
                var reqDate = dateFilter(scope.first.date,'dd MMMM yyyy');
                var newActivation = new Object();
                newActivation.activationDate = reqDate;
                newActivation.locale = 'en' ;
                newActivation.dateFormat = 'dd MMMM yyyy';
                resourceFactory.centerResource.save({centerId : routeParams.id,command:'activate'},newActivation, function(data){
                    location.path('/viewcenter/'+routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditCenterController', ['$scope','ResourceFactory','$location','$routeParams','dateFilter', mifosX.controllers.EditCenterController]).run(function($log) {
        $log.info("EditCenterController initialized");
    });
}(mifosX.controllers || {}));

