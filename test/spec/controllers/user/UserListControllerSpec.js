describe("UserListController", function () {
    var resourceCallback;
    beforeEach(function () {
        this.scope = {
            $broadcast: jasmine.createSpy("$scope.$broadcast(")
        };

        this.resourceFactory = {userListResource: {
            getAllUsers: jasmine.createSpy('userResource.getAllUsers()').andCallFake(function (callback) {
                resourceCallback = callback;
            })
        }};

        this.controller = new mifosX.controllers.UserListController(this.scope, this.resourceFactory);
    });

    it("should call the userResource with the correct method", function () {
        expect(this.resourceFactory.userListResource.getAllUsers).toHaveBeenCalled();
    });

    it("should populate the scope with the retrieved users", function () {
        resourceCallback(["test_user1", "test_user2"]);
        expect(this.scope.users).toEqual(["test_user1", "test_user2"]);
    });
});
