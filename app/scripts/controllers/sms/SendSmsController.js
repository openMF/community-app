(function (module) {
    mifosX.controllers = _.extend(module, {
        SendSmsController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.formData = {};
            scope.formData.locale = scope.optlang.code;
            scope.formData.dateFormat = scope.df;
            scope.type = routeParams.sendertype;
            scope.id = routeParams.senderid;
            scope.smsData  = [];
            if(scope.type=='clients'){
                scope.formData.clientId =  scope.id;
                scope.formData.staffId = undefined;
                resourceFactory.clientResource.get({clientId: scope.formData.clientId}, function (data) {
                    scope.name = data.displayName+' ('+data.mobileNo+')';
                });
            }else if(scope.type=='staffs'){
                scope.formData.staffId =  scope.id;
                scope.formData.clientId = undefined;
                resourceFactory.employeeResource.get({staffId: scope.formData.staffId}, function (data) {
                    scope.name = data.firstname+' '+data.lastname+' ('+data.mobileNo+')';
                });
            }

            scope.submit = function () {
                resourceFactory.smsResource.save(this.formData, function (data) {
                    if(scope.type=='clients'){
                        location.path('/viewclient/' + scope.id);
                    }else if(scope.type=='staffs'){
                        location.path('/viewemployee/' + scope.id);
                    }
                });
            };
        }
    });
    mifosX.ng.application.controller('SendSmsController', ['$scope', 'ResourceFactory', '$location', '$routeParams','dateFilter', mifosX.controllers.SendSmsController]).run(function ($log) {
        $log.info("SendSmsController initialized");
    });
}(mifosX.controllers || {}));