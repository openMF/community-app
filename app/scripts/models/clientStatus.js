(function (module) {
    mifosX.models = _.extend(module, {
        ClientStatus: function () {

            this.getStatus = function (status) {
                return this.statusTypes[status];
            };

            this.allStatusTypes = function () {
                return Object.keys(this.statusTypes);
            };

            this.statusKnown = function (status) {
                return this.allStatusTypes().indexOf(status) > -1;
            };

            this.statusTypes = {
                "Pending": [
                    {
                        name: "label.button.edit",
                        href: "#/editclient",
                        icon: "icon-edit",
                        taskPermissionName: "UPDATE_CLIENT"
                    },
                    {
                        name: "label.button.activate",
                        href: "#/client",
                        subhref: "activate",
                        icon: "icon-ok-sign",
                        taskPermissionName: "ACTIVATE_CLIENT"
                    },
                    {
                        name: "label.button.close",
                        href: "#/client",
                        subhref: "close",
                        icon: "icon-remove-circle",
                        taskPermissionName: "CLOSE_CLIENT"
                    }
                ],
                "Active": [
                    {
                        name: "label.button.edit",
                        href: "#/editclient",
                        icon: "icon-edit",
                        taskPermissionName: "UPDATE_CLIENT"
                    },
                    {
                        name: "label.button.transferclient",
                        href: "#/transferclient",
                        icon: "icon-arrow-right",
                        taskPermissionName: "PROPOSETRANSFER_CLIENT"
                    },
                    {
                        name: "label.button.close",
                        href: "#/client",
                        subhref: "close",
                        icon: "icon-remove-circle",
                        taskPermissionName: "CLOSE_CLIENT"
                    }
                ],
                "Transfer in progress": [
                    {
                        name: "label.button.accepttransfer",
                        href: "#/client",
                        subhref: "acceptclienttransfer",
                        icon: "icon-check-sign",
                        taskPermissionName: "ACCEPTTRANSFER_CLIENT"
                    },
                    {
                        name: "label.button.rejecttransfer",
                        href: "#/client",
                        subhref: "rejecttransfer",
                        icon: "icon-remove",
                        taskPermissionName: "REJECTTRANSFER_CLIENT"
                    },
                    {
                        name: "label.button.undotransfer",
                        href: "#/client",
                        subhref: "undotransfer",
                        icon: "icon-undo",
                        taskPermissionName: "WITHDRAWTRANSFER_CLIENT"
                    }
                ],
                "Transfer on hold": [
                    {
                        name: "label.button.undotransfer",
                        href: "#/client",
                        subhref: "undotransfer",
                        icon: "icon-undo",
                        taskPermissionName: "WITHDRAWTRANSFER_CLIENT"
                    }
                ],
                "Assign Staff": {
                    name: "label.button.assignstaff",
                    href: "#/client",
                    subhref: "assignstaff",
                    icon: "icon-user",
                    taskPermissionName: "ASSIGNSTAFF_CLIENT"
                }
            }
        }
    });
}(mifosX.models || {}));