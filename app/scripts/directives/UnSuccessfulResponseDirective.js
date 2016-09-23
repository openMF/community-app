(function (module) {
    mifosX.directives = _.extend(module, {
        UnSuccessfulResponseDirective: function ($compile, $rootScope) {
            return {
                restrict: 'E',
                require: '?ngmodel',
                link: function (scope, elm, attr, ctrl) {

                    scope.responses = [];

                    scope.failedresponse=[];

                    scope.$watch(function() {
                        return $rootScope.failedResponses;
                    }, function(failedResponses) {
                        scope.failedresponse = failedResponses;

                        if(scope.failedresponse.length > 0) {

                            scope.uniqueId = [];
                            scope.uniqueId1=[];
                            scope.er=[];
                            var id =0;

                            //fills up the uniqueId array with unique identifiers
                            for (var i = 0; i < scope.failedresponse.length; i++) {
                                for(var j = 0; j < scope.br.length; j++) {
                                    if(scope.failedresponse[i].requestId == scope.br[j].requestId) {
                                        if(scope.failedresponse[i].statusCode!=200) {
                                            var error={};
                                            scope.t=scope.br[j].body;
                                            error.clientId=JSON.parse(scope.br[j].body)[scope.identifier];
                                            if( !angular.isUndefined(JSON.parse(scope.failedresponse[i].body)['errors']))
                                            {
                                                scope.er = JSON.parse(scope.failedresponse[i].body)['errors'];
                                                error.errorMessage = scope.er[0].defaultUserMessage;
                                                error.requestId = scope.failedresponse[i].requestId;
                                                error.id=id;
                                                id++;

                                                scope.uniqueId1.push(error)

                                            }
                                            else{
                                                error.errorMessage = scope.failedresponse[i].body;
                                                error.requestId = scope.failedresponse[i].requestId;
                                            }
                                        }
                                    }
                                }
                            }



                            var template = '<div class="error" ng-show="failedResponses.length <= batchRequests.length">' +
                                '<h4>Error </h4>' +
                                '<span ng-repeat="errorArray in uniqueId1">RequestId &nbsp;{{errorArray.requestId}}&nbsp;{{errorArray.errorMessage}} <br></span>'+

                                '<ul></ul>'+
                                '</div>';

                            elm.html('').append($compile(template)(scope));
                        }
                    });

                    /* watch the batchRequests array for changes within the scope
                     of the controller this directive is inserted in.
                     Most importantly there must always be a "scope.batchRequests"
                     variable within the controller this directive is inserted in.*/
                    scope.$watch(function() {
                        return scope.batchRequests;
                    }, function(batchRequests){
                        scope.br = batchRequests;
                    });

                    /* watch the requestIdentifier for changes within the scope
                     of the controller this directive is inserted in.
                     Most importantly there must always be a "scope.requestIdentifier"
                     variable within the controller this directive is inserted in.*/
                    scope.$watch(function() {
                        return scope.requestIdentifier;
                    }, function(identifier){
                        scope.identifier = identifier;
                    });

                }
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("unsuccessfulResponse", ['$compile', '$rootScope', mifosX.directives.UnSuccessfulResponseDirective]).run(function ($log) {
    $log.info("UnSuccessfulResponseDirective initialized");
});