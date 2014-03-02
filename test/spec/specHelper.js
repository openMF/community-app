var MockModule = function () {
    this.value =
        this.factory =
            this.service =
                this.controller =
                    this.directive =
                        this.config =
                            this.run = function () {
                                return this
                            };
};

angular.module = jasmine.createSpy().andReturn(new MockModule())

var $, jQuery = function () {
    throw "you must stub or mock any call to jQuery!"
};

beforeEach(function () {
    this.addMatchers({
        toBeEmpty: function () {
            return _.isEmpty(this.actual);
        }
    });
});

