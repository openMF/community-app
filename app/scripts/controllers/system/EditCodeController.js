(function (module) {
    mifosX.controllers = _.extend(module, {
        EditCodeController: function (scope, routeParams, resourceFactory, location) {
            scope.codevalues = [];
            scope.newcodevalues = [];
            scope.newEle = undefined;
            scope.codevalueerror = false;
            scope.newEle = {};
            scope.enableParentOptions = false;

            resourceFactory.codeResources.get({codeId: routeParams.id}, function (data) {
                scope.code = data;
                scope.codeId = data.id;
                if(data.parentId > 0){
                    scope.enableParentOptions = true;
                    resourceFactory.codeValueTemplateResource.get({parentId: data.parentId}, function (data) {
                        scope.parentOptions = data;
                    });
                }
            });

            resourceFactory.codeValueResource.getAllCodeValues({codeId: routeParams.id}, function (data) {
                scope.codevalues = data;

            });

            scope.addCv = function () {
                if (scope.newEle != undefined && scope.newEle.hasOwnProperty('name')) {
                    scope.codevalueerror = true;
                    resourceFactory.codeValueResource.save({codeId: routeParams.id}, this.newEle, function (data) {
                        scope.stat = false;
                        location.path('/viewcode/' + routeParams.id);
                    });
                } else if (!scope.newEle.name) {
                    scope.codevalueerror = true;
                    scope.labelerror = "codevalueerror";
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
