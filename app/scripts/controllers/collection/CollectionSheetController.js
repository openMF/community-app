(function (module) {
    mifosX.controllers = _.extend(module, {
        CollectionSheetController: function (scope, resourceFactory, location, routeParams, dateFilter, $modal, localStorageService, route, $timeout) {
            scope.offices = [];
            scope.centers = [];
            scope.groups = [];
            scope.clientsAttendance = [];
            scope.calendarId = '';
            scope.formData = {};
            scope.centerId = '';
            scope.groupId = '';
			scope.collectionType = '0';
            scope.date = {};
            scope.newGroupTotal = {};
            scope.savingsGroupsTotal = [];
			scope.date.transactionDate = new Date();
            var centerOrGroupResource = '';
            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
            });

            scope.productiveCollectionSheet = function () {
                for (var i = 0; i < scope.offices.length; i++) {
                    if (scope.offices[i].id === scope.officeId) {
                        scope.officeName = scope.offices[i].name;
                    }
                }
                scope.meetingDate = dateFilter(scope.date.transactionDate, scope.df);
                location.path('/productivesheet/' + scope.officeId + '/' + scope.officeName + '/' + scope.meetingDate + '/' + scope.loanOfficerId);
            };

            scope.officeSelected = function (officeId) {
                scope.officeId = officeId;
                if (officeId) {
                    resourceFactory.employeeResource.getAllEmployees({officeId: officeId}, function (data) {
                        scope.loanOfficers = data;
                    });

                    resourceFactory.centerResource.getAllCenters({officeId: scope.officeId, orderBy: 'name', sortOrder: 'ASC', limit: -1}, function (data) {
                        scope.centers = data;
                    });

                    resourceFactory.groupResource.getAllGroups({officeId: scope.officeId, orderBy: 'name', sortOrder: 'ASC', limit: -1}, function (data) {
                        scope.groups = data;
                    });
                }
            };

            if (localStorageService.get('Success') === 'true') {
                scope.savesuccess = true;
                localStorageService.remove('Success');
                scope.val = true;
                $timeout(function () {
                    scope.val = false;
                }, 3000);

            }

            scope.loanOfficerSelected = function (loanOfficerId) {
                if (loanOfficerId) {
                    resourceFactory.centerResource.getAllCenters({officeId: scope.officeId, staffId: loanOfficerId, orderBy: 'name', sortOrder: 'ASC', limit: -1}, function (data) {
                        scope.centers = data;
                    });

                    resourceFactory.groupResource.getAllGroups({officeId: scope.officeId, staffId: loanOfficerId, orderBy: 'name', sortOrder: 'ASC', limit: -1}, function (data) {
                        scope.groups = data;
                    });
                } else {
                    scope.centers = '';
                    scope.groups = '';
                }
            };

            scope.centerSelected = function (centerId) {
                if (centerId) {
                    scope.collectionsheetdata = "";
                    resourceFactory.centerResource.get({'centerId': centerId, associations: 'groupMembers,collectionMeetingCalendar' }, function (data) {
                        scope.centerdetails = data;
                        if (data.groupMembers.length > 0) {
                            scope.groups = data.groupMembers;
                        }

                        if (data.collectionMeetingCalendar && data.collectionMeetingCalendar.recentEligibleMeetingDate) {
                            if (!scope.date.transactionDate) {
                                scope.date.transactionDate = new Date(dateFilter(data.collectionMeetingCalendar.recentEligibleMeetingDate, scope.df));
                            }
                        }
                        if (data.collectionMeetingCalendar) {
                            scope.calendarId = data.collectionMeetingCalendar.id;
                        }
                        centerOrGroupResource = "centerResource";
                    });
                }
            };

            scope.groupSelected = function (groupId) {
                if (groupId) {
                    scope.collectionsheetdata = "";
                    resourceFactory.groupResource.get({'groupId': groupId, associations: 'collectionMeetingCalendar'}, function (data) {
                        scope.groupdetails = data.pageItems;
                        if (data.collectionMeetingCalendar) {
                            scope.calendarId = data.collectionMeetingCalendar.id;
                        }
                        if (data.collectionMeetingCalendar && data.collectionMeetingCalendar.recentEligibleMeetingDate) {
                            if (!scope.date.transactionDate) {
                                scope.date.transactionDate = new Date(dateFilter(data.collectionMeetingCalendar.recentEligibleMeetingDate, scope.df));

                            }
                        }
                        centerOrGroupResource = "groupResource";
                    });
                } else if (scope.centerId) {
                    centerOrGroupResource = "centerResource";
                }
            };

            scope.previewCollectionSheet = function () {
                scope.formData = {};
                scope.formData.dateFormat = scope.df;
                scope.formData.locale = scope.optlang.code;
                scope.formData.calendarId = scope.calendarId;
                if (scope.date.transactionDate) {
                    scope.formData.transactionDate = dateFilter(scope.date.transactionDate, scope.df);
                }
                if (centerOrGroupResource === "centerResource" && scope.calendarId !== "") {
                    resourceFactory.centerResource.save({'centerId': scope.centerId, command: 'generateCollectionSheet'}, scope.formData, function (data) {
                        if (data.groups.length > 0) {
                            scope.collectionsheetdata = data;
                            scope.clientsAttendanceArray(data.groups);
                            //scope.total(data);
                            scope.savingsgroups = data.groups;
                            scope.sumTotalDueCollection();
                        } else {
                            scope.noData = true;
                            $timeout(function () {
                                scope.noData = false;
                            }, 3000);
                        }

                    });
                } else if (centerOrGroupResource === "groupResource" && scope.calendarId !== "") {
                    resourceFactory.groupResource.save({'groupId': scope.groupId, command: 'generateCollectionSheet'}, scope.formData, function (data) {
                        if (data.groups.length > 0) {
                            scope.collectionsheetdata = data;
                            scope.clientsAttendanceArray(data.groups);
                            //scope.total(data);
                            scope.savingsgroups = data.groups;
                            scope.sumTotalDueCollection();
                        } else {
                            scope.noData = true;
                            $timeout(function () {
                                scope.noData = false;
                            }, 3000);
                        }
                    });
                } else {
                    resourceFactory.groupResource.save({'groupId': 0, command: 'generateCollectionSheet'}, scope.formData, function (data) {
                        scope.collectionsheetdata = data;
                    });
                }
           };
			
			scope.collectionTypeSelected = function () {
				scope.sumTotalDueCollection();
			};
			
			scope.zeroCollectionSheet = function () {
                $modal.open({
                    templateUrl: 'zeroSheet.html',
                    controller: zeroSheetCtrl
                });
			};
			
            var zeroSheetCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
					_.each(scope.savingsgroups, function (group) {
						_.each(group.clients, function (client) {
							if (scope.collectionType != '1') {
								_.each(client.savings, function (saving) {
									saving.dueAmount = parseInt(0);
									saving.withdrawalAmount = parseInt(0);
								});
							}
							if (scope.collectionType != '2') {
								_.each(client.loans, function (loan) {
									loan.totalDue = parseInt(0);
									loan.chargesDue = parseInt(0);
								});
							}
						});
					});
					scope.sumTotalDueCollection();
					$modalInstance.close('unassign');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
			
            /**
             * Sum of loans and savings due for collection group by currency
             */
            scope.sumTotalDueCollection = function () {
                scope.totalDueCollection = [];
                scope.sumGroupDueCollection();
                scope.sumSavingsDueCollection();
                scope.sumLoansTotal();
                scope.sumLoansDueByCurrency();
                scope.sumSavingsDueByCurrency();
            };

            scope.sumLoansDueByCurrency = function () {
                if (scope.collectionType != '2') {
					_.each(scope.loansTotal, function (loan) {
						var existing = _.findWhere(scope.totalDueCollection, {currencyCode: loan.currencyCode});
						var dueAmount = loan.dueAmount;
						if (isNaN(dueAmount)) {
							dueAmount = parseInt(0);
						}
						if (existing === 'undefined' || !(_.isObject(existing))) {
							var gp = {
								currencyCode: loan.currencyCode,
								currencySymbol: loan.currencySymbol,
								dueAmount: dueAmount
							};
							scope.totalDueCollection.push(gp);
						} else {
							existing.dueAmount = Math.ceil((Number(existing.dueAmount) + Number(dueAmount)) * 100) / 100;
						}
					});
				}
            };

            scope.sumSavingsDueByCurrency = function () {
                if (scope.collectionType != '1') {
					_.each(scope.savingsTotal, function (saving) {
						var existing = _.findWhere(scope.totalDueCollection, {currencyCode: saving.currencyCode});
						var dueAmount = saving.totalDue;
						if (isNaN(dueAmount)) {
							dueAmount = parseInt(0);
						}
						if (existing === 'undefined' || !(_.isObject(existing))) {
							var gp = {
								currencyCode: saving.currencyCode,
								currencySymbol: saving.currencySymbol,
								dueAmount: dueAmount
							};
							scope.totalDueCollection.push(gp);
						} else {
							existing.dueAmount = Math.ceil((Number(existing.dueAmount) + Number(dueAmount)) * 100) / 100;
						}
					});
				}
            };

            /**
             * Sum of loan dues, Savings dues and Mandatory Savings withdrawals group by group and product
             */
            scope.sumGroupDueCollection = function () {
                scope.savingsGroupsTotal = [];
                scope.loanGroupsTotal = [];
                _.each(scope.savingsgroups, function (group) {
					_.each(group.clients, function (client) {
						if (scope.collectionType != '1') {
							_.each(client.savings, function (saving) {
								scope.sumGroupSavingsDueCollection(group, saving);
							});
						}
						if (scope.collectionType != '2') {
							_.each(client.loans, function (loan) {
								scope.sumGroupLoansDueCollection(group, loan);
							});
						}
					});
                });
            };

            /**
             * Sum of savings dues and withdrawals group by group id and savings product id
             * @param group
             * @param saving
             */
            scope.sumGroupSavingsDueCollection = function (group, saving) {
				var existing = _.findWhere(scope.savingsGroupsTotal, {groupId: group.groupId, productId: saving.productId});
				var dueAmount = saving.dueAmount;
				var withdrawalAmount = saving.withdrawalAmount;
				
				if (isNaN(dueAmount)) {
					dueAmount = parseInt(0);
				}
				if (isNaN(withdrawalAmount)) {
					withdrawalAmount = parseInt(0);
				}
				
				var totalDue = (dueAmount - withdrawalAmount);
				if (isNaN(totalDue)) {
					totalDue = parseInt(0);
				}
				if (existing === 'undefined' || !(_.isObject(existing))) {
					var gp = {
						groupId: group.groupId,
						productId: saving.productId,
						dueAmount: dueAmount,
						withdrawalAmount: withdrawalAmount,
						totalDue: totalDue,
						currencyCode: saving.currency.code,
						currencySymbol: saving.currency.displaySymbol
					};
					scope.savingsGroupsTotal.push(gp);
				} else {
					existing.dueAmount = Math.ceil((Number(existing.dueAmount) + Number(dueAmount)) * 100) / 100;
					existing.withdrawalAmount = Math.ceil((Number(existing.withdrawalAmount) + Number(withdrawalAmount)) * 100) / 100;
					existing.totalDue = Math.ceil((Number(existing.totalDue) + Number(totalDue)) * 100) / 100;
				}
            };

            /**
             * Sum of loans dues group by group id and loan product id
             * @param group
             * @param loan
             */
            scope.sumGroupLoansDueCollection = function (group, loan) {
				var existing = _.findWhere(scope.loanGroupsTotal, {groupId: group.groupId, productId: loan.productId});
				//alert(_.isObject(existing));
				var totalDue = scope.getLoanTotalDueAmount(loan);
				if (existing === 'undefined' || !(_.isObject(existing))) {
					var gp = {
						groupId: group.groupId,
						productId: loan.productId,
						dueAmount: totalDue,
						//chargesDue: loan['chargesDue'],
						currencyCode: loan.currency.code,
						currencySymbol: loan.currency.displaySymbol
					};
					scope.loanGroupsTotal.push(gp);
				} else {
					existing.dueAmount = Math.ceil((Number(existing.dueAmount) + Number(totalDue)) * 100) / 100;
				}
            };

            scope.getLoanTotalDueAmount = function(loan){
                var principalInterestDue = loan.totalDue;
                var chargesDue = loan.chargesDue;
                if (isNaN(principalInterestDue)) {
                    principalInterestDue = parseInt(0);
                }
                if (isNaN(chargesDue)) {
                    chargesDue = parseInt(0);
                }
                return Math.ceil((Number(principalInterestDue) + Number(chargesDue)) * 100) / 100;
            };
			
            /**
             * Sum of savings dues and  withdrawals across all groups group by savings product id
             */
            scope.sumSavingsDueCollection = function () {
                scope.savingsTotal = [];
				if (scope.collectionType != '1') {
					_.each(scope.savingsGroupsTotal, function (group) {
						var dueAmount = group.dueAmount;
						var withdrawalAmount = group.withdrawalAmount;
						
						if (isNaN(dueAmount)) {
							dueAmount = parseInt(0);
						}
						if (isNaN(withdrawalAmount)) {
							withdrawalAmount = parseInt(0);
						}
						var totalDue = (dueAmount - withdrawalAmount);
						if (isNaN(totalDue)) {
							totalDue = parseInt(0);
						}
						var existing = _.findWhere(scope.savingsTotal, {productId: group.productId});
						if (existing === 'undefined' || !(_.isObject(existing))) {
							var gp = {
								productId: group.productId,
								currencyCode: group.currencyCode,
								currencySymbol: group.currencySymbol,
								dueAmount: dueAmount,
								withdrawalAmount: withdrawalAmount,
								totalDue: totalDue
							};
							scope.savingsTotal.push(gp);
						} else {
							existing.dueAmount = Math.ceil((Number(existing.dueAmount) + Number(dueAmount)) * 100) / 100;
							existing.withdrawalAmount = Math.ceil((Number(existing.withdrawalAmount) + Number(withdrawalAmount)) * 100) / 100;
							existing.totalDue = Math.ceil((Number(existing.totalDue) + Number(existing.totalDue)) * 100) / 100;
						}
					});
				}
            };

            /**
             * Sum of loans dues across all groups group by loan product id
             */
            scope.sumLoansTotal = function () {
                scope.loansTotal = [];
				if (scope.collectionType != '2') {
					_.each(scope.loanGroupsTotal, function (group) {
						var dueAmount = group.dueAmount;
						if (isNaN(dueAmount)) {
							dueAmount = parseInt(0);
						}
						var existing = _.findWhere(scope.loansTotal, {productId: group.productId});
						if (existing === 'undefined' || !(_.isObject(existing))) {
							var gp = {
								productId: group.productId,
								currencyCode: group.currencyCode,
								currencySymbol: group.currencySymbol,
								dueAmount: dueAmount
							};
							scope.loansTotal.push(gp);
						} else {
							existing.dueAmount = Math.ceil((Number(existing.dueAmount) + Number(dueAmount)) * 100) / 100;
						}
					});
				}
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

            scope.constructBulkLoanAndSavingsRepaymentTransactions = function(){
                scope.bulkRepaymentTransactions = [];
                scope.bulkSavingsDueTransactions = [];
				scope.bulkSavingsWithdrawalTransactions = [];
                _.each(scope.savingsgroups, function (group) {
					_.each(group.clients, function (client) {
						if (scope.collectionType != '1') {
							_.each(client.savings, function (saving) {
								var dueAmount = saving.dueAmount;
								if (isNaN(dueAmount)) {
									dueAmount = parseInt(0);
								}
								var savingsTransaction = {
									savingsId:saving.savingsId,
									transactionAmount:dueAmount
								};
								if (dueAmount > 0) {
									scope.bulkSavingsDueTransactions.push(savingsTransaction);
								}
								var withdrawalAmount = saving.withdrawalAmount;
								if (isNaN(withdrawalAmount)) {
									withdrawalAmount = parseInt(0);
								}
								var savingsWithdrawalTransaction = {
									savingsId:saving.savingsId,
									transactionAmount:withdrawalAmount
								};
								if (withdrawalAmount > 0) {
									scope.bulkSavingsWithdrawalTransactions.push(savingsWithdrawalTransaction);
								}
							});
						}
						if (scope.collectionType != '2') {
							_.each(client.loans, function (loan) {
								var totalDue = scope.getLoanTotalDueAmount(loan);
								var loanTransaction = {
									loanId:loan.loanId,
									transactionAmount:totalDue
								};
								if (totalDue > 0) {
									scope.bulkRepaymentTransactions.push(loanTransaction);
								}
							});
						}
					});
                });
            };
			
			scope.submit = function () {
                $modal.open({
                    templateUrl: 'saveSheet.html',
                    controller: saveSheetCtrl
                });
			};
			
			scope.saveSheet = function () {
				scope.formData.calendarId = scope.calendarId;
				scope.formData.dateFormat = scope.df;
				scope.formData.locale = scope.optlang.code;

				if (scope.date.transactionDate) {
					scope.formData.transactionDate = dateFilter(scope.date.transactionDate, scope.df);
				}
				scope.formData.actualDisbursementDate = this.formData.transactionDate;
				scope.formData.clientsAttendance = scope.clientsAttendance;
				scope.formData.bulkDisbursementTransactions = [];
				//construct loan repayment and savings due transactions
				scope.constructBulkLoanAndSavingsRepaymentTransactions();
				scope.formData.bulkRepaymentTransactions = scope.bulkRepaymentTransactions;
				scope.formData.bulkSavingsDueTransactions = scope.bulkSavingsDueTransactions;
				scope.formData.bulkSavingsWithdrawalTransactions = scope.bulkSavingsWithdrawalTransactions;
				if (centerOrGroupResource === "centerResource") {
					resourceFactory.centerResource.save({'centerId': scope.centerId, command: 'saveCollectionSheet'}, scope.formData, function (data) {
						localStorageService.add('Success', true);
						route.reload();
					});
				} else if (centerOrGroupResource === "groupResource") {
					resourceFactory.groupResource.save({'groupId': scope.groupId, command: 'saveCollectionSheet'}, scope.formData, function (data) {
						localStorageService.add('Success', true);
						route.reload();
					});
				}
			}

            var saveSheetCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
					scope.saveSheet();
					$modalInstance.close('unassign');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('CollectionSheetController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', '$modal', 'localStorageService',
            '$route', '$timeout', mifosX.controllers.CollectionSheetController]).run(function ($log) {
            $log.info("CollectionSheetController initialized");
        });
}(mifosX.controllers || {}));