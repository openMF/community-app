/**
 * Created by nikpa on 14-07-2016.
 */
(function (module) {
    mifosX.services = _.extend(module, {
        SharedVariables: function () {

            clientId = "";
            return {
                getClientId: function () {
                    return clientId;
                },
                setClientId: function (value) {
                    clientId = value;
                }

            }
        }
    });
    mifosX.ng.services.service('SharedVariables', [

    ]).run(function ($log) {
        $log.info("SharedVariables initialized");
    });
}(mifosX.services || {}));

