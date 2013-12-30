(function(module) {
  mifosX.controllers = _.extend(module, {
    CollectionSheetController: function(scope, resourceFactory, location, routeParams, dateFilter, localStorageService, route, $timeout) {
        scope.offices = [];
        scope.centers = [];
        scope.groups = [];
        scope.clientsAttendance = [];
        scope.calendarId = '';
        scope.formData = {};
        scope.centerId = '';
        scope.groupId = '';
        scope.date = {};
        var centerOrGroupResource = '';
        resourceFactory.officeResource.getAllOffices(function(data) {
            scope.offices = data;
        });


        scope.officeSelected = function(officeId) {
            scope.officeId = officeId;
            if(officeId) {
                resourceFactory.employeeResource.getAllEmployees({loanOfficersOnly : 'true', officeId : officeId}, function(data) {
                    scope.loanOfficers = data;
                });
            } 
        };

        if (localStorageService.get('Success') == 'true') {
            scope.savesuccess = true;
            localStorageService.remove('Success');
            scope.val = true;
            $timeout(function() {
                  scope.val = false;
              }, 3000);  
              
        }

        scope.loanOfficerSelected = function(loanOfficerId) {
            if(loanOfficerId) {
                resourceFactory.centerResource.getAllCenters({officeId : scope.officeId, staffId : loanOfficerId, orderBy: 'name', sortOrder: 'ASC', limit: -1}, function(data) {
                    scope.centers = data;
                    if (data.length > 0) {
                        scope.centerMandatory = true;
                    }
                });
                
                resourceFactory.groupResource.getAllGroups({officeId : scope.officeId, staffId : loanOfficerId, orderBy: 'name', sortOrder: 'ASC', limit: -1}, function(data) {
                    scope.groups = data;
                    if (data.length > 0 && scope.centers.length < 0) {
                        scope.groupMandatory = true;
                    }
                });
            } else {
                scope.centers = '';
                scope.groups = '';
            }
        };

        scope.centerSelected = function(centerId) {
            if(centerId) {
                scope.collectionsheetdata = "";
                resourceFactory.centerResource.get({'centerId' : centerId, associations : 'groupMembers,collectionMeetingCalendar' }, function(data) {
                  scope.centerdetails = data;
                  if (data.groupMembers.length > 0) {
                      scope.groups = data.groupMembers;
                  }
                  
                  if (data.collectionMeetingCalendar && data.collectionMeetingCalendar.recentEligibleMeetingDate) {
                      scope.date.transactionDate = new Date(dateFilter(data.collectionMeetingCalendar.recentEligibleMeetingDate,scope.df));
                  }
                  if (data.collectionMeetingCalendar) {
                      scope.calendarId = data.collectionMeetingCalendar.id;
                  }
                  centerOrGroupResource = "centerResource";
                });
            }
        }; 

        scope.groupSelected = function(groupId) {
            if(groupId) {
                scope.collectionsheetdata = "";
                resourceFactory.groupResource.get({'groupId' : groupId, associations : 'collectionMeetingCalendar'}, function(data) {
                  scope.groupdetails = data.pageItems;
                  if (data.collectionMeetingCalendar) {
                      scope.calendarId = data.collectionMeetingCalendar.id;
                  }
                  if (data.collectionMeetingCalendar && data.collectionMeetingCalendar.recentEligibleMeetingDate) {
                      scope.date.transactionDate = new Date(dateFilter(data.collectionMeetingCalendar.recentEligibleMeetingDate,scope.df));
                  }
                  centerOrGroupResource = "groupResource";
                });
            } else if(scope.centerId){
                centerOrGroupResource = "centerResource"
            }
        };

        scope.previewCollectionSheet = function() {
            scope.formData = {};
          	scope.formData.dateFormat = "dd MMMM yyyy";
            scope.formData.locale = "en";
            scope.formData.calendarId = scope.calendarId;
            if (scope.date.transactionDate) {
                scope.formData.transactionDate = dateFilter(scope.date.transactionDate,scope.df);
            }
            if (centerOrGroupResource == "centerResource" && scope.calendarId !== "") {
                resourceFactory.centerResource.save({'centerId' : scope.centerId, command : 'generateCollectionSheet'}, scope.formData,function(data){
                    if (data.groups.length > 0) {
                        scope.collectionsheetdata = data;
                        scope.clientsAttendanceArray(data.groups);
                        scope.total(data);
                    } else {
                        scope.noData = true;
                        $timeout(function() {
                              scope.noData = false;
                          }, 3000); 
                    }
                    
                  });
          } else if (centerOrGroupResource == "groupResource" && scope.calendarId !== "") {
                resourceFactory.groupResource.save({'groupId' : scope.groupId, command : 'generateCollectionSheet'}, scope.formData,function(data){
                    if (data.groups.length > 0) {
                        scope.collectionsheetdata = data;
                        scope.clientsAttendanceArray(data.groups);
                        scope.total(data);
                    } else {
                        scope.noData = true;
                        $timeout(function() {
                              scope.noData = false;
                          }, 3000); 
                    }
                });
          } else {
              resourceFactory.groupResource.save({'groupId' : 0, command : 'generateCollectionSheet'}, scope.formData,function(data){
                  scope.collectionsheetdata = data;
              });
          }
        };

        //client transaction amount is update this method will update both individual/all groups
        //total for a specific product
        scope.bulkRepaymentTransactionAmountChange = function() {
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

                //getting unique currency symbol the below logic helps
                var loanProduct = data.loanProducts[i];
                if (scope.loanDueTotalCollections.length > 0) {
                    scope.loanDueTotalCollections = _.reject(scope.loanDueTotalCollections, 
                                                function (loanProductCurrency) 
                                                { 
                                                    return loanProductCurrency.currencySymbol === loanProduct.currency.displaySymbol; 
                                                });
                } 
                var tempLoanDueCollection = {
                    currencySymbol : loanProduct.currency.displaySymbol,
                    amount : 0
                }
                scope.loanDueTotalCollections.push(tempLoanDueCollection);
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

                        var ldt = scope.loanDueTotalCollections.length;
                        for (var m = 0; m < ldt; m++) {
                            var loanDueTotal = scope.loanDueTotalCollections[m];
                            if (loanDueTotal.currencySymbol === scope.loan.currency.displaySymbol) {
                                loanDueTotal.amount = Number(loanDueTotal.amount + Number(scope.loan.totalDue));
                                loanDueTotal.amount = Math.ceil(loanDueTotal.amount  * 100)/100;
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

        scope.submit = function() {  
          	scope.formData.calendarId = scope.calendarId;
            scope.formData.dateFormat = "dd MMMM yyyy";
            scope.formData.locale = "en";
            if (scope.date.transactionDate) {
                scope.formData.transactionDate = dateFilter(scope.date.transactionDate,scope.df);;
            }
            scope.formData.actualDisbursementDate = this.formData.transactionDate;
            scope.formData.clientsAttendance = scope.clientsAttendance;
            scope.formData.bulkDisbursementTransactions = [];
            scope.formData.bulkRepaymentTransactions = scope.bulkRepaymentTransactions;
            if (centerOrGroupResource == "centerResource") {
              resourceFactory.centerResource.save({'centerId' : scope.centerId, command : 'saveCollectionSheet'}, scope.formData,function(data){
                localStorageService.add('Success', true);
                route.reload();
              });
            } else if (centerOrGroupResource == "groupResource") {
              resourceFactory.groupResource.save({'groupId' : scope.groupId, command : 'saveCollectionSheet'}, scope.formData,function(data){
                localStorageService.add('Success', true);
                route.reload();
              });
          }
        };
        
    }
  });
  mifosX.ng.application.controller('CollectionSheetController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', 'localStorageService',
   '$route', '$timeout', mifosX.controllers.CollectionSheetController]).run(function($log) {
    $log.info("CollectionSheetController initialized");
  });
}(mifosX.controllers || {}));
