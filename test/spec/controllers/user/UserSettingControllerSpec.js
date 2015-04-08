describe("UserSettingController", function () {

    beforeEach(function () {
        this.scope = jasmine.createSpyObj("$scope", ['$watch']);
        this.translate = {
            uses: jasmine.createSpy("translate.uses()")
        };
        this.localStorageService = {
            getFromLocalStorage: jasmine.createSpy("localStorageService.getFromLocalStorage()").andReturn({"name": "English", "code": "en"}),
            addToLocalStorage: jasmine.createSpy("localStorageService.addToLocalStorage()")
        };
        this.tmhDynamicLocale = jasmine.createSpyObj("tmhDynamicLocale", ["set"]);
        this.controller = new mifosX.controllers.UserSettingController(this.scope, this.translate, this.localStorageService, this.tmhDynamicLocale);
    });


   /* it("should populate the scope with available languages", function () {
        expect(this.scope.langs).not.toBeNull();
    });

    it("should set the default language", function () {
        expect(this.scope.optlang).toEqual(this.scope.langs[0]);
    });

    it("should change the default language", function () {
        this.scope.optlang = this.scope.langs[1];
        this.scope.changeLang(this.scope.langs[1]);
        expect(this.translate.uses).toHaveBeenCalledWith('fr');
        expect(this.localStorageService.addToLocalStorage).toHaveBeenCalledWith('Language', {"name": "Français", "code": "fr"});
    });*/

});
