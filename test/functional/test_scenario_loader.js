(function() {
  var regexp = /\?test_scenario=(\w+)/
  var match = regexp.exec(window.location.search);
  if (match) {
    var scenarioName = match[1];
    console.log("Loading test scenario: " + scenarioName);
    require(['../lib/sinon/sinon-1.7.1', 'test/SinonFakeServer'], function() {
      require(["test/scenarios/" + scenarioName + "_scenario"])
    });
  }
}());
