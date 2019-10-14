angular.module('strap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
    .factory('$position', ['$document', '$window', function ($document, $window) {

        function getStyle(el, cssprop) {
            if (el.currentStyle) { //IE
                return el.currentStyle[cssprop];
            } else if ($window.getComputedStyle) {
                return $window.getComputedStyle(el)[cssprop];
            }
            // finally try and get inline style
            return el.style[cssprop];
        }

        /**
         * Checks if a given element is statically positioned
         * @param element - raw DOM element
         */
        function isStaticPositioned(element) {
            return (getStyle(element, "position") || 'static' ) === 'static';
        }

        /**
         * returns the closest, non-statically positioned parentOffset of a given element
         * @param element
         */
        var parentOffsetEl = function (element) {
            var docDomEl = $document[0];
            var offsetParent = element.offsetParent || docDomEl;
            while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || docDomEl;
        };

        return {
            /**
             * Provides read-only equivalent of jQuery's position function:
             * http://api.jquery.com/position/
             */
            position: function (element) {
                var elBCR = this.offset(element);
                var offsetParentBCR = { top: 0, left: 0 };
                var offsetParentEl = parentOffsetEl(element[0]);
                if (offsetParentEl != $document[0]) {
                    offsetParentBCR = this.offset(angular.element(offsetParentEl));
                    offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
                    offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
                }

                return {
                    width: element.prop('offsetWidth'),
                    height: element.prop('offsetHeight'),
                    top: elBCR.top - offsetParentBCR.top,
                    left: elBCR.left - offsetParentBCR.left
                };
            },

            /**
             * Provides read-only equivalent of jQuery's offset function:
             * http://api.jquery.com/offset/
             */
            offset: function (element) {
                var boundingClientRect = element[0].getBoundingClientRect();
                return {
                    width: element.prop('offsetWidth'),
                    height: element.prop('offsetHeight'),
                    top: boundingClientRect.top + ($window.pageYOffset || $document[0].body.scrollTop || $document[0].documentElement.scrollTop),
                    left: boundingClientRect.left + ($window.pageXOffset || $document[0].body.scrollLeft || $document[0].documentElement.scrollLeft)
                };
            }
        };
    }]);


angular.module('modified.datepicker', ['strap.position'])

    .constant('datepickerConf', {
        dayFormat: 'dd',
        monthFormat: 'MMMM',
        yearFormat: 'yyyy',
        dayHeaderFormat: 'EEE',
        dayTitleFormat: 'MMMM yyyy',
        monthTitleFormat: 'yyyy',
        showWeeks: true,
        showToday: true,
        startingDay: 0,
        yearRange: 20,
        minDate: new Date(new Date().getFullYear(), 0, 1),
        maxDate: null
    })

    .controller('DatepickController', ['$scope', '$attrs', 'dateFilter', 'datepickerConf', function ($scope, $attrs, dateFilter, dtConfig) {
        var format = {
                day: getValue($attrs.dayFormat, dtConfig.dayFormat),
                month: getValue($attrs.monthFormat, dtConfig.monthFormat),
                year: getValue($attrs.yearFormat, dtConfig.yearFormat),
                dayHeader: getValue($attrs.dayHeaderFormat, dtConfig.dayHeaderFormat),
                dayTitle: getValue($attrs.dayTitleFormat, dtConfig.dayTitleFormat),
                monthTitle: getValue($attrs.monthTitleFormat, dtConfig.monthTitleFormat)
            },
            startingDay = getValue($attrs.startingDay, dtConfig.startingDay),
            yearRange = getValue($attrs.yearRange, dtConfig.yearRange);

        this.minDate = dtConfig.minDate ? new Date(dtConfig.minDate) : null;
        this.maxDate = dtConfig.maxDate ? new Date(dtConfig.maxDate) : null;

        function getValue(value, defaultValue) {
            return angular.isDefined(value) ? $scope.$parent.$eval(value) : defaultValue;
        }

        function getDaysInMonth(year, month) {
            return new Date(year, month, 0).getDate();
        }

        function getDates(startDate, n) {
            var dates = new Array(n);
            var current = startDate, i = 0;
            while (i < n) {
                dates[i++] = new Date(current);
                current.setDate(current.getDate() + 1);
            }
            return dates;
        }

        function makeDate(date, format, isSelected, isSecondary) {
            return { date: date, label: dateFilter(date, format), selected: !!isSelected, secondary: !!isSecondary };
        }

        this.modes = [
            {
                name: 'day',
                getVisibleDates: function (date, selected) {
                    var year = date.getFullYear(), month = date.getMonth(), firstDayOfMonth = new Date(year, month, 1);
                    var difference = startingDay - firstDayOfMonth.getDay(),
                        numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : -difference,
                        firstDate = new Date(firstDayOfMonth), numDates = 0;

                    if (numDisplayedFromPreviousMonth > 0) {
                        firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
                        numDates += numDisplayedFromPreviousMonth; // Previous
                    }
                    numDates += getDaysInMonth(year, month + 1); // Current
                    numDates += (7 - numDates % 7) % 7; // Next

                    var days = getDates(firstDate, numDates), labels = new Array(7);
                    for (var i = 0; i < numDates; i++) {
                        var dt = new Date(days[i]);
                        days[i] = makeDate(dt, format.day, (selected && selected.getDate() === dt.getDate() && selected.getMonth() === dt.getMonth() && selected.getFullYear() === dt.getFullYear()), dt.getMonth() !== month);
                    }
                    for (var j = 0; j < 7; j++) {
                        labels[j] = dateFilter(days[j].date, format.dayHeader);
                    }
                    return { objects: days, title: dateFilter(date, format.dayTitle), labels: labels };
                },
                compare: function (date1, date2) {
                    return (new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()) );
                },
                split: 7,
                step: { months: 1 }
            },
            {
                name: 'month',
                getVisibleDates: function (date, selected) {
                    var months = new Array(12), year = date.getFullYear();
                    for (var i = 0; i < 12; i++) {
                        var dt = new Date(year, i, 1);
                        months[i] = makeDate(dt, format.month, (selected && selected.getMonth() === i && selected.getFullYear() === year));
                    }
                    return { objects: months, title: dateFilter(date, format.monthTitle) };
                },
                compare: function (date1, date2) {
                    return new Date(date1.getFullYear(), date1.getMonth()) - new Date(date2.getFullYear(), date2.getMonth());
                },
                split: 3,
                step: { years: 1 }
            },
            {
                name: 'year',
                getVisibleDates: function (date, selected) {
                    var years = new Array(yearRange), year = date.getFullYear(), startYear = parseInt((year - 1) / yearRange, 10) * yearRange + 1;
                    for (var i = 0; i < yearRange; i++) {
                        var dt = new Date(startYear + i, 0, 1);
                        years[i] = makeDate(dt, format.year, (selected && selected.getFullYear() === dt.getFullYear()));
                    }
                    return { objects: years, title: [years[0].label, years[yearRange - 1].label].join(' - ') };
                },
                compare: function (date1, date2) {
                    return date1.getFullYear() - date2.getFullYear();
                },
                split: 5,
                step: { years: yearRange }
            }
        ];

        this.isDisabled = function (date, mode) {
            var currentMode = this.modes[mode || 0];
            return ((this.minDate && currentMode.compare(date, this.minDate) < 0) || (this.maxDate && currentMode.compare(date, this.maxDate) > 0) || ($scope.dateDisabled && $scope.dateDisabled({date: date, mode: currentMode.name})));
        };
    }])

    .directive('datepick', ['dateFilter', '$parse', 'datepickerConf', '$log', function (dateFilter, $parse, datepickerConf, $log) {
        return {
            restrict: 'EA',
            replace: true,
            template: "<table>\n" +
                "  <thead>\n" +
                "    <tr class=\"text-center\">\n" +
                "      <th><button type=\"button\" class=\"btn-black pull-left\" ng-click=\"move(-1)\"><i class=\"fa fa-chevron-left\"></i></button></th>\n" +
                "      <th colspan=\"{{rows[0].length - 2 + showWeekNumbers}}\"><button type=\"button\" class=\"btn-black btn-block\" ng-click=\"toggleMode()\"><strong>{{title | translate}}</strong></button></th>\n" +
                "      <th><button type=\"button\" class=\"btn-black pull-right\" ng-click=\"move(1)\"><i class=\"fa fa-chevron-right\"></i></button></th>\n" +
                "    </tr>\n" +
                "    <tr class=\"text-center\" ng-show=\"labels.length > 0\">\n" +
                "      <th ng-show=\"showWeekNumbers\">#</th>\n" +
                "      <th ng-repeat=\"label in labels\">{{label | translate}}</th>\n" +
                "    </tr>\n" +
                "  </thead>\n" +
                "  <tbody>\n" +
                "    <tr ng-repeat=\"row in rows\">\n" +
                "      <td ng-show=\"showWeekNumbers\" class=\"text-center\"><em>{{ getWeekNumber(row) }}</em></td>\n" +
                "      <td ng-repeat=\"dt in row\" class=\"text-center\">\n" +
                "        <button type=\"button\" style=\"width:100%;\" class=\"btn-silver\" ng-class=\"{'btn-silver-info': dt.selected}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\"><span ng-class=\"{muted: dt.secondary}\">{{dt.label | translate}}</span></button>\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "    <tr ng-show=\"showTodayDate\">\n" +
                "      <td colspan=\"{{rows[0].length + showWeekNumbers}}\" class=\"text-center\" style=\"padding-top: 5px\">\n" +
                "        <strong><a ng-click=\"select(todayDate.date)\">{{'label.today' | translate}}: {{todayDate.label | translate}}</a></strong>\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n",
            scope: {
                dateDisabled: '&'
            },
            require: ['datepick', '?^ngModel'],
            controller: 'DatepickController',
            link: function (scope, element, attrs, ctrls) {
                var datepickerCtrl = ctrls[0], ngModel = ctrls[1];

                if (!ngModel) {
                    return; // do nothing if no ng-model
                }

                // Configuration parameters
                var mode = 0, selected = new Date(), showWeeks = datepickerConf.showWeeks,
                    showToday = datepickerConf.showToday;

                if (attrs.showToday) {
                    scope.$parent.$watch($parse(attrs.showToday), function (value) {
                        showToday = !!value;
                        updateShowTodayDate();
                    });
                } else {
                    updateShowTodayDate();
                }

                if (attrs.showWeeks) {
                    scope.$parent.$watch($parse(attrs.showWeeks), function (value) {
                        showWeeks = !!value;
                        updateShowWeekNumbers();
                    });
                } else {
                    updateShowWeekNumbers();
                }

                if (attrs.min) {
                    scope.$parent.$watch($parse(attrs.min), function (value) {
                        datepickerCtrl.minDate = value ? new Date(value) : null;
                        refill();
                    });
                }
                if (attrs.max) {
                    scope.$parent.$watch($parse(attrs.max), function (value) {
                        datepickerCtrl.maxDate = value ? new Date(value) : null;
                        refill();
                    });
                }

                function updateShowWeekNumbers() {
                    scope.showWeekNumbers = mode === 0 && showWeeks;
                }

                function updateShowTodayDate() {
                    scope.showTodayDate = showToday;
                }

                // Split array into smaller arrays
                function split(arr, size) {
                    var arrays = [];
                    while (arr.length > 0) {
                        arrays.push(arr.splice(0, size));
                    }
                    return arrays;
                }

                function refill(updateSelected) {
                    var date = null, valid = true;

                    if (ngModel.$modelValue) {
                        date = new Date(ngModel.$modelValue);

                        if (isNaN(date)) {
                            valid = false;
                            $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
                        } else if (updateSelected) {
                            selected = date;
                        }
                    }
                    ngModel.$setValidity('date', valid);

                    var currentMode = datepickerCtrl.modes[mode], data = currentMode.getVisibleDates(selected, date);
                    angular.forEach(data.objects, function (obj) {
                        obj.disabled = datepickerCtrl.isDisabled(obj.date, mode);
                    });

                    ngModel.$setValidity('date-disabled', (!date || !datepickerCtrl.isDisabled(date)));

                    scope.rows = split(data.objects, currentMode.split);
                    scope.labels = data.labels || [];
                    scope.title = data.title;
                    scope.todayDate = {
                        date : new Date(Date.now()),
                        label :  dateFilter(Date.now(), scope.dateFormat)
                    }
                }

                function setMode(value) {
                    mode = value;
                    updateShowWeekNumbers();
                    refill();
                }

                ngModel.$render = function () {
                    refill(true);
                };

                scope.select = function (date) {
                    if (mode === 0) {
                        var dt = new Date(ngModel.$modelValue);
                        dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                        ngModel.$setViewValue(dt);
                        refill(true);
                    } else {
                        selected = date;
                        setMode(mode - 1);
                    }
                };
                scope.move = function (direction) {
                    var step = datepickerCtrl.modes[mode].step;
                    selected.setMonth(selected.getMonth() + direction * (step.months || 0));
                    selected.setFullYear(selected.getFullYear() + direction * (step.years || 0));
                    refill();
                };
                scope.toggleMode = function () {
                    setMode((mode + 1) % datepickerCtrl.modes.length);
                };
                scope.getWeekNumber = function (row) {
                    return ( mode === 0 && scope.showWeekNumbers && row.length === 7 ) ? getISO8601WeekNumber(row[0].date) : null;
                };

                function getISO8601WeekNumber(date) {
                    var checkDate = new Date(date);
                    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
                    var time = checkDate.getTime();
                    checkDate.setMonth(0); // Compare with Jan 1
                    checkDate.setDate(1);
                    return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
                }
            }
        };
    }])

    .constant('datepickerPopConfig', {
        dateFormat: 'dd MMMM yyyy',
        closeOnDateSelection: true
    })

    .directive('datepickerPop', ['$compile', '$parse', '$document', '$position', 'dateFilter', 'datepickerPopConfig',
        function ($compile, $parse, $document, $position, dateFilter, datepickerPopConfig) {
            return {
                restrict: 'EA',
                require: 'ngModel',
                link: function (originalScope, element, attrs, ngModel) {

                    var closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$eval(attrs.closeOnDateSelection) : datepickerPopConfig.closeOnDateSelection;
                    var dateFormat = originalScope.df || attrs.datepickerPop || datepickerPopConfig.dateFormat;

                    // create a child scope for the datepicker directive so we are not polluting original scope
                    var scope = originalScope.$new();
                    originalScope.$on('$destroy', function () {
                        scope.$destroy();
                    });

                    function formatDate(value) {
                        return (value) ? dateFilter(value, dateFormat) : null;
                    }

                    ngModel.$formatters.push(formatDate);

                    // TODO: reverse from dateFilter string to Date object
                    function parseDate(value) {
                        if (value) {
                            var date = new Date(value);
                            if (!isNaN(date)) {
                                return date;
                            }
                        }
                        return value;
                    }

                    ngModel.$parsers.push(parseDate);

                    var getIsOpen, setIsOpen;
                    if (attrs.open) {
                        getIsOpen = $parse(attrs.open);
                        setIsOpen = getIsOpen.assign;

                        originalScope.$watch(getIsOpen, function updateOpen(value) {
                            scope.isOpen = !!value;
                        });
                    }
                    scope.isOpen = getIsOpen ? getIsOpen(originalScope) : false; // Initial state

                    function setOpen(value) {
                        if (setIsOpen) {
                            setIsOpen(originalScope, !!value);
                        } else {
                            scope.isOpen = !!value;
                        }
                    }

                    var documentKeyBind = function(event) {
                        if (event.which == 9 || event.which == 27) { //Tab || Esc
                            if (scope.isOpen) {
                                   scope.$apply(function() {
                                    setOpen(false);
                                });
                            }

                            setTimeout(function() { // check future element focus
                                var el = document.activeElement.parentNode.parentNode.parentNode;
                                if (el != null && el.hasAttribute('collapse') && el.className == "collapse")
                                    document.getElementById('clickToShow').click();
                            }, 10);
                        }
                    };

                    var documentClickBind = function (event) {
                        if (scope.isOpen && event.target !== element[0]) {
                            scope.$apply(function () {
                                setOpen(false);
                            });
                        }
                    };

                    var elementFocusBind = function () {
                        scope.$apply(function () {
                            setOpen(true);
                        });
                    };

                    // popup element used to display calendar
                    var popupEl = angular.element('<datepicker-pop-wrap><datepick></datepick></datepicker-pop-wrap>');
                    popupEl.attr({
                        'ng-model': 'date',
                        'ng-change': 'dateSelection()'
                    });
                    var datepickerEl = popupEl.find('datepick');
                    if (attrs.datepickerOptions) {
                        datepickerEl.attr(angular.extend({}, originalScope.$eval(attrs.datepickerOptions)));
                    }

                    var $setModelValue = $parse(attrs.ngModel).assign;

                    // Inner change
                    scope.dateSelection = function () {
                        $setModelValue(originalScope, scope.date);
                        if (closeOnDateSelection) {
                            setOpen(false);
                        }
                    };

                    // Outter change
                    scope.$watch(function () {
                        return ngModel.$modelValue;
                    }, function (value) {
                        if (angular.isString(value)) {
                            var date = parseDate(value);

                            if (value && !date) {
                                $setModelValue(originalScope, null);
                                throw new Error(value + ' cannot be parsed to a date object.');
                            } else {
                                value = date;
                            }
                        }
                        scope.date = value;
                        updatePosition();
                    });

                    function addWatchableAttribute(attribute, scopeProperty, datepickerAttribute) {
                        if (attribute) {
                            originalScope.$watch($parse(attribute), function (value) {
                                scope[scopeProperty] = value;
                            });
                            datepickerEl.attr(datepickerAttribute || scopeProperty, scopeProperty);
                        }
                    }

                    addWatchableAttribute(attrs.min, 'min');
                    addWatchableAttribute(attrs.max, 'max');
                    if(attrs.showToday) {
                        addWatchableAttribute(attrs.showToday, 'showToday', 'show-today');
                    } else {
                        scope.showToday = true;
                        datepickerEl.attr('show-today', 'showToday');
                    }
                    if (attrs.showWeeks) {
                        addWatchableAttribute(attrs.showWeeks, 'showWeeks', 'show-weeks');
                    } else {
                        scope.showWeeks = true;
                        datepickerEl.attr('show-weeks', 'showWeeks');
                    }
                    if (attrs.dateDisabled) {
                        datepickerEl.attr('date-disabled', attrs.dateDisabled);
                    }

                    function updatePosition() {
                        scope.position = $position.position(element);
                        scope.position.top = scope.position.top + element.prop('offsetHeight');
                    }

                    scope.$watch('isOpen', function (value) {
                        if (value) {
                            updatePosition();
                            $document.bind('keydown', documentKeyBind);
                            $document.bind('click', documentClickBind);
                            element.unbind('focus', elementFocusBind);
                            element.focus();
                        } else {
                            $document.unbind('click', documentClickBind);
                            element.bind('focus', elementFocusBind);
                        }

                        if (setIsOpen) {
                            setIsOpen(originalScope, value);
                        }
                    });

                    scope.today = function () {
                        $setModelValue(originalScope, new Date());
                    };
                    scope.clear = function () {
                        $setModelValue(originalScope, null);
                    };

                    element.after($compile(popupEl)(scope));
                }
            };
        }])

    .directive('datepickerPopWrap', [function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: "<ul class=\"dropdown-menu\" ng-style=\"{display: (isOpen && 'block') || 'none', top: position.top+'px', left: position.left+'px'}\" class=\"dropdown-menu\">\n" +
                "	<li ng-transclude></li>\n" +
                "</ul>",
            link: function (scope, element, attrs) {
                element.bind('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        };
    }]);
