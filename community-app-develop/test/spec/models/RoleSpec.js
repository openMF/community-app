describe("Role", function () {
    it("should return the details about the role", function () {
        var data = {
            id: 1,
            name: "Test super user role",
            description: "test super user description"
        };

        var role = new mifosX.models.Role(data);
        expect(role.id).toEqual(1);
        expect(role.name).toEqual('Test super user role');
        expect(role.description).toEqual('test super user description');
    });
});
