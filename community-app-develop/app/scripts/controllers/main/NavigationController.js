(function (module) {
    mifosX.controllers = _.extend(module, {
        NavigationController: function (scope, resourceFactory) {

            scope.offices = [];
            scope.isCollapsed = false;
            scope.officerCollapsed = true;
            scope.groupCollapsed = true;
            scope.centerCollapsed = true;
            scope.clientCollapsed = true;
            resourceFactory.officeResource.get({officeId: 0}, function (data) {
                scope.office = data;
                scope.officeName = data.name;
            });
            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
            });

            scope.collapseOthers = function () {
                scope.filterText = '';
                scope.isCollapsed = !scope.isCollapsed;
                if (scope.isCollapsed == false) {
                    scope.officerCollapsed = true;
                    scope.groupCollapsed = true;
                    scope.centerCollapsed = true;
                    scope.clientCollapsed = true;
                }
            };
            scope.collapseOfficerOthers = function () {
                scope.filterText = '';
                scope.officerCollapsed = !scope.officerCollapsed;
                if (scope.officerCollapsed == false) {
                    scope.isCollapsed = true;
                    scope.groupCollapsed = true;
                    scope.centerCollapsed = true;
                    scope.clientCollapsed = true;
                }
            };
            scope.collapseCenterOthers = function () {
                scope.filterText = '';
                scope.centerCollapsed = !scope.centerCollapsed;
                if (scope.centerCollapsed == false) {
                    scope.isCollapsed = true;
                    scope.groupCollapsed = true;
                    scope.officerCollapsed = true;
                    scope.clientCollapsed = true;
                }
            };
            scope.collapseGroupOthers = function () {
                scope.filterText = '';
                scope.groupCollapsed = !scope.groupCollapsed;
                if (scope.groupCollapsed == false) {
                    scope.isCollapsed = true;
                    scope.centerCollapsed = true;
                    scope.officerCollapsed = true;
                    scope.clientCollapsed = true;
                }
            };
            scope.collapseClientOthers = function () {
                scope.filterText = '';
                scope.clientCollapsed = !scope.clientCollapsed;
                if (scope.clientCollapsed == false) {
                    scope.isCollapsed = true;
                    scope.groupCollapsed = true;
                    scope.officerCollapsed = true;
                    scope.centerCollapsed = true;
                }
            };

            scope.officeSelected = function (officeId, office) {
                scope.officeName = office;
                scope.selectedOffice = officeId;
                scope.filterText = '';
                scope.staffs = '';
                scope.staff = '';
                scope.group = '';
                scope.center = '';
                scope.client = '';
                scope.centers = '';
                scope.clients = '';
                scope.groups = '';
                scope.groupsOrCenters = '';
                scope.isCollapsed = true;
                scope.officerCollapsed = false;
                scope.centerCollapsed = true;
                scope.clientCollapsed = true;
                scope.groupCollapsed = true;
                scope.loanOfficer = '';
                scope.centerName = '';
                scope.groupName = '';
                scope.clientName = '';
                if (scope.staff == '' && scope.group == '' && scope.center == '' && scope.client == '') {
                    resourceFactory.officeResource.get({officeId: officeId}, function (data) {
                        scope.office = data;
                    });
                    resourceFactory.employeeResource.getAllEmployees({'officeId': officeId}, function (data) {
                        scope.staffs = data;
                    });
                }
            };

            scope.staffSelected = function (staffId, staffName) {
                scope.office = '';
                scope.group = '';
                scope.client = '';
                scope.filterText = '';
                scope.center = '';
                scope.centerName = '';
                scope.groupName = '';
                scope.clientName = '';
                scope.isCollapsed = true;
                scope.officerCollapsed = true;
                scope.centerCollapsed = false;
                scope.clientCollapsed = true;
                scope.groupCollapsed = true;
                scope.clients = '';
                scope.groups = '';
                if (scope.office == '' && scope.group == '' && scope.center == '' && scope.client == '') {
                    resourceFactory.employeeResource.get({staffId: staffId}, function (data) {
                        scope.staff = data;
                    });
                    scope.loanOfficer = staffName;
                    scope.selectedStaff = staffId;
                    resourceFactory.runReportsResource.get({reportSource: 'GroupNamesByStaff', 'R_staffId': staffId, genericResultSet: 'false'}, function (data) {
                        scope.centers = data;
                    });
                }
            };
            scope.centerSelected = function (centerId, centerName) {
                scope.office = '';
                scope.staff = '';
                scope.client = '';
                scope.group = '';
                scope.filterText = '';
                scope.groupName = '';
                scope.clientName = '';
                scope.clients = '';
                scope.centerName = centerName;
                scope.isCollapsed = true;
                scope.officerCollapsed = true;
                scope.centerCollapsed = true;
                scope.clientCollapsed = true;
                scope.groupCollapsed = false;
                if (scope.office == '' && scope.group == '' && scope.staff == '' && scope.client == '') {
                    resourceFactory.centerResource.get({centerId: centerId, associations: 'groupMembers'}, function (data) {
                        scope.groups = data.groupMembers;
                        scope.center = data;
                    });
                    resourceFactory.centerAccountResource.get({centerId: centerId}, function (data) {
                        scope.centerAccounts = data;
                    });
                    resourceFactory.runReportsResource.get({reportSource: 'GroupSummaryCounts', genericResultSet: 'false', R_groupId: centerId}, function (data) {
                        scope.summary = data[0];
                    });
                }
            };
            scope.groupSelected = function (groupId, groupName) {
                scope.office = '';
                scope.filterText = '';
                scope.staff = '';
                scope.center = '';
                scope.client = '';
                scope.clientName = '';
                scope.groupName = groupName;
                scope.isCollapsed = true;
                scope.officerCollapsed = true;
                scope.centerCollapsed = true;
                scope.clientCollapsed = false;
                scope.groupCollapsed = true;
                if (scope.office == '' && scope.center == '' && scope.staff == '' && scope.client == '') {
                    resourceFactory.groupResource.get({groupId: groupId, associations: 'all'}, function (data) {
                        scope.group = data;
                        scope.clients = data.clientMembers;
                    });
                    resourceFactory.groupAccountResource.get({groupId: groupId}, function (data) {
                        scope.groupAccounts = data;
                    });
                }
            };
            scope.clientSelected = function (clientId, clientName) {
                scope.office = '';
                scope.filterText = '';
                scope.staff = '';
                scope.center = '';
                scope.group = '';
                scope.clientName = clientName;
                scope.isCollapsed = true;
                scope.officerCollapsed = true;
                scope.centerCollapsed = true;
                scope.clientCollapsed = false;
                scope.groupCollapsed = true;
                if (scope.office == '' && scope.center == '' && scope.staff == '' && scope.group == '') {
                    resourceFactory.clientResource.get({clientId: clientId}, function (data) {
                        scope.client = data;
                    });
                    resourceFactory.clientAccountResource.get({clientId: clientId}, function (data) {
                        scope.clientAccounts = data;
                    });
                }
            };
        }
    });
    mifosX.ng.application.controller('NavigationController', ['$scope', 'ResourceFactory', mifosX.controllers.NavigationController]).run(function ($log) {
        $log.info("NavigationController initialized");
    });
}(mifosX.controllers || {}));
