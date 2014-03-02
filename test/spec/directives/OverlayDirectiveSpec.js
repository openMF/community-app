describe("overlayDirective", function () {
    var eventsCallbacks, scope;
    beforeEach(function () {
        eventsCallbacks = {};
        $ = jQuery = jasmine.createSpy('jQuery');
        $.blockUI = jasmine.createSpy('$.blockUI');
        $.unblockUI = jasmine.createSpy('$.unblockUI');
        $.blockUI.defaults = {};
        scope = {
            $eval: jasmine.createSpy("$scope.$eval").andCallFake(function (expr) {
                if (expr === "test_map") return {show: 'test_event_show1,test_event_show2', hide: 'test_event_hide1,test_event_hide2'};
                if (expr === "test_opacity") return {opacity: 'test_value'};
            }),
            $on: jasmine.createSpy("$scope.$on").andCallFake(function (eventName, callback) {
                eventsCallbacks[eventName] = callback;
            })
        };

        this.linkFunction = mifosX.directives.overlayDirective();
    });

    describe("Event mapping", function () {
        beforeEach(function () {
            this.linkFunction(scope, "test-element", {mfOverlay: "test_map"});
        });

        it("should reset the default css options", function () {
            expect($.blockUI.defaults.css).toEqual({});
        });
        _.each(['test_event_show1', 'test_event_show2', 'test_event_hide1', 'test_event_hide2'], function (name) {
            it("should setup the " + name + " listener", function () {
                expect(scope.$on).toHaveBeenCalledWith(name, jasmine.any(Function));
            });
        });
    });

    describe("Action mapping with no target", function () {
        beforeEach(function () {
            $.andCallFake(function (selector) {
                if (selector === "test-element") return "test_message";
            });
            this.linkFunction(scope, "test-element", {mfOverlay: "test_map", mfOverlayOptions: "test_opacity"});
        });
        _.each(['test_event_show1', 'test_event_show2'], function (name) {
            it("should invoke the blockUI function to display the overlay", function () {
                eventsCallbacks[name]();

                expect($.blockUI).toHaveBeenCalledWith({
                    fadeIn: 100,
                    fadeOut: 200,
                    message: "test_message",
                    overlayCSS: {opacity: 'test_value'}
                });
            });
        });
        _.each(['test_event_hide1', 'test_event_hide2'], function (name) {
            it("should invoke the unblockUI function to hide the overlay", function () {
                eventsCallbacks[name]();

                expect($.unblockUI).toHaveBeenCalled();
            });
        });
    });

    describe("Action mapping with a target", function () {
        beforeEach(function () {
            $.block = jasmine.createSpy('$.block');
            $.unblock = jasmine.createSpy('$.unblock');
            $.andCallFake(function (selector) {
                if (selector === "test-element") return "test_message";
                if (selector === "test_target") return $;
            });

            this.linkFunction(scope, "test-element", {mfOverlay: "test_map", mfOverlayOptions: "test_opacity", mfOverlayTarget: "test_target"});
        });
        _.each(['test_event_show1', 'test_event_show2'], function (name) {
            it("should invoke the block function to display the overlay", function () {
                eventsCallbacks[name]();

                expect($.block).toHaveBeenCalledWith({
                    fadeIn: 100,
                    fadeOut: 200,
                    message: "test_message",
                    overlayCSS: {opacity: 'test_value'}
                });
            });
        });
        _.each(['test_event_hide1', 'test_event_hide2'], function (name) {
            it("should invoke the unblock function to hide the overlay", function () {
                eventsCallbacks[name]();

                expect($.unblock).toHaveBeenCalled();
            });
        });
    });
});