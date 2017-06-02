describe("SearchController", function () {
    var resourceCallback, clientGet, clientAccountGet, groupGet, groupAccountGet, centerGet, centerAccountGet;
    beforeEach(function () {
        this.scope = {};

        this.route = jasmine.createSpyObj("$routeParams", ['query']);

        this.resourceFactory = {
            globalSearch: {
                search: jasmine.createSpy('globalSearch.search()').andCallFake(function (query, callback) {
                    resourceCallback = callback;
                })},
            clientResource: {
                get: jasmine.createSpy('clientResources.get()').andCallFake(function (params, callback) {
                    clientGet = callback;
                })},
            clientAccountResource: {
                get: jasmine.createSpy('clientAccountResources.get()').andCallFake(function (params, callback) {
                    clientAccountGet = callback;
                })},
            groupResource: {
                get: jasmine.createSpy('groupResources.get()').andCallFake(function (params, callback) {
                    groupGet = callback;
                })},
            groupAccountResource: {
                get: jasmine.createSpy('groupAccountResources.get()').andCallFake(function (params, callback) {
                    groupAccountGet = callback;
                })},
            centerResource: {
                get: jasmine.createSpy('centerResources.get()').andCallFake(function (params, callback) {
                    centerGet = callback;
                })},
            centerAccountResource: {
                get: jasmine.createSpy('centerAccountResources.get()').andCallFake(function (params, callback) {
                    centerAccountGet = callback;
                })}
        }
        this.controller = new mifosX.controllers.SearchController(this.scope, this.route, this.resourceFactory);

    });

    it("should populate the search results on loading", function () {
        resourceCallback({"data": "searchResults"});
        expect(this.resourceFactory.globalSearch.search).toHaveBeenCalled();
        expect(this.scope.searchResults.data).toBe("searchResults");
    });

    describe("when a clientId is selected", function () {
        beforeEach(function () {
            this.scope.getClientDetails("123");
            clientGet({'clientId': '123'});
        });

        it("should set the clientId to selected when the clientId is selected", function () {
            expect(this.scope.selected).toBe("123");
        });
        it("should set the group to blank", function () {
            expect(this.scope.group).toBe("");
        });
        it("should set the center to blank", function () {
            expect(this.scope.center).toBe("");
        });
        it("should get the client data", function () {
            expect(this.scope.client.clientId).toBe("123");
        });
        it("should get the client account data", function () {
            clientAccountGet({'account': '1'});
            expect(this.scope.clientAccounts.account).toBe("1");
        });

    });

    describe("when a groupId is selected", function () {
        beforeEach(function () {
            this.scope.getGroupDetails("10");
            groupGet({'groupId': '10'});
        });

        it("should set the groupID to selected when the groupID is selected", function () {
            expect(this.scope.selected).toBe("10");
        });
        it("should set the client to blank", function () {
            expect(this.scope.client).toBe("");
        });
        it("should set the center to blank", function () {
            expect(this.scope.center).toBe("");
        });
        it("should get the group information", function () {
            expect(this.scope.group.groupId).toBe("10");
        });
        it("should get the group account information", function () {
            groupAccountGet({'account': '2'});
            expect(this.scope.groupAccounts.account).toBe("2");
        });
    });


    describe("when a centerId is selected", function () {
        beforeEach(function () {
            this.scope.getCenterDetails("001");
            centerGet({"centerId": "001"});
        });

        it("should set the centerID to selected when the centerID is selected", function () {
            expect(this.scope.selected).toBe("001");
        });
        it("should set the client to blank", function () {
            expect(this.scope.client).toBe("");
        });
        it("should set the group to blank", function () {
            expect(this.scope.group).toBe("");
        });
        it("should get the center information", function () {
            expect(this.scope.center.centerId).toBe("001");
        });
        it("should get the center account information", function () {
            centerAccountGet({"account": "3"});
            expect(this.scope.centerAccounts.account).toBe("3");
        });
    });

});