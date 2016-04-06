(function (module) {
    mifosX.directives = _.extend(module, {
        AuditLogsDirective: function ($compile) {
            return {
                restrict: 'EA',
                require: '?ngModel',
                controller: ['$scope', '$modal', 'ResourceFactory', '$routeParams', '$location', function(scope, $modal, resourceFactory, routeParams, location) {
                    scope.toggleAudit = false;
                    scope.isShowAuditLog = false;
                    scope.clientAuditLog = [];


                    scope.auditLog = function () {

                        scope.entityName = '';
                        scope.path = location.$$path;

                        if(scope.path.indexOf("viewclient") != -1){
                            scope.entityName = "CLIENT";
                        }else if(scope.path.indexOf("viewgroup") != -1){
                            scope.entityName = "GROUP";
                        }else if(scope.path.indexOf("viewcenter") != -1){
                            scope.entityName = "CENTER";
                        }else if(scope.path.indexOf("viewloanproduct") != -1){
                            scope.entityName = "LOANPRODUCT";
                        }

                        resourceFactory.runReportsResource.getReport({reportSource: 'enitityAuditLogs', R_enitityName: scope.entityName ,R_resourceId: routeParams.id }, function (data) {
                            scope.isShowAuditLog = true;
                            scope.dataLog = data.data;
                            for(var i in scope.dataLog){
                                if(scope.dataLog[i].row && scope.dataLog[i].row[0]){
                                    var dataobj = {};
                                    dataobj.id = scope.dataLog[i].row[0];
                                    dataobj.action = scope.dataLog[i].row[1];
                                    dataobj.changes = JSON.stringify(JSON.parse(scope.dataLog[i].row[2]));
                                    dataobj.updateDate = scope.dataLog[i].row[3];
                                    dataobj.updateBy = scope.dataLog[i].row[4];
                                    dataobj.approvedBy = scope.dataLog[i].row[5];
                                    scope.clientAuditLog.push(dataobj);
                                }
                            }

                        });
                    };

                    scope.showAudit = function(index)
                    {
                        $modal.open({
                            templateUrl: 'audit.html',
                            controller: ViewLoanChanges,
                            resolve :{
                                index : function () {
                                    return index;
                                },
                                clientAuditLog : function (){
                                    return scope.clientAuditLog;
                                }
                            }
                        });
                    };

                    var ViewLoanChanges = function($scope,$modalInstance,index,clientAuditLog){
                        $scope.chengeLogJson = clientAuditLog[index].changes;

                        $scope.cancelAudit = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    };
                }],
                link: function (scope, elm, attr, ctrl) {
                    var template =
                        '<script type="text/ng-template" id="audit.html">' +
                        '<div class="modal-header silver">' +
                        '<h3 class="bolder">{{"label.heading.audit" | translate}}</h3>' +
                    '</div>' +
                    '<div class="modal-body ">' +
                    '<api-validate></api-validate>' +
                    '{{chengeLogJson}}' +
                    '<br>' +
                    '<button class="btn btn-warning" ng-click="cancelAudit()">{{"label.button.cancel" | translate}}</button>' +
                    '</div>' +
                    '</script>'+

                    '<div type="button" class="btn btn-link" data-ng-click="auditLog()" ng-disabled="isShowAuditLog">  Audit Log </div>' +
                        '<div class="row" ng-show="isShowAuditLog">' +
                            '<table class="table table-striped">' +
                                '<thead>' +
                                '<tr>' +
                                    '<div class="col-md-2 col-sm-2"> <th> {{"label.heading.audit.action" | translate}} </th> </div>' +
                                    '<div class="col-md-2 col-sm-2"> <th> {{"label.heading.audit.updateDate"| translate}} </th> </div>' +
                                    '<div class="col-md-2 col-sm-2"> <th> {{"label.heading.audit.updateBy"| translate}} </th> </div>' +
                                    '<div class="col-md-2 col-sm-2"> <th> {{"label.heading.audit.approvedBy" | translate}} </th> </div>' +
                                    '<div class="col-md-2 col-sm-2"> <th> {{"label.heading.audit.changes" | translate}} </th> </div>' +
                                '</tr>' +
                                '</thead>' +
                                '<tbody>' +
                                '<tr ng-repeat="auditLog in clientAuditLog track by $index">' +
                                    '<div class="col-md-2 col-sm-2">' +
                                        '<td>  {{auditLog.action}} </td>' +
                                    '</div>' +
                                    '<div class="col-md-2 col-sm-2">' +
                                        '<td> {{auditLog.updateDate}} </td>' +
                                    '</div>' +
                                    '<div class="col-md-2 col-sm-2">' +
                                        '<td> {{auditLog.updateBy}} </td>' +
                                    '</div>' +
                                    '<div class="col-md-2 col-sm-2">' +
                                        '<td> {{auditLog.approvedBy}} </td>' +
                                    '</div>' +
                                    '<div class="col-md-2 col-sm-2">' +
                                        '<td> {{auditLog.changes | limitTo : 100}}...<button  class="btn btn-link" data-ng-click="showAudit($index)"><i class="icon-info-sign icon-small"></i></button ></td>' +
                                    '</div>' +

                                '</tr>' +
                                '</tbody>' +


                            '</table>' +

                        '</div>';


                    elm.html('').append($compile(template)(scope));
                }
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("auditLogs", ['$compile', mifosX.directives.AuditLogsDirective]).run(function ($log) {
    $log.info("AuditLogsDirective initialized");
});
