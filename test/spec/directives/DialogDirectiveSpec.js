describe("dialogDirective", function () {
    var scope, eventsCallbacks;
    beforeEach(function () {
        eventsCallbacks = {};
        $ = jQuery = jasmine.createSpy('jQuery');
        $.dialog = jasmine.createSpy('$.dialog()');
        $.andCallFake(function (selector) {
            if (selector === "test-element") return $;
        });
        scope = {
            $eval: jasmine.createSpy("$scope.$eval"),
            $on: jasmine.createSpy("$scope.$on").andCallFake(function (eventName, callback) {
                eventsCallbacks[eventName] = callback;
            })
        };

        this.linkFunction = mifosX.directives.dialogDirective();
    });

    describe("Event actions", function () {
        beforeEach(function () {
            scope.$eval.andReturn(
                {show: 'test_event_show1,test_event_show2', hide: 'test_event_hide1,test_event_hide2'}
            );
            this.linkFunction(scope, "test-element", {mfDialog: "test_map"});
        });

        it("should parse the event map", function () {
            expect(scope.$eval).toHaveBeenCalledWith("test_map");
        });
        _.each(['test_event_show1', 'test_event_show2', 'test_event_hide1', 'test_event_hide2'], function (name) {
            it("should setup the " + name + " listener", function () {
                expect(scope.$on).toHaveBeenCalledWith(name, jasmine.any(Function));
            });
        });
        _.times(2, function (i) {
            it("should open the dialog with a given title", function () {
                eventsCallbacks["test_event_show" + (i + 1)]({}, {title: 'test-title'});

                expect($.dialog).toHaveBeenCalledWith('option', 'title', 'test-title');
                expect($.dialog).toHaveBeenCalledWith('open');
            });
            it("should close the dialog", function () {
                eventsCallbacks["test_event_hide" + (i + 1)]({}, {});

                expect($.dialog).toHaveBeenCalledWith('close');
            })
        });
    });

    describe("Dialog options", function () {
        beforeEach(function () {
            scope.$eval.andCallFake(function (attr) {
                if (attr === "test_options") return {resizable: true, modal: true};
                if (attr === "test_map") return {show: 'test_event', hide: 'test_event'};
            });
        });

        it("should use default options", function () {
            this.linkFunction(scope, "test-element", {mfDialog: "test_map"});

            expect($.dialog).toHaveBeenCalledWith({
                autoOpen: false,
                draggable: false,
                resizable: false
            });
        });
        it("should override the options", function () {
            this.linkFunction(scope, "test-element", {mfDialog: "test_map", mfDialogOptions: "test_options"});

            expect($.dialog).toHaveBeenCalledWith({
                autoOpen: false,
                draggable: false,
                resizable: true,
                modal: true
            });
        });
    });
});