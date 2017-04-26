(function (module) {
    mifosX.controllers = _.extend(module, {
        AdjustRepaymentSchedule: function (scope, routeParams, resourceFactory, location, route, http, $uibModal, dateFilter, API_VERSION, $sce, $rootScope) {
            scope.formData = {};
            scope.enablePrincipal = false ;
            scope.enableInstallment = false ;
            scope.newinstallments = [] ;
            scope.deletedinstallments = [] ;
            scope.modifiedinstallments = [] ;
            scope.days = [] ;
            scope.months = [] ;
            var i = 0 ;
            //load days in this days array
            for(i = 0 ; i < 31; i++) {
                scope.days.push(i+1) ;
            }
            //load months in this months array
            for(i = 0 ; i < 12; i++) {
                scope.months.push(i+1) ;
            }
            loadData() ;

            function loadData() {
                scope.newinstallments.splice(0, scope.newinstallments.length) ;
                scope.deletedinstallments.splice(0, scope.deletedinstallments.length) ;
                scope.modifiedinstallments.splice(0, scope.modifiedinstallments.length) ;
                resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.accountId, associations: 'repaymentSchedule', exclude: 'guarantors'}, function (data) {
                    scope.loandetails = data;
                    scope.decimals = data.currency.decimalPlaces;
                    var length = scope.loandetails.repaymentSchedule.periods.length ;
                    var i = 0 ;
                    while(i < scope.loandetails.repaymentSchedule.periods.length) {
                        if(scope.loandetails.repaymentSchedule.periods[i].period) {
                            var date = new Date(scope.loandetails.repaymentSchedule.periods[i].dueDate) ;
                            scope.loandetails.repaymentSchedule.periods[i].dueDate = date ;
                            scope.loandetails.repaymentSchedule.periods[i].originalDueDate = scope.loandetails.repaymentSchedule.periods[i].dueDate ;
                            scope.loandetails.repaymentSchedule.periods[i].oroginalPrincipalDue = scope.loandetails.repaymentSchedule.periods[i].principalDue ;
                            scope.loandetails.repaymentSchedule.periods[i].originaltotalInstallmentAmountForPeriod = scope.loandetails.repaymentSchedule.periods[i].totalInstallmentAmountForPeriod;
                            scope.loandetails.repaymentSchedule.periods[i].formattedDueDate = dateFilter(scope.loandetails.repaymentSchedule.periods[i].dueDate, scope.df);
                            i++ ;
                        }else {
                            scope.loandetails.repaymentSchedule.periods.splice(i, 1) ;
                        }
                    }
                    if(scope.loandetails.interestType.code == 'interestType.flat') {
                        scope.enablePrincipal = true ;
                        scope.enableInstallment = false ;
                    }else if(scope.loandetails.interestType.code == 'interestType.declining.balance') {
                        if(scope.loandetails.amortizationType.code == 'amortizationType.equal.principal') {
                            scope.enablePrincipal = true ;
                        }else if(scope.loandetails.amortizationType.code == 'amortizationType.equal.installments') {
                            scope.enableInstallment = true ;
                        }
                    }else { //invalid case. don't allow anything to be modified
                        scope.enablePrincipal = false ;
                        scope.enableInstallment = false ;
                    }
                });
            }

            scope.pattern = function () {
                $uibModal.open({
                    templateUrl: 'pattern.html',
                    controller: patternController,
                    resolve: {
                        periods: function () {
                            return scope.loandetails.repaymentSchedule.periods;
                        },
                        enablePrincipal: function () {
                            return scope.enablePrincipal;
                        },
                        enableInstallment: function () {
                            return scope.enableInstallment;
                        },
                        months: function () {
                            return scope.months ;
                        },
                        days: function () {
                            return scope.days ;
                        }

                    }
                });
            };


            var patternController = function ($scope, $uibModalInstance, periods, enablePrincipal, enableInstallment, months, days) {
                $scope.periods = periods ;
                $scope.enablePrincipal = enablePrincipal;
                $scope.enableInstallment = enableInstallment ;
                $scope.months = months ;
                $scope.days = days ;
                $scope.adjustmentData = {} ;
                $scope.invaliddaterangeerror = false ;
                $scope.submit = function () {
                    var t1 = $scope.adjustmentData.fromDate.getTime() ;
                    var t2 = $scope.adjustmentData.fromDate.getTime() ;
                    if($scope.adjustmentData.toDate) {
                        t2 = $scope.adjustmentData.toDate.getTime() ;
                        if(t1 > t2) {
                            $scope.invaliddaterangeerror = true ;
                            return ;
                        }
                    }
                    $scope.invaliddaterangeerror = false ;
                    $uibModalInstance.close($scope.adjustmentData);
                    for(var i in scope.loandetails.repaymentSchedule.periods) {
                        if(scope.loandetails.repaymentSchedule.periods[i].dueDate.getTime()>= t1 &&
                            scope.loandetails.repaymentSchedule.periods[i].dueDate.getTime()<= t2) {
                            if($scope.enableInstallment && $scope.adjustmentData.totalInstallmentAmountForPeriod) {
                                scope.loandetails.repaymentSchedule.periods[i].totalInstallmentAmountForPeriod = $scope.adjustmentData.totalInstallmentAmountForPeriod ;
                            }else if($scope.enablePrincipal && $scope.adjustmentData.principalDue){
                                scope.loandetails.repaymentSchedule.periods[i].principalDue = $scope.adjustmentData.principalDue ;
                            }
                            if($scope.adjustmentData.month || $scope.adjustmentData.day) {
                                var tempDate = new Date(scope.loandetails.repaymentSchedule.periods[i].dueDate) ;
                                if($scope.adjustmentData.month) {
                                    tempDate.setMonth(parseInt($scope.adjustmentData.month)+scope.loandetails.repaymentSchedule.periods[i].dueDate.getMonth()) ;
                                }
                                if($scope.adjustmentData.day) {
                                    var uiday = parseInt($scope.adjustmentData.day) ;
                                    var day = numberOfDays(tempDate.getFullYear(), tempDate.getMonth()+1, uiday) ;
                                    tempDate.setDate(day) ;
                                }
                                scope.loandetails.repaymentSchedule.periods[i].dueDate = new Date(tempDate) ;
                                scope.loandetails.repaymentSchedule.periods[i].formattedDueDate = dateFilter(scope.loandetails.repaymentSchedule.periods[i].dueDate, scope.df);
                            }
                        }
                    }
                };

                function numberOfDays(year, month, day) {
                    var d = new Date(year, month, 0);
                    console.log(year, month) ;
                    console.log(d.getDate(), day) ;
                    if(d.getDate() < day) {
                        return d.getDate() ;
                    }else {
                        return day ;
                    }
                }

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.addInstallment = function (index) {
                var installment = {} ;
                scope.loandetails.repaymentSchedule.periods.splice(index+1, 0, installment);
                scope.newinstallments.push(installment) ;

            } ;

            scope.deleteInstallment = function (index) {
                if(scope.loandetails.repaymentSchedule.periods[index].period) {
                    var deleted = {} ;
                    deleted.dueDate = dateFilter( scope.loandetails.repaymentSchedule.periods[index].dueDate , scope.df);
                    scope.deletedinstallments.push(deleted) ;
                }else {
                    var i = 0 ;
                    var length = scope.newinstallments.length ;
                    for(i = 0 ; i < length; i++) {
                        if(scope.newinstallments[i] == scope.loandetails.repaymentSchedule.periods[index]) {
                            scope.newinstallments.splice(i, 1) ;
                            break ;
                        }
                    }
                }
                scope.loandetails.repaymentSchedule.periods.splice(index, 1);
            } ;

            function getNewInstallments() {
                var tempArray = [] ;
                for (var i in scope.newinstallments) {
                    tempArray.push({}) ;
                    tempArray[i].dueDate = dateFilter( scope.newinstallments[i].dueDate, scope.df);
                    if(scope.enablePrincipal) {
                        tempArray[i].principal = scope.newinstallments[i].principalDue;
                    }
                    if(scope.enableInstallment) {
                        tempArray[i].installmentAmount = scope.newinstallments[i].totalInstallmentAmountForPeriod;
                    }
                }
                return tempArray ;
            } ;

            function constructRequestData() {
                var exceptions = {} ;
                var modified = getUpdatedInstallments() ;

                if(modified.length > 0) {
                    exceptions.modifiedinstallments = modified ;
                }
                var newinstalls = getNewInstallments() ;
                if(newinstalls.length > 0) {
                    exceptions.newinstallments = newinstalls ;
                }
                if(scope.deletedinstallments.length > 0) {
                    exceptions.deletedinstallments = scope.deletedinstallments ;
                }
                return exceptions ;
            }

            function getUpdatedInstallments() {
                var modified = [] ;
                var modifiedIndex = 0 ;
                scope.modifiedinstallments.splice(0, scope.modifiedinstallments.length);
                for(var i in scope.loandetails.repaymentSchedule.periods) {
                    if(scope.loandetails.repaymentSchedule.periods[i].period) {
                        var dateModified = scope.loandetails.repaymentSchedule.periods[i].originalDueDate.getTime() != scope.loandetails.repaymentSchedule.periods[i].dueDate.getTime() ;

                        if(!scope.loandetails.repaymentSchedule.periods[i].principalDue) {
                            scope.loandetails.repaymentSchedule.periods[i].principalDue = 0 ;
                        }
                        var principalModified = scope.loandetails.repaymentSchedule.periods[i].oroginalPrincipalDue !=  scope.loandetails.repaymentSchedule.periods[i].principalDue ;

                        if(!scope.loandetails.repaymentSchedule.periods[i].totalInstallmentAmountForPeriod) {
                            scope.loandetails.repaymentSchedule.periods[i].totalInstallmentAmountForPeriod = 0 ;
                        }
                        var installmentModified = scope.loandetails.repaymentSchedule.periods[i].originaltotalInstallmentAmountForPeriod !=  scope.loandetails.repaymentSchedule.periods[i].totalInstallmentAmountForPeriod ;

                        if(dateModified || principalModified || installmentModified) {
                            var modifiedInstallment = {} ;
                            scope.modifiedinstallments.push({}) ;
                            modifiedInstallment.dueDate = dateFilter(scope.loandetails.repaymentSchedule.periods[i].originalDueDate, scope.df);
                            scope.modifiedinstallments[modifiedIndex].dueDate = scope.loandetails.repaymentSchedule.periods[i].originalDueDate ;

                            if(dateModified) {
                                modifiedInstallment.modifiedDueDate = dateFilter(scope.loandetails.repaymentSchedule.periods[i].dueDate, scope.df);
                                scope.modifiedinstallments[modifiedIndex].modifiedDueDate = scope.loandetails.repaymentSchedule.periods[i].dueDate ;
                            }
                            if(scope.enablePrincipal && principalModified) {
                                modifiedInstallment.principal = scope.loandetails.repaymentSchedule.periods[i].principalDue ;
                                scope.modifiedinstallments[modifiedIndex].oroginalPrincipalDue = scope.loandetails.repaymentSchedule.periods[i].oroginalPrincipalDue ;
                                scope.modifiedinstallments[modifiedIndex].principal = scope.loandetails.repaymentSchedule.periods[i].principalDue ;
                            }
                            if(scope.enableInstallment && installmentModified) {
                                modifiedInstallment.installmentAmount = scope.loandetails.repaymentSchedule.periods[i].totalInstallmentAmountForPeriod ;
                                scope.modifiedinstallments[modifiedIndex].originaltotalInstallmentAmountForPeriod = scope.loandetails.repaymentSchedule.periods[i].originaltotalInstallmentAmountForPeriod ;
                                scope.modifiedinstallments[modifiedIndex].installmentAmount = scope.loandetails.repaymentSchedule.periods[i].totalInstallmentAmountForPeriod ;
                            }
                            modified.push(modifiedInstallment) ;
                            modifiedIndex++ ;
                        }
                    }
                }
                return modified ;
            };

            scope.resetToOriginalSchedule = function () {
                $uibModal.open({
                    templateUrl: 'resetschedule.html',
                    controller: resetToOriginalSchedule
                });
            };

            var resetToOriginalSchedule = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.variableinstallments.deleteVariations({loanId: routeParams.accountId}, function (data) {
                        $uibModalInstance.close("Close");
                        loadData() ;
                    });
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            function validateBeforesendingdata() {
                var emptyData = false ;
                for(var i in scope.loandetails.repaymentSchedule.periods) {
                    if(!scope.loandetails.repaymentSchedule.periods[i].dueDate){
                        emptyData = true ;
                        break ;
                    }
                }
                return emptyData ;
            }
            scope.validate = function () {
                if(validateBeforesendingdata()) return true ;
                scope.formData.exceptions = constructRequestData() ;
                if(!scope.formData.exceptions.modifiedinstallments &&
                    !scope.formData.exceptions.newinstallments &&
                    !scope.formData.exceptions.deletedinstallments) {
                    return ;
                }
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                resourceFactory.variableinstallments.validate({loanId: routeParams.accountId}, scope.formData, function (data) {
                    var validRepaymentSchedule = data ;
                    for (var i in validRepaymentSchedule.periods) {
                        var index = -1 ;
                        var date = new Date(validRepaymentSchedule.periods[i].dueDate) ;
                        for(var j in scope.modifiedinstallments) {
                            if((scope.modifiedinstallments[j].dueDate &&
                                scope.modifiedinstallments[j].dueDate.getTime() == date.getTime())) {
                                index = j ;
                                break ;
                            }
                            if(scope.modifiedinstallments[j].modifiedDueDate &&
                                scope.modifiedinstallments[j].modifiedDueDate.getTime() == date.getTime()) {
                                index = j ;
                                break ;
                            }
                        }
                        validRepaymentSchedule.periods[i].dueDate = date ;

                        if(index > -1) {
                            if(scope.modifiedinstallments[index].modifiedDueDate) {
                                validRepaymentSchedule.periods[i].originalDueDate = scope.modifiedinstallments[index].dueDate ;
                            }else {
                                validRepaymentSchedule.periods[i].originalDueDate = validRepaymentSchedule.periods[i].dueDate ;
                            }

                            if(scope.modifiedinstallments[index].principal) {
                                validRepaymentSchedule.periods[i].oroginalPrincipalDue = scope.modifiedinstallments[index].oroginalPrincipalDue ;
                            }else {
                                validRepaymentSchedule.periods[i].oroginalPrincipalDue = validRepaymentSchedule.periods[i].principalDue ;
                            }

                            if(scope.modifiedinstallments[index].installmentAmount) {
                                validRepaymentSchedule.periods[i].originaltotalInstallmentAmountForPeriod = scope.modifiedinstallments[index].originaltotalInstallmentAmountForPeriod ;
                            }else {
                                validRepaymentSchedule.periods[i].originaltotalInstallmentAmountForPeriod = validRepaymentSchedule.periods[i].totalInstallmentAmountForPeriod ;
                            }
                            validRepaymentSchedule.periods[i].formattedDueDate = dateFilter(validRepaymentSchedule.periods[i].dueDate, scope.df);
                        }else {
                            validRepaymentSchedule.periods[i].originalDueDate =  validRepaymentSchedule.periods[i].dueDate ;
                            validRepaymentSchedule.periods[i].oroginalPrincipalDue = validRepaymentSchedule.periods[i].principalDue ;
                            validRepaymentSchedule.periods[i].originaltotalInstallmentAmountForPeriod = validRepaymentSchedule.periods[i].totalInstallmentAmountForPeriod ;
                            validRepaymentSchedule.periods[i].formattedDueDate = dateFilter(validRepaymentSchedule.periods[i].dueDate, scope.df);
                        }

                    }
                    scope.loandetails.repaymentSchedule = data;
                });
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                scope.formData.exceptions = constructRequestData() ;
                resourceFactory.variableinstallments.addVariations({loanId: routeParams.accountId}, scope.formData, function (data) {
                    location.path('/viewloanaccount/' + data.loanId);
                });
            };
        }
    });

    mifosX.ng.application.controller('AdjustRepaymentSchedule', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$route', '$http', '$uibModal', 'dateFilter', 'API_VERSION', '$sce', '$rootScope', mifosX.controllers.AdjustRepaymentSchedule]).run(function ($log) {
        $log.info("AdjustRepaymentSchedule initialized");
    });
}(mifosX.controllers || {}));
