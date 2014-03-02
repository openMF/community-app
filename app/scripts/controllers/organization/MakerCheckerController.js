(function (module) {
    mifosX.controllers = _.extend(module, {
        MakerCheckerController: function (scope, route, resourceFactory) {

            scope.permissions = [];
            scope.groupings = [];
            scope.formData = {};
            scope.isDisabled = true;
            var tempPermissionUIData = [];

            resourceFactory.permissionResource.get({makerCheckerable: true}, function (data) {

                var currentGrouping = "";
                for (var i in data) {
                    if (data[i].grouping != currentGrouping) {
                        currentGrouping = data[i].grouping;
                        scope.groupings.push(currentGrouping);
                        var newEntry = { permissions: [] };
                        tempPermissionUIData[currentGrouping] = newEntry;
                    }
                    var temp = { code: data[i].code};
                    scope.formData[data[i].code] = data[i].selected;
                    tempPermissionUIData[currentGrouping].permissions.push(temp);
                }
                scope.showPermissions = function (grouping) {
                    if (scope.previousGrouping) {
                        tempPermissionUIData[scope.previousGrouping] = scope.permissions;
                    }
                    scope.permissions = tempPermissionUIData[grouping];
                    scope.previousGrouping = grouping;
                };
                //by default show portfolio setting
                scope.showPermissions('portfolio');

                scope.permissionName = function (name) {
                    name = name || "";
                    //replace '_' with ' '
                    name = name.replace(/_/g, " ");
                    //for reorts replace read with view
                    if (scope.previousGrouping == 'report') {
                        name = name.replace(/READ/g, "View");
                    }
                    return name;
                };

                scope.formatName = function (string) {
                    string = string || "";
                    if (string.indexOf('portfolio_') > -1) {
                        string = string.replace("portfolio_", "");
                    }
                    if (string.indexOf('transaction_') > -1) {
                        var temp = string.split("_");
                        string = temp[1] + " " + temp[0].charAt(0).toUpperCase() + temp[0].slice(1) + "s";
                    }
                    string = string.charAt(0).toUpperCase() + string.slice(1);
                    return string;
                };
            });

            scope.cancel = function () {
                scope.isDisabled = true;
            };

            scope.editMCTasks = function () {
                scope.isDisabled = false;
            };

            scope.submit = function () {
                var permissionData = {};
                permissionData.permissions = this.formData;
                resourceFactory.permissionResource.update({makerCheckerable: true}, permissionData, function (data) {
                    route.reload();
                    scope.isDisabled = true;
                });
            };
        }
    });
    mifosX.ng.application.controller('MakerCheckerController', ['$scope', '$route', 'ResourceFactory', mifosX.controllers.MakerCheckerController]).run(function ($log) {
        $log.info("MakerCheckerController initialized");
    });
}(mifosX.controllers || {}));
