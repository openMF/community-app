/**
 * Created by nikpa on 26-06-2017.
 */

(function (module) {
    mifosX.controllers = _.extend(module, {
        EditEmploymentInfoController: function (scope, resourceFactory, routeParams,dateFilter, location) {

            scope.formData={};
            scope.date = {};
            scope.countryOptions=[];
            scope.stateOptions=[];
            scope.lgaOptions=[];
            scope.cityOptions=[];
            scope.employmentStatusOptions=[];
            clientId=routeParams.clientId;
            employmentInfoId=routeParams.employmentInfoId;

            resourceFactory.employmentInfoTemplate.get({clientId:clientId},function(data)
            {
                scope.stateOptions=data.stateProvinceIdOptions;
                scope.countryOptions=data.countryIdOptions;
                scope.lgaOptions=data.lgaIdOptions;
                scope.cityOptions=data.cityIdOptions;
                scope.employmentStatusOptions=data.employmentStatusOptions;
                scope.bankOptions = data.bankOptions;
                scope.industryOptions = data.industryOptions;
                if(scope.formData.employmentStatusId){
                scope.displayFields(scope.formData.employmentStatusId);}


            });

            resourceFactory.employmentInfo.get({clientId:clientId,employmentInfoId:employmentInfoId},function(data)
            {
                scope.formData=data;
                if(data.employmentStatus.id){
                   scope.formData.employmentStatusId = data.employmentStatus.id;
                }
                 if(data.city.id){
                   scope.formData.cityId = data.city.id;
                 }
                 if(data.state.id){
                   scope.formData.stateProvinceId = data.state.id;
                 }
                 if(data.country.id){
                   scope.formData.countryId = data.country.id;
                 }
                 if(data.lga.id){
                   scope.formData.lgaId = data.lga.id;
                 }
                 if(data.bank.id){
                   scope.formData.bankId = data.bank.id;
                 }
                 if(data.industry.id){
                   scope.formData.industryId = data.industry.id;
                 }
            });

            scope.routeTo=function()
            {
                location.path('/viewclient/'+clientId);
            }

            scope.displayFields = function (employmentStatusId) {
            console.log(scope.formData.employmentStatusId);
                scope.info = scope.employmentStatusOptions.filter(function(item) {
                            return(item.id === employmentStatusId);
                        });
                if(scope.info[0].name == 'Currently in a job') {
                    scope.showJobOption = true;
                    scope.showBusinessOption = false;
                    scope.showStudentOptions = false;
                    scope.showJobSearching = false;
                }else if(scope.info[0].name == 'Self-employed') {
                    scope.showBusinessOption = true;
                    scope.showJobOption = false;
                    scope.showStudentOptions = false;
                    scope.showJobSearching = false;
                }
                else if(scope.info[0].name == 'Student') {
                    scope.showStudentOptions = true;
                    scope.showBusinessOption = false;
                    scope.showJobOption = false;
                    scope.showJobSearching = false;
                }
                else if(scope.info[0].name == 'Job searching') {
                    scope.showJobSearching = true;
                    scope.showBusinessOption = false;
                    scope.showJobOption = false;
                    scope.showStudentOptions = false;
                }
            };


            scope.editClientEmploymentInfo=function()
            {
                delete scope.formData.createdBy;
                delete scope.formData.createdOn;
                delete scope.formData.updatedBy;
                delete scope.formData.updatedOn;
                delete scope.formData.state;
                delete scope.formData.country;
                delete scope.formData.lga;
                delete scope.formData.city;
                delete scope.formData.employmentStatus;
                delete scope.formData.bank;
                delete scope.formData.industry;
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;

                resourceFactory.employmentInfo.put({clientId:clientId,employmentInfoId:employmentInfoId},scope.formData,function(data)
                {
                    location.path('/viewclient/'+clientId);
                })
            }

        }


    });
    mifosX.ng.application.controller('EditEmploymentInfoController', ['$scope','ResourceFactory', '$routeParams','dateFilter', '$location', mifosX.controllers.EditEmploymentInfoController]).run(function ($log) {
        $log.info("EditEmploymentInfoController initialized");
    });

}
(mifosX.controllers || {}));
