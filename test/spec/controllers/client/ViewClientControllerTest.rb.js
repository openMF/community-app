describe("ViewClientController", function() {
    var clientResourceCallback,
        clientAccountResourceCallback,
        clientNotesResourceCallback,
        dataTablesResourceCallback,
        runReportsResourceCallback;

    beforeEach(function() {

        this.scope = {};

        this.resourceFactory = {

            clientResource: {
                get: jasmine.createSpy('clientResource.get()').andCallFake(function(query, callback) {
                    clientResourceCallback = callback;
                })
            },
            clientAccountResource : {
                get: jasmine.createSpy('clientAccountResource.get()').andCallFake(function(callback) {
                    clientAccountResourceCallback = callback;
                })
            },
            clientNotesResource: {
                getAllNotes: jasmine.createSpy('clientNotesResource.getAllNotes()').andCallFake(function(callback) {
                    clientNotesResourceCallback = callback;
                })
            },
            DataTablesResource: {
                getAllDataTables: jasmine.createSpy('DataTablesResource.getAllDataTables()').andCallFake(function(callback) {
                    dataTablesResourceCallback = callback;
                })
            },
            runReportsResource: {
                get: jasmine.createSpy('runReportsResource.get()').andCallFake(function(callback) {
                    runReportsResourceCallback = callback;
                })
            }
        };

        this.routeParams = jasmine.createSpy();
        this.route = jasmine.createSpy();
        this.location = jasmine.createSpyObj("location", ["path"]);
        this.http = jasmine.createSpy();
        this.modal = jasmine.createSpy();
        this.API_VERSION = jasmine.createSpy();
        this.rooteScope = jasmine.createSpy();
        this.upload = jasmine.createSpy();

        this.controller = new mifosX.controllers.ViewClientController(this.scope,
                                                                      this.routeParams ,
                                                                      this.route,
                                                                      this.location,
                                                                      this.resourceFactory,
                                                                      this.http,
                                                                      this.modal,
                                                                      this.API_VERSION,
                                                                      this.rootScope,
                                                                      this.upload);
    });

    it("should set the value of scope buttons based on the status of the client", function() {
        clientResourceCallback( {status: {value: "Pending"} } );
        var expectedPendingButtons = new mifosX.models.ClientStatus().getStatus("Pending");

        expect(this.scope.buttons[0]).toEqual(expectedPendingButtons[0]);
        expect(this.scope.buttons[1]).toEqual(expectedPendingButtons[1]);
    });
});
