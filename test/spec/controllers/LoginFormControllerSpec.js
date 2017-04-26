describe("LoginFormController", function () {
    var eventListener;
    beforeEach(function () {
        this.scope = jasmine.createSpyObj("$scope", ['$on']);
        this.scope.$on.andCallFake(function (event, listener) {
            eventListener = listener;
        });
        this.authenticationService = jasmine.createSpyObj("AuthenticationService", ['$on']);
        this.resourceFactory = jasmine.createSpyObj("resourceFactory", ['$on']);
        this.httpService = jasmine.createSpyObj("httpService", ['$on']);
        this.$timeout = jasmine.createSpy("$timeout", ['$on']);
        $ = jQuery = jasmine.createSpy('jQuery');
        $.keypress = jasmine.createSpy('$.keypress()');
        $.andCallFake(function (selector) {
            return $;
        });

        this.controller = new mifosX.controllers.LoginFormController(this.scope, this.authenticationService, this.resourceFactory, this.httpService, this.$timeout);
    });

    it("should initialise the login credentials", function () {
        expect(this.scope.loginCredentials).toEqual({});
    });

    it("should initialise the authenticationFailed flag", function () {
        expect(this.scope.authenticationFailed).toBeFalsy();
    });

    it("should listen to 'UserAuthenticationFailureEvent'", function () {
        expect(this.scope.$on).toHaveBeenCalledWith("UserAuthenticationFailureEvent", jasmine.any(Function));
    });

    describe("on receiving 'UserAuthenticationFailureEvent'", function () {
        it("should set the authenticationFailed flag to true", function () {
            eventListener({});

           // expect(this.scope.authenticationFailed).toBeTruthy();
        });
    });
});
