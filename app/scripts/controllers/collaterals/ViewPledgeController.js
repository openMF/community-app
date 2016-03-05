(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewPledgeController: function (scope, resourceFactory, routeParams, location, dateFilter) {
            scope.formData = {};
            scope.pledge = {};
            scope.collateralDetails = [];
            scope.isFromClient = false;
            resourceFactory.pledgeResource.getCollateralDetails( {pledgeId : routeParams.pledgeId }, function(data){
                scope.pledge = data;
                scope.collateralDetails = data.collateralDetailsData;
                scope.noOfitems = scope.collateralDetails.length;

            });
            scope.showClosePledge = (location.search().close)?true:false;
            if(location.search().id){
                scope.clientId = location.search().id;
                scope.isFromClient = true;
            }
            scope.closureDate = new Date();

            scope.init = function(){
                resourceFactory.pledgeResource.getCollateralDetails( {pledgeId : routeParams.pledgeId }, function(data){
                    scope.pledge = data;
                    scope.collateralDetails = data.collateralDetailsData;
                    scope.noOfitems = scope.collateralDetails.length;

                });
            }
            scope.init();

            scope.openClosePledge = function(){
                scope.showClosePledge = true;
            }

            scope.closePledge = function(pledgeId){
                var reqDate = dateFilter(this.formData.closureDate, scope.df);
                this.formData.closureDate = reqDate;
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                resourceFactory.pledgeResource.closePledge( {pledgeId : pledgeId }, this.formData, function(data){
                   if(location.search().id){
                       var id = location.search().id;
                       location.search('id', null);
                       location.search('close', null);
                       location.path("/viewclient/"+id);
                    }else{
                       location.path("/searchpledge");
                    }

                });
            };

            scope.cancel = function(){
                if((location.search().close)){
                    location.search('id', null);
                    location.search('close', null);
                    location.path("/viewclient/"+scope.clientId);
                }else{
                    scope.showClosePledge = false;
                }
            };
        }
    });

    mifosX.ng.application.controller('ViewPledgeController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.ViewPledgeController]).run(function ($log) {
        $log.info("ViewPledgeController initialized");
    });
}(mifosX.controllers || {}));