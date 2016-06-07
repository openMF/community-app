define(['underscore'], function () {
    var styles = {
        css: [
            'styles.css',
            'fontawesome.css'
        ]
    };

    require(_.reduce(_.keys(styles), function (list, pluginName) {
        return list.concat(_.map(styles[pluginName], function (stylename) {
            return pluginName + '!styles/' + stylename;
        }));
    }, []));
});
