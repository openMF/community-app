define(['angular-mocks'], function() {
  var regexp = /\?test_scenario=(\w+)/
  var match = regexp.exec(window.location.search);
  if (match) {
    var scenarioName = match[1];
    require(["test/scenarios/" + scenarioName + "_scenario"], function(scenario) {
      mifosX.ng.application.config(function($provide) {
        $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
      }).run(function($httpBackend, $log) {
        $log.warn("Loading test scenario: " + scenarioName);
        $httpBackend.when("GET", /\.html$/).passThrough();
        scenario.stubServer($httpBackend);
      });
      angular.bootstrap(document, ["MifosX_Application"]);
    });
    return true;
  }
  return false;
});
