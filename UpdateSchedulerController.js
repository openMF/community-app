(function (module) {
    mifosX.controllers = _.extend(module, {
        UpdateSchedulerController: function (scope, routeParams, resourceFactory, location, $uibModal) {
            resourceFactory.ScheduleReportResource.get({id: routeParams.id}, function (data) {
                
                scope.formData = data;
                scope.formData.locale =  scope.optlang.code;
                scope.formData.dateFormat = scope.df;
                
            });

          scope.pushUpdatedData = {};

          scope.formData = {
            
            name : scope.pushUpdatedData.name,
            description : scope.pushUpdatedData.description,
            startDateTime : scope.pushUpdatedData.startDateTime,
            emailMessage: scope.pushUpdatedData.emailMessage,
            emailSubject : scope.pushUpdatedData.emailSubject,
            emailRecipients : scope.pushUpdatedData.emailRecipients,
            emailAttachmentFileFormatId : scope.pushUpdatedData.emailAttachmentFormatId,
            recurrence : 'FREQUENCY=' + scope.pushUpdatedData.frequency + 'INTERVAL=' +  scope.pushUpdatedData.frequency_interval,
            
            isActive : scope.pushUpdatedData.isActive
        };
        


          
            
            scope.submit = function () {
                
              scope.formData.locale =  scope.optlang.code;
              scope.formData.dateFormat = scope.df;
 
                 resourceFactory.ScheduleReportResource.update({id: routeParams.id}, function (data) {
                    location.path('/reports');
                   
                 });
                
            
             
             };    
             
         }
 

           
            
           
         
  
    });
    mifosX.ng.application.controller('ViewReportController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', mifosX.controllers.ViewReportController]).run(function ($log) {
        $log.info("UpdateSchedulerController initialized");
    });
}(mifosX.controllers || {}));
