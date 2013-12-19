describe("MainController", function() {
  var eventListener, sessionCallback;
  beforeEach(function() {
    this.scope = jasmine.createSpyObj("$scope", ['$on', '$watch']);
    this.scope.$on.andCallFake(function(event, listener) { eventListener = listener; });
    this.location = jasmine.createSpyObj("$location", ['path', 'replace']);
    this.location.path.andReturn(this.location);
    this.sessionManager = jasmine.createSpyObj("sessionManager", ['get', 'clear', 'restore']);
    this.sessionManager.restore.andCallFake(function(callback) {
      sessionCallback = callback;
    });
    this.keyboardManager= jasmine.createSpyObj('keyboardManager',['bind']);

    this.translate = jasmine.createSpyObj("translate", ["uses"]);
    this.rootScope = jasmine.createSpy();
    this.localStorageService = jasmine.createSpyObj("localStorageService", ["get"]);

    this.controller = new mifosX.controllers.MainController(this.scope,
                                                            this.location,
                                                            this.sessionManager,
                                                            this.translate,
                                                            this.rootScope,
                                                            this.localStorageService, this.keyboardManager);
  });

  describe("on initialisation", function() {
    it("should listen to 'UserAuthenticationSuccessEvent'", function() {
      expect(this.scope.$on).toHaveBeenCalledWith("UserAuthenticationSuccessEvent", jasmine.any(Function));
    });

    it("should restore the session", function() {
      sessionCallback("test_session");
      expect(this.scope.currentSession).toEqual("test_session");
    });
  });

  describe("on receving 'UserAuthenticationSuccessEvent'", function() {
    beforeEach(function() {
      this.sessionManager.get.andReturn("test_session");

      eventListener({}, "test_data");
    });

    it("should start a new session", function() {
      expect(this.sessionManager.get).toHaveBeenCalledWith("test_data");
      expect(this.scope.currentSession).toEqual("test_session");
    });
    it("should redirect to the home page", function() {
      expect(this.location.path).toHaveBeenCalledWith('/home');
    });
  });

  describe("User logout", function() {
    beforeEach(function() {
      this.sessionManager.clear.andReturn("test_session");

      this.scope.logout();
    });

    it("should clear the session", function() {
      expect(this.sessionManager.clear).toHaveBeenCalled();
      expect(this.scope.currentSession).toEqual("test_session");
    });
    it("should redirect to the start page", function() {
      expect(this.location.path).toHaveBeenCalledWith('/');
    });
  });
});