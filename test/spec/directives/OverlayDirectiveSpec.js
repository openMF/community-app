describe("overlayDirective", function() {
  var eventsCallbacks, scope;
  beforeEach(function() {
    eventsCallbacks = {};
    $ = jQuery = jasmine.createSpy('jQuery').andReturn("test_message");
    $['blockUI'] = jasmine.createSpy('$.blockUI');
    $['unblockUI'] = jasmine.createSpy('$.unblockUI');
    scope = {
      $eval: jasmine.createSpy("$scope.$eval").andCallFake(function(expr) {
        if (expr === "test_map") return {show: 'test_event_show1,test_event_show2', hide: 'test_event_hide1,test_event_hide2'};
        if (expr === "test_opacity") return {opacity: 'test_value'};
      }),
      $on: jasmine.createSpy("$scope.$on").andCallFake(function(eventName, callback) {
        eventsCallbacks[eventName] = callback;
      })
    };

    linkFunction = mifosX.directives.overlayDirective();

    linkFunction(scope, "test-element", {mfOverlay: "test_map", mfOverlayOptions: "test_opacity"});
  });

  _.each(['test_event_show1', 'test_event_show2', 'test_event_hide1', 'test_event_hide2'], function(name) {
    it("should setup the " + name + " listener", function() {
      expect(scope.$on).toHaveBeenCalledWith(name, jasmine.any(Function));
    });
  });

  _.each(['test_event_show1', 'test_event_show2'], function(name) {
    it("should invoke the blockUI plugin with the correct parameters", function() {
      eventsCallbacks[name]();

      expect($.blockUI).toHaveBeenCalledWith({
        css: { backgroundColor:'transparent', border: '0px'},
        fadeIn: 100,
        fadeOut: 200,
        message: "test_message",
        overlayCSS: {opacity: 'test_value'}
      });
    });
  });
  _.each(['test_event_hide1', 'test_event_hide2'], function(name) {
    it("should invoke the unblockUI plugin", function() {
      eventsCallbacks[name]();

      expect($.unblockUI).toHaveBeenCalled();
    });
  });
});