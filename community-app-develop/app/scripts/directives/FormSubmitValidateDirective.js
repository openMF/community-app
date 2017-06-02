(function (module) {
    mifosX.directives = _.extend(module, {
        FormSubmitValidateDirective: function ($parse, $event) {
            return {
                restrict: 'A',
                require: ['rcSubmit', '?form'],
                controller: ['$scope', function ($scope) {
                    this.attempted = false;

                    var formController = null;

                    this.setAttempted = function () {
                        this.attempted = true;
                    };

                    this.setFormController = function (controller) {
                        formController = controller;
                    };
                }],
                compile: function (cElement, cAttributes, transclude) {
                    return {
                        pre: function (scope, formElement, attributes, controllers) {

                            var submitController = controllers[0];
                            var formController = (controllers.length > 1) ? controllers[1] : null;

                            submitController.setFormController(formController);

                            scope.rc = scope.rc || {};
                            scope.rc[attributes.name] = submitController;
                        },
                        post: function (scope, formElement, attributes, controllers, event) {

                            var submitController = controllers[0];
                            var formController = (controllers.length > 1) ? controllers[1] : null;
                            var fn = $parse(attributes.rcSubmit);

                            formElement.bind('submit', function () {
                                submitController.setAttempted();
                                if (!scope.$$phase) scope.$apply();
                                if (!formController.$valid) {
                                    return false;
                                }
                                scope.$apply(function () {
                                    fn(scope, {$event: event});
                                });
                            });
                        }
                    };
                }
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("rcSubmit", ['$parse', mifosX.directives.FormSubmitValidateDirective]).run(function ($log) {
    $log.info("FormSubmitValidateDirective initialized");
});