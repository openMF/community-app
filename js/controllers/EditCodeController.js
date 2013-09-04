(function(module) {
    mifosX.controllers = _.extend(module, {
        EditCodeController: function(scope, routeParams , resourceFactory, location ) {
            scope.codevalues = [];
            scope.newcodevalues = [];
            scope.newEle = undefined;

            resourceFactory.codeResources.get({codeId: routeParams.id} , function(data) {
                scope.code = data;

            });
            resourceFactory.codeValueResource.getAllCodeValues({codeId: routeParams.id} , function(data) {
                scope.codevalues = data;

            });

            scope.addCv = function(){
                if(scope.newEle != undefined && scope.newEle.hasOwnProperty('name')) {
                    resourceFactory.codeValueUpdate.save({codeId: routeParams.id},this.newEle,function(data){
                        scope.stat=false;
                        location.path('/viewcode/'+routeParams.id);
                    });
                }

            };

            scope.deleteCv = function(id){

                        resourceFactory.codeValueDelete.remove({codeId: routeParams.id,codevalueId: id},this.codevalues,function(data){
                          scope.stat=false;
                          location.path('/viewcode/'+routeParams.id);

                         });

                        };



        }
    });
    mifosX.ng.application.controller('EditCodeController', ['$scope', '$routeParams','ResourceFactory','$location', mifosX.controllers.EditCodeController]).run(function($log) {
        $log.info("EditCodeController initialized");
    });
}(mifosX.controllers || {}));
