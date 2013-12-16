describe("UserSettingController", inject(function() {

    beforeEach(function() {
        this.scope = {};
        this.translate = {
            uses: jasmine.createSpy("translate.uses('data')")
        };
        this.localStorageService = {
            get: jasmine.createSpy("localStorageService.get('Language')").andReturn({"name" : "English" , "code" : "en"}),
            add: jasmine.createSpy("localStorageService.add('Language',data)")
        };
        this.controller = new mifosX.controllers.UserSettingController(this.scope, this.translate,this.localStorageService);
    });


    it("should populate the scope with available languages", inject(function() {
        expect(this.scope.langs).not.toBeNull();
    }));

    it("should set the default language", function() {
       expect(this.scope.optlang).toEqual(this.scope.langs[0]);
    });

    it("should change the default language", function() {
        this.scope.changeLang({"name" : "Français", "code":"fr"});
        expect(this.scope.optlang).toEqual({"name" : "Français", "code":"fr"});
    });
}));
