(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewTemplateController: function (scope, routeParams, resourceFactory, location, $uibModal, $sce) {
            resourceFactory.templateResource.getTemplateDetails({templateId: routeParams.id}, function (data) {
                scope.template = data;
                scope.templateText = $sce.trustAsHtml(data.text);
            });
            scope.deleteTemplate = function () {
                $uibModal.open({
                    templateUrl: 'deletetemplate.html',
                    controller: TemplateDeleteCtrl
                });
            };
            var TemplateDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.templateResource.delete({templateId: routeParams.id}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/templates');
                        // added dummy request param because Content-Type header gets removed
                        // if the request does not contain any data (a request body)
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ViewTemplateController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', '$sce', mifosX.controllers.ViewTemplateController]).run(function ($log) {
        $log.info("ViewTemplateController initialized");
    });
}(mifosX.controllers || {}));
