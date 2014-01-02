describe("clientStatus", function() {

    it ("should assign the correct information for a pending status", function() {
        var clientStatus = new mifosX.models.clientStatus("Pending");
        var pendingStatus = clientStatus.statusTypes["Pending"];

        expect(clientStatus.getStatus()).toEqual(pendingStatus);

    });

    it ("should assign the correct information for an active status", function() {
        var clientStatus = new mifosX.models.clientStatus("Active");
        var activeStatus = clientStatus.statusTypes["Active"];

        expect(clientStatus.getStatus()).toEqual(activeStatus);

    });

    it ("should assign the correct information for a status that is a transfer in progress", function() {
        var clientStatus = new mifosX.models.clientStatus("Transfer in progress");
        var transferInProgressStatus = clientStatus.statusTypes["Transfer in progress"];

        expect(clientStatus.getStatus()).toEqual(transferInProgressStatus);

    });

    it ("should assign the correct information for a status that is a transfer on hold", function() {
        var clientStatus = new mifosX.models.clientStatus("Transfer on hold");
        var transferOnHoldStatus = clientStatus.statusTypes["Transfer on hold"];

        expect(clientStatus.getStatus()).toEqual(transferOnHoldStatus);
    });
});
