describe("clientStatus", function() {

    it ("should assign the correct information for a pending status", function() {
        var clientStatus = mifos.models.clientStatus("Pending");

        expect(clientStatus.getStatus())

    });

    it ("should assign the correct information for an active status", function() {
        var clientStatus = mifos.models.clientStatus("Active");

    });

    it ("should assign the correct information for a status that is a transfer in progress", function() {
        var clientStatus = mifos.models.clientStatus("Transfer in progress");

    });

    it ("should assign the correct information for a status that is a transfer on hold", function() {

        var clientStatus = mifos.models.clientStatus("Transfer on hold");

    });
});
