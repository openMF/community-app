(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewTemplateController: function(scope, routeParams , resourceFactory, location,$modal) {
        resourceFactory.templateResource.getTemplateDetails({templateId: routeParams.id} , function(data) {
            scope.template = data;
            scope.text = data.text;
        });
        scope.deleteTemplate = function (){
            $modal.open({
                templateUrl: 'deletetemplate.html',
                controller: TemplateDeleteCtrl
            });
        };
        var TemplateDeleteCtrl = function ($scope, $modalInstance) {
            $scope.delete = function () {
                resourceFactory.templateResource.delete({templateId: routeParams.id}, {}, function(data) {
                    location.path('/templates');
                    // added dummy request param because Content-Type header gets removed
                    // if the request does not contain any data (a request body)
                });
                $modalInstance.close('delete');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
    }
  });
  mifosX.ng.application.controller('ViewTemplateController', ['$scope', '$routeParams','ResourceFactory', '$location','$modal', mifosX.controllers.ViewTemplateController]).run(function($log) {
    $log.info("ViewTemplateController initialized");
  });
}(mifosX.controllers || {}));
