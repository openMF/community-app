(function (module) {
    mifosX.controllers = _.extend(module, {
        ScheduleReportController: function (scope, resourceFactory, location) {
         
       scope.schedulerData = {};

       
      

          scope.reportId = Math.floor((Math.random() * 10000) + 1);
          
           
           scope.pushData = {
            
            name : scope.schedulerData.name,
            description : scope.schedulerData.description,
            startDateTime : scope.schedulerData.startDateTime,
            emailMessage: scope.schedulerData.emailMessage,
            emailSubject : scope.schedulerData.emailSubject,
            emailRecipients : scope.schedulerData.emailRecipients,
            emailAttachmentFileFormatId : scope.schedulerData.emailAttachmentFormatId,
            recurrence : 'FREQUENCY=' + scope.schedulerData.frequency + 'INTERVAL=' +  scope.schedulerData.frequency_interval,
            stretchyReportId : scope.reportId,
            isActive : scope.schedulerData.isActive
        };
        

            scope.submit = function () {
               
             scope.pushData.locale =  scope.optlang.code;
             scope.pushData.dateFormat = scope.df;

                resourceFactory.ScheduleReportResource.save(scope.pushData, function (data) {
                   location.path('/viewscheduler/'+ data.resourceId);
                  
                });
               
            console.log(scope.pushData.stretchyReportId);
            
            };    
            
        }

         
        });
        
        mifosX.ng.application.controller('ScheduleReportController', ['$scope', 'ResourceFactory', '$location' , mifosX.controllers.ScheduleReportController]).run(function ($log) {
            $log.info("ScheduleReportController initialized");
        });
    
    }(mifosX.controllers || {}));
