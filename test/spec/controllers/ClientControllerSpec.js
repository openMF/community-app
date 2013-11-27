describe("ClientController", function() {
    var resourceCallback;
    beforeEach(function() {
        this.scope = jasmine.createSpyObj("$scope", ['$clients']);

        this.resourceFactory = {clientResource: {
            getAllClients: jasmine.createSpy('clientResource.getAllClients()').andCallFake(function(callback) {
                resourceCallback = callback;
            })
        }};

        this.paginatorService = jasmine.createSpyObj("paginatorService", ["paginate"]);

        this.controller = new mifosX.controllers.ClientController(this.scope, this.resourceFactory, this.paginatorService);
    });

    it("should populate the scope with paginated clients", function() {
        expect(this.paginatorService.paginate).toHaveBeenCalled();
    });
});