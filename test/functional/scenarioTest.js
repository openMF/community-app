define(['mifosX', 'angular-mocks'], {
  configure: function(scenarioName) {
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
  }
});