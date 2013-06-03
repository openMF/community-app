(function(testModule) {
  var _fakeServer;
  mifosX.test = _.extend(testModule, {
    SinonFakeServer: function() {
      
    },
    getFakeServer: function() {
      if (!_fakeServer) {
        _fakeServer = new mifosX.test.SinonFakeServer();
      }
      return _fakeServer;
    }
  });
}(mifosX.test || {}));
