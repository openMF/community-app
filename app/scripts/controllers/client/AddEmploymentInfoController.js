/**
 * Created by nikpa on 26-06-2017.
 */

(function (module) {
    mifosX.controllers = _.extend(module, {
        AddEmploymentInfoController: function (scope, resourceFactory, routeParams,dateFilter, location) {

            scope.formData={};
            scope.date = {};
            scope.countryOptions=[];
            scope.stateOptions=[];
            scope.lgaOptions=[];
            scope.cityOptions=[];
            scope.employmentStatusOptions=[];
            clientId=routeParams.clientId;

            resourceFactory.employmentInfoTemplate.get({clientId:clientId},function(data)
            {
                scope.stateOptions=data.stateProvinceIdOptions;
                scope.countryOptions=data.countryIdOptions;
                scope.lgaOptions=data.lgaIdOptions;
                scope.cityOptions=data.cityIdOptions;
                scope.employmentStatusOptions=data.employmentStatusOptions;
                scope.bankOptions = data.bankOptions;
                scope.industryOptions = data.industryOptions;

            });

            scope.routeTo=function()
            {
                location.path('/viewclient/'+clientId);
            }

            scope.displayFields = function (employmentStatus) {
                console.log(employmentStatus);
                if(employmentStatus.name == 'Currently in a job') {
                    scope.showJobOption = true;
                    scope.showBusinessOption = false;
                    scope.showStudentOptions = false;
                    scope.showJobSearching = false;
                }else if(employmentStatus.name == 'Self-employed') {
                    scope.showBusinessOption = true;
                    scope.showJobOption = false;
                    scope.showStudentOptions = false;
                    scope.showJobSearching = false;
                }
                else if(employmentStatus.name == 'Student') {
                    scope.showStudentOptions = true;
                    scope.showBusinessOption = false;
                    scope.showJobOption = false;
                    scope.showJobSearching = false;
                }
                else if(employmentStatus.name == 'Job searching') {
                    scope.showJobSearching = true;
                    scope.showBusinessOption = false;
                    scope.showJobOption = false;
                    scope.showStudentOptions = false;
                }
            };

            scope.addClientEmploymentInfo=function()
            {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.employmentStatusId = scope.formData.employmentStatus.id;
                delete this.formData.employmentStatus;

                resourceFactory.employmentInformation.post({clientId:clientId},scope.formData,function(data)
                {
                    location.path('/viewclient/'+clientId);
                })
            }

        }


    });
    mifosX.ng.application.controller('AddEmploymentInfoController', ['$scope','ResourceFactory', '$routeParams','dateFilter', '$location', mifosX.controllers.AddEmploymentInfoController]).run(function ($log) {
        $log.info("AddEmploymentInfoController initialized");
    });

}
(mifosX.controllers || {}));
