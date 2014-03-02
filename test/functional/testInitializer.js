define(['test/demoTest', 'test/scenarioTest'], function (demoTest, scenarioTest) {
    var protocol = window.location.protocol;
    if (protocol === 'file:') {
        var match = /\?test_scenario=(\w+)/.exec(window.location.search);
        if (match) {
            scenarioTest.configure(match[1]);
            return true;
        } else {
            demoTest.configure();
        }
    }
    return false;
});
