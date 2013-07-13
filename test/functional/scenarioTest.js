define(['mifosX', 'angular-mocks'], {
  configure: function(scenarioName) {
    require(["test/testHelper", "test/scenarios/" + scenarioName + "_scenario"], function(testHelper, scenario) {
      mifosX.ng.application.config(function($provide) {
        $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
      }).run(function($httpBackend, $log) {
        $log.warn("Running test scenario: " + scenarioName);
        $httpBackend.when("GET", /\.html$/).passThrough();
        scenario.stubServer(new testHelper.FakeServer($httpBackend));
      });
      angular.bootstrap(document, ["MifosX_Application"]);
    });
  }
});