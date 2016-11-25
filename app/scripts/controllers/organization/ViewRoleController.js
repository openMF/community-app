(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewRoleController: function (scope, routeParams, resourceFactory, route, $uibModal) {

            scope.permissions = [];
            scope.groupings = [];
            scope.formData = {};
            scope.checkboxesChanged = false; // this flag is informing backup-system if user started editing
            var bValuesOnly = []; // array for 1-0 values only from permission-checkboxes

            var tempPermissionUIData = [];
            resourceFactory.rolePermissionResource.get({roleId: routeParams.id}, function (data) {
                scope.role = data;
                scope.isDisabled = true;

                var currentGrouping = "";
                for (var i in data.permissionUsageData) {
                    if (data.permissionUsageData[i].grouping != currentGrouping) {
                        currentGrouping = data.permissionUsageData[i].grouping;
                        scope.groupings.push(currentGrouping);
                        var newEntry = { permissions: [] };
                        tempPermissionUIData[currentGrouping] = newEntry;
                    }
                    var temp = { code: data.permissionUsageData[i].code};
                    scope.formData[data.permissionUsageData[i].code] = data.permissionUsageData[i].selected;
                    tempPermissionUIData[currentGrouping].permissions.push(temp);
                }

                scope.backupCheckValues = function()
                {//backup -> save the data from formData before editing to boolean array
                    for(var i = 0; i< this.permissions.permissions.length; i++)
                    {
                        var temp = this.formData[this.permissions.permissions[i].code];
                        bValuesOnly.push(temp);
                    }
                    checkboxesChanged = true; // user started editing - set flag to true
                };

                scope.isRoleEnable = function(value) {
                    return value;
                };

                scope.editRoles = function () {
                    scope.isDisabled = false;
                };

                scope.disableRolesConfirmation = function () {
                    $uibModal.open({
                        templateUrl: 'disablerole.html',
                        controller: RoleDisableCtrl
                    });
                };

                var RoleDisableCtrl = function ($scope, $uibModalInstance) {
                    $scope.disableRoles = function () {
                        resourceFactory.roleResource.disableRoles({roleId: routeParams.id, command: 'disable'}, function (data) {
                            $uibModalInstance.close('disableRoles');
                            location.href = '#/admin/roles';
                        });
                    };
                    $scope.cancelDisableRole = function () {
                        $uibModalInstance.dismiss('cancelDisableRole');
                    };
                };

                scope.enableRolesConfirmation = function () {
                    $uibModal.open({
                        templateUrl: 'enablerole.html',
                        controller: RoleEnableCtrl
                    });
                };

                var RoleEnableCtrl = function ($scope, $uibModalInstance) {
                    $scope.enableRoles = function () {
                        resourceFactory.roleResource.enableRoles({roleId: routeParams.id, command: 'enable'}, function (data) {
                            $uibModalInstance.close('enableRoles');
                            location.href = '#/admin/roles';
                        });
                    };
                    $scope.cancelEnableRole = function () {
                        $uibModalInstance.dismiss('cancelEnableRole');
                    };
                };

                scope.deleteRolesConfirmation = function () {
                    $uibModal.open({
                        templateUrl: 'deleterole.html',
                        controller: RoleDeleteCtrl
                    });
                };

                var RoleDeleteCtrl = function ($scope, $uibModalInstance) {
                    $scope.deleteRoles = function () {
                        resourceFactory.roleResource.deleteRoles({roleId: routeParams.id}, function(data){
                            $uibModalInstance.close('deleteRoles');
                            location.href = '#/admin/roles';
                        });
                    };
                    $scope.cancelDeleteRole = function () {
                        $uibModalInstance.dismiss('cancelDeleteRole');
                    };
                };

                scope.cancel = function () {
                    route.reload();
                    scope.isDisabled = true;
                };


                scope.submit = function () {
                    var permissionData = {};
                    permissionData.permissions = this.formData;
                    resourceFactory.rolePermissionResource.update({roleId: routeParams.id}, permissionData, function (data) {
                        route.reload();
                        backupCheckValues();// reload current data in array (backup)
                        checkboxesChanged = false; // user finished editing - set flag to false
                        scope.isDisabled = true;

                    });

                };

                scope.showPermissions = function (grouping) {
                    if (scope.previousGrouping) {
                        tempPermissionUIData[scope.previousGrouping] = scope.permissions;
                    }
                    scope.permissions = tempPermissionUIData[grouping];
                    scope.previousGrouping = grouping;
                };
                //by default show special permissions
                scope.showPermissions('special');

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

                scope.selectAll = function(allSelected)
                {
                    var checkboxes = document.getElementsByName('cp');

                    if(allSelected == false)
                    {
                        for(var i in checkboxes)
                        {
                            checkboxes[i].checked = 1;
                        }
                        for(var i = 0; i< this.permissions.permissions.length; i++)
                        {
                            this.formData[this.permissions.permissions[i].code] = true;
                        }

                    }
                    else
                    {
                        for(var i in checkboxes)
                        {
                            checkboxes[i].checked = 0;
                        }
                        for(var i = 0; i< this.permissions.permissions.length; i++)
                        {
                            this.formData[this.permissions.permissions[i].code] = false;
                        }

                    }

                };
                scope.restoreCheckboxes = function()
                {
                    for(var i = 0; i < bValuesOnly.length;i++)
                    {
                        this.formData[this.permissions.permissions[i].code] = bValuesOnly[i];
                    }
                    for(var i = bValuesOnly.length; i > 0; i--)
                    {
                        bValuesOnly.pop(); // erase old elements in flag-array
                    }

                    checkboxesChanged = false; // user canceled editing - set flag to false
                };



            });
        }
    });
    mifosX.ng.application.controller('ViewRoleController', ['$scope', '$routeParams', 'ResourceFactory', '$route','$uibModal', mifosX.controllers.ViewRoleController]).run(function ($log) {
        $log.info("ViewRoleController initialized");
    });
}(mifosX.controllers || {}));