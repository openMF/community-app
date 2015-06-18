(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewCodeController: function (scope, routeParams, resourceFactory, location, $modal, route) {
            scope.codevalues = [];
            scope.formData = [];
            scope.newcode = {};
            scope.codename = {};
            scope.enableparentOptions = false;
            resourceFactory.codeResources.get({codeId: routeParams.id}, function (data) {
                scope.code = data;
                scope.codename.name = data.name;
                if(scope.code.parentId > 0){
                    scope.enableparentOptions = true;
                    resourceFactory.codeValueTemplateResource.get({parentId: data.parentId}, function (data) {
                        scope.parentOptions = data;
                    });
                }
            });
            resourceFactory.codeValueResource.getAllCodeValues({codeId: routeParams.id}, function (data) {
                scope.codevalues = data;
            });

            scope.delCode = function () {
                $modal.open({
                    templateUrl: 'deletecode.html',
                    controller: CodeDeleteCtrl
                });
            };
            scope.showEdit = function (id, name, description,position, cv, parentId) {
                scope.formData[id] = {
                    name: name,
                    description:description,
                    position: position,
                    parentId: parentId
                }
                cv.edit = !cv.edit;
            };
            scope.changeParentOption = function(id,parentId){
                this.formData[id].parentId = parentId;
            };
            scope.editCodeValue = function (id, cv) {
                resourceFactory.codeValueResource.update({codeId: routeParams.id, codevalueId: id}, this.formData[id], function (data) {
                    cv.edit = !cv.edit;
                    route.reload();
                });
            };
            scope.showEditCode = function () {
                scope.newcode.edit = !scope.newcode.edit;
                scope.codename.name = scope.code.name;
                if(scope.code.parentId > 0){
                    scope.enableparentOptions = true;
                    scope.codename.parentId = scope.code.parentId;
                    resourceFactory.codeResources.getAllCodes(function (data) {
                        scope.codes = data;
                    });
                }

            };
            scope.updateCode = function () {
                resourceFactory.codeResources.update({codeId: routeParams.id}, this.codename, function (data) {
                    route.reload();
                });
            }
            var CodeDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.codeResources.delete({codeId: routeParams.id}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/codes');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            var EditCodeValueCtrl = function ($scope, $modalInstance, cid) {
                $scope.edit = function () {

                    $modalInstance.close('delete');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            scope.deleteCodeValue = function (id) {
                $modal.open({
                    templateUrl: 'deletecodevalue.html',
                    controller: CodeValueDeleteCtrl,
                    resolve: {
                        cvid: function () {
                            return id;
                        }
                    }
                });
            };
            var CodeValueDeleteCtrl = function ($scope, $modalInstance, cvid) {
                $scope.delete = function () {
                    resourceFactory.codeValueResource.delete({codeId: routeParams.id, codevalueId: cvid}, {}, function (data) {
                        $modalInstance.close('delete');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewCodeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.ViewCodeController]).run(function ($log) {
        $log.info("ViewCodeController initialized");
    });
}(mifosX.controllers || {}));
