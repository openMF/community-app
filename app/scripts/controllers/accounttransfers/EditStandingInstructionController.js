(function (module) {
    mifosX.controllers = _.extend(module, {
        EditStandingInstructionController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.restrictDate = new Date();
            var params = {};
            scope.formData = {};
            scope.showselctclient = 'false';
            scope.allowclientedit = 'true';
            scope.standingInstructionId =  routeParams.instructionId;
            if(routeParams.from == 'list'){
                scope.fromlist = true;
            }
            scope.from = routeParams.from;
            params.standingInstructionId = scope.standingInstructionId;
            resourceFactory.standingInstructionResource.withTemplate(params, function (data) {
                scope.standinginstruction = data;
                scope.formData = {
                    priority:data.priority.id,
                    status:data.status.id,
                    instructionType:data.instructionType.id,
                    amount:data.amount,
                    validFrom:data.validFrom,
                    validTill:data.validTill,
                    recurrenceType:data.recurrenceType.id,
                    recurrenceInterval:data.recurrenceInterval
                }
                if(data.recurrenceFrequency){
                    scope.formData.recurrenceFrequency=data.recurrenceFrequency.id;   
                }
                
                if(data.fromClient.id == data.toClient.id){
                    scope.allowclientedit = false;
                }
                if (data.recurrenceOnMonthDay) {
                    var d = new Date();
                    var n = d.getFullYear();
                    data.recurrenceOnMonthDay.push(n);
                    var actDate = dateFilter(data.recurrenceOnMonthDay, 'dd MMMM');
                    scope.recurrenceOnMonthDay = new Date(actDate);
                }
                scope.formData.validFrom = new Date(scope.formData.validFrom);
                if(scope.formData.validTill){
                   scope.formData.validTill = new Date(scope.formData.validTill);
                }
            });

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                if (this.formData.validFrom) this.formData.validFrom = dateFilter(this.formData.validFrom, scope.df);
                if (this.formData.validTill) this.formData.validTill = dateFilter(this.formData.validTill, scope.df);
                if(this.recurrenceOnMonthDay){
                 var reqDate = dateFilter(this.recurrenceOnMonthDay, 'dd MMMM');
                 this.formData.recurrenceOnMonthDay = reqDate;
                 this.formData.monthDayFormat = 'dd MMMM';
                }
                resourceFactory.standingInstructionResource.update({standingInstructionId: scope.standingInstructionId},this.formData, function (data) {
                    location.path('/viewstandinginstruction/' + scope.standingInstructionId);
                });
            };

            scope.cancel = function(){
                if(scope.fromlist){
                    scope.viewliststandinginstruction();
                }else{
                    scope.viewstandinginstruction();
                }
            }

            scope.viewstandinginstruction = function () {
                location.path('/viewstandinginstruction/'+ scope.standingInstructionId);
            };

            scope.viewliststandinginstruction = function () {
                location.path('/liststandinginstructions/'+scope.standinginstruction.fromClient.officeId+'/'+scope.standinginstruction.fromClient.id);
            };
        }
    });
    mifosX.ng.application.controller('EditStandingInstructionController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditStandingInstructionController]).run(function ($log) {
        $log.info("EditStandingInstructionController initialized");
    });
}(mifosX.controllers || {}));