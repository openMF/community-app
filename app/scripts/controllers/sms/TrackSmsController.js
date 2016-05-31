(function (module) {
    mifosX.controllers = _.extend(module, {
        TrackSmsController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.formData = {};
            scope.formData.locale = scope.optlang.code;
            scope.formData.dateFormat = scope.df;
            scope.limit = 30;
            scope.smsData  = [];
            scope.searchedSmsData  = [];
            scope.tabSelected = "allsms";
            scope.smsStatus = [{name:'SENT',value:200},{name:'PENDING',value:100},{name:'DELIVERED',value:300},
                {name:'FAILED',value:400},{name:'INVALID',value:0}];

            scope.searchSms = function(){
                var toDate = dateFilter(this.formData.toDate,scope.formData.dateFormat);
                var fromDate = dateFilter(this.formData.fromDate,scope.formData.dateFormat);
                resourceFactory.searchSmsResource.get({limit: scope.limit,locale: this.formData.locale,
                    dateFormat: this.formData.dateFormat,status: this.formData.status,fromDate: fromDate,toDate: toDate
                },function(data){
                    scope.searchedSmsData = data.pageItems;
                });
            };

            scope.searchSmsByStatus = function(){
                scope.tabSelected = "search";
            };

            scope.allSms = function(){
                scope.tabSelected = "allsms";
                resourceFactory.smsResource.getAll({limit: scope.limit},function(data){
                    scope.smsData = data;
                });
            };

            scope.pendingSms = function(){
                scope.tabSelected = "pending";
                resourceFactory.pendingSmsResource.get({limit: scope.limit},function(data){
                    scope.smsData = data;
                });
            };

            scope.failedSms = function(){
                scope.tabSelected = "failed";
                resourceFactory.failedSmsResource.get({limit: scope.limit},function(data){
                    scope.smsData = data;
                });
            };

            scope.sentSms = function(){
                scope.tabSelected = "sent";
                resourceFactory.sentSmsResource.get({limit: scope.limit},function(data){
                    scope.smsData = data;
                });
            };

            scope.deliveredSms = function(){
                scope.tabSelected = "delivered";
                resourceFactory.deliveredSmsResource.get({limit: scope.limit},function(data){
                    scope.smsData = data;
                });
            };

            scope.formatDate = function(date){
                if(date != undefined){
                    var d = new Date();
                    var month = parseInt(date[1])-1;
                    d.setFullYear(date[0], month, date[2]);
                    var sentdate = dateFilter(d,scope.df);
                    return sentdate;
                }else{
                    return "";
                }
            };

        }
    });
    mifosX.ng.application.controller('TrackSmsController', ['$scope', 'ResourceFactory', '$location', '$routeParams','dateFilter', mifosX.controllers.TrackSmsController]).run(function ($log) {
        $log.info("TrackSmsController initialized");
    });
}(mifosX.controllers || {}));