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
                        icon: "fa fa-edit",
                        taskPermissionName: "UPDATE_CLIENT"
                    },
                    {
                        name: "label.button.activate",
                        href: "#/client",
                        subhref: "activate",
                        icon: "fa fa-check",
                        taskPermissionName: "ACTIVATE_CLIENT"
                    },
                    {
                        name: "label.button.close",
                        href: "#/client",
                        subhref: "close",
                        icon: "fa fa-remove-circle",
                        taskPermissionName: "CLOSE_CLIENT"
                    },
                    {
                        name: "label.button.reject",
                        href: "#/client",
                        subhref: "reject",
                        icon: "fa fa-remove-circle",
                        taskPermissionName: "REJECT_CLIENT"
                    },
                    {
                        name: "label.button.withdraw",
                        href: "#/client",
                        subhref: "withdraw",
                        icon: "fa fa-remove-circle",
                        taskPermissionName: "WITHDRAW_CLIENT"
                    }
                ],
                "Closed":[
                    {
                        name: "label.button.reactivate",
                        href: "#/client",
                        subhref: "reactivate",
                        icon: "fa fa-check",
                        taskPermissionName: "REACTIVATE_CLIENT"
                    }

                ],
                "Active": [
                    {
                        name: "label.button.edit",
                        href: "#/editclient",
                        icon: "fa fa-edit",
                        taskPermissionName: "UPDATE_CLIENT"
                    },
                    {
                        name: "label.button.newloan",
                        href: "#/newclientloanaccount",
                        icon: "fa fa-plus",
                        taskPermissionName: "CREATE_LOAN"
                    },
                    {
                        name: "label.button.newsaving",
                        href: "#/new_client_saving_application",
                        icon: "fa fa-plus",
                        taskPermissionName: "CREATE_SAVINGSACCOUNT"
                    },
                    {
                        name: "label.button.newshareaccount",
                        href: "#/createshareaccount",
                        icon: "fa fa-plus",
                        taskPermissionName: "CREATE_SHAREACCOUNT"
                    },
                    {
                        name: "label.button.newcharge",
                        href: "#/viewclient",
                        subhref: "addcharge",
                        icon: "fa fa-plus",
                        taskPermissionName: "CREATE_CLIENTCHARGE"
                    },
                    {
                        name: "label.button.transferclient",
                        href: "#/transferclient",
                        icon: "fa fa-arrow-right",
                        taskPermissionName: "PROPOSETRANSFER_CLIENT"
                    },
                    {
                        name: "label.button.close",
                        href: "#/client",
                        subhref: "close",
                        icon: "fa fa-remove-circle",
                        taskPermissionName: "CLOSE_CLIENT"
                    }
                ],
                "Transfer in progress": [
                    {
                        name: "label.button.accepttransfer",
                        href: "#/client",
                        subhref: "acceptclienttransfer",
                        icon: "fa fa-check-sign",
                        taskPermissionName: "ACCEPTTRANSFER_CLIENT"
                    },
                    {
                        name: "label.button.rejecttransfer",
                        href: "#/client",
                        subhref: "rejecttransfer",
                        icon: "fa fa-remove",
                        taskPermissionName: "REJECTTRANSFER_CLIENT"
                    },
                    {
                        name: "label.button.undotransfer",
                        href: "#/client",
                        subhref: "undotransfer",
                        icon: "fa fa-undo",
                        taskPermissionName: "WITHDRAWTRANSFER_CLIENT"
                    }
                ],
                "Transfer on hold": [
                    {
                        name: "label.button.undotransfer",
                        href: "#/client",
                        subhref: "undotransfer",
                        icon: "fa fa-undo",
                        taskPermissionName: "WITHDRAWTRANSFER_CLIENT"
                    }
                ],
                "Assign Staff": {
                    name: "label.button.assignstaff",
                    href: "#/client",
                    subhref: "assignstaff",
                    icon: "fa fa-user",
                    taskPermissionName: "ASSIGNSTAFF_CLIENT"
                }
            }
        }
    });
}(mifosX.models || {}));