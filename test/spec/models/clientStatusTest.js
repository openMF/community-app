describe("ClientStatus", function() {

    it ("should assign the correct information for a pending status", function() {
        var clientStatus = new mifosX.models.ClientStatus();
        var pendingStatus = clientStatus.statusTypes["Pending"];

        expect(clientStatus.getStatus("Pending")).toEqual(pendingStatus);

    });

    it ("should assign the correct information for an active status", function() {
        var clientStatus = new mifosX.models.ClientStatus();
        var activeStatus = clientStatus.statusTypes["Active"];

        expect(clientStatus.getStatus("Active")).toEqual(activeStatus);

    });

    it ("should assign the correct information for a status that is a transfer in progress", function() {
        var clientStatus = new mifosX.models.ClientStatus();
        var transferInProgressStatus = clientStatus.statusTypes["Transfer in progress"];

        expect(clientStatus.getStatus("Transfer in progress")).toEqual(transferInProgressStatus);

    });

    it ("should assign the correct information for a status that is a transfer on hold", function() {
        var clientStatus = new mifosX.models.ClientStatus();
        var transferOnHoldStatus = clientStatus.statusTypes["Transfer on hold"];

        expect(clientStatus.getStatus("Transfer on hold")).toEqual(transferOnHoldStatus);
    });
});
