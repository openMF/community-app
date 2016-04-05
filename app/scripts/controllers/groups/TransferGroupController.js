(function (module) {
	
  mifosX.controllers = _.extend(module, {
    TransferGroupController: function (scope, routeParams, resourceFactory) {
				
			var tgc = this;
			
			tgc.inizialize   = inizialize;
			tgc.getGroup     = getGroup;
			tgc.associate    = associate;
			tgc.disassociate = disassociate;
			tgc.transfer     = transfer;
			
			tgc.inizialize();
			
			return tgc;
			
			function inizialize() {
				        
        tgc.getGroup().$promise.then(function() {
	        
	        resourceFactory.centerResource.getAllCenters({officeId: scope.group.officeId}, function(result) {
	          
	          scope.centers = result;
	          
	        });
	        
				});

			}
			
			function getGroup() {
				
				return resourceFactory.groupResource.get({groupId: routeParams.id}, function (result) {
          
          scope.group = result;

        });
				
			}
			
			function associate() {
				
				var body = {
					groupMembers : [scope.group.id]
				};
				
				return resourceFactory.centerResource.associateGroups({centerId: scope.formData.centerId}, body, function (result) {
          
          tgc.getGroup()

        });
				
			}
			
			function disassociate() {
				
				var body = {
					groupMembers : [scope.group.id]
				};
								
				return resourceFactory.centerResource.disassociateGroups({centerId: scope.group.centerId}, body, function (result) {
          
          tgc.getGroup()

        });
				
			}
			
			function transfer() {
				
				if( scope.group.centerId ) {
					
					tgc.disassociate().$promise.then(function() {
						
						tgc.associate();
						
					});
					
				}
				else {
					tgc.associate();
				}
				
			}
        
    }
  });
  
  mifosX.ng.application.controller('TransferGroupController', ['$scope', '$routeParams', 'ResourceFactory',
    mifosX.controllers.TransferGroupController]).run(function ($log) {
    $log.info("TransferGroupController initialized");
  });
    
}(mifosX.controllers || {}));
