/**
 * Created by nikpa on 26-06-2017.
 */

(function (module) {
    mifosX.controllers = _.extend(module, {
        AddFamilyMembersController: function (scope, resourceFactory, routeParams,dateFilter, location) {

            scope.formData={};
            scope.date = {};
            clientId=routeParams.clientId;
            familyMemberId=routeParams.familyMemberId;

            resourceFactory.familyMemberTemplate.get({clientId:clientId},function(data)
            {
                scope.relationshipIdOptions=data.relationshipIdOptions;
                scope.genderIdOptions=data.genderIdOptions;
                scope.maritalStatusIdOptions=data.maritalStatusIdOptions;
                scope.professionIdOptions=data.professionIdOptions;

            });





            scope.routeTo=function()
            {
                location.path('/viewclient/'+clientId);
            }

            scope.addClientMember=function()
            {


                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;

                if(scope.date.dateOfBirth){
                    this.formData.dateOfBirth = dateFilter(scope.date.dateOfBirth,  scope.df);
                }
                resourceFactory.familyMembers.post({clientId:clientId},scope.formData,function(data)
                {

                    location.path('/viewclient/'+clientId);


                })
            }

        }


    });
    mifosX.ng.application.controller('AddFamilyMembersController', ['$scope','ResourceFactory', '$routeParams','dateFilter', '$location', mifosX.controllers.AddFamilyMembersController]).run(function ($log) {
        $log.info("AddFamilyMemberController initialized");
    });

}
(mifosX.controllers || {}));
