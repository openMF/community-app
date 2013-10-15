(function(module) {
  mifosX.controllers = _.extend(module, {
    EnterCollectionSheetController: function(scope, resourceFactory, location, routeParams) {
        scope.offices = [];
        scope.centers = [];
        scope.groups = [];
        scope.bulkRepaymentTransactions = [];
        scope.bulkDisbursementTransactions = [];
        scope.clientsAttendance = [];
        scope.calendarId = '';
        scope.formData = {};
        scope.centerId = '';
        scope.groupId = '';
        var centerOrGroupResource = '';
        scope.formData.transactionDate = "20 September 2013";
        resourceFactory.officeResource.getAllOffices(function(data) {
            scope.offices = data;
        });
        
        scope.officeSelected = function(officeId) {
          if(officeId) {
            resourceFactory.centerResource.get({'officeId' : officeId}, function(data) {
              scope.centers = data.pageItems;
            });
            resourceFactory.groupResource.get({officeId : officeId}, function(data) {
              scope.groups = data.pageItems;
            });
          } else {
            scope.centers = '';
            scope.groups = '';
          }
        }

        scope.centerSelected = function(centerId) {
          if(centerId) {
            resourceFactory.centerResource.get({'centerId' : centerId, associations : 'groupMembers,collectionMeetingCalendar' }, function(data) {
              scope.centerdetails = data;
              scope.groups = data.groupMembers;
              if (data.collectionMeetingCalendar)
              scope.calendarId = data.collectionMeetingCalendar.id;
              centerOrGroupResource = "centerResource";
            });
          }
        } 

        scope.groupSelected = function(groupId) {
          if(groupId) {
            resourceFactory.groupResource.get({'groupId' : groupId, associations : 'collectionMeetingCalendar'}, function(data) {
              scope.groupdetails = data.pageItems;
              scope.calendarId = data.collectionMeetingCalendar.id;
              centerOrGroupResource = "groupResource";
            });
          } else if(scope.centerId){
            centerOrGroupResource = "centerResource"
          }
        }

        scope.previewCollectionSheet = function() {
          scope.formData.dateFormat = "dd MMMM yyyy";
          scope.formData.locale = "en";
          scope.formData.calendarId = scope.calendarId;
          scope.bulkRepaymentTransactions = [];
          scope.bulkDisbursementTransactions = [];
          scope.clientsAttendance = [];
          scope.formData.transactionDate = this.formData.transactionDate;
          if (centerOrGroupResource == "centerResource") {
            resourceFactory.centerResource.save({'centerId' : scope.centerId, command : 'generateCollectionSheet'}, scope.formData,function(data){
              scope.collectionsheetdata = data;
              scope.bulkRepaymentTransaction(data);
              scope.bulkDisbursementTransaction(data);
              scope.clientsAttendanceSelected(data);
              scope.groupTotalArray(data);
            });
          } else if (centerOrGroupResource == "groupResource") {
              resourceFactory.groupResource.save({'groupId' : scope.groupId, command : 'generateCollectionSheet'}, scope.formData,function(data){
                scope.collectionsheetdata = data;
                scope.bulkRepaymentTransaction(data);
                scope.bulkDisbursementTransaction(data);
                scope.clientsAttendanceSelected(data);
                scope.groupTotalArray(data);
              });
          } else {
            scope.formData.transactionDate = "";
            resourceFactory.groupResource.save({'groupId' : 0, command : 'generateCollectionSheet'}, scope.formData,function(data){
              scope.collectionsheetdata = data;
            });
          }

        }

        scope.bulkRepaymentTransaction = function(data) {
          var checkEqualOrNot = 'false';
          _.each(data.groups, function(groupData) {
            _.each(groupData.clients, function(clientData) {
               _.each(clientData.loans, function(loanData) {
                if (loanData.totalDue != 0) {
                  var  temp = {
                    clientId : clientData.clientId,
                    productId : loanData.productId,
                    loanId : loanData.loanId,
                    transactionAmount : loanData.totalDue
                  }

                  _.each(scope.bulkRepaymentTransactions, function(bulkRepay) {
                    if(_.isEqual(bulkRepay,temp)) {
                      checkEqualOrNot = 'true';
                    }
                  });
                  if (checkEqualOrNot == 'false') {
                    scope.bulkRepaymentTransactions.push(temp);
                  }
                }
              });
            });
          });
        }

        //client transaction amount is update this method will update both individual/all groups
        //total for a specific product
        scope.bulkRepaymentTransactionAmountChange = function(bulkRepaymentTransaction) {
          if(bulkRepaymentTransaction.transactionAmount) {
            _.each(scope.collectionSheetData.groups, function(groupData) {
              _.each(groupData.clients, function(clientData) {
                if (bulkRepaymentTransaction.clientId == clientData.clientId) {
                   _.each(clientData.loans, function(clientLoan) {
                      if (bulkRepaymentTransaction.loanId == clientLoan.loanId) {
                        clientLoan.totalDue = bulkRepaymentTransaction.transactionAmount;
                      }
                   });
                }
              });
            });
            scope.groupTotalArray(scope.collectionSheetData);
          }
        }

        //client disburse amount is update this method will update both individual/all groups
        //total for a specific product
        scope.bulkDisbursementAmountChange = function(bulkDisbursementTransaction) {
          if(bulkDisbursementTransaction.transactionAmount) {
            _.each(scope.collectionSheetData.groups, function(groupData) {
              _.each(groupData.clients, function(clientData) {
                if (bulkDisbursementTransaction.clientId == clientData.clientId) {
                   _.each(clientData.loans, function(clientLoan) {
                      if (bulkDisbursementTransaction.loanId == clientLoan.loanId && clientLoan.disbursementAmount) {
                        clientLoan.disbursementAmount = bulkDisbursementTransaction.transactionAmount;
                      }
                   });
                }
              });
            });
            scope.groupTotalArray(scope.collectionSheetData);
          }
        }

        scope.clientsAttendanceSelected = function(data) {
          var checkEqualOrNot = 'false';      
           _.each(data.groups, function(groupData) {
            _.each(groupData.clients, function(clientData) {
              if (clientData.attendanceType) {
                var  temp = {
                    clientId : clientData.clientId,
                    attendanceType : 1
                  }

                _.each(scope.clientsAttendance, function(attendance) {
                  if(_.isEqual(attendance,temp)) {
                    checkEqualOrNot = 'true';
                  }
                });

                if (checkEqualOrNot == 'false') {
                  scope.clientsAttendance.push(temp);
                }
              }
            });
          });
        }

        scope.bulkDisbursementTransaction = function(data) {
          var checkEqualOrNot = 'false';
          _.each(data.groups, function(groupData) {
            _.each(groupData.clients, function(clientData) {
               _.each(clientData.loans, function(loanData) {
                if (loanData.disbursementAmount) {
                  var  temp = {
                    clientId : clientData.clientId,
                    productId : loanData.productId,
                    loanId : loanData.loanId,
                    transactionAmount : loanData.disbursementAmount
                  }
                  _.each(scope.bulkDisbursementTransactions, function(bulkRepay) {
                    if(_.isEqual(bulkRepay,temp)) {
                      checkEqualOrNot = 'true';
                    }
                  });
                  if (checkEqualOrNot == 'false') {
                    scope.bulkDisbursementTransactions.push(temp);
                  }
                }
              });
            });
          });
        }


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
        //this method calculates both individual/all group total for a specific product
        scope.groupTotalArray = function(data) {
          var groupTotal = [];
          var loanProductTemp = {};
          scope.groupTotal = [];
          scope.collectionSheetData = data;
          scope.loanProductArray = [];
          _.each(data.loanProducts, function(loanProduct) {
            loanProductTemp = {
              productId : loanProduct.id,
              displaySymbol : loanProduct.currency.displaySymbol,
              transactionAmount : 0,
              disbursementAmount : 0
            }
            scope.loanProductArray.push(loanProductTemp);
          });
          
          _.each(data.groups, function(groupData) {
            var loanProductArrayDup = deepCopy(scope.loanProductArray);
            var temp = {};
            temp.groupId = groupData.groupId;
            _.each(groupData.clients, function(clientData) {
               _.each(clientData.loans, function(clientLoan) {
                  _.each(loanProductArrayDup, function(loanProduct) {
                    if (loanProduct.productId == clientLoan.productId) {
                      if (clientLoan.disbursementAmount) {
                        loanProduct.disbursementAmount = Number(loanProduct.disbursementAmount + clientLoan.disbursementAmount);
                      } else {
                        loanProduct.transactionAmount = Number(loanProduct.transactionAmount + clientLoan.totalDue);
                      }
                    }
                  });
               });
            });
            temp.loanProductArrayDup = loanProductArrayDup;
            scope.groupTotal.push(temp);
          });

          var loanProductArrayTotal =  deepCopy(scope.loanProductArray);
          _.each(scope.groupTotal, function(groupProductTotal) {
            _.each(groupProductTotal.loanProductArrayDup, function(productObjectTotal) {
              _.each(loanProductArrayTotal, function(productArrayTotal) {
                if (productObjectTotal.productId == productArrayTotal.productId) {
                  productArrayTotal.transactionAmount = productArrayTotal.transactionAmount + productObjectTotal.transactionAmount;
                  productArrayTotal.disbursementAmount = productArrayTotal.disbursementAmount + productObjectTotal.disbursementAmount;
                }
              });
            });
          });
          scope.grandTotal = loanProductArrayTotal;
        }

        scope.submit = function() {  
          scope.formData.calendarId = scope.calendarId;
          scope.formData.dateFormat = "dd MMMM yyyy";
          scope.formData.locale = "en";
          scope.formData.transactionDate = this.formData.transactionDate;
          scope.formData.actualDisbursementDate = this.formData.transactionDate;
          scope.formData.clientsAttendance = scope.clientsAttendance;
          scope.formData.bulkDisbursementTransactions = scope.bulkDisbursementTransactions;
          scope.formData.bulkRepaymentTransactions = scope.bulkRepaymentTransactions;
          if (centerOrGroupResource == "centerResource") {
            resourceFactory.centerResource.save({'centerId' : scope.centerId, command : 'saveCollectionSheet'}, scope.formData,function(data){
              location.path('/home/');
            });
          } else if (centerOrGroupResource == "groupResource") {
            resourceFactory.groupResource.save({'groupId' : scope.groupId, command : 'saveCollectionSheet'}, scope.formData,function(data){
              location.path('#/home/');
            });
          } 
        };
    }
  });
  mifosX.ng.application.controller('EnterCollectionSheetController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.EnterCollectionSheetController]).run(function($log) {
    $log.info("EnterCollectionSheetController initialized");
  });
}(mifosX.controllers || {}));
