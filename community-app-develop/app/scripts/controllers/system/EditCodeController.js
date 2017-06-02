(function (module) {
    mifosX.controllers = _.extend(module, {
        EditCodeController: function (scope, routeParams, resourceFactory, location) {
            scope.codevalues = [];
            scope.newcodevalues = [];
            scope.newEle = {};
            scope.errorDetails = [];
            scope.codevalueerror = false;
            scope.newEle.isActive = true;
            resourceFactory.codeResources.get({codeId: routeParams.id}, function (data) {
                scope.code = data;
                scope.codeId = data.id;

            });
            resourceFactory.codeValueResource.getAllCodeValues({codeId: routeParams.id}, function (data) {
                scope.codevalues = data;

            });

            scope.addCv = function () {
                if (scope.newEle != undefined && scope.newEle.hasOwnProperty('name')) {
                    //scope.codevalueerror = true;
                    resourceFactory.codeValueResource.save({codeId: routeParams.id}, this.newEle, function (data) {
                        scope.stat = false;
                        location.path('/viewcode/' + routeParams.id);
                    });
                } else if (!scope.newEle.name) {
                    scope.codevalueerror = true;
                    scope.labelerror = "codevalueerror";
                    scope.errorDetails = [];
                    var errorObj = new Object();
                    errorObj.args = {
                        params: []
                    };
                    errorObj.args.params.push({value:'label.input.codevalue'});
                    scope.errorDetails.push(errorObj);
                }

            };

            scope.deleteCv = function (id) {
                resourceFactory.codeValueResource.remove({codeId: routeParams.id, codevalueId: id}, {}, function (data) {
                    scope.stat = false;
                    location.path('/viewcode/' + routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditCodeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.EditCodeController]).run(function ($log) {
        $log.info("EditCodeController initialized");
    });
}(mifosX.controllers || {}));


