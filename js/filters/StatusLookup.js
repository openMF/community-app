(function(module) {
  mifosX.filters = _.extend(module, {
    StatusLookup: function () {
                    return function(input) {

                      var  cssClassNameLookup = {
                        "true" : "statusactive" ,
                        "false" : "statusdeleted",
                        "Active" : "statusactive",
                        "loanStatusType.submitted.and.pending.approval" : "statuspending",
                        "loanStatusType.approved" : "statusApproved",
                        "loanStatusType.active" : "statusactive"
                      }   

                      return cssClassNameLookup[input];
                  }
                }
  });
  mifosX.ng.application.filter('StatusLookup', [mifosX.filters.StatusLookup]).run(function($log) {
    $log.info("StatusLookup filter initialized");
  });
}(mifosX.filters || {}));
