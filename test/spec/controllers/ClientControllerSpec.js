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


//        spyOn(this.paginatorService, 'paginate').andCallThrough();


        this.controller = new mifosX.controllers.ClientController(this.scope, this.resourceFactory, this.paginatorService);
    });

    it("should call the clientResource with the correct method", function() {
        expect(this.resourceFactory.clientResource.getAllClients).toHaveBeenCalled();
    });
});