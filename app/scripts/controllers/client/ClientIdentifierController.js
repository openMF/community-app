(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientIdentifierController: function (scope, routeParams, location, resourceFactory) {
            scope.clientId = routeParams.clientId;
            scope.formData = {};
            scope.documenttypes = [];
            scope.showCountry = true;
            scope.statusTypes = [{
                id: 1,
                label: 'Active'
            }, {
                id: 2,
                label: 'Inactive',
            }];
            resourceFactory.clientIdenfierTemplateResource.get({clientId: routeParams.clientId}, function (data) {
                scope.documenttypes = data.allowedDocumentTypes;
                scope.formData.documentTypeId = data.allowedDocumentTypes[0].id;
            });
            resourceFactory.countryValueResource.getAllCountryValues({locale: scope.optlang.code}, function (data) {
                scope.documentPassportCountries = data;
            });
            
            scope.submit = function () {
                resourceFactory.clientIdenfierResource.save({clientId: scope.clientId}, this.formData, function (data) {
                    location.path('/viewclient/' + data.clientId);
                });
            };
            scope.displayDocumentValue = function () {
                if (this.formData.documentTypeId == 1) {
                    scope.showCountry = true;
                }
                else{
                    scope.showCountry = false;
                }
            };

        }
    });
    mifosX.ng.application.controller('ClientIdentifierController', ['$scope', '$routeParams', '$location', 'ResourceFactory', mifosX.controllers.ClientIdentifierController]).run(function ($log) {
        $log.info("ClientIdentifierController initialized");
    });
}(mifosX.controllers || {}));

