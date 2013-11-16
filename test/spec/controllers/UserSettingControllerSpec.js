describe("UserSettingController", function() {
    var resourceCallback;
    beforeEach(function() {
        this.scope = {
            $broadcast: jasmine.createSpy("$scope.$broadcast(")
        };

        this.resourceFactory = {userListResource: {
            getAllUsers: jasmine.createSpy('userResource.getAllUsers()').andCallFake(function(callback) {
                resourceCallback = callback;
            })
        }};

        this.controller = new mifosX.controllers.UserListController(this.scope, this.resourceFactory);
    });


});

