(function (module) {
    mifosX.controllers = _.extend(module, {
        TellersController: function (scope, resourceFactory, location) {

            scope.tellers = [];
            var idToNodeMap = {};

            scope.TellersPerPage = 15;
            resourceFactory.tellerResource.getAllTellers(function (data) {
                scope.tellers = data;
            });

            scope.routeTo = function (id) {
                location.path('/viewtellers/' + id);
            };

            scope.routeToEdit = function (id) {
                location.path('/viewtellers/' + id);
            };

            scope.routeToCashiers = function (id) {
                location.path('/tellers/' + id + '/cashiers/');
            };

            scope.routeToDelete = function(id){
                    resourceFactory.tellerResource.delete({
                        tellerId: id},function(data){
                        resourceFactory.tellerResource.getAllTellers(function (data) {
                            scope.tellers = data;
                        });
                        location.path('/tellers');
                    });
            };
            /*scope.delete = function (tellerId, cashierId) {
                resourceFactory.tellerCashierResource.delete({tellerId: tellerId, cashierId: cashierId}, function (data) {
                    location.path('/tellers/' + tellerId + "/cashiers/");
                });

            };*/

            scope.deepCopy = function (obj) {
                if (Object.prototype.toString.call(obj) === '[object Array]') {
                    var out = [], i = 0, len = obj.length;
                    for (; i < len; i++) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                if (typeof obj === 'object') {
                    var out = {}, i;
                    for (i in obj) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                return obj;
            }



        }
    });
    mifosX.ng.application.controller('TellersController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.TellersController]).run(function ($log) {
        $log.info("TellersController initialized");
    });
}(mifosX.controllers || {}));
