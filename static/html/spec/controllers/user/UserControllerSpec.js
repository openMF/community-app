describe("UserController", function () {
    var resourceCallback;
    beforeEach(function () {
        this.scope = {
            $broadcast: jasmine.createSpy("$scope.$broadcast("),
            $evalAsync: jasmine.createSpy("$scope.$evalAsync()").andCallFake(function (callback) {
                callback();
            })
        };
        this.resourceFactory = {userResource: {
            getAllUsers: jasmine.createSpy('userResource.getAllUsers()').andCallFake(function (params, callback) {
                resourceCallback = callback;
            })
        }};

        this.controller = new mifosX.controllers.UserController(this.scope, this.resourceFactory);
    });

    it("should broadcast 'OpenUserFormDialog' event with the title", function () {
        this.scope.newUserFormDialog();

        expect(this.scope.$broadcast).toHaveBeenCalledWith('OpenUserFormDialog', {title: 'New User'});
    });

    it("should call the userResource with the correct field selection", function () {
        expect(this.resourceFactory.userResource.getAllUsers).toHaveBeenCalledWith({fields: "id,firstname,lastname,username,officeName"}, jasmine.any(Function));
    });

    it("should populate the scope with the retrieved users", function () {
        resourceCallback(["test_user1", "test_user2"]);

        expect(this.scope.users).toEqual(["test_user1", "test_user2"]);
    });
});