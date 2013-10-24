(function(module) {
  mifosX.controllers = _.extend(module, {
    NavigationController: function(scope, resourceFactory) {

        scope.offices = [];
        scope.isCollapsed = false;
        scope.officerCollapsed = true;
        scope.groupCollapsed = true;
        scope.centerCollapsed = true;
        scope.clientCollapsed = true;
        resourceFactory.officeResource.get({officeId: 1} , function(data) {
            scope.office = data;
            scope.officeName = data.name;
        });
        resourceFactory.officeResource.getAllOffices(function(data){
          scope.offices = data;
        });

        scope.collapseOthers = function(){
            scope.isCollapsed = !scope.isCollapsed;
            if(scope.isCollapsed==false){
            scope.officerCollapsed = true;
            scope.groupCollapsed = true;
            scope.centerCollapsed = true;
            scope.clientCollapsed = true;
            }
        };
        scope.collapseOfficerOthers = function(){
            scope.officerCollapsed = !scope.officerCollapsed;
            if(scope.officerCollapsed==false){
                scope.isCollapsed = true;
                scope.groupCollapsed = true;
                scope.centerCollapsed = true;
                scope.clientCollapsed = true;
            }
        };
        scope.collapseCenterOthers = function(){
            scope.centerCollapsed = !scope.centerCollapsed;
            if(scope.centerCollapsed==false){
                scope.isCollapsed = true;
                scope.groupCollapsed = true;
                scope.officerCollapsed = true;
                scope.clientCollapsed = true;
            }
        };
        scope.collapseGroupOthers = function(){
            scope.groupCollapsed = !scope.groupCollapsed;
            if(scope.groupCollapsed==false){
                scope.isCollapsed = true;
                scope.centerCollapsed = true;
                scope.officerCollapsed = true;
                scope.clientCollapsed = true;
            }
        };
        scope.collapseClientOthers = function(){
            scope.clientCollapsed = !scope.clientCollapsed;
            if(scope.clientCollapsed==false){
                scope.isCollapsed = true;
                scope.groupCollapsed = true;
                scope.officerCollapsed = true;
                scope.centerCollapsed = true;
            }
        };

        scope.officeSelected= function(officeId,office) {
            scope.officeName = office;
            scope.selectedOffice = officeId;
            scope.staffs = '';
            scope.staff = '';
            scope.group = '';
            scope.center = '';
            scope.client = '';
            scope.groupsOrCenters = '';
            scope.isCollapsed = true;
            scope.officerCollapsed = false;
            scope.centerCollapsed = true;
            scope.clientCollapsed = true;
            scope.groupCollapsed = true;
            resourceFactory.officeResource.get({officeId: officeId} , function(data) {
                scope.office = data;
            });
          resourceFactory.employeeResource.getAllEmployees({'officeId' : officeId}, function(data){
            scope.staffs = data;
          });
            scope.loanOfficer = '';
            scope.centerName = '';
            scope.groupName = '';
            scope.clientName = '';
        };

        scope.staffSelected= function(staffId,staffName) {
            scope.isCollapsed = true;
            scope.officerCollapsed = true;
            scope.centerCollapsed = false;
            scope.clientCollapsed = true;
            scope.groupCollapsed = true;
            resourceFactory.employeeResource.get({staffId: staffId} , function(data) {
                scope.staff = data;
            });
            scope.office = '';
            scope.group = '';
            scope.client = ''
            scope.center = '';
            scope.loanOfficer = staffName;
            scope.selectedStaff = staffId;
            resourceFactory.runReportsResource.get({reportSource : 'GroupNamesByStaff', 'R_staffId' : staffId, genericResultSet : 'false'}, function(data){
              scope.centers = data;
            });
            scope.centerName = '';
            scope.groupName = '';
            scope.clientName = '';
        };
        scope.centerSelected= function(centerId,centerName) {
            scope.centerName = centerName;
            scope.isCollapsed = true;
            scope.officerCollapsed = true;
            scope.centerCollapsed = true;
            scope.clientCollapsed = true;
            scope.groupCollapsed = false;
            resourceFactory.centerResource.get({centerId: centerId,associations:'groupMembers'} , function(data) {
                scope.groups = data.groupMembers;
                scope.center = data;
            });
            scope.office = '';
            scope.staff = '';
            scope.client = '';
            scope.group='';
            scope.groupName = '';
            scope.clientName = '';
        };
        scope.groupSelected= function(groupId,groupName) {
            scope.groupName = groupName;
            scope.isCollapsed = true;
            scope.officerCollapsed = true;
            scope.centerCollapsed = true;
            scope.clientCollapsed = false;
            scope.groupCollapsed = true;
            resourceFactory.groupResource.get({groupId: groupId,associations:'all'} , function(data) {
                scope.group = data;
                scope.clients = data.clientMembers;
            });
            scope.office = '';
            scope.staff = '';
            scope.center = '';
            scope.client = '';
            scope.clientName = '';
        };
        scope.clientSelected= function(clientId,clientName) {
            scope.clientName = clientName;
            scope.isCollapsed = true;
            scope.officerCollapsed = true;
            scope.centerCollapsed = true;
            scope.clientCollapsed = false;
            scope.groupCollapsed = true;
            resourceFactory.clientResource.get({clientId: clientId} , function(data) {
                scope.client = data;
            });
            scope.office = '';
            scope.staff = '';
            scope.center = '';
            scope.group = '';
        };

     }
  });
  mifosX.ng.application.controller('NavigationController', ['$scope', 'ResourceFactory', mifosX.controllers.NavigationController]).run(function($log) {
    $log.info("NavigationController initialized");
  });
}(mifosX.controllers || {}));
