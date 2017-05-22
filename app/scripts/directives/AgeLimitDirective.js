(function (module) {
    mifosX.directives = _.extend(module, {
        AgeLimitDirective: function ($filter, $locale) {
            return {
                require: 'ngModel',
                link: function (scope, elm, attrs, ctrl) {

                    function testDateForAgeLimit(attributes, controller) {
                        var minAge = attributes.minage ? attributes.minage : -100;
                        var maxAge = attributes.maxage ? attributes.maxage : 200;
                        var viewValue = controller.$viewValue;
                        var date;
                        if (viewValue == undefined) return false;
                        if (viewValue.length == 0) {
                            controller.$setValidity('ageLimit', true);
                            controller.$setValidity('dateValidity', true);
                            return undefined;
                        }
                        var dsplit;
                        if (viewValue.indexOf('/') == -1) {
                            var pattern = /^\d{2}\s[a-zA-Z]{3,9}\s\d{4}$/;
                            if (!pattern.test(viewValue)) {
                                controller.$setValidity('dateValidity', false);
                                return undefined;
                            }
                            var viewValueDate = new Date(viewValue);
                            viewValue = ("0" + viewValueDate.getDate()).slice(-2) + "/" + ("0" + (viewValueDate.getMonth() + 1)).slice(-2) + "/" + viewValueDate.getFullYear();

                        }

                        dsplit = viewValue.split("/");

                        function padToTwo(number) {
                            if (number <= 9) { number = ("0" + number).slice(-2); }
                            return number.toString();
                        }

                        if (dsplit.length != 3) {
                            controller.$setValidity('dateValidity', false);
                            return undefined;
                        } else {
                            dsplit[0] = padToTwo(parseInt(dsplit[0]));
                            dsplit[1] = padToTwo(parseInt(dsplit[1]));
                            if (parseInt(dsplit[1]) > 12 || parseInt(dsplit[1]) < 1 || parseInt(dsplit[0].length) != 2 || parseInt(dsplit[1].length) != 2 || parseInt(dsplit[2].length) != 4) {
                                controller.$setValidity('dateValidity', false);
                                return undefined;
                            }
                            controller.$setValidity('dateValidity', true);
                            date = new Date(parseInt(dsplit[2]), parseInt(dsplit[1]) - 1, parseInt(dsplit[0]));
                        }

                        //var viewValueDate = new Date(viewValue);
                        //var viewValue = ("0" + viewValueDate.getDate()).slice(-2) + "/" + ("0" + (viewValueDate.getMonth() + 1)).slice(-2) + "/" + viewValueDate.getFullYear();


                        //console.log(controller.$modelValue);
                        //console.log("Logging evaluated date");
                        //console.log(date);
                        if (isNaN(date)) {
                            //Make it invalid
                            //                            console.log("marking invalid since not a date");
                            controller.$setValidity('dateValidity', false);
                            return undefined;
                        }
                        var minDate = new Date();
                        minDate.setHours(0, 0, 0, 0);
                        minDate = minDate.setFullYear(minDate.getFullYear() - maxAge);
                        var maxDate = new Date();
                        maxDate.setHours(0, 0, 0, 0);
                        maxDate = maxDate.setFullYear(maxDate.getFullYear() - minAge);
                        if (date <= maxDate && date >= minDate) {
                            // it is valid
                            controller.$setValidity('ageLimit', true);
                            return date;
                        } else {
                            // it is invalid, return undefined (no model update)
                            // console.log("marking invalid since not in range");
                            controller.$setValidity('ageLimit', false);
                            return undefined;
                        }
                    }
                    scope.$watch(function () { return ctrl.$modelValue }, function () {
                        testDateForAgeLimit(attrs, ctrl);
                    });
                    ctrl.$parsers.unshift(function (viewValue) {
                        // console.log("Called parser");
                        return testDateForAgeLimit(attrs, ctrl);
                    });
                }
            }
        }
    });
}(mifosX.directives || {}));
mifosX.ng.application.directive("ageLimit", ['$filter', '$locale', mifosX.directives.AgeLimitDirective]).run(function ($log) {
    $log.info("AgeLimitDirective initialized");
});