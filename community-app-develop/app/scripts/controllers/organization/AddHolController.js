(function (module) {
    mifosX.controllers = _.extend(module, {
        AddHolController: function (scope, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.holidays = [];
            scope.date = {};
            scope.date.first = new Date();
            scope.date.second = new Date();
            scope.date.third = new Date();
            var idToNodeMap = {};
            var holidayOfficeIdArray = [];

            scope.deepCopy = function (obj) {
                if (Object.prototype.toString.call(obj) === '[object Array]') {
                    var out = [], i = 0, len = obj.length;
                    for (; i < len; i++) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                if (typeof obj === 'object') {
                    var out = {}, i;
                    for (i in obj) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                return obj;
            }

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = scope.deepCopy(data);
                for (var i in data) {
                    data[i].children = [];
                    idToNodeMap[data[i].id] = data[i];
                }
                function sortByParentId(a, b) {
                    return a.parentId - b.parentId;
                }

                data.sort(sortByParentId);

                var root = [];
                for (var i = 0; i < data.length; i++) {
                    var currentObj = data[i];
                    if (currentObj.children) {
                        currentObj.collapsed = "true";
                    }
                    if (typeof currentObj.parentId === "undefined") {
                        root.push(currentObj);
                    } else {
                        parentNode = idToNodeMap[currentObj.parentId];
                        parentNode.children.push(currentObj);
                    }
                }
                scope.treedata = root;
            });

            scope.holidayApplyToOffice = function (node) {
                if (node.selectedCheckBox === 'true') {
                    recurHolidayApplyToOffice(node);
                    holidayOfficeIdArray = _.uniq(holidayOfficeIdArray);
                } else {
                    node.selectedCheckBox = 'false';
                    recurRemoveHolidayAppliedOOffice(node);

                }
            };

            function recurHolidayApplyToOffice(node) {
                node.selectedCheckBox = 'true';
                holidayOfficeIdArray.push(node.id);
                if (node.children.length > 0) {
                    for (var i = 0; i < node.children.length; i++) {
                        node.children[i].selectedCheckBox = 'true';
                        holidayOfficeIdArray.push(node.children[i].id);
                        if (node.children[i].children.length > 0) {
                            recurHolidayApplyToOffice(node.children[i]);
                        }
                    }
                }
            }

            function recurRemoveHolidayAppliedOOffice(node) {
                holidayOfficeIdArray = _.without(holidayOfficeIdArray, node.id);
                if (node.children.length > 0) {
                    for (var i = 0; i < node.children.length; i++) {
                        node.children[i].selectedCheckBox = 'false';
                        holidayOfficeIdArray = _.without(holidayOfficeIdArray, node.children[i].id);
                        if (node.children[i].children.length > 0) {
                            recurRemoveHolidayAppliedOOffice(node.children[i]);
                        }
                    }
                }
            }

            scope.minDat = new Date();
            scope.submit = function () {
                var reqFirstDate = dateFilter(scope.date.first, scope.df);
                var reqSecondDate = dateFilter(scope.date.second, scope.df);
                var reqThirdDate = dateFilter(scope.date.third, scope.df);
                var newholiday = new Object();
                newholiday.locale = scope.optlang.code;
                newholiday.dateFormat = scope.df;
                newholiday.name = this.formData.name;
                newholiday.fromDate = reqFirstDate;
                newholiday.toDate = reqSecondDate;
                newholiday.repaymentsRescheduledTo = reqThirdDate;
                newholiday.description = this.formData.description;
                newholiday.offices = [];
                for (var i in holidayOfficeIdArray) {
                    var temp = new Object();
                    temp.officeId = holidayOfficeIdArray[i];
                    newholiday.offices.push(temp);
                }
                resourceFactory.holValueResource.save(newholiday, function (data) {
                    location.path('/holidays');
                });
            };
        }
    });
    mifosX.ng.application.controller('AddHolController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.AddHolController]).run(function ($log) {
        $log.info("AddHolController initialized");
    });
}(mifosX.controllers || {}));

