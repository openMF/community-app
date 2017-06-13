/**
 * Easy to use Wizard library for AngularJS
 * @version v0.4.0 - 2014-04-25 * @link https://github.com/mgonto/angular-wizard
 * @author Martin Gontovnikas <martin@gon.to>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module('templates-angularwizard', ['step.html', 'wizard.html']);

angular.module("step.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("step.html",
            "<div ng-show=\"selected\" ng-class=\"{current: selected, done: completed}\" class=\"step\" ng-transclude>\n" +
            "</div>");
}]);


angular.module("wizard.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("wizard.html",
            "<div class = \"wiz-container\">\n" +
            "    <div class = \"row \">\n" +
            "    <div class = \"col-md-12 \">\n" +
            "    <div class = \"helper-set-block\">\n" +
            "    <div class = \"arrow-wrapper steps-indicator\">\n" +
           // "    <div class=\"steps-indicator\" ng-if=\"!hideIndicators\">\n" +
           // "      <div ng-repeat=\"step in steps\" ng-class=\"{'active':step.title == selectedStep.title, default: !step.completed && !step.selected, 'current': step.selected && !step.completed, 'done': step.completed && !step.selected, 'editing': step.selected && step.completed}\">\n" +
            "        <a ng-repeat=\"step in steps\" ng-click=\"goTo(step)\" ng-class=\"{'active':step.title == selectedStep.title, default: " +
                "!step.completed && !step.selected, 'current': step.selected && !step.completed, " +
                "'done': step.completed && !step.selected, 'editing': step.selected && step.completed," +
                "'current icon-arrow-right': step.selected && !step.completed, 'done icon-check': step.completed && !step.selected, " +
                "'editing icon-repeat': step.selected && step.completed}\">\n" +
                "<span class=\"fa-stack\">" +
                "<span class=\"fa fa-circle-thin fa-stack-2x\"></span>" +
                "<span class=\"fa fa-check fa-stack-1x\" ng-show=\"step.completed\"></span>" +
                "</span>"+
           // "      <span class=\"{{step.icon}}\"></span> " +
            "&nbsp;    {{step.title || step.wzTitle}}\n" +
            "        </a>\n" +
           // "      </div>\n" +
            //"    </div>\n" +
            "    </div>\n" +
            "    </div>\n" +
            "    </div>\n" +
            "    </div>\n" +
            "    <div class = \"row \">\n" +
            "    <div class=\"steps col-md-12\" ng-transclude></div>\n" +
            "    </div>\n" +
            "</div>\n" +
            "");
}]);
angular.module('mgo-angular-wizard', ['templates-angularwizard']);

angular.module('mgo-angular-wizard').directive('wzStep', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            wzTitle: '@',
            title: '@',
            icon: '@'
        },
        require: '^wizard',
        templateUrl: function(element, attributes) {
            return attributes.template || "step.html";
        },
        link: function($scope, $element, $attrs, wizard) {
            $scope.title = $scope.title || $scope.wzTitle;
            wizard.addStep($scope);
        }
    }
});

angular.module('mgo-angular-wizard').directive('wizard', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            currentStep: '=',
            onFinish: '&',
            hideIndicators: '=',
            editMode: '=',
            name: '@'
        },
        templateUrl: function(element, attributes) {
            return attributes.template || "wizard.html";
        },
        controller: ['$scope', '$element', 'WizardHandler', function($scope, $element, WizardHandler) {

            WizardHandler.addWizard($scope.name || WizardHandler.defaultName, this);
            $scope.$on('$destroy', function() {
                WizardHandler.removeWizard($scope.name || WizardHandler.defaultName);
            });

            $scope.steps = [];

            $scope.$watch('currentStep', function(step) {
                if (!step) return;
                var stepTitle = $scope.selectedStep.title || $scope.selectedStep.wzTitle;
                if ($scope.selectedStep && stepTitle !== $scope.currentStep) {
                    $scope.goTo(_.findWhere($scope.steps, {title: $scope.currentStep}));
                }

            });

            $scope.$watch('[editMode, steps.length]', function() {
                var editMode = $scope.editMode;
                if (_.isUndefined(editMode) || _.isNull(editMode)) return;

                if (editMode) {
                    _.each($scope.steps, function(step) {
                        step.completed = true;
                    });
                }
            }, true);

            this.addStep = function(step) {
                $scope.steps.push(step);
                if ($scope.steps.length === 1) {
                    $scope.goTo($scope.steps[0]);
                }
            };

            $scope.goTo = function(step) {
                unselectAll();
                $scope.selectedStep = step;
                if (!_.isUndefined($scope.currentStep)) {
                    $scope.currentStep = step.title || step.wzTitle;
                }
                step.selected = true;
                $scope.$emit('wizard:stepChanged', {step: step, index: _.indexOf($scope.steps , step)});
            };

            $scope.currentStepNumber = function() {
                return _.indexOf($scope.steps , $scope.selectedStep) + 1;
            }

            this.getCurrentStep = function() {
                return $scope.currentStepNumber();
            }

            function unselectAll() {
                _.each($scope.steps, function (step) {
                    step.selected = false;
                });
                $scope.selectedStep = null;
            }

            this.next = function(draft) {
                var index = _.indexOf($scope.steps , $scope.selectedStep);
                if (!draft) {
                    $scope.selectedStep.completed = true;
                }
                if (index === $scope.steps.length - 1) {
                    this.finish();
                } else {
                    $scope.goTo($scope.steps[index + 1]);
                }
            };

            this.goTo = function(step) {
                var stepTo;
                if (_.isNumber(step)) {
                    stepTo = $scope.steps[step];
                } else {
                    stepTo = _.findWhere($scope.steps, {title: step});
                }
                $scope.goTo(stepTo);
            };

            this.finish = function() {
                if ($scope.onFinish) {
                    $scope.onFinish();
                }
            };

            this.cancel = this.previous = function() {
                var index = _.indexOf($scope.steps , $scope.selectedStep);
                if (index === 0) {
                    throw new Error("Can't go back. It's already in step 0");
                } else {
                    $scope.goTo($scope.steps[index - 1]);
                }
            };

            //deletes steps from $scope.steps array starting with index to length
            this.removeSteps = function (index, length) {
                $scope.steps.splice(index, length);
            };
        }]
    };
});

function wizardButtonDirective(action) {
    angular.module('mgo-angular-wizard')
        .directive(action, function() {
            return {
                restrict: 'A',
                replace: false,
                require: '^wizard',
                link: function($scope, $element, $attrs, wizard) {

                    $element.on("click", function(e) {
                        e.preventDefault();
                        $scope.$apply(function() {
                            $scope.$eval($attrs[action]);
                            wizard[action.replace("wz", "").toLowerCase()]();
                        });
                    });
                }
            };
        });
}

wizardButtonDirective('wzNext');
wizardButtonDirective('wzPrevious');
wizardButtonDirective('wzFinish');
wizardButtonDirective('wzCancel');

angular.module('mgo-angular-wizard').factory('WizardHandler', function() {
    var service = {};

    var wizards = {};

    service.defaultName = "defaultWizard";

    service.addWizard = function(name, wizard) {
        wizards[name] = wizard;
    };

    service.removeWizard = function(name) {
        delete wizards[name];
    };

    service.wizard = function(name) {
        var nameToUse = name;
        if (!name) {
            nameToUse = service.defaultName;
        }

        return wizards[nameToUse];
    };

    return service;
});
