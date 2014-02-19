(function(module) {
  mifosX.controllers = _.extend(module, {
    ProductiveCollectionSheetController: function(scope, routeParams , resourceFactory, dateFilter, location) {
        var params = {};
        params.locale = "en";
        params.dateFormat = "dd MMMM yyyy";
        params.meetingDate = routeParams.meetingDate;
        params.officeId = routeParams.officeId;
        params.staffId = routeParams.staffId;
        var centerIdArray = [];
        scope.submitButtonShow = false;
        scope.completedCenter = false;
        scope.officeName = routeParams.officeName;
        scope.meetingDate = routeParams.meetingDate;
      
        resourceFactory.centerResource.getAllMeetingFallCenters(params, function (data) {
            scope.staffCenterData = data[0].meetingFallCenters;
            for (var i = 0; i < scope.staffCenterData.length; i++) {
                centerIdArray.push({id : scope.staffCenterData[i].id, calendarId : scope.staffCenterData[i].id});
            }
            scope.getAllGroupsByCenter(data[0].meetingFallCenters[0].id, data[0].meetingFallCenters[0].collectionMeetingCalendar.id);
        });

        scope.getAllGroupsByCenter = function (centerId, calendarId) {
            scope.submitButtonShow = false;
            scope.selectedTab = centerId;
            scope.centerId = centerId;
            scope.calendarId = calendarId;
            scope.formData = {};
            scope.formData.dateFormat = "dd MMMM yyyy";
            scope.formData.locale = "en";
            scope.formData.calendarId = scope.calendarId;
            scope.formData.transactionDate = routeParams.meetingDate;
            resourceFactory.centerResource.save({'centerId' : scope.centerId, command : 'generateCollectionSheet'}, scope.formData,function(data){
                scope.collectionsheetdata = data;
                scope.clientsAttendanceArray(data.groups);
                scope.total(data);
            });
        };

        scope.bulkRepaymentTransactionAmountChange = function () {
            scope.collectionData = scope.collectionsheetdata;
            scope.total(scope.collectionData);
        };

        scope.clientsAttendanceArray = function (groups) {
            var gl = groups.length;
            for (var i = 0; i < gl; i++) {
                scope.clients = groups[i].clients;
                var cl = scope.clients.length;
                for (var j = 0; j < cl; j++) {
                    scope.client = scope.clients[j];
                    if (scope.client.attendanceType.id === 0) {
                      scope.client.attendanceType.id = 1;
                    }
                }
            }
        };

        function deepCopy(obj) {
            if (Object.prototype.toString.call(obj) === '[object Array]') {
                 var out = [], i = 0, len = obj.length;
                 for ( ; i < len; i++ ) {
                     out[i] = arguments.callee(obj[i]);
                 }
                 return out;
            }
            if (typeof obj === 'object') {
                var out = {}, i;
                for ( i in obj ) {
                    out[i] = arguments.callee(obj[i]);
                }
                return out;
            }
            return obj;
        }

        scope.total = function (data) {
            scope.bulkRepaymentTransactions = [];
            scope.bulkDisbursementTransactions = [];
            scope.groupTotal = [];
            scope.loanProductArray = [];
            scope.loanDueTotalCollections = [];

            for (var i = 0; i < data.loanProducts.length; i++) {
                loanProductTemp = {
                  productId : data.loanProducts[i].id,
                  transactionAmount : 0,
                  disbursementAmount : 0
                }
                scope.loanProductArray.push(loanProductTemp);
            }

            scope.groupArray = scope.collectionsheetdata.groups;
            var gl = scope.groupArray.length;
            for (var i = 0; i < gl; i++) {
                var loanProductArrayDup = deepCopy(scope.loanProductArray);

                var temp = {};
                temp.groupId = scope.groupArray[i].groupId;

                scope.clientArray = scope.groupArray[i].clients;
                var cl = scope.clientArray.length;
                for (var j = 0; j < cl; j++) {
                    scope.loanArray = scope.clientArray[j].loans;
                    var ll = scope.loanArray.length;
                    for (var k = 0; k < ll; k++) {
                        scope.loan = scope.loanArray[k];
                        if (scope.loan.totalDue > 0) {
                            scope.bulkRepaymentTransactions.push({
                                loanId : scope.loan.loanId,
                                transactionAmount : scope.loan.totalDue
                            });
                        } 

                        for (var l = 0; l < loanProductArrayDup.length; l++) {
                            if (loanProductArrayDup[l].productId == scope.loan.productId) {
                              if (scope.loan.chargesDue) {
                                loanProductArrayDup[l].transactionAmount = Number(loanProductArrayDup[l].transactionAmount + Number(scope.loan.totalDue) + Number(scope.loan.chargesDue));
                                loanProductArrayDup[l].transactionAmount = Math.ceil(loanProductArrayDup[l].transactionAmount  * 100)/100;
                              } else {
                                  loanProductArrayDup[l].transactionAmount = Number(loanProductArrayDup[l].transactionAmount + Number(scope.loan.totalDue));
                              }
                            }
                        }
                     }
                }
                temp.loanProductArrayDup = loanProductArrayDup;
                scope.groupTotal.push(temp);
            }

            var loanProductArrayTotal =  deepCopy(scope.loanProductArray);
            for (var i = 0; i < scope.groupTotal.length; i++) {
                var groupProductTotal = scope.groupTotal[i];
                for (var j = 0; j < groupProductTotal.loanProductArrayDup.length; j++) {
                    var productObjectTotal = groupProductTotal.loanProductArrayDup[j];
                    for (var k = 0; k < loanProductArrayTotal.length; k++) {
                        var productArrayTotal = loanProductArrayTotal[k];
                        if (productObjectTotal.productId == productArrayTotal.productId) {
                            productArrayTotal.transactionAmount = productArrayTotal.transactionAmount + productObjectTotal.transactionAmount;
                            productArrayTotal.disbursementAmount = productArrayTotal.disbursementAmount + productObjectTotal.disbursementAmount;
                        }
                    }
                }
            }
            scope.grandTotal = loanProductArrayTotal;
        }

        scope.viewFullScreen = function () {
            var element = document.getElementById("productive_sheet");
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if(element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        };

        scope.submit = function() {  
            scope.formData.calendarId = scope.calendarId;
            scope.formData.dateFormat = "dd MMMM yyyy";
            scope.formData.locale = "en";
            scope.formData.transactionDate = dateFilter(routeParams.meetingDate,scope.df);
            scope.formData.clientsAttendance = scope.clientsAttendance;
            scope.formData.bulkDisbursementTransactions = [];
            scope.formData.bulkRepaymentTransactions = scope.bulkRepaymentTransactions;
            resourceFactory.centerResource.save({'centerId' : scope.centerId, command : 'saveCollectionSheet'}, scope.formData,function (data) {
                scope.tempId = scope.centerId;
                for (var i=0; i < centerIdArray.length; i++) {
                    if (scope.centerId == centerIdArray[i].id && i+1 <= centerIdArray.length-1) {
                        scope.selectedTab = centerIdArray[i+1];
                        scope.getAllGroupsByCenter(centerIdArray[i+1].id, centerIdArray[i+1].calendarId);
                        if (i+1 === centerIdArray.length-1) {
                            scope.submitButtonShow = true;
                        }
                        break;
                    }
                }
                if (scope.tempId === centerIdArray[centerIdArray.length-1].id) {
                    location.path('/entercollectionsheet');
                }
            });
        };
    }
  });
  mifosX.ng.application.controller('ProductiveCollectionSheetController', ['$scope', '$routeParams','ResourceFactory', 'dateFilter', '$location', mifosX.controllers.ProductiveCollectionSheetController]).run(function($log) {
    $log.info("ProductiveCollectionSheetController initialized");
  });
}(mifosX.controllers || {}));
