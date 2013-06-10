define(['angular-mocks'], function() {
  var regexp = /\?test_scenario=(\w+)/
  var match = regexp.exec(window.location.search);
  if (match) {
    var scenarioName = match[1];
    mifosX.ng.application.config(function($provide) {
      $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
    }).run(function($httpBackend, $log) {
      $httpBackend.when("GET", /\.html$/).passThrough();
      $log.warn("Loading test scenario: " + scenarioName);
      require(["test/scenarios/" + scenarioName + "_scenario"], function(scenario) {
        scenario.stubServer($httpBackend);
      });
    });
  }  
});
