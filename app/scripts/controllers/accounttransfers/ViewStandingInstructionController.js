(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewStandingInstructionController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.restrictDate = new Date();
            var params = {};
            scope.formData = {};
            scope.showselctclient = 'false';
            scope.allowclientedit = 'true';
            scope.standingInstructionId =  routeParams.instructionId;
            params.standingInstructionId = scope.standingInstructionId;

            resourceFactory.standingInstructionResource.get(params, function (data) {
                scope.standinginstruction = data;
                if(data.fromClient.id == data.toClient.id){
                    scope.allowclientedit = false;
                }
                
            });
            
            scope.cancel = function(){
                location.path('/liststandinginstructions/'+scope.standinginstruction.fromClient.officeId+'/'+scope.standinginstruction.fromClient.id);
            }

        }
    });
    mifosX.ng.application.controller('ViewStandingInstructionController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.ViewStandingInstructionController]).run(function ($log) {
        $log.info("ViewStandingInstructionController initialized");
    });
}(mifosX.controllers || {}));