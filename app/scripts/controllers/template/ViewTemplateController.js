(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewTemplateController: function (scope, routeParams, resourceFactory, location, $modal, $sce) {
            resourceFactory.templateResource.getTemplateDetails({templateId: routeParams.id}, function (data) {
                scope.template = data;
                scope.templateText = $sce.trustAsHtml(data.text);
            });
            scope.deleteTemplate = function () {
                $modal.open({
                    templateUrl: 'deletetemplate.html',
                    controller: TemplateDeleteCtrl
                });
            };
            var TemplateDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.templateResource.delete({templateId: routeParams.id}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/templates');
                        // added dummy request param because Content-Type header gets removed
                        // if the request does not contain any data (a request body)
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ViewTemplateController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$sce', mifosX.controllers.ViewTemplateController]).run(function ($log) {
        $log.info("ViewTemplateController initialized");
    });
}(mifosX.controllers || {}));
