define(['Q', 'underscore', 'mifosX'], function (Q) {
    var components = {
        models: [
            'models.js'
        ],
        services: [
            'ResourceFactoryProvider.js',
            'HttpServiceProvider.js',
            'AuthenticationService.js',
            'SessionManager.js',
            'Paginator.js',
            'UIConfigService.js'
        ],
        controllers: [
            'controllers.js'
        ],
        filters: [
            'filters.js'
        ],
        directives: [
            'directives.js'
        ]
    };

    return function() {
        var defer = Q.defer();
        require(_.reduce(_.keys(components), function (list, group) {
            return list.concat(_.map(components[group], function (name) {
                return group + "/" + name;
            }));
        }, [
            'routes-initialTasks-webstorage-configuration.js'
        ]), function(){
            defer.resolve();
        });
        return defer.promise;
    }
});
