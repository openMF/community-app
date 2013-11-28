describe("UserSettingController", function() {
    var resourceCallback;
    beforeEach(function() {
        this.scope = {};

        this.translate = jasmine.createSpyObj("translate", ["uses"]);

        this.controller = new mifosX.controllers.UserSettingController(this.scope, this.translate);
    });

    it("should populate the scope with available languages", function() {
        expect(this.scope.langs).not.toBeNull();
    });

    it("should set the default language", function() {
       expect(this.scope.optlang).toEqual(this.scope.langs[0]);
    });

    it("should change the default language", function() {
        this.scope.changeLang('blah')
        expect(this.scope.optlang).toEqual('blah')
    });
});
