describe("TransferClientsController", function() {
  let clientMembersGet, transferClientsController, scope, $q;

  beforeEach(function() {
    this.scope = {};

    this.resourceFactory = {
        groupResource: {
            get: jasmine.createSpy('clientResource.getAllClients()').andCallFake(function(params, callback) {
                clientMembersGet = callback;
            })
        }
    };

    this.$q = jasmine.createSpy();
    this.routeParams = jasmine.createSpy();
    this.route = jasmine.createSpy();
    this.location = jasmine.createSpy();

    transferClientsController = new mifosX.controllers.TransferClientsController(
      this.$q,
      this.scope,
      this.routeParams,
      this.route,
      this.location,
      this.resourceFactory
    );
  });

  it("sets scope.allMembers to all active client members for the current group", function () {
      let member1 = { active: true, id: 1 };
      let member2 = { active: true, id: 2 };
      let member3 = { active: false, id: 3 };
      let member4 = { active: false, id: 4 };
      clientMembersGet({ clientMembers: [member1, member2, member3, member4] });

      expect(this.scope.allMembers.length).toEqual(2);
      expect(this.scope.allMembers).toContain(member1);
      expect(this.scope.allMembers).toContain(member2);
  });
});
