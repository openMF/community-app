/* Copyright (c) 2012-2013 Coding Smackdown TV, http://codingsmackdown.tv

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */

'use strict';

// Declare module which depends on filters, and services
angular.module('notificationWidget', [])
// Declare an http interceptor that will signal the start and end of each request
.config(['$httpProvider', function ($httpProvider) {
    var $http,
        interceptor = ['$q', '$injector', '$location', '$rootScope', function ($q, $injector, $location, $rootScope) {
            var notificationChannel;

            function removeErrors() {
                var $inputs = $(':input');
                $inputs.each(function() {
                    $(this).removeClass("validationerror");
                });
            }

            function success(response) {
                // clear previous errors for a success request.
                delete $rootScope.errorStatus;
                delete $rootScope.errorDetails;
                removeErrors();
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                // don't send notification until all requests are complete
                if ($http.pendingRequests.length < 1) {
                    // get requestNotificationChannel via $injector because of circular dependency problem
                    notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
                    // send a notification requests are complete
                    notificationChannel.requestEnded();
                }
                if(response.config && response.config.method=="GET"){
                    return response;
                }else {
                    if (response.data && response.data.commandId) {
                        //Maker checker is enabled or performing actions of maker checker
                        if (response.config.url.indexOf('makercheckers/') > 0) {
                            //return response for maker checker actions(approve or delete)
                            return response;
                        } else{
                            //redirect if maker checker is enabled
                            $location.path('/viewMakerCheckerTask/'+response.data.commandId);
                        }
                    } else{
                        //when no maker checker enabled
                        return response;
                    };
                }
            }

            function error(response) {
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                removeErrors();
                // don't send notification until all requests are complete
                if ($http.pendingRequests.length < 1) {
                    // get requestNotificationChannel via $injector because of circular dependency problem
                    notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
                    // send a notification requests are complete
                    notificationChannel.requestEnded();
                }
                if (response.status === 0) {
                    $rootScope.errorStatus='No connection. Verify application is running.';
                } else if (response.status == 401) {
                    $rootScope.errorStatus='Unauthorized';
                } else if (response.status == 404) {
                    $rootScope.errorStatus='Requested page not found. [404]';
                } else if (response.status == 405) {
                    $rootScope.errorStatus='HTTP verb not supported [405]';
                } else if (response.status == 500) {
                    $rootScope.errorStatus='Internal Server Error [500].';
                } else {
                    var jsonErrors = JSON.parse(JSON.stringify(response.data));
                    var valErrors = jsonErrors.errors;
                    var errorArray = new Array();
                    var arrayIndex = 0;
                    for(var i in valErrors) {
                        var temp = valErrors[i];
                        // add error class to input in dialog
                        var fieldId = '#' + temp.parameterName;
                        $(fieldId).addClass("validationerror");

                        var errorObj = new Object();
                        errorObj.field = temp.parameterName;
                        errorObj.code = temp.userMessageGlobalisationCode;
                        errorObj.args = {params:[]};
                        for(var j in temp.args) {
                            errorObj.args.params.push({value : temp.args[j].value});
                        }

                        errorArray[arrayIndex] = errorObj;
                        arrayIndex++;
                    }; 
                    $rootScope.errorDetails = errorArray;
                }
                return $q.reject(response);
            }

            return function (promise) {
                // get requestNotificationChannel via $injector because of circular dependency problem
                notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
                // send a notification requests are complete
                notificationChannel.requestStarted();
                return promise.then(success, error);
            }
        }];

    $httpProvider.responseInterceptors.push(interceptor);
}])
// declare the notification pub/sub channel
.factory('requestNotificationChannel', ['$rootScope', function($rootScope){
    // private notification messages
    var _START_REQUEST_ = '_START_REQUEST_';
    var _END_REQUEST_ = '_END_REQUEST_';
    // publish start request notification
    var requestStarted = function() {
        $rootScope.$broadcast(_START_REQUEST_);
        $rootScope.blockUI = true;
    };
    // publish end request notification
    var requestEnded = function() {
        $rootScope.$broadcast(_END_REQUEST_);
        $rootScope.blockUI = false;
    };
    // subscribe to start request notification
    var onRequestStarted = function($scope, handler){
        $scope.$on(_START_REQUEST_, function(event){
            handler();
        });
    };
    // subscribe to end request notification
    var onRequestEnded = function($scope, handler){
        $scope.$on(_END_REQUEST_, function(event){
            handler();
        });
    };

    return {
        requestStarted:  requestStarted,
        requestEnded: requestEnded,
        onRequestStarted: onRequestStarted,
        onRequestEnded: onRequestEnded
    };
}])


