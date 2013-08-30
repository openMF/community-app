(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewClientController: function(scope, routeParams , resourceFactory ) {
        scope.client = [];
        scope.identitydocuments = [];

        resourceFactory.clientResource.get({clientId: routeParams.id} , function(data) {
            scope.client = data;
        });
        resourceFactory.clientAccountResource.get({clientId: routeParams.id} , function(data) {
            scope.clientAccounts = data;
        });
        resourceFactory.clientNotesResource.getAllNotes({clientId: routeParams.id} , function(data) {
            scope.clientNotes = data;
        });
        resourceFactory.clientResource.getAllClientDocuments({clientId: routeParams.id, anotherresource: 'identifiers'} , function(data) {
            scope.identitydocuments = data;
            for(var i = 0; i<scope.identitydocuments.length; i++) {
                  resourceFactory.clientIdentifierResource.get({clientIdentityId: scope.identitydocuments[i].id} , function(data) {

                      for(var j = 0; j<scope.identitydocuments.length; j++) {
                               if(data.length > 0 && scope.identitydocuments[j].id == data[0].parentEntityId)
                                {
                                  scope.identitydocuments[j].documents = data;
                                }
                        }
              });
            }
        });

        

        scope.isNotClosed = function(loanaccount) {
          if(loanaccount.status.code === "loanStatusType.closed.written.off" || 
            loanaccount.status.code === "loanStatusType.rejected") {
            return false;
          } else{
             return true;
          }
           
        };
        scope.isClosed = function(loanaccount) {
          if(loanaccount.status.code === "loanStatusType.closed.written.off" || 
            loanaccount.status.code === "loanStatusType.rejected") {
            return true;
          } else{
             return false;
          }
        };

    }
  });
  mifosX.ng.application.controller('ViewClientController', ['$scope', '$routeParams','ResourceFactory', mifosX.controllers.ViewClientController]).run(function($log) {
    $log.info("ViewClientController initialized");
  });
}(mifosX.controllers || {}));
